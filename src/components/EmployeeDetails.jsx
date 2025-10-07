import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    _id: "",
    employeeId: "",
    userName: "",
    name: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    password: "",
    confirmPassword: "",
    branch: "",
    designation: "",
    dateOfBirth: "",
    address: "",
    joinDate: "",
    fatherName: "",
    spouseName: "",
    salary: "",
    gender: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const storedApprovalStatus = localStorage.getItem(`approval-${employeeId}`);
    if (storedApprovalStatus) {
      setIsApproved(JSON.parse(storedApprovalStatus));
    }
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/${employeeId}/details`
      );
      setEmployee(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(`approval-${employeeId}`, JSON.stringify(isApproved));
  }, [isApproved, employeeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-lg mx-auto shadow-lg text-white max-w-4xl mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Employee Details</h1>
      <form className="gri
      d grid-cols-1 md:grid-cols-2 gap-4">
        {/* Render employee details */}
        <label className="flex flex-col font-semibold">
          Employee ID
          <input
            type="text"
            value={employee.employeeId}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          User Name
          <input
            type="text"
            value={employee.userName}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Mobile Number
          <input
            type="text"
            value={employee.mobileNumber}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Alternate Mobile Number
          <input
            type="text"
            value={employee.alternateMobileNumber}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Branch
          <input
            type="text"
            value={employee.branch}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Designation
          <input
            type="text"
            value={employee.designation}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Date of Birth
          <input
            type="date"
            value={employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : ""}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Address
          <input
            type="text"
            value={employee.address}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold mt-4">
          Father Name
          <input
            type="text"
            value={employee.fatherName}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />

        </label>
        <label className="flex flex-col font-semibold mt-4">
          Spouse Name
          <input
            type="text"
            value={employee.spouseName}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Salary
          <input
            type="text"
            value={employee.salary}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold">
          Gender
          <input
            type="text"
            value={employee.gender}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          />
        </label>
        <label className="flex flex-col font-semibold mt-4">
          Join Date
          <input
            type="date"
            value={employee.joinDate ? employee.joinDate.split("T")[0] : ""}
            readOnly
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200" 
            />
        </label>
        <label className="flex flex-col font-semibold">
          Approval Status
          <select
            value={isApproved ? "Approved" : "Not Approved"}
            onChange={(e) => setIsApproved(e.target.value === "Approved")}
            className="mt-1 p-3 rounded-md bg-white text-gray-800 hover:bg-gray-200 transition duration-200"
          >
            <option value="Not Approved">Not Approved</option>
            <option value="Approved">Approved</option>
          </select>
        </label>
        <button
          onClick={() => navigate(-1)}
          className="col-span-1 md:col-span-2 mt-6 p-3 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EmployeeDetails;
