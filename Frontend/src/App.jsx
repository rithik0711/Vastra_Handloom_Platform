import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";

import Owner from "./Owner/Owner";
import Customer from "./Customer/Customer";

import Manufacturer from "./Manufacturer/Manufacturer";
import Products from "./Manufacturer/Products";
import Orders from "./Manufacturer/Orders";
import Profile from "./Manufacturer/Profile";

function App() {
  const userEmail = localStorage.getItem("userEmail");

  const getUserRole = () => {
    if (userEmail === "rithikeswaran.it23@bitsathy.ac.in") {
      return "manufacturer";
    }

    if (userEmail === "nadish.it23@bitsathy.ac.in") {
      return "owner";
    }

    if (userEmail) {
      return "customer";
    }

    return null;
  };

  const userRole = getUserRole();

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/"
        element={
          userEmail && userRole ? (
            <Navigate to={`/${userRole}`} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Owner */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="owner">
            <Owner />
          </ProtectedRoute>
        }
      />

      {/* Manufacturer Dashboard */}
      <Route
        path="/manufacturer"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Manufacturer />
          </ProtectedRoute>
        }
      />

      {/* Manufacturer Products */}
      <Route
        path="/manufacturer/products"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Manufacturer Orders */}
      <Route
        path="/manufacturer/orders"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Manufacturer Profile */}
      <Route
        path="/manufacturer/profile"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Customer */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <Customer />
          </ProtectedRoute>
        }
      />

      {/* Invalid Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;