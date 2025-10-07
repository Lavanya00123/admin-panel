import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";

const UserRequest = () => {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem("employees");
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const STATUS = {
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PENDING: "Pending",
  };

  // Fetch employees data
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/employees`);
      const fetchedEmployees = response.data;
      setEmployees(fetchedEmployees);
      localStorage.setItem("employees", JSON.stringify(fetchedEmployees));
    } catch (err) {
      const savedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      if (savedEmployees.length > 0) {
        setEmployees(savedEmployees);
        setError("Failed to fetch fresh data. Showing cached employees.");
      } else {
        setError("Error fetching employees. Please try again later.");
      }
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const retryFetch = () => {
    fetchEmployees();
  };

  const goToDetails = (employeeId) => {
    navigate(`/employees/${employeeId}/details`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toString().includes(searchTerm) ||
      employee.mobileNumber?.includes(searchTerm)
  );

  // Handle status change for employees
  const handleStatusChange = async (employeeId, status) => {
    try {
      const response = await axios.post(`${BASE_URL}/employees/${employeeId}/status`, { status });
      const updatedEmployee = response.data;

      const updatedEmployees = employees.map((emp) =>
        emp.employeeId === updatedEmployee.employeeId
          ? { ...emp, ApproveStatus: updatedEmployee.ApproveStatus }
          : emp
      );

      setEmployees(updatedEmployees);
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    } catch (err) {
      console.error(`Error changing status for employee ${employeeId}:`, err);
      setError("Error changing status. Please try again.");
    }
  };

  // Employee Row component
  const EmployeeRow = React.memo(({ employee, index }) => (
    <tr
      key={employee._id}
      className="hover:bg-gray-100 transition-colors duration-200"
    >
      <td className="border border-gray-800 px-4 py-2 text-center">
        {index + 1}
      </td>
      <td className="border border-gray-800 px-4 py-2">{employee.employeeId}</td>
      <td className="border border-gray-800 px-4 py-2">{employee.name}</td>
      <td className="border border-gray-800 px-4 py-2">{employee.mobileNumber}</td>
      <td className="border border-gray-800 px-4 py-2">
        <button
          onClick={() => goToDetails(employee.employeeId)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
        >
          View
        </button>
      </td>
      <td className="border-b border-r border-gray-800  px-4 py-2 flex flex-wrap gap-2 justify-center">
        {employee.ApproveStatus === STATUS.APPROVED ? (
          <>
            <span className="text-green-500 font-bold">Approved</span>
            <button
              onClick={() => handleStatusChange(employee.employeeId, STATUS.PENDING)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
            >
              Edit
            </button>
          </>
        ) : employee.ApproveStatus === STATUS.REJECTED ? (
          <>
            <span className="text-red-500 font-bold">Rejected</span>
            <button
              onClick={() => handleStatusChange(employee.employeeId, STATUS.PENDING)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleStatusChange(employee.employeeId, STATUS.APPROVED)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-01 px-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange(employee.employeeId, STATUS.REJECTED)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  ));

  return (
    <div className="p-4 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Employee List</h2>

      <input
        type="text"
        placeholder="Search by Employee ID, Name, or Mobile Number"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-4 p-2 border border-red-600 rounded "
      />

      {loading ? (
        <div className="text-center">
          <p className="text-gray-500">Loading employees...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={retryFetch}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white ">
                  SL No
                </th>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white  ">
                  Employee ID
                </th>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white ">
                  Employee Name
                </th>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white ">
                  Mobile Number
                </th>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white ">
                  Details
                </th>
                <th className="border border-gray-600 px-4 py-3 text-sm font-medium bg-red-500 text-white ">
                  Actions
                </th>
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
          <p className="text-gray-500">No employees available.</p>
        </div>
      )}
    </div>
  );
};

export default UserRequest;
