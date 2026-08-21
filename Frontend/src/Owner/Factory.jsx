import React, { useState, useEffect } from "react";
import OwnerSidebar from "./Sidebar";
import {
  Factory as FactoryIcon,
  Sun,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  Zap,
  MapPin
} from "lucide-react";

export default function Factory() {
  const [factories, setFactories] = useState([
    {
      id: "FAC-101",
      name: "Coimbatore Silk & Handloom Cluster",
      owner: "Kathar Weaves / Rithikeswaran M",
      location: "Coimbatore, Tamil Nadu",
      activeLooms: 18,
      totalLooms: 20,
      dailyOutputMeters: 45,
      powerStatus: "Solar + Grid (Active)",
      complianceStatus: "Certified Organic & Handloom Mark",
      efficiency: "92%",
      status: "Operational"
    },
    {
      id: "FAC-102",
      name: "Kanchipuram Heritage Artisan Guild",
      owner: "Kanchi Master Guild",
      location: "Kanchipuram, Tamil Nadu",
      activeLooms: 34,
      totalLooms: 36,
      dailyOutputMeters: 62,
      powerStatus: "Active",
      complianceStatus: "Silk Mark Certified",
      efficiency: "96%",
      status: "Operational"
    },
    {
      id: "FAC-103",
      name: "Salem Natural Cotton Weaving Center",
      owner: "Salem Weavers Cooperative",
      location: "Salem, Tamil Nadu",
      activeLooms: 14,
      totalLooms: 16,
      dailyOutputMeters: 38,
      powerStatus: "Active",
      complianceStatus: "India Handloom Brand Certified",
      efficiency: "88%",
      status: "Operational"
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/owner/factories")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setFactories(json.data);
        }
      })
      .catch((err) => console.log("Using cached factories:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <OwnerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Owner Administration
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            Loom Clusters & Weaving Centers
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Monitor real-time loom uptime, green energy utilization, and production capacity across all verified centers.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {factories.map((fac) => (
            <div
              key={fac.id}
              className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#EAF6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                  {fac.status}
                </span>
                <span className="font-serif text-xs font-bold text-[#A16B16]">{fac.id}</span>
              </div>

              <h3 className="mt-4 font-serif text-xl font-bold text-[#4A1525]">{fac.name}</h3>
              <p className="text-xs text-[#7A6D61] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-[#9B8F84]" />
                {fac.location}
              </p>

              <div className="mt-4 space-y-2 rounded-2xl bg-[#FAF6F0] p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8F8175]">Workshop Lead:</span>
                  <span className="font-semibold text-[#292421]">{fac.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8175]">Active Looms:</span>
                  <span className="font-semibold text-[#4A1525]">
                    {fac.activeLooms} / {fac.totalLooms} Looms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8175]">Daily Meterage:</span>
                  <span className="font-semibold text-[#292421]">{fac.dailyOutputMeters} Meters/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8175]">Efficiency:</span>
                  <span className="font-bold text-emerald-700">{fac.efficiency}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-3 text-[11px] text-[#7A6D61]">
                <span className="flex items-center gap-1 text-amber-700">
                  <Sun className="h-3.5 w-3.5" />
                  {fac.powerStatus}
                </span>
                <span className="font-medium text-[#4A1525]">{fac.complianceStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
