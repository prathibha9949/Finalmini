import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductDetails from "./ProductDetails";
import EditProductPopup from "./EditProductPopup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ProductsPage.css";
import { BsFillCartFill, BsFillPencilFill, BsFillTrashFill, BsFillEyeFill, BsPower } from 'react-icons/bs'; // Importing icons

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const user = JSON.parse(localStorage.getItem("user"));
        setUserRole(role);
        if (user) setUserId(user._id);

        if (!token) {
          console.error("No token found. User may not be authenticated.");
          return;
        }

        const response = await axios.get("https://finalmini.onrender.com/api/products", {
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
  }, []);

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

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://finalmini.onrender.com/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("You are not the owner of this product to delete.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Header with Search and Logout */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">Available Equipment for Rent</h1>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
          <button className="btn btn-danger btn-sm ms-3" onClick={handleLogout}>
            <BsPower /> {/* Display the logout icon */}
          </button>
        </div>
      </div>

      {/* Role-based Buttons */}
      {(userRole === "laborer" || userRole === "seller" || userRole === "buyer") && (
        <div className="d-flex justify-content-start mb-3 flex-wrap gap-2">
          {userRole === "laborer" &&(
            <>
              <button className="btn btn-success btn-sm" onClick={() => navigate("/need-work")}>
                Need Work?
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/cart")}>
                🛒 View Cart
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/laborers-list")}>
                👷 View Laborer
              </button>
            </>
          )}
          {userRole === "seller" && (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-product")}>
                ➕ Add Product
              </button>
              <button className="btn btn-success btn-sm" onClick={() => navigate("/cart")}>
                🛒 View Cart
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/laborers-list")}>
                👷 View Laborer
              </button>
            </>
          )}

          {userRole === "buyer" && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/cart")}>
              🛒 View Cart
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="product-list">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.length === 0 ? (
            <div className="text-center">No equipment found.</div>
          ) : (
            products
              .filter((product) =>
                product.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div className="col" key={product._id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://finalmini.onrender.com${product.photo}`}
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
                    <div className="card-footer d-flex justify-content-around flex-wrap">
                      <button
                        className="btn btn-warning btn-sm mb-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <BsFillCartFill />
                      </button>
                      <button
                        className="btn btn-info btn-sm mb-1"
                        onClick={() => handleViewDetails(product)}
                      >
                        <BsFillEyeFill />
                      </button>

                      {userRole === "seller" &&
                        product.sellerId?.toString() === userId?.toString() && (
                          <>
                            <button
                              className="btn btn-primary btn-sm mb-1"
                              onClick={() => setEditProduct(product)}
                            >
                              <BsFillPencilFill />
                            </button>
                            <button
                              className="btn btn-danger btn-sm mb-1"
                              onClick={() => handleDelete(product._id)}
                            >
                              <BsFillTrashFill />
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleCloseDetails} />
      )}
      {editProduct && (
        <EditProductPopup
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onProductUpdated={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
            );
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
