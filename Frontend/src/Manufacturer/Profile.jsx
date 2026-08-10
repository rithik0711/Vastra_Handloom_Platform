import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    businessName: "Kathar Weaves",
    ownerName: "Rithikeswaran M",
    email: "rithikeswaran.it23@bitsathy.ac.in",
    phone: "+91 98765 43210",
    location: "Coimbatore, Tamil Nadu",
    address: "Coimbatore, Tamil Nadu, India",
    specialization: "Handloom Silk & Cotton Sarees",
    experience: "15+ Years",
    description:
      "Kathar Weaves is a traditional handloom manufacturer focused on creating authentic, high-quality sarees while preserving India's rich weaving heritage.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem("manufacturerProfile", JSON.stringify(profile));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[78px] min-h-screen px-[20px] py-[24px] transition-all duration-300 lg:ml-[250px] lg:px-[38px] lg:py-[30px]">

        {/* Page Header */}
        <div className="flex flex-col gap-[16px] md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#a08b76]">
              Manufacturer
            </p>

            <h1 className="mt-[4px] text-[28px] font-semibold tracking-[-0.7px] text-[#4A1525]">
              Profile
            </h1>

            <p className="mt-[5px] text-[13px] text-[#746b62]">
              Manage your Kathar Weaves business profile.
            </p>
          </div>

          {/* Edit / Save Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-[42px] items-center justify-center gap-[8px] rounded-[10px] bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-[18px] text-[12px] font-semibold text-white shadow-[0_5px_15px_rgba(74,21,37,0.16)] transition hover:opacity-95 active:scale-[0.98]"
            >
              {/* Edit Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[16px] w-[16px]"
              >
                <path
                  d="M12 20h9"
                  strokeLinecap="round"
                />
                <path
                  d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
                  strokeLinejoin="round"
                />
              </svg>

              Edit Profile
            </button>
          ) : (
            <div className="flex gap-[8px]">

              <button
                onClick={handleCancel}
                className="h-[42px] rounded-[10px] border border-[#d8cec3] bg-white px-[16px] text-[12px] font-semibold text-[#6e6258] transition hover:bg-[#faf7f2]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex h-[42px] items-center gap-[7px] rounded-[10px] bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-[18px] text-[12px] font-semibold text-white shadow-[0_5px_15px_rgba(74,21,37,0.16)] transition hover:opacity-95"
              >
                {/* Check Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-[15px] w-[15px]"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                Save Changes
              </button>

            </div>
          )}

        </div>

        {/* Profile Hero */}
        <section className="relative mt-[24px] overflow-hidden rounded-[18px] border border-[#e4d9ce] bg-white shadow-[0_7px_25px_rgba(60,35,20,0.06)]">

          {/* Decorative Background */}
          <div className="absolute right-[-80px] top-[-100px] h-[260px] w-[260px] rounded-full bg-[#f7eee5] opacity-70" />
          <div className="absolute bottom-[-120px] left-[-80px] h-[240px] w-[240px] rounded-full bg-[#f8edf0] opacity-60" />

          <div className="relative flex flex-col gap-[20px] p-[20px] sm:p-[25px] md:flex-row md:items-center md:p-[30px]">

            {/* Business Logo */}
            <div className="relative shrink-0">

              <div className="flex h-[105px] w-[105px] items-center justify-center overflow-hidden rounded-[20px] border border-[#e4d8cd] bg-[#fcfaf7] shadow-sm sm:h-[120px] sm:w-[120px]">

                <img
                  src="/images/logo.png"
                  alt="Kathar Weaves"
                  className="h-[90%] w-[90%] object-contain"
                />

              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-[-7px] right-[-7px] flex h-[28px] w-[28px] items-center justify-center rounded-full border-[3px] border-white bg-[#3d8154] text-white">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="h-[13px] w-[13px]"
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

              <div className="flex flex-wrap items-center gap-[8px]">

                <h2 className="text-[24px] font-semibold tracking-[-0.5px] text-[#4A1525]">
                  {profile.businessName}
                </h2>

                <span className="rounded-full bg-[#edf7ef] px-[9px] py-[4px] text-[9px] font-semibold text-[#3d8154]">
                  Verified Manufacturer
                </span>

              </div>

              <p className="mt-[5px] text-[13px] font-medium text-[#756b62]">
                {profile.specialization}
              </p>

              <p className="mt-[9px] max-w-[650px] text-[12px] leading-[1.7] text-[#8b8178]">
                {profile.description}
              </p>

              <div className="mt-[13px] flex flex-wrap gap-[7px]">

                <span className="rounded-full bg-[#f7eee7] px-[10px] py-[5px] text-[10px] font-medium text-[#745845]">
                  Handloom
                </span>

                <span className="rounded-full bg-[#f7eee7] px-[10px] py-[5px] text-[10px] font-medium text-[#745845]">
                  Silk Sarees
                </span>

                <span className="rounded-full bg-[#f7eee7] px-[10px] py-[5px] text-[10px] font-medium text-[#745845]">
                  Cotton Sarees
                </span>

                <span className="rounded-full bg-[#f7eee7] px-[10px] py-[5px] font-medium text-[#745845]">
                  Custom Orders
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* Statistics */}
        <div className="mt-[18px] grid grid-cols-2 gap-[12px] lg:grid-cols-4">

          <div className="rounded-[14px] border border-[#e7ddd3] bg-white p-[15px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

            <p className="text-[10px] text-[#938980]">
              Products
            </p>

            <p className="mt-[4px] text-[23px] font-semibold text-[#403a35]">
              24
            </p>

            <p className="mt-[2px] text-[9px] text-[#3d8154]">
              Active products
            </p>

          </div>

          <div className="rounded-[14px] border border-[#e7ddd3] bg-white p-[15px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

            <p className="text-[10px] text-[#938980]">
              Orders
            </p>

            <p className="mt-[4px] text-[23px] font-semibold text-[#403a35]">
              128
            </p>

            <p className="mt-[2px] text-[9px] text-[#3d8154]">
              Completed orders
            </p>

          </div>

          <div className="rounded-[14px] border border-[#e7ddd3] bg-white p-[15px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

            <p className="text-[10px] text-[#938980]">
              Experience
            </p>

            <p className="mt-[4px] text-[23px] font-semibold text-[#403a35]">
              15+
            </p>

            <p className="mt-[2px] text-[9px] text-[#91877e]">
              Years in weaving
            </p>

          </div>

          <div className="rounded-[14px] border border-[#e7ddd3] bg-white p-[15px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

            <p className="text-[10px] text-[#938980]">
              Rating
            </p>

            <p className="mt-[4px] text-[23px] font-semibold text-[#a16b16]">
              4.8
            </p>

            <p className="mt-[2px] text-[9px] text-[#a16b16]">
              Customer rating
            </p>

          </div>

        </div>

        {/* Main Profile Grid */}
        <div className="mt-[18px] grid grid-cols-1 gap-[18px] xl:grid-cols-[1.35fr_0.65fr]">

          {/* Personal / Business Information */}
          <section className="rounded-[16px] border border-[#e7ddd3] bg-white p-[20px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-[16px] font-semibold text-[#403a35]">
                  Business Information
                </h2>

                <p className="mt-[3px] text-[10px] text-[#958c83]">
                  Your manufacturer details
                </p>
              </div>

              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-[#f7eee7] text-[#6b273b]">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-[17px] w-[17px]"
                >
                  <path
                    d="M4 20V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v15"
                    strokeLinecap="round"
                  />

                  <path
                    d="M3 20h18"
                    strokeLinecap="round"
                  />

                  <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" />
                </svg>

              </div>

            </div>

            <div className="mt-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-2">

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
          <div className="space-y-[18px]">

            {/* Profile Completion */}
            <section className="rounded-[16px] border border-[#e7ddd3] bg-white p-[20px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-[15px] font-semibold text-[#403a35]">
                    Profile Strength
                  </h2>

                  <p className="mt-[3px] text-[10px] text-[#958c83]">
                    Complete your profile
                  </p>
                </div>

                <span className="text-[18px] font-semibold text-[#4A1525]">
                  85%
                </span>

              </div>

              <div className="mt-[14px] h-[7px] overflow-hidden rounded-full bg-[#eee7df]">

                <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#4A1525] to-[#D09229]" />

              </div>

              <p className="mt-[9px] text-[10px] leading-[1.5] text-[#958c83]">
                Add your business documents and certifications to reach 100%.
              </p>

              <button className="mt-[13px] text-[10px] font-semibold text-[#6b273b] underline underline-offset-2">
                Complete Profile
              </button>

            </section>

            {/* Contact */}
            <section className="rounded-[16px] border border-[#e7ddd3] bg-white p-[20px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">

              <h2 className="text-[15px] font-semibold text-[#403a35]">
                Contact Information
              </h2>

              <div className="mt-[15px] space-y-[13px]">

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
            <section className="rounded-[16px] border border-[#dfe9df] bg-[#f8fcf8] p-[18px]">

              <div className="flex items-center gap-[10px]">

                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#e5f3e7] text-[#3d8154]">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-[17px] w-[17px]"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </div>

                <div>
                  <p className="text-[12px] font-semibold text-[#3d6548]">
                    Account Verified
                  </p>

                  <p className="mt-[2px] text-[9px] text-[#73907a]">
                    Your manufacturer account is active.
                  </p>
                </div>

              </div>

            </section>

          </div>

        </div>

      </main>
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

      <label className="mb-[6px] block text-[10px] font-semibold uppercase tracking-[0.5px] text-[#958c83]">
        {label}
      </label>

      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="box-border h-[40px] w-full rounded-[9px] border border-[#d6ccc1] bg-[#fffdfa] px-[11px] text-[12px] text-[#403a35] outline-none transition focus:border-[#8b5b24] focus:ring-2 focus:ring-[#c08a35]/10"
        />
      ) : (
        <div className="flex min-h-[40px] items-center rounded-[9px] border border-[#eee7df] bg-[#fcfaf7] px-[11px]">

          <p className="break-all text-[12px] text-[#4e4740]">
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
        strokeWidth="1.7"
        className="h-[16px] w-[16px]"
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
        strokeWidth="1.7"
        className="h-[16px] w-[16px]"
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
        strokeWidth="1.7"
        className="h-[16px] w-[16px]"
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
    <div className="flex items-center gap-[10px]">

      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#f7eee7] text-[#6b273b]">
        {icons[icon]}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] uppercase tracking-[0.4px] text-[#a0978f]">
          {label}
        </p>

        <p className="mt-[2px] truncate text-[11px] font-medium text-[#514941]">
          {value}
        </p>

      </div>

    </div>
  );
}