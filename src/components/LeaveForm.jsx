import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from './constants';

const LeaveForm = () => {
  const { employeeId, name, mobileNumber, branch, designation } = useParams();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employee, setEmployee] = useState({});
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

        const leaveRequestsResponse = await axios.get(
          `${BASE_URL}/employees/${employeeId}/attendance-list/leaves`
        );
        setLeaveRequests(leaveRequestsResponse.data);

        localStorage.setItem('leaveRequests', JSON.stringify(leaveRequestsResponse.data));
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleStatusChange = async (leaveId, status) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/employees/${employeeId}/attendance-list/leaves/${leaveId}/status`,
        { status }
      );
      const updatedLeave = response.data;

      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedLeave.leaveRequest._id
            ? { ...request, ApproveStatus: updatedLeave.leaveRequest.ApproveStatus }
            : request
        )
      );

      localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    } catch (err) {
      console.error(`Error changing status for leave request ${leaveId}:`, err);
      setError("Error changing status. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen absolute top-16 md:left-[255px] right-0 left-0">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-lg shadow-lg mb-6 hover:shadow-md transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-white">Employee Information</h2>
        <p className="text-lg text-white">ID: {employee.employeeId || employeeId}</p>
        <p className="text-lg text-white">Name: {employee.name || name}</p>
        <p className="text-lg text-white">Number: {employee.mobileNumber || mobileNumber}</p>
        <p className="text-lg text-white">Branch: {employee.branch || branch}</p>
        <p className="text-lg text-white">Designation: {employee.designation || designation}</p>
      </div>

      <h2 className="text-3xl font-bold text-black text-center mb-6">Leave Requests Inbox</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : leaveRequests.length > 0 ? (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-600 transition-transform duration-300 hover:scale-95 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold text-blue-700">
                <span className="text-red-600">Leave Type: {request.leaveType}</span>
                <br />
                <span>Reason: {request.reason}</span>
              </h3>
              <p className="text-gray-700">
                Start Date: {new Date(request.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                End Date: {new Date(request.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                Applied Date: {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <p className="text-blue-700">Status: {request.ApproveStatus}</p>

              <div className="border border-gray-300 px-4 py-2 gap-3 flex items-center justify-center">
                {request.ApproveStatus === 'Approved' ? (
                  <span className="text-green-500 font-bold">Approved</span>
                ) : request.ApproveStatus === 'Rejected' ? (
                  <span className="text-red-500 font-bold">Rejected</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleStatusChange(request._id, 'Approved')}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(request._id, 'Rejected')}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleStatusChange(request._id, 'Pending')}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black">No leave requests found.</p>
      )}
    </div>
  );
};

export default LeaveForm;
