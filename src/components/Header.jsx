import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from './constants';

const Header = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    const confirmLogout = window.confirm("Do you really want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/register");
    }
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 bg-gradient-to-br from-black to-red-500 shadow-md p-4 flex items-center justify-between z-50">
      {/* Branding/Logo - Attica Tracker */}
      <Link
        to="/"
        className="text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-purple-600 hover:scale-105 transition-transform duration-500 xs:pl-20"
      >
        ATTICA EYE
      </Link>

      {auth ? (
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-200 text-2xl cursor-pointer hover:text-gray-900" />
          
          {/* Profile Section */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <FaUserCircle
              className="text-gray-200 text-3xl cursor-pointer hover:text-gray-900"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Profile options"
            />
            <span className="text-lg md:text-2xl text-white ml-2 hidden md:block">
              {JSON.parse(auth).username}
            </span>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className="text-white text-lg md:text-xl hover:text-gray-300 transition"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;
