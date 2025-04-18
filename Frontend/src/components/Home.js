import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import farm1 from "../images/farm1.png";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const isFirstRender = useRef(true); // 🔁 Fix: flag to detect first render

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Save reviews to localStorage only after the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && comment && rating > 0) {
      const newReview = {
        id: Date.now(),
        name,
        comment,
        rating,
        date: new Date().toLocaleString(),
      };
      setReviews([newReview, ...reviews]);
      setName("");
      setComment("");
      setRating(0);
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  };

  const renderStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div className="container text-center my-5">
      <img
        src={farm1}
        alt="Banner"
        className="img-fluid w-100"
        style={{ width: "100%", height: "150%", objectFit: "cover" }}
      />

      <div className="mt-4">
        <h1 className="fw-bold text-success">Welcome to Our Agriculture Platform</h1>
        <p className="text-muted">
          Connect, rent equipment, and innovate. Discover how we empower farmers and businesses.
        </p>
      </div>

      <div className="mt-5">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Give a Review
        </button>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content text-start">
              <div className="modal-header">
                <h5 className="modal-title">Submit Your Review</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <textarea
                    className="form-control mb-3"
                    placeholder="Write your review..."
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <label className="mb-1">Rating:</label>
                  <div className="mb-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        onClick={() => setRating(num)}
                        style={{
                          cursor: "pointer",
                          fontSize: "1.5rem",
                          color: num <= rating ? "gold" : "gray",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-start">
        <h4 className="fw-bold text-secondary">Buyer Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded p-3 my-2 bg-light shadow-sm position-relative"
            >
              <strong>{review.name}</strong> <br />
              <small className="text-muted">{review.date}</small>
              <p className="mb-1">{review.comment}</p>
              <div className="text-warning">{renderStars(review.rating)}</div>
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                onClick={() => handleDelete(review.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
