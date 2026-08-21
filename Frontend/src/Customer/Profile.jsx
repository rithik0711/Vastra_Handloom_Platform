import React, { useState } from "react";
import CustomerSidebar from "./Sidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Save,
  CheckCircle2
} from "lucide-react";

export default function CustomerProfile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("customerProfile");
    return saved
      ? JSON.parse(saved)
      : {
          fullName: "Ananya Deshmukh",
          email: localStorage.getItem("userEmail") || "customer@example.com",
          phone: "+91 98451 23456",
          shippingAddress: "Flat 402, Lotus Residency, Indiranagar, Bengaluru, Karnataka - 560038",
          favoriteWeaves: "Kanchipuram Silk, Banarasi Zari, Handloom Linen",
          preferredOccasions: "Festivals, Weddings, Traditional Celebrations"
        };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("customerProfile", JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Customer Portal
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            Customer Profile & Preferences
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Manage your shipping details, handloom style preferences, and patron profile.
          </p>
        </div>

        {savedSuccess && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">Profile updated successfully!</span>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="mt-8 max-w-3xl rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#4A1525]">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Email Address</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#ECE5DB] p-3 text-xs text-[#7A6D61] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Primary Delivery Address</label>
            <textarea
              rows={3}
              value={profile.shippingAddress}
              onChange={(e) => setProfile({ ...profile, shippingAddress: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Favorite Weaves & Fabrics</label>
            <input
              type="text"
              value={profile.favoriteWeaves}
              onChange={(e) => setProfile({ ...profile, favoriteWeaves: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </form>
      </main>
    </div>
  );
}
