import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from './constants'

const MessageDetails = () => {
  const { employeeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [inputEmployeeId, setInputEmployeeId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch messages from backend API
  const fetchMessages = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/${id}/messages`
      );
      setMessages(response.data);
      setFilteredMessages(response.data);
      setErrorMessage(""); // Clear error message if successful
    } catch (error) {
      console.error("Error fetching messages:", error);
      setErrorMessage("Error fetching messages. Please try again.");
    }
  };

  // Handle delete a single message with confirmation
  const handleDelete = async (messageId) => {
    if (window.confirm("Do you really want to delete this message?")) {
      try {
        await axios.delete(
          `${BASE_URL}/Delete-message/${employeeId}/${messageId}`
        );
        // Update local state to reflect the deleted message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setFilteredMessages((prevFiltered) =>
          prevFiltered.filter((msg) => msg._id !== messageId)
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  // Handle delete all messages with confirmation
  const handleDeleteAllMessages = async () => {
    if (
      window.confirm(
        "Do you really want to delete all messages? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `${BASE_URL}/Delete-all-messages/${employeeId}`
        );
        // Clear the messages in the state
        setMessages([]); // Empty the messages state
        setFilteredMessages([]); // Clear filtered messages state
        alert("All messages deleted successfully.");
      } catch (error) {
        console.error("Error deleting all messages:", error);
        alert("Error deleting all messages. Please try again.");
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

  // Handle form submission to fetch messages for entered Employee ID
  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputEmployeeId.trim() === "") {
      setErrorMessage("Please enter a valid Employee ID.");
      return;
    }
    fetchMessages(inputEmployeeId);
    setInputEmployeeId(""); // Clear input after submission
  };

  // Filter messages based on search term
  useEffect(() => {
    const filtered = messages.filter((msg) => {
      const address = msg.address || "";
      const body = msg.body || "";
      const serviceCenter = msg.service_center || "";
      const date = msg.date || "";

      return (
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredMessages(filtered);
  }, [searchTerm, messages]);

  return (
    <div className="p-4 mx-auto my-8 max-w-7xl absolute md:top-20 md:left-[265px]">
      <span className="text-4xl font-bold">Messages {employeeId}</span>
      <form onSubmit={handleSubmit} className="mb-4 mt-6 flex flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={inputEmployeeId}
          onChange={handleEmployeeIdChange}
          className="border p-2 rounded mb-2 sm:mb-0 sm:mr-2 border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 flex-1"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg text-white px-6 py-2 rounded-lg flex-shrink-0"
        >
          Fetch Messages
        </button>
      </form>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Conditional rendering for search input */}
      {messages.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 w-full sm:w-1/3 mb-2"
          />
          <button
            onClick={handleDeleteAllMessages} // Handle Delete All logic
            className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg"
          >
            Delete All Messages
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">
        Messages for Employee ID: {employeeId}
      </h2>
      {filteredMessages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 border-collapse shadow-lg rounded-lg">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Sl No
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Address
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Message Body
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Service Center
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Received Date
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Received Time
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, index) => (
                <tr
                  key={msg._id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="border border-gray-300 px-6 py-4">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {msg.address}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">{msg.body}</td>
                  <td className="border border-gray-300 px-6 py-4">
                    {msg.service_center}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {new Date(msg.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {new Date(msg.date).toLocaleTimeString()}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    <button
                      onClick={() => handleDelete(msg._id)}
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
        <p>No messages available</p>
      )}
    </div>
  );
};

export default MessageDetails;
