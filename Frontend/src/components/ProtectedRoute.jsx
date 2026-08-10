import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const userEmail = localStorage.getItem("userEmail");

  const getUserRole = () => {
    if (userEmail === "rithikeswaran.it23@bitsathy.ac.in") {
      return "manufacturer";
    }

    if (userEmail === "nadish.it23@bitsathy.ac.in") {
      return "owner";
    }
    else{
        return "customer";
    }
    return null;
  };

  const userRole = getUserRole();

  if (!userEmail || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
}

export default ProtectedRoute;