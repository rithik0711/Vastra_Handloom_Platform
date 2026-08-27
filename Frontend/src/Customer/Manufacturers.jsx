import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import ArtisanCard from "./components/ArtisanCard";
import ArtisanProfileModal from "./components/ArtisanProfileModal";
import {
  Award,
  MapPin,
  Star,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

export default function CustomerManufacturers() {
  const navigate = useNavigate();

  const defaultManufacturers = [
    {
      id: "MFR-01",
      name: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      ownerName: "Rithikeswaran M",
      location: "Coimbatore, Tamil Nadu",
      rating: 4.9,
      reviewsCount: 142,
      specialization: "Kanchipuram Silk & Fine Cotton",
      experience: "15+ Years",
      image: "/images/kathar.png",
      verified: true,
      activeLooms: 18,
      description:
        "Generational master weavers crafting heirloom pure mulberry silk sarees with authentic Korvai border techniques and natural botanical dyes."
    },
    {
      id: "MFR-02",
      name: "Aura Handlooms",
      artisanName: "Senthil Kumar",
      ownerName: "Senthil Kumar",
      location: "Salem, Tamil Nadu",
      rating: 4.8,
      reviewsCount: 98,
      specialization: "Organic Cotton & Dhoti Weaves",
      experience: "12+ Years",
      image: "/images/handloom.png",
      verified: true,
      activeLooms: 12,
      description:
        "Dedicated to reviving traditional natural cotton spinning, chemical-free yarn processing, and soft festive cotton weaves."
    },
    {
      id: "MFR-03",
      name: "Varanasi Silk Guild",
      artisanName: "Rajeshwar Pandey",
      ownerName: "Rajeshwar Pandey",
      location: "Varanasi, Uttar Pradesh",
      rating: 4.9,
      reviewsCount: 210,
      specialization: "Banarasi Brocade & Tanchoi",
      experience: "25+ Years",
      image: "/images/zari.png",
      verified: true,
      activeLooms: 24,
      description:
        "Master Jacquard and brocade silk weaving heritage house famous for gold zari kadwa motifs and vintage wedding textiles."
    },
    {
      id: "MFR-04",
      name: "Chettinad Heritage Cotton",
      artisanName: "Alagappan Muthiah",
      ownerName: "Alagappan Muthiah",
      location: "Karaikudi, Tamil Nadu",
      rating: 4.7,
      reviewsCount: 76,
      specialization: "Chettinad Sungudi & Cotton",
      experience: "18+ Years",
      image: "/images/cotton.png",
      verified: true,
      activeLooms: 10,
      description:
        "Specialists in contrasting bold check patterns, thick bordered traditional Chettinad weaves, and pure natural-dyed daily wear."
    }
  ];

  const [manufacturers, setManufacturers] = useState(defaultManufacturers);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/manufacturers")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setManufacturers(json.data);
        }
      })
      .catch((err) => console.log("Using cached manufacturers:", err));
  }, []);

  const filtered = manufacturers.filter((m) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.artisanName && m.artisanName.toLowerCase().includes(q)) ||
      (m.location && m.location.toLowerCase().includes(q)) ||
      (m.specialization && m.specialization.toLowerCase().includes(q));

    const matchRegion =
      filterRegion === "All" || (m.location && m.location.toLowerCase().includes(filterRegion.toLowerCase()));

    return matchSearch && matchRegion;
  });

  const handleDirectCustomOrder = (artisan) => {
    navigate(
      `/customer/booking?manufacturer=${encodeURIComponent(
        artisan.name
      )}&artisanName=${encodeURIComponent(artisan.artisanName || artisan.ownerName || "Master Weaver")}`
    );
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
            Master Weavers & Artisan Clusters
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Connect directly with verified generational handloom masters, explore workshop looms, and commission bespoke weaves.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
            <input
              type="text"
              placeholder="Search by master weaver, guild name, location, silk specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-4 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "Tamil Nadu", "Varanasi"].map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setFilterRegion(reg)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  filterRegion === reg
                    ? "bg-[#4A1525] text-white shadow-xs"
                    : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Artisans Grid assembled with ArtisanCard */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mfr) => (
            <ArtisanCard
              key={mfr.id}
              artisan={mfr}
              onSelectArtisan={(artisan) => setSelectedArtisan(artisan)}
              onDirectCustomOrder={handleDirectCustomOrder}
            />
          ))}
        </div>

        {/* Deep Artisan Bio Modal */}
        {selectedArtisan && (
          <ArtisanProfileModal
            artisan={selectedArtisan}
            onClose={() => setSelectedArtisan(null)}
            onBookCustomOrder={handleDirectCustomOrder}
          />
        )}
      </main>
    </div>
  );
}
