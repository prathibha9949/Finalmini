import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const typingTimeout = useRef(null);
  const alreadyExistsHandled = useRef(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const roleRef = useRef(null);
  const submitButtonRef = useRef(null);
  const voiceRefs = useRef({ en: null, te: null });

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      voiceRefs.current.en = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /male|daniel|fred|david|english/i.test(v.name)
      );
      voiceRefs.current.te = voices.find((v) => v.lang === "te-IN");

      if (!voiceRefs.current.en) {
        voiceRefs.current.en = voices.find((v) => v.lang.startsWith("en"));
      }
      if (!voiceRefs.current.te) {
        voiceRefs.current.te = voices.find((v) => v.lang.startsWith("te"));
      }

      setTimeout(() => {
        nameRef.current?.focus();
        speakStep(1);
      }, 500);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, lang = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = lang === "te-IN" ? voiceRefs.current.te : voiceRefs.current.en;
    utterance.lang = lang;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const speakStep = (step) => {
    const messages = [
      ["Please enter your username.", "దయచేసి వినియోగదారి పేరు నమోదు చేయండి."],
      ["Please enter your email.", "దయచేసి మీ ఇమెయిల్ నమోదు చేయండి."],
      ["Please enter your password.", "దయచేసి పాస్‌వర్డ్ నమోదు చేయండి."],
      ["Please confirm your password.", "దయచేసి పాస్‌వర్డ్‌ను నిర్ధారించండి."],
      ["Please select your role.", "దయచేసి మీ పాత్రను ఎంచుకోండి."],
    ];

    const [en, te] = messages[step - 1] || [];
    if (en && te) {
      speak(en, "en-US");
      setTimeout(() => speak(te, "te-IN"), 3000);
    }
  };

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      if (name === "email" && !validateEmail(value)) {
        speak("Invalid email format.", "en-US");
        speak("చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి.", "te-IN");
      }

      if (name === "confirmPassword" && formData.password !== value) {
        speak("Passwords do not match.", "en-US");
        speak("పాస్‌వర్డ్‌లు సరిపోలడం లేదు.", "te-IN");
      }

      // Auto focus logic
      if (name === "username" && value) {
        emailRef.current?.focus();
        speakStep(2);
      }
      if (name === "email" && validateEmail(value)) {
        passwordRef.current?.focus();
        speakStep(3);
      }
      if (name === "password" && value.length >= 6) {
        confirmPasswordRef.current?.focus();
        speakStep(4);
      }
      if (name === "confirmPassword" && value === formData.password) {
        roleRef.current?.focus();
        speakStep(5);
      }
      if (name === "role" && value) {
        submitButtonRef.current?.focus();
      }
    }, 1500);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.role) newErrors.role = "Role selection is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alreadyExistsHandled.current = false;

    if (!validateForm()) return;

    try {
      const response = await axios.post("https://finalmini.onrender.com/api/auth/signup", formData);
      if (response.data.success) {
        toast.success("✅ Registered successfully!");
        speak("Signup successful! Redirecting to login...", "en-US");
        speak("నమోదు విజయవంతం! లాగిన్‌కు వెళ్లుతున్నాం...", "te-IN");
        setTimeout(() => navigate("/login"), 2000);
      } else if (
        response.data.message === "User already exists" &&
        !alreadyExistsHandled.current
      ) {
        alreadyExistsHandled.current = true;
        toast.success("✅ User already exists. Redirecting to login...");
        speak("User already exists. Redirecting to login...", "en-US");
        speak("వాడుకరి ఇప్పటికే ఉన్నారు. లాగిన్‌కు వెళ్లుతున్నాం...", "te-IN");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("❌ Signup failed. Try again.");
        speak("Signup failed. Try again.", "en-US");
        speak("నమోదు విఫలమైంది. మళ్లీ ప్రయత్నించండి.", "te-IN");
      }
    } catch (error) {
      toast.error("❌ Signup failed. Try again.");
      speak("Signup failed. Try again.", "en-US");
      speak("నమోదు విఫలమైంది. మళ్లీ ప్రయత్నించండి.", "te-IN");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="border p-4 bg-white rounded shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control rounded-pill mb-3"
            name="username"
            value={formData.username}
            onChange={handleChange}
            ref={nameRef}
            placeholder="Username"
          />
          <input
            type="email"
            className="form-control rounded-pill mb-3"
            name="email"
            value={formData.email}
            onChange={handleChange}
            ref={emailRef}
            placeholder="Email"
          />
          <input
            type="password"
            className="form-control rounded-pill mb-3"
            name="password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordRef}
            placeholder="Password"
          />
          <input
            type="password"
            className="form-control rounded-pill mb-3"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            ref={confirmPasswordRef}
            placeholder="Confirm Password"
          />
          <select
            className="form-control mb-3"
            name="role"
            value={formData.role}
            onChange={handleChange}
            ref={roleRef}
          >
            <option value="">Select Role</option>
            <option value="laborer">Laborer</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          <button
            ref={submitButtonRef}
            type="submit"
            className="btn btn-primary w-100 rounded-pill"
            style={{ backgroundColor: "#597D35", borderColor: "#597DFF" }}
          >
            Signup
          </button>
        </form>
        <p className="text-center mt-3">
          Already signed up? <Link to="/login">Login here</Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
