import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/landing"></Navigate>;
  }
  return children;
};

export default ProtectedRoute;
