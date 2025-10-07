import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 
import { FaPhone, FaEnvelope, FaTachometerAlt, FaUsers, FaClipboardList, FaMapMarkerAlt, FaUser } from "react-icons/fa"; 
import { BASE_URL } from './constants'; // Make sure to import your BASE_URL if needed

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar
  const [newEmployeeCount, setNewEmployeeCount] = useState(0); // State for new employee count

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar open/close
  };

  // // Simulate fetching new employee count (replace this with your actual fetching logic)
  // useEffect(() => {
  //   const fetchNewEmployeeCount = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/employees/new-count`); // Update with your actual endpoint
  //       const data = await response.json();
  //       setNewEmployeeCount(data.count); // Assuming the API returns an object with the count
  //     } catch (error) {
  //       console.error("Error fetching new employee count:", error);
  //     }
  //   };

  //   fetchNewEmployeeCount(); // Call the function to fetch new employee count
  // }, []); // This effect runs once on component mount; adjust the dependencies as needed

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-md md:hidden"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 z-40`}>
        <nav className="space-y-4 mt-16">
          <Link to="/" className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaTachometerAlt className="text-yellow-400" />
            <span>Dashboard</span>
          </Link>

          <Link to="/employees" className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaUsers className="text-purple-400" />
            <span>Employee List</span>
          </Link>

          <Link to="/call-details" className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaPhone className="text-blue-400" />
            <span>Call Log</span>
          </Link>

          <Link to="/messages" className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaEnvelope className="text-green-400" />
            <span>Messages</span>
          </Link>

          <Link to="/location" className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaMapMarkerAlt className="text-red-400" />
            <span>Location</span>
          </Link>

          <Link to="/attendance-details" className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaClipboardList className="text-orange-400" />
            <span>Attendance</span>
          </Link>

          {/* User Requests Link */}
          <Link to="/user-request" className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaUser className="text-teal-400" />
            <span>User Requests</span>
            {newEmployeeCount > 0 && <span className="ml-2 text-red-500">{newEmployeeCount}</span>} {/* Display new employee count */}
          </Link>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
