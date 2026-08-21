import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";

export default function ManufacturerLayout() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      {/* Shared Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area populated by nested routes */}
      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        <Outlet />
      </main>

      {/* Persistent Floating AI Artisan Assistant */}
      <RAG />
    </div>
  );
}
