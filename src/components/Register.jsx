import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BASE_URL } from './constants'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState(""); // Username for login/register
  const [password, setPassword] = useState(""); // Password for login/register
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  // Handle Login function
  const handleLogin = async () => {
    console.log(username, password);
    try {
      let result = await fetch(`${BASE_URL}/login`, {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result) {
        result = await result.json();
        console.log(result);
        localStorage.setItem("user", JSON.stringify(result));
        Navigate("/");
      } else {
        alert("Please enter correct Details");
      }
      // Navigate to dashboard or home page
    } catch (error) {
      setError("Invalid Username or Password");
    }
  };

  // Handle Register function
  const handleRegister = async () => {
    console.log(username, password);
    try {
      let result = await fetch(`${BASE_URL}/register`, {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();

      if (result.error) {
        setError(result.error); // Display error if the user already exists
      } else {
        console.log(result);
        localStorage.setItem("adminuser", JSON.stringify(result));
        // Registration success, navigate or display success message
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] p-8 bg-gradient-to-br from-black to-red-500 rounded-lg shadow-lg border border-red-700">
        {/* Conditionally render Login or Register form */}
        {isLogin ? (
          <>
            {/* Login Form */}
            <h2 className="text-2xl font-semibold text-center mb-4 text-white ">Login</h2>
            <input
              type="text"

              placeholder="Enter Username"
              className="w-full p-2 mb-4 rounded border border-red-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-2 mb-4 border  border-red-600 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              className="w-full hover:bg-red-400 bg-red-500 text-white py-2 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="text-center mt-4 text-white">
              Don't have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Register Form */}
            <h2 className="text-2xl font-semibold text-center mb-4">
              Register
            </h2>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full p-2 mb-4 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              className="w-full hover:bg-red-400 bg-red-500 text-white py-2 rounded"
              onClick={handleRegister}
            >
              Register
            </button>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
