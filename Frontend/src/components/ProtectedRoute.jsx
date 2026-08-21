import React from "react";
import { Navigate } from "react-router-dom";

export const getUserRole = (userEmail) => {
  if (!userEmail) return null;
  const email = userEmail.trim().toLowerCase();

  if (email === "rithikeswaran.it23@bitsathy.ac.in") {
    return "manufacturer";
  }

  if (
    email === "rithikeswaran2005@gmail.com" ||
    email === "nadish.it23@bitsathy.ac.in"
  ) {
    return "owner";
  }

  return "customer";
};

function ProtectedRoute({ children, allowedRole }) {
  const userEmail = (localStorage.getItem("userEmail") || "").trim().toLowerCase();
  const storedRole = (localStorage.getItem("userRole") || "").trim().toLowerCase();

  const userRole = storedRole || (userEmail ? getUserRole(userEmail) : null);

  if (!userEmail || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== allowedRole.toLowerCase()) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
}

export default ProtectedRoute;