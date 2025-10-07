import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const CallLogDetails = () => {
  const { employeeId } = useParams();
  const [callLogs, setCallLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCallLogs, setFilteredCallLogs] = useState([]);
  const [inputEmployeeId, setInputEmployeeId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Fetch call logs from backend API
  const fetchCallLogs = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/employees/${id}/call-logs`);
      setCallLogs(response.data);
      setFilteredCallLogs(response.data);
      setErrorMessage(""); // Clear error message if successful
    } catch (error) {
      console.error("Error fetching call logs:", error);
      setErrorMessage("Error fetching call logs. Please try again.");
    }
  };

  // Handle delete a single call log with confirmation
  const handleDelete = async (callLogId) => {
    if (window.confirm("Do you really want to delete this call log?")) {
      try {
        await axios.delete(`${BASE_URL}/Delete-call-log/${employeeId}/${callLogId}`);
        setCallLogs((prevLogs) => prevLogs.filter((log) => log._id !== callLogId));
        setFilteredCallLogs((prevFiltered) => prevFiltered.filter((log) => log._id !== callLogId));
      } catch (error) {
        console.error("Error deleting call log:", error);
      }
    }
  };

  // Handle delete all call logs with confirmation
  const handleDeleteAllCallLogs = async () => {
    if (window.confirm("Do you really want to delete all call logs? This action cannot be undone.")) {
      try {
        await axios.delete(`${BASE_URL}/Delete-all-call-logs/${employeeId}`);
        setCallLogs([]); // Empty the call logs state
        setFilteredCallLogs([]); // Empty the filtered call logs state
        alert("All call logs deleted successfully.");
      } catch (error) {
        console.error("Error deleting all call logs:", error);
        alert("Error deleting all call logs. Please try again.");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle employee ID input change
  const handleEmployeeIdChange = (event) => {
    setInputEmployeeId(event.target.value);
    setErrorMessage(""); // Clear error message on input change
  };

  // Handle form submission to fetch call logs for entered Employee ID
  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputEmployeeId.trim() === "") {
      setErrorMessage("Please enter a valid Employee ID.");
      return;
    }
    fetchCallLogs(inputEmployeeId);
    setInputEmployeeId(""); // Clear input after submission
  };

  // Sort call logs by key
  const sortCallLogs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedLogs = [...filteredCallLogs].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredCallLogs(sortedLogs);
  };

  // Filter call logs based on search term
  useEffect(() => {
    const filtered = callLogs.filter((log) => {
      const name = log.name || "";
      const phoneNumber = log.phoneNumber || "";
      const type = log.type || "";
      const date = log.dateTime
        ? new Date(log.dateTime).toLocaleDateString()
        : "";

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        date.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredCallLogs(filtered);
  }, [searchTerm, callLogs]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
  
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Converts to 12-hour format with AM/PM
    };
  
    return date.toLocaleString("en-IN", options);
  };

  return (
    <div className="p-4 absolute top-20 right-0 md:left-[275px] xs:left-0">
      <h1 className="text-4xl font-bold mb-6">Call Logs for Employee ID: {employeeId}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={inputEmployeeId}
          onChange={handleEmployeeIdChange}
          className="border p-2 rounded mr-2 border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg text-white px-6 py-2 rounded-lg"
        >
          Fetch Call Logs
        </button>
      </form>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {callLogs.length > 0 && (
        <div>
          <input
            type="text"
            placeholder="Search call logs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded mb-4 border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 w-full md:w-1/3"
          />
          <button
            onClick={handleDeleteAllCallLogs}
            className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg ml-4"
          >
            Delete All Call Logs
          </button>
        </div>
      )}

      {filteredCallLogs.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 border-collapse shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-white">Sl. No</th>
              <th
                className="border border-gray-300 px-4 py-3 text-left font-medium text-white cursor-pointer"
                onClick={() => sortCallLogs("name")}
              >
                Name
              </th>
              <th
                className="border border-gray-300 px-4 py-3 text-left font-medium text-white cursor-pointer"
                onClick={() => sortCallLogs("phoneNumber")}
              >
                Phone Number
              </th>
              <th
                className="border border-gray-300 px-4 py-3 text-left font-medium text-white cursor-pointer"
                onClick={() => sortCallLogs("type")}
              >
                Type
              </th>
              <th
                className="border border-gray-300 px-4 py-3 text-left font-medium text-white cursor-pointer"
                onClick={() => sortCallLogs("duration")}
              >
                Duration (minutes)
              </th>
              <th
                className="border border-gray-300 px-4 py-3 text-left font-medium text-white cursor-pointer"
                onClick={() => sortCallLogs("dateTime")}
              >
                Date
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCallLogs.map((log, index) => (
         <tr key={log._id} className="hover:bg-gray-100 transition-colors duration-200">
         <td className="border border-gray-300 px-4 py-4">{index + 1}</td>
         <td className="border border-gray-300 px-4 py-4">{log.name}</td>
         <td className="border border-gray-300 px-4 py-4">{log.phoneNumber}</td>
         <td className="border border-gray-300 px-4 py-4">{log.type}</td>
         <td className="border border-gray-300 px-4 py-4">
           {log.duration &&
             `${Math.floor(log.duration / 60)} mins ${log.duration % 60} secs`}
         </td>
         <td className="border border-gray-300 px-4 py-4">
  {log.dateTime.replace("T", " ").split(".")[0]}
</td>

         <td className="border border-gray-300 px-4 py-4">
           <button
             onClick={() => handleDelete(log._id)}
             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
           >
             Delete
           </button>
         </td>
       </tr>
       
           
            ))}
          </tbody>
        </table>
      ) : (
        <p>No call logs found.</p>
      )}
    </div>
  );
};

export default CallLogDetails;
