import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("userRole");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    const fallbackPath = role === "Owner" ? "/owner" : role === "Agent" ? "/agent" : "/customer";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
