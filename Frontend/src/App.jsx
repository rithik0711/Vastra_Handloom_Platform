import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";


// Manufacturer Views
import Manufacturer from "./Manufacturer/Manufacturer";
import Products from "./Manufacturer/Products";
import Orders from "./Manufacturer/Orders";
import Profile from "./Manufacturer/Profile";
import Gallery from "./Manufacturer/Gallery";
import Customers from "./Manufacturer/Customers";
import Revenue from "./Manufacturer/Revenue";
import Design from "./Manufacturer/Design";
import CreateDesign from "./Manufacturer/CreateDesign";

function App() {
  const userRole = localStorage.getItem("userRole");

  return (
    <Routes>
      {/* Auth Entry Route */}
      <Route
        path="/"
        element={userRole ? <Navigate to={`/${userRole}`} replace /> : <Login />}
      />

      {/* Manufacturer Portal Routes */}
      <Route
        path="/manufacturer"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Manufacturer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/dashboard"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Manufacturer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/products"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/orders"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/gallery"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Gallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/design"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Design />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/create-design"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <CreateDesign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/revenue"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Revenue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/profile"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/customers"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Customers />
          </ProtectedRoute>
        }
      />

      {/* Customer Portal Routes */}
      {/* <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerOrder />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/customer/booking"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerBooking />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/customer/manufacturers"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerManufacturers />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      /> */}

      {/* Owner Administration Portal Routes */}
      {/* <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="owner">
            <Owner />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/owner/factories"
        element={
          <ProtectedRoute allowedRole="owner">
            <Factory />
          </ProtectedRoute>
        }
      /> */}

      {/* Catch-All Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; 