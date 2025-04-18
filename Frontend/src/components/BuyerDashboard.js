// frontend/src/components/BuyerDashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductDetails from "./ProductDetails";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillCartFill, BsFillEyeFill } from 'react-icons/bs'; // Importing icons

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User may not be authenticated.");
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5004/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error("Failed to fetch products:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.equipmentName} has been added to your cart!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-5"> {/* Increase the margin-top */}
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2"> {/* Add gap for spacing between buttons */}
          {/* Left Buttons */}
          <button
            className="btn btn-secondary btn-sm mb-2"
            onClick={() => navigate("/laborers-list")}
          >
            View Laborers
          </button>
          <button
            className="btn btn-primary btn-sm mb-2"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        </div>

        <div className="d-flex align-items-center">
          {/* Search Box */}
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
          
          {/* Logout Button */}
          <button
            className="btn btn-danger btn-sm ms-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="product-list">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products
            .filter((product) =>
              product.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <div className="col" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`http://localhost:5004${product.photo}`}
                    className="card-img-top"
                    alt={product.equipmentName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <hr style={{ border: "2px solid black", margin: "0" }} />
                  <div className="card-body">
                    <h5 className="card-title">{product.equipmentName}</h5>
                    <p className="card-text">Rent: ₹{product.rent}</p>
                    <p className="card-text">Location: {product.place}</p>
                    <p className="card-text">Contact: {product.mobile}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-around">
                    <button
                      className="btn btn-warning btn-sm mb-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <BsFillCartFill /> {/* Cart Icon Only */}
                    </button>
                    <button
                      className="btn btn-info btn-sm mb-1"
                      onClick={() => handleViewDetails(product)}
                    >
                      <BsFillEyeFill /> {/* Eye Icon Only */}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default BuyerDashboard;
