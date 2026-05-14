import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  const hasAccess = Array.isArray(allowedRole)
    ? allowedRole.includes(user.role)
    : user.role === allowedRole;

  if (allowedRole &&  !hasAccess) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
