import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Eye,
  Sliders,
  FolderOpen,
  ArrowRight,
  Layers,
  Scissors,
  Bookmark,
  Calendar,
  CheckCircle2,
  Trash2,
  Share2,
  Download,
  Printer,
  ChevronDown,
  RefreshCw,
  X,
  Copy,
  Check,
  Edit3
} from "lucide-react";

export default function CustomerDesign() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedZari, setSelectedZari] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDesignModal, setSelectedDesignModal] = useState(null);
  const [generatingImageId, setGeneratingImageId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const userEmail = localStorage.getItem("userEmail") || "";

  // Fetch designs for the customer from Backend
  useEffect(() => {
    fetchCustomerDesigns();
  }, [userEmail]);

  const fetchCustomerDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/customer/design?customerEmail=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        setDesigns(json.data);
      } else {
        setDesigns([]);
      }
    } catch (err) {
      console.warn("Designs fetch error:", err);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI Image on the fly
  const handleGenerateImageForDesign = async (design, e) => {
    if (e) e.stopPropagation();
    const id = design._id || design.id;
    setGeneratingImageId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/design/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: id,
          fabric: design.fabric,
          baseColor: design.baseColor,
          borderStyle: design.borderStyle,
          zari: design.zari,
          palluDesign: design.palluDesign,
          motifs: design.motifs,
          occasion: design.occasion,
          compiledPrompt: design.compiledPrompt
        })
      });
      const json = await res.json();
      if (json.status === "success" && json.data?.imageUrl) {
        setDesigns((prev) =>
          prev.map((d) => ((d._id || d.id) === id ? { ...d, imageUrl: json.data.imageUrl } : d))
        );
        if (selectedDesignModal && (selectedDesignModal._id || selectedDesignModal.id) === id) {
          setSelectedDesignModal((prev) => ({ ...prev, imageUrl: json.data.imageUrl }));
        }
      }
    } catch (err) {
      console.warn("AI generation failed:", err);
    } finally {
      setGeneratingImageId(null);
    }
  };

  // Delete design
  const handleDeleteDesign = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom saree blueprint?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/customer/design/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete design err:", err);
    }

    setDesigns((prev) => prev.filter((d) => (d._id || d.id) !== id));
    if (selectedDesignModal && (selectedDesignModal._id || selectedDesignModal.id) === id) {
      setSelectedDesignModal(null);
    }
  };

  // Filter and Sort designs
  const filteredDesigns = useMemo(() => {
    return designs
      .filter((d) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.fabric && d.fabric.toLowerCase().includes(q)) ||
          (d.baseColor && d.baseColor.toLowerCase().includes(q)) ||
          (d.borderStyle && d.borderStyle.toLowerCase().includes(q));

        const matchesFabric = selectedFabric === "All" || d.fabric === selectedFabric;
        const matchesOccasion = selectedOccasion === "All" || d.occasion === selectedOccasion;
        const matchesZari = selectedZari === "All" || d.zari === selectedZari;

        return matchesQuery && matchesFabric && matchesOccasion && matchesZari;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [designs, searchQuery, selectedFabric, selectedOccasion, selectedZari, sortBy]);

  // Distinct Filter options
  const fabricOptions = ["All", "Pure Silk", "Cotton", "Linen", "Tussar Silk", "Banarasi Silk"];
  const occasionOptions = ["All", "Bridal", "Wedding", "Festival", "Traditional", "Party"];
  const zariOptions = ["All", "Gold", "Antique Gold", "Silver", "Two-Tone Zari"];

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* --- Top Header Section --- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Bespoke Handloom Portfolio
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              My Custom Saree Blueprints
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Explore your custom-designed saree blueprints with photorealistic FLUX AI renders and 1-click booking on master artisan looms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchCustomerDesigns}
              className="flex items-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white px-3.5 py-2.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8]"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#D09229]" : "text-[#7A6D61]"} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer/create-design")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-95"
            >
              <Plus size={16} />
              <span>+ Design New Saree</span>
            </button>
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="mt-6 rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A695]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, fabric, color, border style..."
                className="w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] py-2 pl-10 pr-4 text-xs font-semibold text-[#4A1525] placeholder:text-[#B5A695] focus:border-[#D09229] focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                {fabricOptions.map((f) => (
                  <option key={f} value={f}>
                    Fabric: {f}
                  </option>
                ))}
              </select>

              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                {occasionOptions.map((o) => (
                  <option key={o} value={o}>
                    Occasion: {o}
                  </option>
                ))}
              </select>

              <select
                value={selectedZari}
                onChange={(e) => setSelectedZari(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                {zariOptions.map((z) => (
                  <option key={z} value={z}>
                    Zari: {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16">
            <RefreshCw className="animate-spin text-[#D09229]" size={36} />
            <p className="mt-3 font-serif text-base font-bold text-[#4A1525]">Loading Your Saree Blueprints...</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF3E8] text-[#D09229]">
              <FolderOpen size={30} />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-[#4A1525]">No Custom Saree Designs Found</h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#7A6D61]">
              Launch the Interactive Saree Studio to create your first custom handloom saree design.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/customer/create-design")}
                className="flex items-center gap-2 rounded-xl bg-[#4A1525] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] shadow-xs"
              >
                <Plus size={16} />
                <span>Design Custom Saree</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesigns.map((d) => {
              const baseHex = d.customBaseHex || "#800000";
              const zariHex = d.zari === "Antique Gold" ? "#997A15" : d.zari === "Silver" ? "#E0E0E0" : "#D4AF37";
              const isGeneratingThis = generatingImageId === (d._id || d.id);

              return (
                <div
                  key={d._id || d.id || Math.random()}
                  onClick={() => setSelectedDesignModal(d)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D09229] hover:shadow-[0_12px_32px_rgba(74,21,37,0.08)] cursor-pointer"
                >
                  {/* Card Header Media */}
                  <div className="relative h-48 overflow-hidden border-b border-[#eadfd2] bg-[#1a1412]">
                    {d.imageUrl ? (
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={d.imageUrl}
                          alt={d.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur-xs">
                          <Sparkles size={10} />
                          <span>FLUX Render</span>
                        </span>
                      </div>
                    ) : (
                      <div className="relative h-full w-full" style={{ backgroundColor: baseHex }}>
                        <div
                          className="absolute top-0 bottom-0 right-0 w-24 border-l-2 shadow-md flex flex-col justify-center items-center text-white"
                          style={{ backgroundColor: d.customPalluHex || "#D4AF37", borderColor: zariHex }}
                        >
                          <span className="font-serif text-[10px] font-bold">{d.palluDesign || "Peacock"} Pallu</span>
                        </div>
                      </div>
                    )}

                    {/* Top Floating Badge Pills */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-xs">
                        {d.fabric}
                      </span>
                      <span className="rounded-full bg-[#FAF3E8]/90 px-2 py-0.5 text-[10px] font-bold text-[#4A1525] backdrop-blur-xs border border-[#eadfd2]">
                        {d.occasion}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#4A1525] group-hover:text-[#7A263B] transition">
                          {d.title || "Custom Handloom Saree"}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-[#9B8068]">
                          {d.borderWidth} • {d.borderStyle}
                        </p>
                      </div>
                      <span className="rounded-md border border-[#E8DFC8] bg-[#FAF8F4] px-2 py-0.5 text-[10px] font-bold text-[#7A6D61]">
                        {d.zari} Zari
                      </span>
                    </div>

                    {/* Motifs */}
                    {d.motifs && d.motifs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {d.motifs.map((m, idx) => (
                          <span
                            key={idx}
                            className="rounded-md border border-[#EAE2D5] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4A1525]"
                          >
                            ✦ {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons Footer */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#F0E8DC] pt-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/customer/create-design", { state: { design: d } });
                          }}
                          className="flex items-center gap-1 rounded-lg border border-[#E0D3C1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8]"
                          title="Edit in Studio"
                        >
                          <Edit3 size={13} className="text-[#D09229]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteDesign(d._id || d.id, e)}
                          className="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50"
                          title="Delete Design"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/customer/booking", { state: { selectedDesign: d } });
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95 active:scale-95"
                      >
                        <Sparkles size={13} className="text-amber-300" />
                        <span>Book on Loom</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Detailed Blueprint Inspection Modal --- */}
        {selectedDesignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#EFE7DC] bg-[#FFFDF9] shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#eadfd2] bg-[#FAF6F0] px-6 py-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8068]">
                    Custom Saree Blueprint Specification
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                    {selectedDesignModal.title || "Custom Saree Creation"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDesignModal(null)}
                  className="rounded-full p-2 text-[#7A6D61] hover:bg-[#EFE7DC] hover:text-[#4A1525]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedDesignModal.imageUrl && (
                  <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-[#E0D3C1] shadow-inner bg-[#1a1412]">
                    <img
                      src={selectedDesignModal.imageUrl}
                      alt={selectedDesignModal.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-300 w-fit">
                        ✨ FLUX AI Photorealistic Generation
                      </span>
                      <button
                        type="button"
                        onClick={() => window.open(selectedDesignModal.imageUrl, "_blank")}
                        className="self-end rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white hover:text-amber-300"
                      >
                        View Full Res ↗
                      </button>
                    </div>
                  </div>
                )}

                {/* Technical Specifications */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Fabric</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.fabric}</p>
                  </div>
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Base Color</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.baseColor}</p>
                  </div>
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Zari Grade</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.zari} Zari</p>
                  </div>
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Border Style</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.borderStyle}</p>
                  </div>
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Pallu Design</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.palluDesign}</p>
                  </div>
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Occasion</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.occasion}</p>
                  </div>
                </div>

                {/* Master Weaver Notes */}
                {selectedDesignModal.additionalInstructions && (
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Artisan Loom Notes</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#292421]">
                      {selectedDesignModal.additionalInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-[#eadfd2] bg-[#FAF6F0] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedDesignModal(null)}
                  className="rounded-xl border border-[#E0D3C1] bg-white px-4 py-2 text-xs font-bold text-[#7A6D61] hover:bg-[#F8F5EF]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const d = selectedDesignModal;
                    setSelectedDesignModal(null);
                    navigate("/customer/booking", { state: { selectedDesign: d } });
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Proceed to Book on Custom Loom</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
