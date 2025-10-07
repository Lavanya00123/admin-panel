import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASE_URL } from './constants';

const AttendanceTable = () => {
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const [date, setDate] = useState(new Date());

  const getStatus = (attendanceStatus) => {
    if (attendanceStatus.isPresent) return "Present";
    if (attendanceStatus.isHalfDay) return "Half Day";
    if (attendanceStatus.isLeave) return "Leave";
    return "Absent"; 
  };

  useEffect(() => {
    const fetchEmployeeAttendance = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/employees/${employeeId}/attendance-list`);
        const { attendance: attendanceData, ...employeeDetails } = response.data;

        setAttendance(attendanceData);
        setEmployee(employeeDetails);
        console.log("Fetched Attendance Data:", attendanceData); 
      } catch (err) {
        setError("Error fetching employee data. Please try again later.");
        console.error("Error fetching employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAttendance();
  }, [employeeId]);

  // Filter only records with attendance and status
  const filteredAttendance = attendance
    .filter((record) => record.AttendanceStatus && record.time && record.photoUri && record.locationName)
    .map((record) => ({
      date: new Date(record.time).toDateString(),
      status: getStatus(record.AttendanceStatus),
      time: new Date(record.time).toLocaleTimeString(), // Get the time in a readable format
      photoUri: record.photoUri,
      location: record.locationName,
    }));

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg absolute top-20 right-10 xs:left-0 xs:right-0 md:left-[275px]">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Employee Attendance</h2>

      {employee && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold">Employee Details</h3>
          <p><strong>ID:</strong> {employee.employeeId}</p>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Username:</strong> {employee.userName}</p>
          <p><strong>Mobile Number:</strong> {employee.mobileNumber}</p>
          <p><strong>Branch:</strong> {employee.branch}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Selected Month:</strong> {date.toLocaleString("default", { month: "long", year: "numeric" })}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 mb-6">
        <Link to={`/employees/${employeeId}/attendance-list/leaves`}>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300 mb-2 md:mb-0">
            View Leave Requests
          </button>
        </Link>
        <Link to={`/employees/${employeeId}/attendance-list/complaints`}>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300">
            View Complaints
          </button>
        </Link>
      </div>

      <div className="mb-6">
        <Calendar onChange={setDate} value={date} className="mx-auto" />
        <p className="text-center text-gray-600 mt-2">
          Selected Month: {date.toLocaleString("default", { month: "long", year: "numeric" })}
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
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Location</th>
                  <th className="border border-gray-300 px-10 py-2 text-left text-sm font-medium text-gray-600">Photo</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(({ date, status, time, photoUri, location }) => (
                  <tr key={date} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{time}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{status}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{location}</td>
                    <td className="border border-gray-300 px-4 py-2">
  <img
    src={photoUri}
    alt="Attendance"
    className="w-32 h-32 object-cover rounded-lg mx-auto" // Increase the width and height
  />
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No attendance records for this period.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
