import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import CustomOrderWizard from "./components/CustomOrderWizard";
import {
  Sparkles,
  Calendar,
  Layers,
  Palette,
  Clock,
  CheckCircle2,
  Send,
  HelpCircle,
  ShieldCheck
} from "lucide-react";

export default function CustomerBooking() {
  const [searchParams] = useSearchParams();
  const initialMfr = searchParams.get("manufacturer") || "Kathar Weaves";
  const initialArtisan = searchParams.get("artisanName") || "Rithikeswaran M";

  const [bookings, setBookings] = useState([
    {
      id: "BK-501",
      bookingId: "BK-501",
      manufacturer: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      loomType: "Traditional Pit Loom",
      fabricChoice: "Pure Mulberry Silk & Gold Zari",
      customPattern: "Peacock Motif with Contrast Pallu",
      bodyColor: "Crimson Red",
      bookingDate: "14 Aug 2026",
      targetCompletion: "10 Sep 2026",
      status: "Confirmed",
      advancePaid: "₹3,000"
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/bookings")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setBookings(json.data);
        }
      })
      .catch((err) => console.log("Using cached bookings:", err));
  }, []);

  const handleBookingSuccess = (newBooking) => {
    if (newBooking) {
      setBookings((prev) => [newBooking, ...prev]);
    }
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
            Bespoke Loom Reservation & Custom Orders
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Select a master weaver, customize your bridal or heirloom weave specifications, and reserve dedicated artisan loom time.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Custom Order Wizard Form (2 Cols) */}
          <div className="lg:col-span-2">
            <CustomOrderWizard
              initialManufacturer={initialMfr}
              initialArtisan={initialArtisan}
              onSubmitSuccess={handleBookingSuccess}
            />
          </div>

          {/* Active Bookings & Loom Status (1 Col) */}
          <div className="space-y-6">
            {/* Guarantee Box */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-gradient-to-br from-[#4A1525] to-[#7A263B] p-6 text-white shadow-xs">
              <div className="flex items-center gap-2 text-[#FCDA8B] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Bespoke Artisan Guarantee</span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-bold">
                100% Dedicated Pit Loom
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Your saree is woven on a single dedicated loom by the designated master weaver. We send live video updates as your warp drafting begins.
              </p>
            </div>

            {/* My Active Loom Reservations */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">
                  My Custom Loom Orders
                </h3>
                <span className="text-xs font-semibold text-[#8F8175]">
                  {bookings.length} {bookings.length === 1 ? "Order" : "Orders"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.bookingId || b.id || b._id}
                    className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-4 text-xs transition hover:border-[#4A1525]/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#4A1525]">
                        #{b.bookingId || b.id || "BK-501"}
                      </span>
                      <span className="rounded-full bg-[#EAF6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                        {b.status || "Confirmed"}
                      </span>
                    </div>

                    <p className="mt-2 font-semibold text-[#292421]">
                      {b.fabricChoice || "Pure Silk & Zari Saree"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#7A6D61]">
                      {b.loomType} • Woven by <strong>{b.artisanName || b.manufacturer}</strong>
                    </p>
                    {b.customPattern && (
                      <p className="mt-1 text-[11px] text-[#8F8175] italic">
                        Pattern: {b.customPattern}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-[#E8DFD5] pt-2 text-[10px] text-[#8F8175]">
                      <span>Target: {b.targetCompletion || "In 3 Weeks"}</span>
                      <span className="font-bold text-[#4A1525]">
                        Advance Paid: {b.advancePaid || "₹3,000"}
                      </span>
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
