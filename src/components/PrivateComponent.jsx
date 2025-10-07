import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
  const auth = localStorage.getItem("user"); // Check if user is logged in
  return auth ? <Outlet /> : <Navigate to="/register" />; // Redirect to Register if not logged in
};

export default PrivateComponent;
