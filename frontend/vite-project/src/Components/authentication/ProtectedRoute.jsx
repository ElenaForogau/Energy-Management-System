import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const role = sessionStorage.getItem("role");

  if (role === "ROLE_ADMIN") {
    return children;
  } else {
    return <Navigate to="/user-dashboard" />;
  }
};

export default ProtectedRoute;
