import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "./constants";

const CallLogTable = () => {
  const { employeeId } = useParams();
  const [callLogs, setCallLogs] = useState([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch call logs
  useEffect(() => {
    const fetchCallLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/employees/${employeeId}/call-logs`
        );
        setCallLogs(response.data);
        setFilteredCallLogs(response.data);
      } catch (err) {
        setError("Error fetching call logs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchCallLogs();
  }, [employeeId]);

  // Handle Search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle Sorting
  const handleSort = (order) => {
    setSortOrder(order);
    const sortedLogs = [...filteredCallLogs].sort((a, b) =>
      order === "ascending" ? a.duration - b.duration : b.duration - a.duration
    );
    setFilteredCallLogs(sortedLogs);
  };

  // Handle Call Log Deletion
  const handleDeleteCallLog = async (callLogId) => {
    if (window.confirm("Do you really want to delete this call log?")) {
      try {
        await axios.delete(
          `${BASE_URL}/Delete-call-log/${employeeId}/${callLogId}`
        );
        const updatedLogs = callLogs.filter((log) => log._id !== callLogId);
        setCallLogs(updatedLogs);
        setFilteredCallLogs(updatedLogs);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle Deleting All Call Logs
  const handleDeleteAllCallLogs = async () => {
    if (window.confirm("Do you really want to delete all call logs?")) {
      try {
        await axios.delete(`${BASE_URL}/Delete-all-call-logs/${employeeId}`);
        setCallLogs([]);
        setFilteredCallLogs([]);
        alert("All call logs deleted successfully.");
      } catch (err) {
        console.error(err);
        alert("Error deleting call logs. Please try again.");
      }
    }
  };

  // Filter Logs Based on Search Term and Type
  useEffect(() => {
    const filtered = callLogs.filter((log) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        log.name?.toLowerCase().includes(searchLower) ||
        log.phoneNumber.includes(searchLower) ||
        log.type?.toLowerCase().includes(searchLower) ||
        log.duration.toString().includes(searchTerm) ||
        new Date(log.dateTime).toLocaleDateString().includes(searchTerm);

      return matchesSearch && (filterType === "All" || log.type === filterType);
    });

    setFilteredCallLogs(filtered);
  }, [searchTerm, filterType, callLogs]);

  // Format DateTime in Indian Standard Time (IST)
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Format Duration in minutes:seconds format
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-6 absolute top-20 right-10 xs:right-0 md:left-[270px] xs:left-0">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
        Call Logs for Employee ID: {employeeId}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name or Phone Number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 p-2 rounded-lg w-1/3 shadow-sm"
        />
        <select
          className="border border-purple-500 p-2 rounded-lg focus:outline-none focus:border-purple-700"
          value={sortOrder}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort by Duration</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
        <button
          onClick={handleDeleteAllCallLogs}
          className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-6 py-2 rounded-lg"
        >
          Delete All Call Logs
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-600">{error}</p>
      ) : filteredCallLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xl">
                <th className="p-4">Sl. No.</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredCallLogs.map((log, index) => (
                <tr
                  key={`${log.timestamp}-${index}`}
                  className="bg-white border-b border-purple-200 hover:bg-purple-50 transition duration-300"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{log.name || "N/A"}</td>
                  <td className="p-4">{log.type}</td>
                  <td className="p-4">{formatDuration(log.duration)}</td>
                  {/* <td className="p-4">{formatDateTime(log.dateTime)}</td> */}
                  <td className="p-4">
  {log.dateTime.replace("T", " ").split(".")[0]}
</td>

                  <td className="p-4">{log.phoneNumber}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteCallLog(log._id)}
                      className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          No call logs available
        </p>
      )}
    </div>
  );
};

export default CallLogTable;
