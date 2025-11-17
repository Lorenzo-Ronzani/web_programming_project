import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/*
  ProtectedRoute Component
  ----------------------------
  - Prevents access to routes if not logged in
  - Supports multiple allowed roles
  - Shows loading state while AuthContext initializes
*/

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Wait until AuthContext finishes loading
  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
