import React, { useEffect, useState } from "react";
import "./ProductList.css"; // Ensure you add the styles below

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      setProducts(data.products);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Deleted successfully");
      fetchProducts();
    } else {
      alert(data.message || "Delete failed");
    }
  };

  return (
    <div className="product-list-container">
      <h2 className="title">Available Equipment for Rent</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.photo} alt={product.equipmentName} className="product-image" />
            <div className="product-info">
              <h5 className="product-name">{product.equipmentName}</h5>
              <p className="product-price">
                ₹{product.rent}
                <span className="original-price"> ₹{(product.rent * 1.3).toFixed(0)}</span>
              </p>
              <p className="product-place">📍 {product.place}</p>
              <p className="product-contact">📞 {product.mobile}</p>
              <div className="product-actions">
                <button className="btn btn-primary">View</button>
                <button className="btn btn-warning">Update</button>
                <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
