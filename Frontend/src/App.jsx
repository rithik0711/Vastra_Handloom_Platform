import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Owner from "./Owner/Owner";
// Dashboard views
import Customer from "./Customer/Customer";
import Agent from "./Agent/Agent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="Owner">
            <Owner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="Customer">
            <Customer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRole="Agent">
            <Agent />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;