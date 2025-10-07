import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";

const MessagesData = () => {
  const { employeeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch messages from backend API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/employees/${employeeId}/messages`
        );
        setMessages(response.data);
        setFilteredMessages(response.data);
      } catch (error) {
        setErrorMessage("Error fetching messages. Please try again later.");
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [employeeId]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle delete a single message with confirmation
  const handleDelete = async (messageId) => {
    if (window.confirm("Do you really want to delete this message?")) {
      try {
        await axios.delete(
          `${BASE_URL}/Delete-message/${employeeId}/${messageId}`
        );
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setFilteredMessages((prevFiltered) =>
          prevFiltered.filter((msg) => msg._id !== messageId)
        );
      } catch (error) {
        setErrorMessage("Error deleting message. Please try again.");
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
        setMessages([]);
        setFilteredMessages([]);
        alert("All messages deleted successfully.");
      } catch (error) {
        setErrorMessage("Error deleting all messages. Please try again.");
        console.error("Error deleting all messages:", error);
      }
    }
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
    <div className="p-4 ">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded mb-4 border border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-500 p-2 rounded-lg w-1/3 shadow-sm"
      />
      <button
        onClick={handleDeleteAllMessages}
        className="ml-4 bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-6 py-2 rounded-lg"
      >
        Delete All Messages
      </button>
      <h2 className="text-xl font-bold mb-4">
        Messages for Employee ID: {employeeId}
      </h2>
      {filteredMessages.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
            <tr className="text-white text-xl">
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Sl No</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Address</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Message Body</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Service Center</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Received Date</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Received Time</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg, index) => (
              <tr key={msg._id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border border-gray-300 px-6 py-4">{index + 1}</td>
                <td className="border border-gray-300 px-6 py-4">{msg.address}</td>
                <td className="border border-gray-300 px-6 py-4">{msg.body}</td>
                <td className="border border-gray-300 px-6 py-4">{msg.service_center}</td>
                <td className="border border-gray-300 px-6 py-4">{new Date(msg.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-6 py-4">{new Date(msg.date).toLocaleTimeString()}</td>
                <td className="border border-gray-300 px-6 py-4">
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="bg-gradient-to-r from-red-500 to-purple-700 hover:shadow-lg text-white px-4 py-2 rounded-lg"
                    aria-label={`Delete message with ID ${msg._id}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
};

export default MessagesData;
