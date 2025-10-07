import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from './constants';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const response = await axios.get(`${BASE_URL}/employees`);
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      setError("Error fetching employees. Please try again later.");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const retryFetch = () => {
    fetchEmployees();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEmployees(
      employees.filter(
        (employee) =>
          employee.employeeId.toLowerCase().includes(query) ||
          employee.name.toLowerCase().includes(query) ||
          employee.mobileNumber.includes(query)
      )
    );
  };

  const goToCallDetails = (employeeId) => {
    navigate(`/employees/${employeeId}/call-logs`);
  };

  const goToMessageDetails = (employeeId) => {
    navigate(`/employees/${employeeId}/messages`);
  };

  const goToAttendanceDetails = (employeeId) => {
    navigate(`/employees/${employeeId}/attendance-list`);
  };

  const EmployeeRow = ({ employee, index }) => (
    <tr key={employee._id} className="hover:bg-gray-100 transition-colors duration-200">
      <td className="border border-gray-800 px-4 py-2 text-center">{index + 1}</td>
      <td className="border border-gray-800 px-4 py-2">{employee.employeeId}</td>
      <td className="border border-gray-800 px-4 py-2">{employee.name}</td>
      <td className="border border-gray-800 px-4 py-2">{employee.mobileNumber}</td>
      <td className="border border-gray-800 px-4 py-2">
        <button onClick={() => goToCallDetails(employee.employeeId)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" aria-label="View call logs">Calls</button>
        <button onClick={() => goToMessageDetails(employee.employeeId)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2" aria-label="View messages">Messages</button>
        <button onClick={() => goToAttendanceDetails(employee.employeeId)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded" aria-label="View attendance list">Attendance</button>
      </td>
      <td className="border border-gray-400 px-4 py-12 flex items-center justify-center">
        {employee.isActive ? (
          <div className="flex items-center">
            <FaCircle className="text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Online</span>
          </div>
        ) : (
          <div className="flex items-center">
            <FaCircle className="text-red-500 mr-2" />
            <span className="text-sm text-gray-700">Offline</span>
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-4 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Employee List</h2>

      <div className="mb-6 text-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Employee ID, Name, or Mobile Number"
          className="w-full max-w-md px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center">
          <p className="text-gray-500">Loading employees...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button onClick={retryFetch} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Retry</button>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-600 rounded-lg shadow-md">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">SL No</th>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">Employee ID</th>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">Employee Name</th>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">Mobile Number</th>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">Actions</th>
                <th className="border border-black px-4 py-3 text-left text-sm font-medium text-white bg-red-600">Active Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <EmployeeRow key={employee._id} employee={employee} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No employees match your search.</p>
        </div>
      )}
    </div>
  );
};

export default Employee;
