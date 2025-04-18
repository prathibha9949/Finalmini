import React from "react";

const ProductDetails = ({ product, onClose }) => {
  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <span className="close" onClick={onClose} style={closeStyle}>
          &times;
        </span>
        <h2>{product.equipmentName}</h2>
        <img
          src={`http://localhost:5004/uploads/${product.photo}`}
          alt={product.equipmentName}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "200px",
            objectFit: "cover",
            marginBottom: "1rem",
          }}
        />
        <p><strong>Rent:</strong> ₹{product.rent}</p>
        <p><strong>Location:</strong> {product.place}</p>
        <p><strong>Contact:</strong> {product.mobile}</p>
      </div>
    </div>
  );
};

// Modal styles
const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.5)",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  border: "1px solid #888",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "500px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const closeStyle = {
  cursor: "pointer",
  float: "right",
  fontSize: "24px",
  color: "#888",
};

export default ProductDetails;
