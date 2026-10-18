import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Owner Views
import Owner from "./Owner/Owner";

// Customer Views
import CustomerDashboard from "./Customer/Dashboard";
import CustomerOrder from "./Customer/Order";
import CustomerBooking from "./Customer/Booking";
import CustomerManufacturers from "./Customer/Manufacturers";
import ProductDetails from "./Customer/ProductDetails";
import Wishlist from "./Customer/Wishlist";
import ArtisanDetails from "./Customer/ArtisanDetails";
import Payment from "./Customer/Payment";
import CustomerProfile from "./Customer/Profile";
import CustomerDesign from "./Customer/Design";
import CustomerCreateDesign from "./Customer/CreateDesign";
import PublicProductView from "./Customer/PublicProductView";

// Manufacturer Views
import Manufacturer from "./Manufacturer/Manufacturer";
import Products from "./Manufacturer/Products";
import Orders from "./Manufacturer/Orders";
import OrderDetails from "./Manufacturer/OrderDetails";
import Profile from "./Manufacturer/Profile";
import Gallery from "./Manufacturer/Gallery";
import Customers from "./Manufacturer/Customers";
import Revenue from "./Manufacturer/Revenue";

function App() {
  const userRole = localStorage.getItem("userRole");

  return (
    <Routes>
      {/* Auth Entry Route */}
      <Route
        path="/"
        element={userRole ? <Navigate to={`/${userRole}`} replace /> : <Login />}
      />

      {/* Public Mobile Authenticity & QR Scanning Routes (No Login Required) */}
      <Route path="/product/:id" element={<PublicProductView />} />
      <Route path="/verify/:id" element={<PublicProductView />} />
      <Route path="/verify-product/:id" element={<PublicProductView />} />

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
        path="/manufacturer/:id"
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
        path="/manufacturer/dashboard/:id"
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
        path="/manufacturer/orders/:id"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <OrderDetails />
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
        path="/manufacturer/revenue"
        element={
          <ProtectedRoute allowedRole="manufacturer">
            <Revenue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manufacturer/revenue/:id"
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
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/products/:id"
        element={
          <ProtectedRoute allowedRole="customer">
            <ProductDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/artisan/:id"
        element={
          <ProtectedRoute allowedRole="customer">
            <ArtisanDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/payment"
        element={
          <ProtectedRoute allowedRole="customer">
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/wishlist"
        element={
          <ProtectedRoute allowedRole="customer">
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/design"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDesign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/create-design"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerCreateDesign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/booking"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/manufacturers"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerManufacturers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/manufacturers/:id"
        element={
          <ProtectedRoute allowedRole="customer">
            <ArtisanDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      {/* Owner Administration Portal Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="owner">
            <Owner />
          </ProtectedRoute>
        }
      />

      {/* Catch-All Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;