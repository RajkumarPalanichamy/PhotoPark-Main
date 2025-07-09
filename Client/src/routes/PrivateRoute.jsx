import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
