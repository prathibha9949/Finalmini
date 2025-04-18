import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const [totalRent, setTotalRent] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setTotalRent(cart.reduce((sum, product) => sum + product.rent, 0));
  }, [cart]);

  const handleConfirmOrder = (product) => {
    setSelectedProduct(product);
    const modal = new window.bootstrap.Modal(document.getElementById("chatCallModal"));
    modal.show();
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h1>Your Cart</h1>
        <div className="cart-list">
          {cart.length > 0 ? (
            cart
              .slice()
              .reverse()
              .map((product) => (
                <div className="cart-item" key={product._id}>
                  <div className="card shadow-sm">
                    <img
                      src={`https://finalmini.onrender.com${product.photo}`}
                      alt={product.equipmentName}
                      className="cart-image"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.equipmentName}</h5>
                      <p>Rent: ₹{product.rent}</p>
                      <p>Location: {product.place}</p>
                      <p>Seller Mobile: {product.mobile}</p>

                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(product._id)}
                        >
                          Remove
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleConfirmOrder(product)}
                        >
                          Confirm Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="cart-empty">
              <div className="card text-center p-4 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">Your cart is empty</h4>
                  <p>Add some products to view them here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cart-sidebar">
        <h3>Total Rent</h3>
        <h2>₹{totalRent}</h2>
      </div>

      {/* Modal for WhatsApp & Call */}
      <div
        className="modal fade"
        id="chatCallModal"
        tabIndex="-1"
        aria-labelledby="chatCallModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title" id="chatCallModalLabel">Contact Seller</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <p className="mb-3">Choose how you want to contact the seller:</p>
              {selectedProduct && (
                <>
                  <a
                    href={`https://wa.me/91${selectedProduct.mobile}?text=Hi, I'm interested in your equipment.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success me-2"
                  >
                    <i className="bi bi-whatsapp"></i> WhatsApp
                  </a>
                  <a href={`tel:${selectedProduct.mobile}`} className="btn btn-info">
                    📞 Call
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
