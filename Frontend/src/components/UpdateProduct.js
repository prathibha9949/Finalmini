import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // ✅ State to hold equipment details
  const [formData, setFormData] = useState({
    equipmentName: "",
    rent: "",
    mobile: "",
    place: "",
    photo: null, // For file upload
  });

  const [previewImage, setPreviewImage] = useState(""); // ✅ Preview uploaded image
  const [loading, setLoading] = useState(false); // ✅ Show loading state
  const [isDataFetched, setIsDataFetched] = useState(false); // ✅ Ensure useEffect runs only once

  // ✅ Fetch existing product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/products/${id}`);
        if (res.data && res.data.equipment) {
          const { equipmentName, rent, mobile, place, photo } = res.data.equipment;

          setFormData({
            equipmentName: equipmentName || "",
            rent: rent || "",
            mobile: mobile || "",
            place: place || "",
            photo: photo || null, // Keep existing image
          });

          if (photo) {
            setPreviewImage(`http://localhost:5004${photo}`);
          }

          setIsDataFetched(true); // ✅ Ensure useEffect only runs once
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to fetch product details. Please try again.");
      }
    };

    if (!isDataFetched) {
      fetchProduct();
    }
  }, [id, isDataFetched]); // ✅ Ensures fetching happens once

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file upload and show preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));

    // Show preview of selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.equipmentName || !formData.rent || !formData.mobile || !formData.place) {
      alert("Please fill in all fields before updating.");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("equipmentName", formData.equipmentName);
    formDataToSend.append("rent", formData.rent);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("place", formData.place);

    if (formData.photo instanceof File) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      await axios.put(`http://localhost:5004/api/products/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      navigate("/products"); // Redirect to products page
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Update Product</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Equipment Name</label>
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rent</label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Place</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input type="file" onChange={handleFileChange} className="form-control" />
        </div>
        
        {/* ✅ Show preview of the image */}
        {previewImage && (
          <div className="mb-3 text-center">
            <img src={previewImage} alt="Preview" width="200px" className="rounded shadow-sm" />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
