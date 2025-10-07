import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASE_URL } from "./constants"; // Make sure the BASE_URL is correctly set

const AttendanceDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const getStatus = (attendanceStatus) => {
    if (attendanceStatus.isPresent) return "Present";
    if (attendanceStatus.isHalfDay) return "Half Day";
    if (attendanceStatus.isLeave) return "Leave";
    return "Absent";
  };

  const fetchEmployeeAttendance = async (id) => {
    const selectedMonth = date.getMonth() + 1; // getMonth is zero-based, so add 1
    const selectedYear = date.getFullYear();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/${id}/attendance-list?month=${selectedMonth}&year=${selectedYear}`
      );
      setEmployee(response.data);
      setAttendance(response.data.attendance || []);
    } catch (err) {
      setError("Error fetching employee data. Please try again later.");
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (employeeId.trim()) {
      fetchEmployeeAttendance(employeeId);
    }
  };

  const filteredAttendance = attendance
    .filter(
      (record) =>
        record.AttendanceStatus &&
        record.time &&
        record.photoUri &&
        record.locationName
    )
    .map((record) => ({
      date: new Date(record.time).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: getStatus(record.AttendanceStatus),
      time: new Date(record.time).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      photoUri: record.photoUri,
      location: record.locationName,
    }));

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-20 md:ml-[275px]">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Employee Attendance
      </h2>

      <form onSubmit={handleSearch} className="mb-4 text-center">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      {employee && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold">Employee Details</h3>
          <p>
            <strong>ID:</strong> {employee.employeeId}
          </p>
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>User Name:</strong> {employee.userName}
          </p>
          <p>
            <strong>Mobile Number:</strong> {employee.mobileNumber}
          </p>
          <p>
            <strong>Branch:</strong> {employee.branch}
          </p>
          <p>
            <strong>Designation:</strong> {employee.designation}
          </p>
          <p>
            <strong>Selected Month:</strong>{" "}
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 mb-6">
        <button
          onClick={() =>
            navigate(`/employees/${employeeId}/attendance-list/leaves`)
          }
          className="px-6 py-2 bg-blue-500 hover:bg-red-600 text-white rounded-lg shadow  transition duration-300 mb-2 md:mb-0"
        >
          View Leave Requests
        </button>
        <button
          onClick={() =>
            navigate(`/employees/${employeeId}/attendance-list/complaints`)
          }
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300"
        >
          View Complaints
        </button>
      </div>

      <div className="mb-6">
        <Calendar onChange={setDate} value={date} className="mx-auto" />
        <p className="text-center text-gray-600 mt-2">
          Selected Month:{" "}
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading attendance...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="mb-8">
          {filteredAttendance.length > 0 ? (
            <table className="min-w-full bg-white mt-4 border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Time
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Photo
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(
                  ({ date, status, time, photoUri, location }) => (
                    <tr
                      key={date}
                      className="hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {time}
                      </td>

                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800">
                        {location}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <img
                          src={photoUri}
                          alt="Attendance"
                          className="w-32 h-32 object-cover rounded-lg mx-auto" // Increase the width and height
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No attendance records found for this employee.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceDetails;
