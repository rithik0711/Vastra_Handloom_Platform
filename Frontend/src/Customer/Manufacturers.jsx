import React, { useState, useEffect } from "react";
import CustomerSidebar from "./Sidebar";
import {
  Award,
  MapPin,
  Star,
  ShieldCheck,
  Check,
  ChevronRight
} from "lucide-react";

export default function CustomerManufacturers() {
  const [manufacturers, setManufacturers] = useState([
    {
      id: "MFR-01",
      name: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      location: "Coimbatore, Tamil Nadu",
      rating: 4.9,
      reviewsCount: 142,
      specialization: "Kanchipuram Silk & Fine Cotton",
      experience: "15+ Years",
      image: "/images/kathar.png",
      verified: true,
      activeLooms: 18,
      description: "Generational weavers crafting heirloom pure mulberry silk sarees with authentic Korvai border techniques and natural botanical dyes."
    },
    {
      id: "MFR-02",
      name: "Aura Handlooms",
      artisanName: "Senthil Kumar",
      location: "Salem, Tamil Nadu",
      rating: 4.8,
      reviewsCount: 98,
      specialization: "Organic Cotton & Dhoti Weaves",
      experience: "12+ Years",
      image: "/images/handloom.png",
      verified: true,
      activeLooms: 12,
      description: "Dedicated to reviving traditional natural cotton spinning, chemical-free yarn processing, and soft festive cotton weaves."
    },
    {
      id: "MFR-03",
      name: "Varanasi Silk Guild",
      artisanName: "Rajeshwar Pandey",
      location: "Varanasi, Uttar Pradesh",
      rating: 4.9,
      reviewsCount: 210,
      specialization: "Banarasi Brocade & Tanchoi",
      experience: "25+ Years",
      image: "/images/zari.png",
      verified: true,
      activeLooms: 24,
      description: "Master Jacquard and brocade silk weaving heritage house famous for gold zari kadwa motifs and vintage wedding textiles."
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/manufacturers")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setManufacturers(json.data);
        }
      })
      .catch((err) => console.log("Using cached manufacturers:", err));
  }, []);

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
            Master Weavers & Artisan Clusters
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Connect directly with verified handloom manufacturers and artisan weaving societies across India.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {manufacturers.map((mfr) => (
            <div
              key={mfr.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Weaver
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#A16B16]">
                    <Star className="h-3.5 w-3.5 fill-[#D09229] text-[#D09229]" />
                    <span>{mfr.rating}</span>
                    <span className="text-[10px] text-[#8F8175]">({mfr.reviewsCount || 100}+)</span>
                  </div>
                </div>

                <h3 className="mt-4 font-serif text-2xl font-bold text-[#4A1525]">{mfr.name}</h3>
                <p className="text-xs font-semibold text-[#8F8175] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-[#B8AAA0]" />
                  {mfr.location}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-[#56493F]">
                  {mfr.description || "Traditional weaver guild dedicated to handwoven heirloom sarees."}
                </p>

                <div className="mt-4 space-y-2 rounded-2xl bg-[#FAF6F0] p-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8F8175]">Specialization:</span>
                    <span className="font-semibold text-[#4A1525]">{mfr.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F8175]">Experience:</span>
                    <span className="font-semibold text-[#292421]">{mfr.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F8175]">Active Looms:</span>
                    <span className="font-semibold text-[#A16B16]">{mfr.activeLooms || 16} Looms</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#F0E8DF] pt-4">
                <a
                  href="/customer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF0E1] py-2.5 text-xs font-bold text-[#4A1525] transition hover:bg-[#F3E5D0]"
                >
                  <span>Explore Workshop Creations</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
