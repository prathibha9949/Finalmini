import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaWhatsapp, FaPhone, FaTrash, FaEdit } from "react-icons/fa";

const LaborerList = () => {
    const [laborers, setLaborers] = useState([]);
    const [selectedLaborer, setSelectedLaborer] = useState(null);
    const [updatedDetails, setUpdatedDetails] = useState({ name: "", wage: "", mobile: "" });

    useEffect(() => {
        const fetchLaborers = async () => {
            try {
                const response = await axios.get("http://localhost:5004/api/laborers");
                setLaborers(response.data.laborers);
            } catch (error) {
                console.error("Error fetching laborers:", error);
            }
        };
        fetchLaborers();
    }, []);

    // Open WhatsApp Web Chat
    // const handleWhatsAppChat = (mobile) => {
    //     window.open(`https://web.whatsapp.com/send?phone=${mobile}&text=Hello,%20I%20am%20interested%20in%20your%20work.`, "_blank");
    // };
    const handleWhatsAppChat = (mobile) => {
        window.open(`https://web.whatsapp.com/send?phone=${mobile}&text=Are%20you%20interested%20in%20work?`, "_blank");
    };
    

    // Call via Browser
    const handleBrowserCall = (mobile) => {
        window.location.href = `tel:${mobile}`;
    };

    // Delete Laborer
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this laborer?")) {
            try {
                await axios.delete(`http://localhost:5004/api/laborers/${id}`);
                setLaborers(laborers.filter((laborer) => laborer._id !== id));
                alert("Laborer deleted successfully!");
            } catch (error) {
                console.error("Error deleting laborer:", error);
                alert("Failed to delete laborer.");
            }
        }
    };

    // Open Update Modal
    const handleUpdateClick = (laborer) => {
        setSelectedLaborer(laborer);
        setUpdatedDetails({ name: laborer.name, wage: laborer.wage, mobile: laborer.mobile });
    };

    // Handle Update Submission
    const handleUpdateSubmit = async () => {
        try {
            await axios.put(`http://localhost:5004/api/laborers/${selectedLaborer._id}`, updatedDetails);
            setLaborers(
                laborers.map((laborer) => (laborer._id === selectedLaborer._id ? { ...laborer, ...updatedDetails } : laborer))
            );
            alert("Laborer details updated successfully!");
            setSelectedLaborer(null);
        } catch (error) {
            console.error("Error updating laborer:", error);
            alert("Failed to update laborer details.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Available Laborers</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Wage (₹)</th>
                        <th>Mobile</th>
                        <th>WhatsApp Chat</th>
                        <th>Call via Browser</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {laborers.map((laborer) => (
                        <tr key={laborer._id}>
                            <td>{laborer.name}</td>
                            <td>{laborer.wage}</td>
                            <td>{laborer.mobile}</td>
                            <td>
                                <button className="btn btn-success" onClick={() => handleWhatsAppChat(laborer.mobile)}>
                                    <FaWhatsapp size={16} />
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleBrowserCall(laborer.mobile)}>
                                    <FaPhone size={16} />
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleUpdateClick(laborer)}>
                                    <FaEdit size={16} />
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(laborer._id)}>
                                    <FaTrash size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            {selectedLaborer && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Laborer Details</h5>
                                <button className="btn-close" onClick={() => setSelectedLaborer(null)}></button>
                            </div>
                            <div className="modal-body">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={updatedDetails.name}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })}
                                />
                                <label>Wage (₹):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={updatedDetails.wage}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, wage: e.target.value })}
                                />
                                <label>Mobile:</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={updatedDetails.mobile}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, mobile: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedLaborer(null)}>Close</button>
                                <button className="btn btn-success" onClick={handleUpdateSubmit}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaborerList;
