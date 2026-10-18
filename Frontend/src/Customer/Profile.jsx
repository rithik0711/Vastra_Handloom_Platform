import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  Clock,
  Heart,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Edit3,
  RefreshCw,
  Ruler
} from "lucide-react";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName") || "";
  const storedAvatar = localStorage.getItem("userAvatar") || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [favCount, setFavCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]").length;
    } catch {
      return 0;
    }
  });

  const [profile, setProfile] = useState({
    fullName: storedName,
    email: userEmail,
    phone: "",
    city: "",
    deliveryAddress: "",
    pincode: "",
    bio: "",
    preferredFabrics: [],
    blouseSize: "38 (Standard M)",
    sareeLengthPreference: "6.3 Meters with Blouse Piece",
    avatar: storedAvatar,
    stats: {
      totalOrders: 0,
      activeLoomBookings: 0,
      savedDesigns: 0,
      patronTier: "Handloom Silk Patron"
    }
  });

  useEffect(() => {
    if (userEmail) {
      fetchProfile();
    }
  }, [userEmail]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/customer/profile?email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(storedName)}&avatar=${encodeURIComponent(storedAvatar)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProfile(json.data);
        if (json.data.fullName && !localStorage.getItem("userName")) {
          localStorage.setItem("userName", json.data.fullName);
        }
      }
    } catch (err) {
      console.warn("Profile fetch note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, email: userEmail })
      });
      const json = await res.json();
      if (json.status === "success") {
        setNotification({ type: "success", msg: "Profile details updated successfully in database!" });
        if (json.data) setProfile((prev) => ({ ...prev, ...json.data }));
        setTimeout(() => setNotification(null), 4000);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      setNotification({ type: "error", msg: "Could not save profile to database." });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Patron Account & Preferences
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Customer Profile
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Manage your delivery details, bespoke weave measurements, and view your handloom patron statistics.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            className="flex items-center gap-1.5 self-start rounded-xl border border-[#E0D3C1] bg-white px-3.5 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#D09229]" : "text-[#7A6D61]"} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{notification.msg}</span>
            </div>
          </div>
        )}

        {/* Profile Card & Stats Header */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-xs">
          <div className="relative h-32 bg-gradient-to-r from-[#4A1525] via-[#6A1F35] to-[#7A263B] p-6 text-white flex items-end">
            <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold text-[#FCDA8B] backdrop-blur-xs border border-[#FCDA8B]/30">
              <Award size={14} />
              <span>{profile.stats?.patronTier || "Gold Patron"}</span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="relative group">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#4A1525] font-serif text-3xl font-bold text-[#FCDA8B] shadow-md shrink-0">
                    {(profile.fullName || "AD")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}

                <label className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#D09229] text-white shadow-md cursor-pointer hover:bg-[#A16B16] transition">
                  <Edit3 size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfile((prev) => ({ ...prev, avatar: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mb-1">
                <h2 className="font-serif text-2xl font-bold text-[#4A1525]">{profile.fullName || "Handloom Patron"}</h2>
                <p className="text-xs text-[#7A6D61] flex items-center gap-1 mt-0.5 flex-wrap">
                  <Mail size={13} className="text-[#D09229]" />
                  <span>{profile.email}</span>
                  {profile.city && (
                    <>
                      <span className="mx-1">•</span>
                      <MapPin size={13} className="text-[#D09229]" />
                      <span>{profile.city}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 border-t border-[#F0E8DF] bg-[#FAF8F4] sm:grid-cols-4 divide-x divide-[#F0E8DF]">
            <div
              onClick={() => navigate("/customer/orders")}
              className="p-4 text-center hover:bg-[#FAF3E8] transition cursor-pointer"
            >
              <p className="font-serif text-xl font-bold text-[#4A1525]">{profile.stats?.totalOrders || 0}</p>
              <p className="text-[11px] font-semibold text-[#8F8175] mt-0.5 flex items-center justify-center gap-1">
                <ShoppingBag size={12} className="text-[#D09229]" />
                <span>Total Orders</span>
              </p>
            </div>
            <div
              onClick={() => navigate("/customer/booking")}
              className="p-4 text-center hover:bg-[#FAF3E8] transition cursor-pointer"
            >
              <p className="font-serif text-xl font-bold text-[#4A1525]">{profile.stats?.activeLoomBookings || 0}</p>
              <p className="text-[11px] font-semibold text-[#8F8175] mt-0.5 flex items-center justify-center gap-1">
                <Clock size={12} className="text-[#D09229]" />
                <span>Active Looms</span>
              </p>
            </div>
            <div
              onClick={() => navigate("/customer/design")}
              className="p-4 text-center hover:bg-[#FAF3E8] transition cursor-pointer"
            >
              <p className="font-serif text-xl font-bold text-[#4A1525]">{profile.stats?.savedDesigns || 0}</p>
              <p className="text-[11px] font-semibold text-[#8F8175] mt-0.5 flex items-center justify-center gap-1">
                <Palette size={12} className="text-[#D09229]" />
                <span>Custom Blueprints</span>
              </p>
            </div>
            <div
              onClick={() => navigate("/customer/wishlist")}
              className="p-4 text-center hover:bg-[#FAF3E8] transition cursor-pointer"
            >
              <p className="font-serif text-xl font-bold text-[#4A1525]">{favCount}</p>
              <p className="text-[11px] font-semibold text-[#8F8175] mt-0.5 flex items-center justify-center gap-1">
                <Heart size={12} className="text-[#D09229]" />
                <span>Liked Sarees</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Edit Form (8 cols) */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-6"
            >
              <div className="border-b border-[#F0E8DF] pb-4">
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">Personal & Delivery Details</h3>
                <p className="text-xs text-[#7A6D61] mt-0.5">
                  Ensure your delivery address and contact information are up to date for bespoke dispatch.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A1525]">Delivery Address (Primary)</label>
                <textarea
                  rows={2}
                  required
                  value={profile.deliveryAddress}
                  onChange={(e) => setProfile({ ...profile, deliveryAddress: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">City / Region</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Pincode</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Saree & Weave Preferences */}
              <div className="border-t border-[#F0E8DF] pt-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                  <Ruler size={16} className="text-[#D09229]" />
                  <span>Saree Drape & Measurement Preferences</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Blouse Size / Stitch Preference</label>
                    <select
                      value={profile.blouseSize}
                      onChange={(e) => setProfile({ ...profile, blouseSize: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    >
                      <option>34 (XS)</option>
                      <option>36 (S)</option>
                      <option>38 (Standard M)</option>
                      <option>40 (L)</option>
                      <option>42 (XL)</option>
                      <option>Unstitched 0.8m Blouse Piece Included</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Saree Length Requirement</label>
                    <select
                      value={profile.sareeLengthPreference}
                      onChange={(e) => setProfile({ ...profile, sareeLengthPreference: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    >
                      <option>5.5 Meters (Standard Traditional)</option>
                      <option>6.3 Meters with Blouse Piece</option>
                      <option>9 Yards (Madisar / Nauvari Heritage Drape)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Preferred Handloom Fabrics</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      "Pure Mulberry Silk",
                      "Kanchipuram Brocade",
                      "Organic Cotton",
                      "Kasavu Gold Weave",
                      "Banarasi Tanchoi",
                      "Tussar Silk",
                      "Linen Handloom"
                    ].map((fab) => {
                      const isSelected = (profile.preferredFabrics || []).includes(fab);
                      return (
                        <button
                          key={fab}
                          type="button"
                          onClick={() => {
                            const current = profile.preferredFabrics || [];
                            const updated = isSelected
                              ? current.filter((f) => f !== fab)
                              : [...current, fab];
                            setProfile({ ...profile, preferredFabrics: updated });
                          }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                              ? "border-[#4A1525] bg-[#4A1525] text-white shadow-2xs"
                              : "border-[#E5DCD0] bg-[#FAF6F0] text-[#56493F] hover:border-[#D09229]"
                          }`}
                        >
                          {isSelected ? `✓ ${fab}` : `+ ${fab}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Patron Bio & Heritage Notes</label>
                  <textarea
                    rows={2}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="border-t border-[#F0E8DF] pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 disabled:opacity-60"
                >
                  <Save size={15} />
                  <span>{saving ? "Saving Changes..." : "Save Profile Preferences"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Quick Portal Links (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#4A1525]">Handloom Portal Hub</h3>
              <p className="text-[11px] text-[#7A6D61] mt-0.5">Quick access to your handloom services</p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/customer/design")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#F0E8DF] bg-[#FAF8F4] p-3 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] hover:border-[#D09229] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette size={16} className="text-[#D09229]" />
                    <span>My Saree Designs</span>
                  </div>
                  <ChevronRight size={15} className="text-[#8F8175]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customer/create-design")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#F0E8DF] bg-[#FAF8F4] p-3 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] hover:border-[#D09229] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#D09229]" />
                    <span>Launch Saree Studio</span>
                  </div>
                  <ChevronRight size={15} className="text-[#8F8175]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customer/booking")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#F0E8DF] bg-[#FAF8F4] p-3 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] hover:border-[#D09229] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#D09229]" />
                    <span>Custom Loom Booking</span>
                  </div>
                  <ChevronRight size={15} className="text-[#8F8175]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customer/orders")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#F0E8DF] bg-[#FAF8F4] p-3 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] hover:border-[#D09229] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} className="text-[#D09229]" />
                    <span>Track Active Orders</span>
                  </div>
                  <ChevronRight size={15} className="text-[#8F8175]" />
                </button>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-gradient-to-br from-[#4A1525] to-[#7A263B] p-6 text-white shadow-xs">
              <div className="flex items-center gap-2 text-[#FCDA8B] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>GI & Silk Mark Guarantee</span>
              </div>
              <h4 className="mt-2 font-serif text-lg font-bold">100% Genuine Handloom</h4>
              <p className="mt-1 text-xs text-white/80 leading-relaxed">
                All custom saree orders placed via your patron profile include authentic physical Silk Mark seals and weaver verification certificates.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
