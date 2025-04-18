
// frontend/src/components/WorkList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const WorkList = () => {
  const [workRequests, setWorkRequests] = useState([]);

  useEffect(() => {
    const fetchWorkRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/work/list");
        if (response.data.success) {
          setWorkRequests(response.data.workRequests);
        }
      } catch (error) {
        console.error("Error fetching work requests:", error);
      }
    };
    fetchWorkRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Work Requests</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Wage Required</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {workRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.name}</td>
              <td>₹{request.wageRequired}</td>
              <td>{request.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkList;

// frontend/src/components/ProductList.js (Modify to add 'Need Work?' button)
