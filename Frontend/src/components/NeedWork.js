import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NeedWork = () => {
    const [name, setName] = useState("");
    const [wage, setWage] = useState("");
    const [mobile, setMobile] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5004/api/laborers", { name, wage, mobile });
    
            if (response.data.success) {
                alert("Your details have been submitted successfully!");
                navigate("/laborers-list"); // Redirect to laborers list page
            } else {
                alert(`Failed to submit details: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error submitting laborer details:", error.response?.data || error.message);
            alert(`An error occurred: ${error.response?.data?.message || error.message}`);
        }
    };
    
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="shadow p-4 bg-light rounded" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Enter Your Details</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Wage Required (₹):</label>
                        <input type="number" className="form-control" value={wage} onChange={(e) => setWage(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mobile Number:</label>
                        <input type="tel" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-warning w-100">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default NeedWork;