import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const Dashboard = () => {
  const { employeeId } = useParams();
  const [inputEmployeeId, setInputEmployeeId] = useState(employeeId || "");
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState("N/A");
  const [employee, setEmployee] = useState({});
  const [basicSalary, setBasicSalary] = useState("N/A");
  const [advanceSalary, setAdvanceSalary] = useState("N/A");
  const [numberOfLeaves, setNumberOfLeaves] = useState("N/A");
  const [actualSalary, setActualSalary] = useState("N/A");
  const [locations, setLocations] = useState([]); // New state for storing location updates
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    setError(null);
    setEmployee({});
    setTotalCalls(0);
    setTotalMessages(0);
    setAttendanceStatus("");
    setBasicSalary("");
    setAdvanceSalary("");
    setNumberOfLeaves("");
    setActualSalary("");
    setLocations([]); // Reset locations

    try {
      const employeeResponse = await fetch(`${BASE_URL}/employees/${id}`);
      if (!employeeResponse.ok) throw new Error("Employee not found");
      const employeeData = await employeeResponse.json();
      setEmployee(employeeData);

      const callResponse = await fetch(`${BASE_URL}/employees/${id}/total-calls`);
      const callData = callResponse.ok ? await callResponse.json() : { totalCalls: 0 };
      setTotalCalls(callData.totalCalls || 0);

      const messageResponse = await fetch(`${BASE_URL}/employees/${id}/total-messages`);
      const messageData = messageResponse.ok ? await messageResponse.json() : { totalMessages: 0 };
      setTotalMessages(messageData.totalMessages || 0);

      const attendanceResponse = await fetch(`${BASE_URL}/employees/${id}/attendance-list`);
      const attendanceData = attendanceResponse.ok ? await attendanceResponse.json() : {};
      setAttendanceStatus(attendanceData.status || "N/A");

      const salaryResponse = await fetch(`${BASE_URL}/employees/${id}/salaries`);
      if (salaryResponse.ok) {
        const salaryData = await salaryResponse.json();
        setBasicSalary(salaryData.basicSalary);
        setAdvanceSalary(salaryData.advanceSalary);
        setNumberOfLeaves(salaryData.noOfLeaves);
        setActualSalary(salaryData.actualSalary);
      }
    } catch (err) {
      setError("Error fetching employee data. Please check the Employee ID.");
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputEmployeeId) {
      fetchEmployeeData(inputEmployeeId);
    } else {
      setError("Please enter a valid Employee ID.");
      setEmployee({ name: "", employeeId: "", mobileNumber: "", branch: "" });
    }
  };

  return (
    <div className="p-4 xs:p-5 sm:p-6 md:p-8 absolute md:left-[270px] lg:top-20 lg:right-0 xs:top-20 xs:right-10 xs:left-10">
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex flex-col xs:flex-row items-center justify-center gap-2"
      >
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-full xs:w-48 sm:w-64 focus:outline-none focus:border-blue-500"
          placeholder="Enter Employee ID"
          value={inputEmployeeId}
          onChange={(e) => setInputEmployeeId(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full xs:w-auto"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="bg-gray-300 shadow-xl hover:shadow-xl transition-shadow shadow-violet-800 rounded-lg p-4 xs:p-5 sm:p-6 mb-10 flex flex-col">
        <h2 className="text-2xl xs:text-2xl sm:text-3xl font-bold mb-2">Employee Details</h2>
        <p className="text-gray-700 text-lg xs:text-xl">Name: {employee.name || "N/A"}</p>
        <p className="text-gray-700 text-lg xs:text-xl">Employee ID: {employee.employeeId || inputEmployeeId}</p>
        <p className="text-gray-700 text-lg xs:text-xl">Phone Number: {employee.mobileNumber || "N/A"}</p>
        <p className="text-gray-700 text-lg xs:text-xl">Basic Salary: {basicSalary || "N/A"}</p>
        <p className="text-gray-700 text-lg xs:text-xl">Branch: {employee.branch || "N/A"}</p>
        <p className="text-gray-700 text-lg xs:text-xl">Designation: {employee.designation || "N/A"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xs:grid-cols-1 md:grid-cols-2 mb-10">
        <Link to={`/employees/${employee.employeeId || inputEmployeeId}/call-logs`}>
          <div className="bg-gray-300 shadow-xl rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between hover:shadow-xl transition-shadow shadow-blue-700">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Total Calls</h2>
              <p className="text-gray-800 mt-1 text-lg">{totalCalls} calls</p>
            </div>
            <FaPhone className="text-blue-500 text-2xl sm:text-3xl" />
          </div>
        </Link>

        <Link to={`/employees/${employee.employeeId || inputEmployeeId}/messages`}>
          <div className="bg-gray-300 shadow-xl rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between hover:shadow-xl shadow-green-600 transition-shadow">
            <div>
              <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Messages</h2>
              <p className="text-gray-800 mt-1 text-lg">{totalMessages} messages</p>
            </div>
            <FaEnvelope className="text-green-500 text-2xl sm:text-3xl" />
          </div>
        </Link>

        <div className="bg-gray-300 shadow-xl rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between shadow-yellow-500 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Salary Details</h2>
            <p className="text-gray-700 text-lg xs:text-xl">Basic Salary: {basicSalary}</p>
            <p className="text-gray-700 text-lg xs:text-xl">Number of Leaves: {numberOfLeaves}</p>
            <p className="text-gray-700 text-lg xs:text-xl">Actual Salary: {actualSalary}</p>
            <p className="text-gray-700 text-lg xs:text-xl">Advance Salary: {advanceSalary}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl" />
        </div>

        <div className="bg-gray-300 shadow-xl rounded-lg p-4 xs:p-5 sm:p-6 flex items-center justify-between shadow-red-600 hover:shadow-xl transition-shadow">
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold">Location Updates</h2>
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <p key={index} className="text-gray-800 mt-1 text-lg">
                  {location.locationName} at {location.time}
                </p>
              ))
            ) : (
              <p className="text-gray-800 mt-1 text-lg">No location updates available.</p>
            )}
          </div>
          <FaMapMarkerAlt className="text-red-500 text-2xl sm:text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
