import React, { useState, useEffect } from "react";
import OwnerSidebar from "./Sidebar";
import {
  TrendingUp,
  Users,
  Award,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function Owner() {
  const [overview, setOverview] = useState({
    totalPlatformGMV: "₹48.6 Lakhs",
    platformCommission: "₹4.86 Lakhs",
    activeManufacturers: 48,
    totalArtisans: 620,
    activeLooms: 312,
    totalOrdersDelivered: 1420,
    loomUtilizationRate: "89.4%",
    customerSatisfaction: "4.9 / 5.0"
  });

  const [manufacturers, setManufacturers] = useState([
    {
      id: "MFR-01",
      name: "Kathar Weaves",
      owner: "Rithikeswaran M",
      email: "rithikeswaran.it23@bitsathy.ac.in",
      location: "Coimbatore, TN",
      registeredDate: "15 Jan 2026",
      verificationStatus: "Verified",
      totalSales: "₹12.4 Lakhs",
      rating: 4.9
    },
    {
      id: "MFR-02",
      name: "Aura Handlooms",
      owner: "Senthil Kumar",
      email: "senthil@aurahandlooms.in",
      location: "Salem, TN",
      registeredDate: "02 Feb 2026",
      verificationStatus: "Verified",
      totalSales: "₹8.9 Lakhs",
      rating: 4.8
    },
    {
      id: "MFR-03",
      name: "Royal Banaras Loom Guild",
      owner: "Nadish V",
      email: "nadish.it23@bitsathy.ac.in",
      location: "Varanasi, UP",
      registeredDate: "20 Mar 2026",
      verificationStatus: "Verified",
      totalSales: "₹18.2 Lakhs",
      rating: 5.0
    },
    {
      id: "MFR-04",
      name: "Chettinad Heritage Cotton",
      owner: "Alagappan Muthiah",
      email: "alagappan@chettinadcotton.com",
      location: "Karaikudi, TN",
      registeredDate: "10 Aug 2026",
      verificationStatus: "Pending Verification",
      totalSales: "₹1.5 Lakhs",
      rating: 4.7
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/owner/overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setOverview(json.data);
        }
      })
      .catch((err) => console.log("Using cached owner overview:", err));

    fetch("http://localhost:5000/api/owner/manufacturers")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setManufacturers(json.data);
        }
      })
      .catch((err) => console.log("Using cached owner manufacturers:", err));
  }, []);

  const handleVerify = (id) => {
    setManufacturers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, verificationStatus: "Verified" } : m
      )
    );

    fetch(`http://localhost:5000/api/owner/manufacturers/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Verified" })
    }).catch((err) => console.log("Status updated locally"));
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <OwnerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Owner Administration
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Vastra Platform Master Control
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Global handloom ecosystem analytics, manufacturer verification & revenue oversight.
            </p>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">Total Platform GMV</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#4A1525] sm:text-3xl">
              {overview.totalPlatformGMV}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +24% Year-over-Year
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">Platform Revenue</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#A16B16]">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#A16B16] sm:text-3xl">
              {overview.platformCommission}
            </h2>
            <p className="mt-1 text-[11px] text-[#8F8175]">10% Handloom marketplace take-rate</p>
          </div>

          <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">Master Artisans</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4EAFA] text-[#704C91]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#704C91] sm:text-3xl">
              {overview.totalArtisans}
            </h2>
            <p className="mt-1 text-[11px] text-[#8F8175]">Across {overview.activeManufacturers} verified workshops</p>
          </div>

          <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">Loom Utilization</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF6ED] text-[#2E7D32]">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#2E7D32] sm:text-3xl">
              {overview.loomUtilizationRate}
            </h2>
            <p className="mt-1 text-[11px] text-[#8F8175]">{overview.activeLooms} Looms actively spinning</p>
          </div>
        </div>

        {/* Verification & Manufacturers List */}
        <div className="mt-8 rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                Weaver Guilds & Manufacturer Verifications
              </h3>
              <p className="mt-0.5 text-xs text-[#7A6D61]">
                Approve new handloom producers and verify Silk Mark / GI compliance.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E8DF] text-[11px] font-bold uppercase text-[#8F8175]">
                  <th className="pb-3">Manufacturer / Guild</th>
                  <th className="pb-3">Owner & Contact</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Platform Sales</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE8]">
                {manufacturers.map((m) => (
                  <tr key={m.id} className="transition hover:bg-[#FAF6F0]">
                    <td className="py-4 font-serif text-sm font-bold text-[#292421]">
                      {m.name}
                    </td>
                    <td className="py-4">
                      <p className="font-semibold text-[#292421]">{m.owner}</p>
                      <p className="text-[11px] text-[#8F8175]">{m.email}</p>
                    </td>
                    <td className="py-4 text-[#56493F]">{m.location}</td>
                    <td className="py-4 font-serif font-bold text-[#4A1525]">{m.totalSales}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          m.verificationStatus === "Verified"
                            ? "bg-[#EAF6ED] text-[#2E7D32] border border-[#C8E6C9]"
                            : "bg-[#FFF4DF] text-[#A16B16] border border-[#F5DEC0]"
                        }`}
                      >
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {m.verificationStatus === "Pending Verification" ? (
                        <button
                          onClick={() => handleVerify(m.id)}
                          className="rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95"
                        >
                          Verify & Approve
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
