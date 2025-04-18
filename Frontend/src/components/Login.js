import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Redirect to the correct dashboard if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      redirectToDashboard(role);
    } else {
      guideUser("email");
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const getTeluguMaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "te-IN" && v.name.toLowerCase().includes("male")) ||
      voices.find((v) => v.lang === "te-IN")
    );
  };

  const speakTelugu = (textTe, repeat = 2) => {
    speechSynthesis.cancel();
    const voice = getTeluguMaleVoice();

    for (let i = 0; i < repeat; i++) {
      const utterance = new SpeechSynthesisUtterance(textTe);
      utterance.lang = "te-IN";
      utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, i * 3000);
    }
  };

  const guideUser = (field) => {
    if (field === "email") {
      speakTelugu("దయచేసి మీ ఈమెయిల్‌ను ఇవ్వండి", 2);
      setTimeout(() => {
        emailRef.current?.focus();
      }, 1000);
    } else if (field === "password") {
      speakTelugu("ఇప్పుడు మీ పాస్‌వర్డ్‌ను ఇవ్వండి", 2);
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 1000);
    } else if (field === "submit") {
      speakTelugu("లాగిన్ బటన్ పై క్లిక్ చేయండి", 2);
      setTimeout(() => {
        submitButtonRef.current?.focus();
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    speechSynthesis.cancel();
    setFormData((prev) => ({ ...prev, [name]: value }));

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (name === "email") {
        guideUser("password");
      } else if (name === "password") {
        guideUser("submit");
      }
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    speechSynthesis.cancel();
    clearTimeout(timeoutRef.current);

    try {
      const response = await axios.post("http://localhost:5004/api/auth/login", formData);
      if (response.data?.success) {
        const { token, role, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("farmer", JSON.stringify(user));
        redirectToDashboard(role);
      } else {
        setError(response.data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed! Please check your credentials.");
    }
  };

  const redirectToDashboard = (role) => {
    const rolePath = {
      seller: "/products",
      buyer: "/buyer-dashboard",
      admin: "/admin-dashboard",
      laborer: "/products",
    };
    navigate(rolePath[role.toLowerCase()] || "/products");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow col-12 col-md-6 col-lg-4">
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-3 rounded-pill"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              ref={emailRef}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control mb-3 rounded-pill"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              ref={passwordRef}
              required
            />
          </div>
          <button
            ref={submitButtonRef}
            type="submit"
            className="btn btn-primary w-100 rounded-pill"
            style={{ backgroundColor: "#597D35", borderColor: "#597DFF" }}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
