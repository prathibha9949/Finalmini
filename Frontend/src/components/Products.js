import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("role"); // Get user role from localStorage
  const token = localStorage.getItem("token"); // Get auth token

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/products");
        setProducts(response.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Function to delete a product
  const handleDeleteProduct = async (productId) => {
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log("Deleting Product ID:", productId);
        console.log("Token:", token);

        const response = await axios.delete(`http://localhost:5004/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });

        console.log("Delete Response:", response.data);

        if (response.data.success) {
          setProducts(products.filter((product) => product._id !== productId)); // Update UI
          alert("Product deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error.response?.data || error);
        alert("Failed to delete product. Check console for details.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Equipment for Rent</h2>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card shadow-sm">
                  <img
                    src={`http://localhost:5004/uploads/${product.photo}`}
                    className="card-img-top"
                    alt={product.equipmentName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.equipmentName}</h5>
                    <p className="card-text">Rent: ₹{product.rent}</p>
                    <p className="card-text">Location: {product.place}</p>
                    <p className="card-text">Contact: {product.mobile}</p>

                    {/* ✅ Show delete button only for sellers and admins */}
                    {(userRole === "seller" || userRole === "admin") && (
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
