import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const Complaints = () => {
  const { employeeId, name, mobileNumber,branch,designation } = useParams();
  const [employee, setEmployee] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employeeResponse = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list`
        );
        setEmployee(employeeResponse.data);

        const complaintsResponse = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list/complaints`
        );
        setComplaints(complaintsResponse.data);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Sort complaints by createdAt date in descending order
  const sortedComplaints = complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen absolute top-20 md:left-[275px] right-0 left-0 ">
      {/* Employee Information */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Employee Information</h2>
        <p className="text-lg text-white">ID: {employee.employeeId || employeeId}</p>
        <p className="text-lg text-white">Name: {employee.name || name}</p>
        <p className="text-lg text-white">Number: {employee.mobileNumber || mobileNumber}</p>
        <p className="text-lg text-white">Branch: {employee.branch || branch}</p>
        <p className="text-lg text-white">Designation: {employee.designation || designation}</p>
      </div>

      {/* Complaints List */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black text-center">Complaints Inbox</h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading complaints...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sortedComplaints.length > 0 ? (
          sortedComplaints.map((complaint, index) => {
            // Extract date and time from createdAt
            const date = new Date(complaint.createdAt);
            const formattedDate = date.toLocaleDateString(); // Only the date
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Only the time

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-500 transition duration-400 ease-in-out hover:scale-95 hover:bg-gradient-to-r from-red-300 via-blue-300 to-blue-100 relative"
              >
                <span className="text-xl font-semibold">Title:</span>{" "}
                <h3 className="text-xl font-bold mb-2">{complaint.title}</h3>
                <span className="text-xl font-semibold">Description:</span>{" "}
                <p className="text-black text-lg">{complaint.description}</p>
                
                {/* Display Date at the Top Right */}
                <p className="absolute right-4 top-4 text-gray-600">
                  {formattedDate} {formattedTime}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;
