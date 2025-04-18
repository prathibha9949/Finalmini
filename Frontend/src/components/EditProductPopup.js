import React, { useState } from "react";
import axios from "axios";
import "../styles/Popup.css";

const EditProductPopup = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    equipmentName: product.equipmentName,
    rent: product.rent,
    mobile: product.mobile,
    place: product.place,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5004/api/products/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Product updated successfully!");
        onProductUpdated(response.data.updatedProduct);
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("You are not authorized to update this product.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content p-4 rounded shadow bg-white">
        <h4 className="mb-3">Edit Equipment</h4>
        <form onSubmit={handleUpdate}>
          <div className="mb-2">
            <label className="form-label">Equipment Name</label>
            <input
              type="text"
              className="form-control"
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Rent</label>
            <input
              type="number"
              className="form-control"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Place</label>
            <input
              type="text"
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success me-2">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPopup;
