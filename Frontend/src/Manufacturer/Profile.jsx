import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import RAG from "./RAG";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const userEmail = localStorage.getItem("userEmail") || "rithikeswaran.it23@bitsathy.ac.in";

  const [profile, setProfile] = useState({
    businessName: "Kathar Weaves",
    ownerName: "Rithikeswaran M",
    email: userEmail,
    phone: "+91 98765 43210",
    location: "Coimbatore, Tamil Nadu",
    address: "124, Handloom Weaver Colony, Coimbatore, Tamil Nadu 641048",
    specialization: "Handloom Silk & Cotton Sarees",
    experience: "15+ Years",
    loomsActive: 18,
    artisanCount: 32,
    gstin: "33AABCK1234F1Z9",
    description:
      "Kathar Weaves is a traditional handloom manufacturer focused on creating authentic, high-quality sarees while preserving India's rich weaving heritage.",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/manufacturer/profile?email=${encodeURIComponent(userEmail)}`);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile((prev) => ({ ...prev, ...json.data, email: userEmail }));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://localhost:5000/api/manufacturer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, email: userEmail })
      });
      const json = await res.json();
      if (json.status === "success") {
        setIsEditing(false);
        setNotification("Profile details saved successfully!");
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(json.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">

        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Manufacturer
              </p>
            </div>

            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Profile
            </h1>

            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Manage your Kathar Weaves business profile.
            </p>
          </div>

          {/* Edit / Save Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95 md:self-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M12 20h9" strokeLinecap="round" />
                <path
                  d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2 self-start md:self-center">

              <button
                onClick={handleCancel}
                className="h-10 rounded-xl border border-[#D9CBBF] bg-white px-4 text-xs font-bold text-[#56493F] transition hover:bg-[#FAF7F2] active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Save Changes</span>
              </button>

            </div>
          )}

        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-emerald-600 shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m9 11 3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-bold">{notification}</span>
          </div>
        )}

        {/* Profile Hero */}
        <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">

          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FAF5EE] pointer-events-none" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#F6EDF1]/60 pointer-events-none" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">

            {/* Business Logo */}
            <div className="relative shrink-0">

              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[#E5D9CC] bg-[#FAF7F2] p-2 shadow-xs sm:h-28 sm:w-28">

                <img
                  src="/images/kathar.png"
                  alt="Kathar Weaves"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/logo.png";
                  }}
                />

              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

            </div>

            {/* Business Details */}
            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2.5">

                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#4A1525] sm:text-3xl">
                  {profile.businessName}
                </h2>

                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Verified Manufacturer
                </span>

              </div>

              <p className="mt-1 text-xs font-semibold text-[#705D4E] sm:text-sm">
                {profile.specialization}
              </p>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#6D5F54] sm:text-sm">
                {profile.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="rounded-md bg-[#FAF5EE] border border-[#EBE1D6] px-2.5 py-1 text-[11px] font-semibold text-[#7C6E61]">
                  Handloom
                </span>

                <span className="rounded-md bg-[#FAF5EE] border border-[#EBE1D6] px-2.5 py-1 text-[11px] font-semibold text-[#7C6E61]">
                  Silk Sarees
                </span>

                <span className="rounded-md bg-[#FAF5EE] border border-[#EBE1D6] px-2.5 py-1 text-[11px] font-semibold text-[#7C6E61]">
                  Cotton Sarees
                </span>

                <span className="rounded-md bg-[#FAF5EE] border border-[#EBE1D6] px-2.5 py-1 text-[11px] font-semibold text-[#7C6E61]">
                  Custom Orders
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
              Products
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
              24
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-emerald-700">
              Active products
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
              Orders
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
              128
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-emerald-700">
              Completed orders
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
              Experience
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
              15+
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#7C6E61]">
              Years in weaving
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
              Rating
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#A16B16]">
              4.8
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#A16B16]">
              Customer rating
            </p>
          </div>

        </div>

        {/* Main Profile Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">

          {/* Personal / Business Information */}
          <section className="rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs">

            <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">

              <div>
                <h2 className="font-serif text-xl font-bold text-[#403A35]">
                  Business Information
                </h2>

                <p className="mt-0.5 text-xs text-[#8F8175]">
                  Your manufacturer details
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    d="M4 20V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v15"
                    strokeLinecap="round"
                  />
                  <path d="M3 20h18" strokeLinecap="round" />
                  <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" />
                </svg>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Business Name */}
              <ProfileField
                label="Business Name"
                name="businessName"
                value={profile.businessName}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Owner Name */}
              <ProfileField
                label="Owner Name"
                name="ownerName"
                value={profile.ownerName}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Email */}
              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Phone */}
              <ProfileField
                label="Phone Number"
                name="phone"
                value={profile.phone}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Location */}
              <ProfileField
                label="Location"
                name="location"
                value={profile.location}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Experience */}
              <ProfileField
                label="Experience"
                name="experience"
                value={profile.experience}
                editing={isEditing}
                onChange={handleChange}
              />

              {/* Specialization */}
              <div className="sm:col-span-2">
                <ProfileField
                  label="Specialization"
                  name="specialization"
                  value={profile.specialization}
                  editing={isEditing}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <ProfileField
                  label="Business Address"
                  name="address"
                  value={profile.address}
                  editing={isEditing}
                  onChange={handleChange}
                />
              </div>

            </div>

          </section>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Profile Completion */}
            <section className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-xs">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-serif text-lg font-bold text-[#403A35]">
                    Profile Strength
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8F8175]">
                    Complete your profile
                  </p>
                </div>

                <span className="font-serif text-2xl font-bold text-[#4A1525]">
                  85%
                </span>

              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EFE6DB]">
                <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#D09229] to-[#4A1525]" />
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#8F8175]">
                Add your business documents and certifications to reach 100%.
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 text-xs font-bold text-[#4A1525] underline underline-offset-2 hover:text-[#7A263B]"
              >
                Complete Profile
              </button>

            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-xs">

              <h2 className="font-serif text-lg font-bold text-[#403A35] border-b border-[#F0E8DF] pb-3">
                Contact Information
              </h2>

              <div className="mt-4 space-y-3">

                <ContactRow
                  icon="phone"
                  label="Phone"
                  value={profile.phone}
                />

                <ContactRow
                  icon="mail"
                  label="Email"
                  value={profile.email}
                />

                <ContactRow
                  icon="location"
                  label="Location"
                  value={profile.location}
                />

              </div>

            </section>

            {/* Account Status */}
            <section className="rounded-2xl border border-[#D5EADB] bg-[#F4FAF5] p-4 shadow-2xs">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Account Verified
                  </p>

                  <p className="mt-0.5 text-[11px] text-emerald-700">
                    Your manufacturer account is active.
                  </p>
                </div>

              </div>

            </section>

          </div>

        </div>

      </main>
      <RAG />
    </div>
  );
}

/* Profile Field */

function ProfileField({
  label,
  name,
  value,
  editing,
  onChange,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
        {label}
      </label>

      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="h-10 w-full rounded-xl border border-[#E2D6C8] bg-[#FAF7F2] px-3 text-xs font-medium text-[#292421] outline-none transition focus:border-[#4A1525] focus:bg-white"
        />
      ) : (
        <div className="flex min-h-[40px] items-center rounded-xl border border-[#EAE0D4] bg-[#FAF6F0] px-3.5">
          <p className="break-all text-xs font-semibold text-[#292421]">
            {value}
          </p>
        </div>
      )}

    </div>
  );
}

/* Contact Row */

function ContactRow({ icon, label, value }) {
  const icons = {
    phone: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path
          d="M6.5 3.5h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3c0 1-1 2-2 2C10 19.5 4.5 14 4.5 5.5c0-1 1-2 2-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    mail: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path
          d="m4 7 8 6 8-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    location: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path
          d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#A76913]">
        {icons[icon]}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-semibold text-[#292421]">
          {value}
        </p>

      </div>

    </div>
  );
}