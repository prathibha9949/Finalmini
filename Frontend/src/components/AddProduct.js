import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom"; // Import Navigate

const AddProduct = ({ onProductAdded }) => {
  const [productData, setProductData] = useState({
    equipmentName: "",
    rent: "",
    mobile: "",
    place: "",
    photo: null,
  });
  const [redirect, setRedirect] = useState(false); // State for redirecting
  const [error, setError] = useState(null); // State for handling errors

  const speechRef = useRef(null);
  const timeoutRef = useRef(null);

  const nameRef = useRef(null);
  const rentRef = useRef(null);
  const mobileRef = useRef(null);
  const placeRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    speakStep(1);
    if (nameRef.current) {
      nameRef.current.focus(); // Focus on the first input field
    }
  }, []);

  const speak = (text, lang = "en-US") => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const speakStep = (step) => {
    const messages = [
      "Please enter the equipment name.",
      "Please enter the rent amount.",
      "Please enter your mobile number.",
      "Please enter the place.",
      "Please upload an image of the equipment.",
    ];
    const translations = [
      "దయచేసి పరికరం పేరును నమోదు చేయండి.",
      "దయచేసి అద్దె మొత్తం నమోదు చేయండి.",
      "దయచేసి మీ మొబైల్ నంబర్ నమోదు చేయండి.",
      "దయచేసి స్థలాన్ని నమోదు చేయండి.",
      "దయచేసి పరికరానికి సంబంధించిన చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    ];

    if (step <= messages.length) {
      speak(messages[step - 1]);
      setTimeout(() => speak(translations[step - 1], "te-IN"), 2000);
    }

    focusNextField(step);
  };

  const focusNextField = (step) => {
    setTimeout(() => {
      switch (step) {
        case 1:
          nameRef.current && nameRef.current.focus();
          break;
        case 2:
          rentRef.current && rentRef.current.focus();
          break;
        case 3:
          mobileRef.current && mobileRef.current.focus();
          break;
        case 4:
          placeRef.current && placeRef.current.focus();
          break;
        case 5:
          photoRef.current && photoRef.current.focus();
          break;
        default:
          break;
      }
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      switch (name) {
        case "equipmentName":
          if (value) speakStep(2);
          break;
        case "rent":
          if (value) speakStep(3);
          break;
        case "mobile":
          if (value) speakStep(4);
          break;
        case "place":
          if (value) speakStep(5);
          break;
        default:
          break;
      }
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, photo: file });
    speak("Image uploaded successfully!");
    console.log("Selected file:", file); // Log the selected file
  };

  const validateForm = () => {
    const { equipmentName, rent, mobile, place, photo } = productData;
    let errors = {};

    if (!equipmentName.trim()) {
      errors.equipmentName = "Equipment name is required.";
    }
    if (!rent.trim()) {
      errors.rent = "Rent amount is required.";
    }
    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Mobile number must be 10 digits.";
    }
    if (!place.trim()) {
      errors.place = "Place is required.";
    }
    if (!photo) {
      errors.photo = "Equipment image is required.";
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        speak(error);
      });
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("equipmentName", productData.equipmentName);
    formData.append("rent", productData.rent);
    formData.append("mobile", productData.mobile);
    formData.append("place", productData.place);
    formData.append("photo", productData.photo);

    const token = localStorage.getItem("token"); // Get the token from localStorage
    console.log("Token:", token); // Debugging line to check token presence

    if (!token) {
        console.error("No token found. User might not be logged in.");
        return; // Exit if no token is found
    }

    try {
        const response = await axios.post("http://localhost:5004/api/products/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`, // Correctly formatted token
            },
        });

        if (response.data.success) {
            // Handle success
            speak("Product added successfully!");
            setProductData({
                equipmentName: "",
                rent: "",
                mobile: "",
                place: "",
                photo: null,
            });
            setRedirect(true); // Redirect to the products page
        } else {
            console.error("Failed to add product:", response.data.message);
            speak("Failed to add product. Try again.");
        }
    } catch (error) {
        console.error("Error adding product:", error); // Log the error
        speak("Error adding product. Check your details.");
    }
};

  
  // If redirect is true, redirect to the products page
  if (redirect) {
    return <Navigate to="/products" />; // Use Navigate for redirection
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="p-4 bg-white rounded shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Add Equipment</h3>
        {error && <p className="text-danger text-center">{error}</p>} {/* Display error message if any */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Equipment Name</label>
            <input
              type="text"
              className="form-control"
              name="equipmentName"
              value={productData.equipmentName}
              onChange={handleChange}
              ref={nameRef}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rent</label>
            <input
              type="text"
              className="form-control"
              name="rent"
              value={productData.rent}
              onChange={handleChange}
              ref={rentRef}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              value={productData.mobile}
              onChange={handleChange}
              ref={mobileRef}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Place</label>
            <input
              type="text"
              className="form-control"
              name="place"
              value={productData.place}
              onChange={handleChange}
              ref={placeRef}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Equipment Photo</label>
            <input
              type="file"
              className="form-control"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              ref={photoRef}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100"   style={{"background-color": "#597D35",color: "white"}} >Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;