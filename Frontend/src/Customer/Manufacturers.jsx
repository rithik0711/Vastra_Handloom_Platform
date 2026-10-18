import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  Award,
  MapPin,
  Star,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  X,
  Phone,
  Mail,
  Calendar,
  Layers
} from "lucide-react";

export default function CustomerManufacturers() {
  const navigate = useNavigate();

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/customer/manufacturers")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data)) {
          setManufacturers(json.data);
        } else {
          setManufacturers([]);
        }
      })
      .catch((err) => {
        console.warn("Manufacturers fetch note:", err);
        setManufacturers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = manufacturers.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.artisanName && m.artisanName.toLowerCase().includes(q)) ||
      m.location.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q);

    const matchesRegion =
      filterRegion === "All" ||
      m.location.toLowerCase().includes(filterRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Master Artisans & Handloom Guilds
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Meet the Handloom Craftsmen
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Connect directly with Silk Mark certified master weavers and reserve custom looms.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A695]" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artisans by guild, location, specialization..."
              className="w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] py-2 pl-10 pr-4 text-xs text-[#4A1525] focus:outline-hidden"
            />
          </div>

          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:outline-hidden"
          >
            <option value="All">All Regions</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

        {/* Artisans Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((artisan) => (
            <div
              key={artisan.id || artisan._id}
              className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={artisan.image || "/images/kathar.png"}
                      alt={artisan.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-[#E5DCD0]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/kathar.png";
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-lg font-bold text-[#4A1525]">{artisan.name}</h3>
                        {artisan.verified && (
                          <ShieldCheck size={16} className="text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#8F8175]">
                        Lead Weaver: <strong>{artisan.artisanName || artisan.ownerName}</strong>
                      </p>
                      <p className="text-[11px] text-[#7A6D61] flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#D09229]" />
                        <span>{artisan.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-[#FAF0E1] px-2.5 py-1 text-xs font-bold text-[#A16B16]">
                    <Star size={12} className="fill-[#A16B16] text-[#A16B16]" />
                    <span>{artisan.rating || 4.9}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#5C534B] leading-relaxed line-clamp-2">
                  {artisan.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-lg bg-[#FAF8F4] border border-[#EFE7DC] px-2.5 py-1 font-semibold text-[#4A1525]">
                    {artisan.specialization}
                  </span>
                  <span className="rounded-lg bg-[#FAF8F4] border border-[#EFE7DC] px-2.5 py-1 font-semibold text-[#4A1525]">
                    {artisan.experience || "15+ Years"}
                  </span>
                  <span className="rounded-lg bg-[#FAF8F4] border border-[#EFE7DC] px-2.5 py-1 font-semibold text-[#4A1525]">
                    {artisan.activeLooms || 18} Active Looms
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#F0E8DF] pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/customer/artisan/${artisan.id || artisan._id || "kathar_weaves"}`)}
                  className="flex-1 rounded-xl border border-[#4A1525] bg-white py-2 text-xs font-bold text-[#4A1525] hover:bg-[#FAF6F0] transition"
                >
                  View Profile, Gallery & Sarees
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/customer/booking", { state: { initialManufacturer: artisan.name, initialArtisan: artisan.artisanName } })}
                  className="flex-1 rounded-xl bg-[#4A1525] py-2 text-xs font-bold text-white hover:bg-[#6A1F35] transition"
                >
                  Book Loom Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Profile Modal */}
        {selectedArtisan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">{selectedArtisan.name}</h3>
                <button type="button" onClick={() => setSelectedArtisan(null)} className="text-stone-400 hover:text-stone-700">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-[#5C534B] leading-relaxed">
                {selectedArtisan.description}
              </p>

              <div className="rounded-2xl bg-[#FAF8F4] border border-[#EFE7DC] p-3 text-xs space-y-1.5">
                <p><strong>Location:</strong> {selectedArtisan.location}</p>
                <p><strong>Master Craftsman:</strong> {selectedArtisan.artisanName || selectedArtisan.ownerName}</p>
                <p><strong>Specialization:</strong> {selectedArtisan.specialization}</p>
                <p><strong>Active Pit Looms:</strong> {selectedArtisan.activeLooms || 18}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedArtisan(null)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold text-[#7A6D61]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const art = selectedArtisan;
                    setSelectedArtisan(null);
                    navigate("/customer/booking", { state: { initialManufacturer: art.name, initialArtisan: art.artisanName } });
                  }}
                  className="rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Book Loom
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
