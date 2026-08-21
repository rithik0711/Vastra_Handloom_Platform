import React, { useState, useEffect } from "react";
import CustomerSidebar from "./Sidebar";
import {
  Sparkles,
  Calendar,
  Layers,
  Palette,
  Clock,
  CheckCircle2,
  Send,
  HelpCircle
} from "lucide-react";

export default function CustomerBooking() {
  const [formData, setFormData] = useState({
    manufacturer: "Kathar Weaves",
    loomType: "Traditional Pit Loom",
    fabricChoice: "Pure Mulberry Silk & Gold Zari",
    customPattern: "Peacock Motif with Contrast Border",
    targetCompletion: "Within 3-4 Weeks",
    notes: ""
  });

  const [bookings, setBookings] = useState([
    {
      id: "BK-501",
      manufacturer: "Kathar Weaves",
      loomType: "Traditional Pit Loom",
      fabricChoice: "Pure Mulberry Silk & Gold Zari",
      customPattern: "Peacock Motif with Contrast Pallu",
      bookingDate: "14 Aug 2026",
      targetCompletion: "10 Sep 2026",
      status: "Confirmed",
      advancePaid: "₹3,000"
    }
  ]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/bookings")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setBookings(json.data);
        }
      })
      .catch((err) => console.log("Using cached bookings:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/customer/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setBookings([json.data, ...bookings]);
        }
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch(() => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Customer Portal
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            Bespoke Loom Reservation
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Reserve dedicated artisan loom time for customized weaving, heritage wedding sarees, and bridal textiles.
          </p>
        </div>

        {submitted && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Loom Reservation Submitted!</p>
              <p className="text-[11px] text-emerald-700">The master weaver has received your specifications and will initiate the warp drafting.</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Reservation Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-5"
          >
            <h2 className="font-serif text-xl font-bold text-[#4A1525]">Loom Customization Details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-[#4A1525]">Artisan Workshop / Manufacturer</label>
                <select
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                >
                  <option>Kathar Weaves (Coimbatore)</option>
                  <option>Aura Handlooms (Salem)</option>
                  <option>Varanasi Silk Guild (Varanasi)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A1525]">Loom Type</label>
                <select
                  value={formData.loomType}
                  onChange={(e) => setFormData({ ...formData, loomType: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                >
                  <option>Traditional Pit Loom (Pure Silk)</option>
                  <option>Frame Loom (Organic Cotton)</option>
                  <option>Jacquard Attachment Loom (Intricate Zari)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Fabric & Yarn Composition</label>
              <input
                type="text"
                value={formData.fabricChoice}
                onChange={(e) => setFormData({ ...formData, fabricChoice: e.target.value })}
                placeholder="e.g., Pure Mulberry Silk with 24k Gold Zari Pallu"
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Bespoke Motif & Pattern Specifications</label>
              <input
                type="text"
                value={formData.customPattern}
                onChange={(e) => setFormData({ ...formData, customPattern: e.target.value })}
                placeholder="e.g., Mayil (Peacock) motifs, temple borders, contrast rich pallu"
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Special Instructions & Color Palette</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Describe preferred body color, border width, or family monogram weaving..."
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Book Dedicated Loom Slot</span>
            </button>
          </form>

          {/* Active Bookings */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#4A1525]">My Loom Reservations</h3>
              <div className="mt-4 space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#4A1525]">#{b.id}</span>
                      <span className="rounded-full bg-[#EAF6ED] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-[#292421]">{b.fabricChoice}</p>
                    <p className="mt-0.5 text-[11px] text-[#7A6D61]">{b.loomType} • {b.manufacturer}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#E8DFD5] pt-2 text-[10px] text-[#8F8175]">
                      <span>Target: {b.targetCompletion}</span>
                      <span className="font-bold text-[#4A1525]">Advance: {b.advancePaid}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
