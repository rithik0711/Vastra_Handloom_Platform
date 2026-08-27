import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Eye,
  Sliders,
  Trash2,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  Calendar,
  Layers,
  Palette,
  Scissors,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  RefreshCw,
  X,
  ExternalLink,
  Edit3,
  Bookmark,
  FileText,
  Image as ImageIcon
} from "lucide-react";

// Default Initial Handcrafted Designs with authentic saree preview images
const SEED_DESIGNS = [
  {
    _id: "seed-1",
    title: "Maharani Bridal Kanchipuram Edition",
    fabric: "Pure Silk",
    baseColor: "Maroon",
    customBaseHex: "#800000",
    borderStyle: "Temple Border",
    borderWidth: "Large",
    zari: "Gold",
    palluDesign: "Peacock",
    palluColor: "Gold",
    customPalluHex: "#D4AF37",
    motifs: ["Peacock", "Lotus", "Temple Spire"],
    customMotifText: "Sacred Ganda Berunda central medallion",
    bodyPattern: "Butta Pattern",
    patternDensity: "Medium",
    occasion: "Bridal",
    designStyle: "Traditional",
    additionalInstructions: "Double warp with 3-ply pure mulberry silk. Korvai interlocking temple border with solid gold zari pallu. Finished with handcrafted tasseling.",
    compiledPrompt: "A high-fashion royal Indian bride wearing an ultra-luxurious Pure Silk Kanchipuram saree in regal Maroon with solid Gold zari temple border and heavy peacock pallu.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    _id: "seed-2",
    title: "Banarasi Shikargah Royal Brocade",
    fabric: "Banarasi Silk",
    baseColor: "Royal Blue",
    customBaseHex: "#1034A6",
    borderStyle: "Floral Border",
    borderWidth: "Extra Large",
    zari: "Antique Gold",
    palluDesign: "Paisley",
    palluColor: "Contrast Color",
    customPalluHex: "#FB8C00",
    motifs: ["Paisley", "Floral Vines", "Animals/Shikargah"],
    customMotifText: "Continuous hunting scenes woven in gold kadhwa technique",
    bodyPattern: "Jaal (All-over Mesh)",
    patternDensity: "Heavy",
    occasion: "Royal Wedding",
    designStyle: "Opulent Heritage",
    additionalInstructions: "Traditional Kadwa weave where each animal motif is individually woven with extra weft spool. Rich kadwa floral border.",
    compiledPrompt: "A masterpiece royal Banarasi silk saree in deep Royal Blue covered in intricate antique gold zari Shikargah flora-fauna jaal with extra large kadhwa border.",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    _id: "seed-3",
    title: "Chanderi Lotus Blossom Festive Drape",
    fabric: "Tussar Silk",
    baseColor: "Mustard",
    customBaseHex: "#D4AF37",
    borderStyle: "Traditional Zari Border",
    borderWidth: "Medium",
    zari: "Copper",
    palluDesign: "Lotus",
    palluColor: "Maroon",
    customPalluHex: "#800000",
    motifs: ["Lotus", "Rudraksha", "Coin (Kasavu)"],
    customMotifText: "Fine copper zari coin booti in alternate grid",
    bodyPattern: "Coin / Ashavali Circles",
    patternDensity: "Minimal",
    occasion: "Festival",
    designStyle: "Modern Heritage",
    additionalInstructions: "Natural wild tussar silk texture. Pure copper zari warp highlights with sheer featherweight drape.",
    compiledPrompt: "Vibrant Mustard yellow handwoven Tussar silk saree featuring copper zari lotus motifs and contrasting maroon pallu.",
    imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
  },
  {
    _id: "seed-4",
    title: "Chettinad Temple Loom Organic Cotton",
    fabric: "Cotton",
    baseColor: "Peacock Green",
    customBaseHex: "#005F60",
    borderStyle: "Checked Border",
    borderWidth: "Medium",
    zari: "No Zari",
    palluDesign: "Temple",
    palluColor: "Same as Body",
    customPalluHex: "#005F60",
    motifs: ["Geometric Lattice", "Temple Spire"],
    customMotifText: "Authentic double-shuttle coarse cotton weave",
    bodyPattern: "Stripes / Lines",
    patternDensity: "Medium",
    occasion: "Temple Wear",
    designStyle: "Artisanal Organic",
    additionalInstructions: "100% 80-count organic cotton yarn dyed with natural vegetable pigments. Contrast temple spires woven in korvai method.",
    compiledPrompt: "Authentic Peacock Green Chettinad organic handloom cotton saree with vibrant contrast temple spire border and artisanal stripes.",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  },
  {
    _id: "seed-5",
    title: "Ethereal Pastel Organza Shimmer Drape",
    fabric: "Organza",
    baseColor: "Pink",
    customBaseHex: "#D81B60",
    borderStyle: "Paisley Border",
    borderWidth: "Small",
    zari: "Silver",
    palluDesign: "Floral",
    palluColor: "Same as Body",
    customPalluHex: "#D81B60",
    motifs: ["Floral Vines", "Jasmine Buds"],
    customMotifText: "Delicate scalloped silver zari border",
    bodyPattern: "Floral Spray / Jaal",
    patternDensity: "Minimal",
    occasion: "Cocktail",
    designStyle: "Contemporary Minimal",
    additionalInstructions: "Ultra sheer organza weave with silver zari scalloped embroidery along selvage and crystal bead fringes.",
    compiledPrompt: "Exquisite rose pink sheer luxury organza saree adorned with delicate silver zari floral vines and shimmering scalloped border.",
    imageUrl: "https://images.unsplash.com/photo-1610030469668-9655ecf36c53?auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString()
  }
];

const FABRIC_FILTER_OPTIONS = [
  "All",
  "Pure Silk",
  "Banarasi Silk",
  "Cotton",
  "Tussar Silk",
  "Cotton Silk",
  "Organza",
  "Linen",
  "Khadi",
  "Raw Silk"
];

const OCCASION_FILTER_OPTIONS = [
  "All",
  "Bridal",
  "Royal Wedding",
  "Festival",
  "Modern Heritage",
  "Temple Wear",
  "Cocktail",
  "Classic"
];

const ZARI_FILTER_OPTIONS = [
  "All",
  "Gold",
  "Antique Gold",
  "Silver",
  "Copper",
  "Two-Tone Zari",
  "No Zari"
];

export default function Design() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedZari, setSelectedZari] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'title' | 'fabric'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Selected design for detailed modal inspection
  const [selectedDesignModal, setSelectedDesignModal] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [generatingImageId, setGeneratingImageId] = useState(null);

  const userEmail = localStorage.getItem("userEmail") || "kathar_weaves";

  // Notification helper
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch designs from backend with fallback
  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/design?manufacturerId=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data && json.data.length > 0) {
        setDesigns(json.data);
      } else {
        // Check local storage
        const local = localStorage.getItem("vastra_saved_designs");
        if (local && JSON.parse(local).length > 0) {
          setDesigns(JSON.parse(local));
        } else {
          // Use seed designs
          setDesigns(SEED_DESIGNS);
          localStorage.setItem("vastra_saved_designs", JSON.stringify(SEED_DESIGNS));
        }
      }
    } catch (err) {
      console.warn("Backend load error, using local storage or seed data:", err);
      const local = localStorage.getItem("vastra_saved_designs");
      if (local && JSON.parse(local).length > 0) {
        setDesigns(JSON.parse(local));
      } else {
        setDesigns(SEED_DESIGNS);
        localStorage.setItem("vastra_saved_designs", JSON.stringify(SEED_DESIGNS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  // Generate Image with FLUX AI for a given design
  const handleGenerateImageForDesign = async (d, e) => {
    if (e) e.stopPropagation();
    const id = d._id || d.id;
    setGeneratingImageId(id);
    showToast("Generating realistic AI saree image with FLUX model...", "info");

    try {
      const res = await fetch("http://localhost:5000/api/manufacturer/design/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: id,
          prompt: d.compiledPrompt,
          fabric: d.fabric,
          baseColor: d.baseColor,
          borderStyle: d.borderStyle,
          zari: d.zari,
          palluDesign: d.palluDesign,
          motifs: d.motifs,
          occasion: d.occasion
        })
      });
      const json = await res.json();
      if (json.status === "success" && json.data?.imageUrl) {
        const updatedImageUrl = json.data.imageUrl;
        const updatedList = designs.map((item) =>
          (item._id || item.id) === id ? { ...item, imageUrl: updatedImageUrl } : item
        );
        setDesigns(updatedList);
        localStorage.setItem("vastra_saved_designs", JSON.stringify(updatedList));
        if (selectedDesignModal && (selectedDesignModal._id || selectedDesignModal.id) === id) {
          setSelectedDesignModal({ ...selectedDesignModal, imageUrl: updatedImageUrl });
        }
        showToast("AI Saree photo generated and saved to design!");
      } else {
        throw new Error(json.message || "Generation failed");
      }
    } catch (err) {
      console.warn("AI generation fallback:", err);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        d.compiledPrompt || d.title
      )}?width=1024&height=768&model=flux&seed=${Math.floor(Math.random() * 999999)}&nologo=true&enhance=true`;
      const updatedList = designs.map((item) =>
        (item._id || item.id) === id ? { ...item, imageUrl: fallbackUrl } : item
      );
      setDesigns(updatedList);
      localStorage.setItem("vastra_saved_designs", JSON.stringify(updatedList));
      if (selectedDesignModal && (selectedDesignModal._id || selectedDesignModal.id) === id) {
        setSelectedDesignModal({ ...selectedDesignModal, imageUrl: fallbackUrl });
      }
      showToast("AI Saree photo generated!");
    } finally {
      setGeneratingImageId(null);
    }
  };

  // Delete design
  const handleDeleteDesign = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saree design specification?")) return;

    try {
      await fetch(`http://localhost:5000/api/manufacturer/design/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.warn("Delete API failed, updating local state", err);
    }

    const updated = designs.filter((d) => (d._id || d.id) !== id);
    setDesigns(updated);
    localStorage.setItem("vastra_saved_designs", JSON.stringify(updated));
    showToast("Design deleted successfully!");

    if (selectedDesignModal && (selectedDesignModal._id || selectedDesignModal.id) === id) {
      setSelectedDesignModal(null);
    }
  };

  // Copy AI Prompt
  const handleCopyPrompt = (promptText) => {
    navigator.clipboard.writeText(promptText);
    setCopySuccess(true);
    showToast("AI Generation Prompt copied to clipboard!");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Export Specification JSON
  const handleDownloadSpec = (d) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(d, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(d.title || "Vastra_Design").replace(/\s+/g, "_")}_Spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Design specification downloaded as JSON!");
  };

  // Print Specification Sheet
  const handlePrintSpec = (d) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${d.title || "Saree Design Specification"}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #292421; }
            h1 { color: #4A1525; border-bottom: 2px solid #D09229; padding-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
            .box { border: 1px solid #eadfd2; padding: 12px; border-radius: 6px; }
            .label { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #7A6D61; }
            .value { font-size: 14px; margin-top: 4px; color: #1c1917; }
            .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>VASTRA HANDLOOM PLATFORM - WEAVING SPECIFICATION</h1>
          <h2>${d.title || "Custom Saree Creation"}</h2>
          <p><strong>Fabric:</strong> ${d.fabric} | <strong>Occasion:</strong> ${d.occasion} | <strong>Style:</strong> ${d.designStyle || "Traditional"}</p>
          <div class="grid">
            <div class="box"><div class="label">Base Color</div><div class="value">${d.baseColor} (${d.customBaseHex || "Default"})</div></div>
            <div class="box"><div class="label">Border Specification</div><div class="value">${d.borderWidth} Width • ${d.borderStyle}</div></div>
            <div class="box"><div class="label">Zari Standard</div><div class="value">${d.zari} Zari Wire</div></div>
            <div class="box"><div class="label">Pallu Architecture</div><div class="value">${d.palluDesign} Motif • ${d.palluColor}</div></div>
            <div class="box"><div class="label">Body Pattern & Density</div><div class="value">${d.bodyPattern} (${d.patternDensity} Density)</div></div>
            <div class="box"><div class="label">Selected Motifs</div><div class="value">${(d.motifs || []).join(", ") || "None"}</div></div>
          </div>
          <div class="box" style="margin-top: 16px;">
            <div class="label">Master Weaver Instructions</div>
            <div class="value">${d.additionalInstructions || "None provided"}</div>
          </div>
          <div class="footer">Generated by Vastra Master Weaver Studio • Confidential Manufacturing Document</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Filter and Sort designs
  const filteredDesigns = useMemo(() => {
    return designs
      .filter((d) => {
        const matchesQuery =
          (d.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.fabric || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.occasion || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.borderStyle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.motifs || []).some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFabric = selectedFabric === "All" || d.fabric === selectedFabric;
        const matchesOccasion = selectedOccasion === "All" || d.occasion === selectedOccasion;
        const matchesZari = selectedZari === "All" || d.zari === selectedZari;

        return matchesQuery && matchesFabric && matchesOccasion && matchesZari;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }
        if (sortBy === "fabric") {
          return (a.fabric || "").localeCompare(b.fabric || "");
        }
        return 0;
      });
  }, [designs, searchQuery, selectedFabric, selectedOccasion, selectedZari, sortBy]);

  // Key metrics calculation
  const metrics = useMemo(() => {
    const total = designs.length;
    const silkCount = designs.filter((d) => (d.fabric || "").toLowerCase().includes("silk")).length;
    const goldZariCount = designs.filter((d) => (d.zari || "").toLowerCase().includes("gold")).length;
    const bridalCount = designs.filter((d) => (d.occasion || "").toLowerCase().includes("bridal") || (d.occasion || "").toLowerCase().includes("wedding")).length;

    return { total, silkCount, goldZariCount, bridalCount };
  }, [designs]);

  // Helper color getter
  const getCardHex = (d) => {
    return d.customBaseHex || "#800000";
  };

  const getZariHex = (d) => {
    if (d.zari === "Silver") return "#E0E0E0";
    if (d.zari === "Copper") return "#B87333";
    if (d.zari === "Antique Gold") return "#997A15";
    if (d.zari === "Two-Tone Zari") return "#E5C158";
    if (d.zari === "No Zari") return "#94A3B8";
    return "#D4AF37";
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* --- Top Header Section --- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Manufacturer Design Portfolio
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              My Created Saree Designs
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Explore, manage, and inspect all custom handloom saree specifications developed by your weaving unit.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={fetchDesigns}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-3.5 text-xs font-semibold text-[#7A6D61] shadow-xs transition hover:bg-[#fffaf3] hover:text-[#4A1525] hover:border-[#D09229] active:scale-95"
              title="Refresh Designs"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/manufacturer/create-design")}
              className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95"
            >
              <Plus size={16} />
              <span>Create New Design</span>
            </button>
          </div>
        </div>

        {/* --- Toast Notification --- */}
        {notification && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl border p-4 text-xs font-bold shadow-sm transition-all duration-300 ${
              notification.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-[#7A6D61] hover:text-[#4A1525]"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* --- Summary Metrics Bar --- */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs transition hover:border-[#D09229]/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">Total Blueprints</p>
              <span className="rounded-lg bg-[#FAF3E8] p-1.5 text-[#D09229]">
                <Layers size={16} />
              </span>
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#4A1525]">{metrics.total}</p>
            <p className="mt-0.5 text-[11px] text-[#7A6D61]">Custom weaves saved</p>
          </div>

          <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs transition hover:border-[#D09229]/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">Pure Silk Weaves</p>
              <span className="rounded-lg bg-[#FAF3E8] p-1.5 text-[#4A1525]">
                <Scissors size={16} />
              </span>
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#4A1525]">{metrics.silkCount}</p>
            <p className="mt-0.5 text-[11px] text-[#7A6D61]">Mulberry & Tussar silk</p>
          </div>

          <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs transition hover:border-[#D09229]/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">Gold Zari Crafted</p>
              <span className="rounded-lg bg-[#FAF3E8] p-1.5 text-[#D4AF37]">
                <Sparkles size={16} />
              </span>
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#4A1525]">{metrics.goldZariCount}</p>
            <p className="mt-0.5 text-[11px] text-[#7A6D61]">Pure & antique brocades</p>
          </div>

          <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs transition hover:border-[#D09229]/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">Bridal & Royal</p>
              <span className="rounded-lg bg-[#FAF3E8] p-1.5 text-[#7A263B]">
                <Bookmark size={16} />
              </span>
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#4A1525]">{metrics.bridalCount}</p>
            <p className="mt-0.5 text-[11px] text-[#7A6D61]">Opulent master editions</p>
          </div>
        </div>

        {/* --- Controls, Filter & Search Section --- */}
        <div className="mt-6 rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8068]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs by title, fabric, occasion, motifs, or border..."
                className="h-10 w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] pl-10 pr-4 text-xs text-[#292421] placeholder-[#9B8068] focus:border-[#4A1525] focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8068] hover:text-[#4A1525]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Selects & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Fabric Select */}
              <div className="flex items-center gap-1.5 text-xs text-[#7A6D61]">
                <span className="font-semibold text-[#4A1525]">Fabric:</span>
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="h-9 rounded-lg border border-[#E0D3C1] bg-white px-2 text-xs font-semibold text-[#4A1525] focus:border-[#4A1525] focus:outline-none"
                >
                  {FABRIC_FILTER_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion Select */}
              <div className="flex items-center gap-1.5 text-xs text-[#7A6D61]">
                <span className="font-semibold text-[#4A1525]">Occasion:</span>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="h-9 rounded-lg border border-[#E0D3C1] bg-white px-2 text-xs font-semibold text-[#4A1525] focus:border-[#4A1525] focus:outline-none"
                >
                  {OCCASION_FILTER_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zari Select */}
              <div className="flex items-center gap-1.5 text-xs text-[#7A6D61]">
                <span className="font-semibold text-[#4A1525]">Zari:</span>
                <select
                  value={selectedZari}
                  onChange={(e) => setSelectedZari(e.target.value)}
                  className="h-9 rounded-lg border border-[#E0D3C1] bg-white px-2 text-xs font-semibold text-[#4A1525] focus:border-[#4A1525] focus:outline-none"
                >
                  {ZARI_FILTER_OPTIONS.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 text-xs text-[#7A6D61]">
                <span className="font-semibold text-[#4A1525]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 rounded-lg border border-[#E0D3C1] bg-white px-2 text-xs font-semibold text-[#4A1525] focus:border-[#4A1525] focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="fabric">Fabric Type</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="ml-auto flex items-center rounded-lg border border-[#E0D3C1] bg-[#FAF8F4] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "grid" ? "bg-white text-[#4A1525] shadow-xs" : "text-[#7A6D61] hover:text-[#4A1525]"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "table" ? "bg-white text-[#4A1525] shadow-xs" : "text-[#7A6D61] hover:text-[#4A1525]"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Content Grid / Table --- */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16">
            <RefreshCw className="animate-spin text-[#D09229]" size={36} />
            <p className="mt-3 font-serif text-base font-bold text-[#4A1525]">Loading Saree Blueprints...</p>
            <p className="text-xs text-[#7A6D61]">Fetching handcrafted designs from your weaving archive</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          /* Empty State */
          <div className="mt-8 rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF3E8] text-[#D09229]">
              <FolderOpen size={30} />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-[#4A1525]">No Saree Designs Found</h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#7A6D61]">
              {searchQuery || selectedFabric !== "All" || selectedOccasion !== "All" || selectedZari !== "All"
                ? "No creations match your current filters. Try resetting the filters or searching with a different term."
                : "You have not developed any custom saree designs yet. Launch the Master Weaver Studio to configure your first saree."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {(searchQuery || selectedFabric !== "All" || selectedOccasion !== "All" || selectedZari !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFabric("All");
                    setSelectedOccasion("All");
                    setSelectedZari("All");
                  }}
                  className="rounded-xl border border-[#E0D3C1] bg-white px-4 py-2 text-xs font-bold text-[#7A6D61] hover:bg-[#FAF6F0]"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/manufacturer/create-design")}
                className="flex items-center gap-2 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35] shadow-xs"
              >
                <Plus size={15} />
                <span>Create Design in Studio</span>
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* --- Grid View Cards --- */
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesigns.map((d) => {
              const baseHex = getCardHex(d);
              const zariHex = getZariHex(d);
              const isGeneratingThis = generatingImageId === (d._id || d.id);

              return (
                <div
                  key={d._id || d.id || Math.random()}
                  onClick={() => setSelectedDesignModal(d)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D09229] hover:shadow-[0_12px_32px_rgba(74,21,37,0.08)] cursor-pointer"
                >
                  {/* Card Header Media (AI Image or Simulated Visual Saree Swatch) */}
                  <div className="relative h-48 overflow-hidden border-b border-[#eadfd2] bg-[#1a1412]">
                    {d.imageUrl ? (
                      /* High-Resolution AI Generated Photorealistic Image */
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
                      /* Interactive 2D Saree Swatch Simulation */
                      <div className="relative h-full w-full" style={{ backgroundColor: baseHex }}>
                        {/* Structure mesh simulation */}
                        <div
                          className="absolute inset-0 opacity-80"
                          style={{
                            backgroundImage:
                              d.bodyPattern === "Checks / Grids"
                                ? `linear-gradient(${zariHex}22 1px, transparent 1px), linear-gradient(90deg, ${zariHex}22 1px, transparent 1px)`
                                : d.bodyPattern === "Stripes / Lines"
                                ? `repeating-linear-gradient(90deg, transparent, transparent 12px, ${zariHex}25 12px, ${zariHex}25 14px)`
                                : `radial-gradient(${zariHex}33 1.5px, transparent 1.5px)`,
                            backgroundSize:
                              d.bodyPattern === "Checks / Grids"
                                ? "18px 18px"
                                : d.bodyPattern === "Stripes / Lines"
                                ? "14px 14px"
                                : "20px 20px"
                          }}
                        />

                        {/* Top Selvedge */}
                        <div
                          className="absolute top-0 left-0 right-0 h-2"
                          style={{ backgroundColor: zariHex, opacity: 0.8 }}
                        />

                        {/* Left Pallu Band preview */}
                        <div
                          className="absolute bottom-0 top-0 right-0 w-24 border-l-2 shadow-lg"
                          style={{
                            backgroundColor:
                              d.palluColor === "Contrast Color" || d.palluColor === "Gold"
                                ? d.customPalluHex || "#D4AF37"
                                : baseHex,
                            borderColor: zariHex
                          }}
                        >
                          <div
                            className="flex h-full flex-col justify-between p-2 text-[9px] font-bold uppercase tracking-wider text-white"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                          >
                            <span className="rounded bg-black/40 px-1 py-0.5 text-center text-[8px]">Pallu</span>
                            <div className="text-center font-serif text-[10px] leading-tight">
                              {d.palluDesign || "Peacock"}
                            </div>
                            <span className="text-center text-[8px] opacity-80">{d.zari || "Gold"} Zari</span>
                          </div>
                        </div>

                        {/* Bottom Saree Border simulation */}
                        <div
                          className="absolute bottom-0 left-0 right-24 border-t-2"
                          style={{
                            backgroundColor: zariHex,
                            borderColor: "#ffffff40",
                            height:
                              d.borderWidth === "Extra Large"
                                ? "36px"
                                : d.borderWidth === "Large"
                                ? "28px"
                                : d.borderWidth === "Small"
                                ? "14px"
                                : "22px"
                          }}
                        >
                          <div className="flex h-full items-center justify-start px-2">
                            <span className="font-serif text-[10px] font-bold tracking-wider text-[#3d2c0e]">
                              ✦ {d.borderStyle || "Temple Border"}
                            </span>
                          </div>
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

                    {/* Action Overlays */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedDesignModal(d)}
                        className="flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#4A1525] shadow-md backdrop-blur-xs transition hover:bg-white active:scale-95"
                      >
                        <Eye size={13} />
                        <span>Inspect Spec</span>
                      </button>

                      {!d.imageUrl && (
                        <button
                          type="button"
                          onClick={(e) => handleGenerateImageForDesign(d, e)}
                          disabled={isGeneratingThis}
                          className="flex items-center gap-1 rounded-lg bg-[#D09229] px-2.5 py-1 text-[11px] font-bold text-[#3d2c0e] shadow-md transition hover:bg-amber-400 active:scale-95 disabled:opacity-60"
                          title="Generate AI photo for this design"
                        >
                          <Sparkles size={12} className={isGeneratingThis ? "animate-spin" : ""} />
                          <span>{isGeneratingThis ? "Generating..." : "Generate AI"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Title and ID */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#4A1525] group-hover:text-[#7A263B] transition">
                          {d.title || "Custom Handloom Saree"}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-[#9B8068]">
                          Crafted: {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md border border-[#E8DFC8] bg-[#FAF8F4] px-2 py-0.5 text-[10px] font-bold text-[#7A6D61]">
                        {d.designStyle || "Traditional"}
                      </span>
                    </div>

                    {/* Technical Blueprint Key-Values */}
                    <div className="mt-3.5 space-y-1.5 rounded-xl border border-[#F0E8DC] bg-[#FAF8F4] p-3 text-xs">
                      <div className="flex items-center justify-between text-[#7A6D61]">
                        <span>Base Palette:</span>
                        <span className="flex items-center gap-1.5 font-semibold text-[#292421]">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-black/20"
                            style={{ backgroundColor: baseHex }}
                          />
                          {d.baseColor}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A6D61]">
                        <span>Border & Width:</span>
                        <span className="font-semibold text-[#292421]">
                          {d.borderWidth} • {d.borderStyle}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A6D61]">
                        <span>Zari Type:</span>
                        <span className="flex items-center gap-1 font-semibold text-[#292421]">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: zariHex }}
                          />
                          {d.zari} Zari
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A6D61]">
                        <span>Body Pattern:</span>
                        <span className="font-semibold text-[#292421]">{d.bodyPattern || "Plain"}</span>
                      </div>
                    </div>

                    {/* Motifs Chips */}
                    {d.motifs && d.motifs.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Motifs</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {d.motifs.map((m, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-[#EAE2D5] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4A1525]"
                            >
                              ✦ {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Footer */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#F0E8DC] pt-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/manufacturer/create-design", { state: { design: d } });
                          }}
                          className="flex items-center gap-1 rounded-lg border border-[#E0D3C1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#4A1525] transition hover:bg-[#FAF3E8] hover:border-[#D09229] active:scale-95"
                          title="Open and edit in Saree Studio"
                        >
                          <Edit3 size={13} className="text-[#D09229]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleGenerateImageForDesign(d, e)}
                          disabled={isGeneratingThis}
                          className="rounded-lg border border-[#E0D3C1] bg-white p-1.5 text-[#D09229] transition hover:bg-[#FAF3E8] hover:border-[#D09229]"
                          title="Generate/Re-generate FLUX AI Image"
                        >
                          <Sparkles size={14} className={isGeneratingThis ? "animate-spin" : ""} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSpec(d);
                          }}
                          className="rounded-lg border border-[#E0D3C1] bg-white p-1.5 text-[#7A6D61] transition hover:bg-[#FAF6F0] hover:text-[#4A1525]"
                          title="Download Spec JSON"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintSpec(d);
                          }}
                          className="rounded-lg border border-[#E0D3C1] bg-white p-1.5 text-[#7A6D61] transition hover:bg-[#FAF6F0] hover:text-[#4A1525]"
                          title="Print Spec Sheet"
                        >
                          <Printer size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDesign(d._id || d.id, e)}
                          className="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                          title="Delete Design"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedDesignModal(d)}
                          className="flex items-center gap-1 rounded-lg bg-[#4A1525] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#6A1F35] active:scale-95 shadow-xs"
                        >
                          <span>View</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- Technical Table View --- */
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#292421]">
                <thead className="border-b border-[#eadfd2] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  <tr>
                    <th className="px-5 py-3.5">Design Title</th>
                    <th className="px-4 py-3.5">Fabric & Style</th>
                    <th className="px-4 py-3.5">Base Color</th>
                    <th className="px-4 py-3.5">Border Specification</th>
                    <th className="px-4 py-3.5">Zari Grade</th>
                    <th className="px-4 py-3.5">Pallu Motif</th>
                    <th className="px-4 py-3.5">Occasion</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {filteredDesigns.map((d) => (
                    <tr
                      key={d._id || d.id || Math.random()}
                      className="transition hover:bg-[#FFFDF9]"
                    >
                      <td className="px-5 py-4 font-serif font-bold text-[#4A1525]">
                        <div className="flex items-center gap-2">
                          {d.imageUrl && (
                            <img
                              src={d.imageUrl}
                              alt={d.title}
                              className="h-8 w-8 rounded-lg object-cover border border-[#E0D3C1]"
                            />
                          )}
                          <span>{d.title || "Custom Saree"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded bg-[#FAF3E8] px-2 py-0.5 font-bold text-[#4A1525]">
                          {d.fabric}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-black/20"
                            style={{ backgroundColor: getCardHex(d) }}
                          />
                          {d.baseColor}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#7A6D61]">
                        {d.borderWidth} • {d.borderStyle}
                      </td>
                      <td className="px-4 py-4 font-medium text-[#292421]">
                        {d.zari} Zari
                      </td>
                      <td className="px-4 py-4 text-[#7A6D61]">
                        {d.palluDesign} ({d.palluColor})
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                          {d.occasion}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDesignModal(d)}
                            className="rounded-md border border-[#E0D3C1] p-1.5 text-[#4A1525] hover:bg-[#FAF3E8]"
                            title="View Full Spec"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate("/manufacturer/create-design", { state: { design: d } })}
                            className="rounded-md border border-[#E0D3C1] p-1.5 text-[#D09229] hover:bg-[#FAF3E8]"
                            title="Edit in Studio"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDesign(d._id || d.id, e)}
                            className="rounded-md border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    Master Blueprint Technical Spec
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
                {/* Visual Swatch / AI Image Strip */}
                {selectedDesignModal.imageUrl ? (
                  <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-[#E0D3C1] shadow-inner bg-[#1a1412]">
                    <img
                      src={selectedDesignModal.imageUrl}
                      alt={selectedDesignModal.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4">
                      <div className="flex justify-between items-start">
                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs">
                          ✨ FLUX AI Photorealistic Generation
                        </span>
                        <button
                          type="button"
                          onClick={() => window.open(selectedDesignModal.imageUrl, "_blank")}
                          className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white hover:text-amber-300"
                        >
                          View Full Res ↗
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-white">
                          {selectedDesignModal.fabric} • {selectedDesignModal.zari} Zari
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleGenerateImageForDesign(selectedDesignModal, e)}
                          disabled={generatingImageId === (selectedDesignModal._id || selectedDesignModal.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#D09229] px-3 py-1.5 text-xs font-bold text-[#3d2c0e] hover:bg-amber-400 active:scale-95 disabled:opacity-50 shadow-md"
                        >
                          <Sparkles size={13} className={generatingImageId === (selectedDesignModal._id || selectedDesignModal.id) ? "animate-spin" : ""} />
                          <span>{generatingImageId === (selectedDesignModal._id || selectedDesignModal.id) ? "Generating..." : "Re-generate Image"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative h-36 w-full overflow-hidden rounded-2xl border border-[#E0D3C1] shadow-inner"
                    style={{ backgroundColor: getCardHex(selectedDesignModal) }}
                  >
                    <div
                      className="absolute top-0 bottom-0 right-0 w-36 border-l-2 shadow-md flex flex-col justify-center items-center text-white"
                      style={{
                        backgroundColor:
                          selectedDesignModal.palluColor === "Contrast Color" || selectedDesignModal.palluColor === "Gold"
                            ? selectedDesignModal.customPalluHex || "#D4AF37"
                            : getCardHex(selectedDesignModal),
                        borderColor: getZariHex(selectedDesignModal)
                      }}
                    >
                      <span className="font-serif text-xs font-bold">{selectedDesignModal.palluDesign} Pallu</span>
                      <span className="text-[10px] opacity-80">{selectedDesignModal.zari} Zari</span>
                    </div>

                    <div
                      className="absolute bottom-0 left-0 right-36 border-t-2 flex items-center justify-between px-4"
                      style={{
                        backgroundColor: getZariHex(selectedDesignModal),
                        borderColor: "#ffffff30",
                        height: selectedDesignModal.borderWidth === "Extra Large" ? "36px" : "28px"
                      }}
                    >
                      <span className="font-serif text-xs font-bold text-[#3d2c0e]">
                        ✦ {selectedDesignModal.borderWidth} {selectedDesignModal.borderStyle}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleGenerateImageForDesign(selectedDesignModal, e)}
                        disabled={generatingImageId === (selectedDesignModal._id || selectedDesignModal.id)}
                        className="flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-200 hover:bg-black"
                      >
                        <Sparkles size={11} />
                        <span>Generate AI Image</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Fabric Structure</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.fabric}</p>
                    <p className="text-[10px] text-[#7A6D61]">Weight: Heavy / Rich Sheen</p>
                  </div>

                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Base Tone</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.baseColor}</p>
                    <p className="text-[10px] text-[#7A6D61]">{selectedDesignModal.customBaseHex || "Standard Hex"}</p>
                  </div>

                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Zari Composition</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.zari} Zari</p>
                    <p className="text-[10px] text-[#7A6D61]">Metallic Warp/Weft</p>
                  </div>

                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Border Architecture</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.borderStyle}</p>
                    <p className="text-[10px] text-[#7A6D61]">Scale: {selectedDesignModal.borderWidth}</p>
                  </div>

                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Pallu Styling</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.palluDesign}</p>
                    <p className="text-[10px] text-[#7A6D61]">{selectedDesignModal.palluColor} palette</p>
                  </div>

                  <div className="rounded-xl border border-[#EFE7DC] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Occasion & Category</p>
                    <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">{selectedDesignModal.occasion}</p>
                    <p className="text-[10px] text-[#7A6D61]">{selectedDesignModal.designStyle || "Traditional"}</p>
                  </div>
                </div>

                {/* Motifs Section */}
                <div className="rounded-xl border border-[#EFE7DC] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Selected Motifs & Buttas</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(selectedDesignModal.motifs || []).map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-[#E0D3C1] bg-[#FAF8F4] px-2.5 py-1 text-xs font-semibold text-[#4A1525]"
                      >
                        ✦ {m}
                      </span>
                    ))}
                    {selectedDesignModal.customMotifText && (
                      <span className="rounded-lg border border-[#D09229]/40 bg-[#FAF3E8] px-2.5 py-1 text-xs font-semibold text-[#8C5D0E]">
                        Note: {selectedDesignModal.customMotifText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Weaving Instructions */}
                <div className="rounded-xl border border-[#EFE7DC] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Master Weaver Notes</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#292421]">
                    {selectedDesignModal.additionalInstructions || "No additional instructions recorded."}
                  </p>
                </div>

                {/* AI Generation Prompt */}
                {selectedDesignModal.compiledPrompt && (
                  <div className="rounded-xl border border-[#E8DFC8] bg-[#FAF8F4] p-4">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4A1525]">
                        <Sparkles size={14} className="text-[#D09229]" />
                        <span>AI Visualizer & Rendering Prompt</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleGenerateImageForDesign(selectedDesignModal, e)}
                          disabled={generatingImageId === (selectedDesignModal._id || selectedDesignModal.id)}
                          className="flex items-center gap-1 rounded-md bg-[#D09229] px-2.5 py-1 text-xs font-bold text-[#3d2c0e] hover:bg-amber-400"
                        >
                          <Sparkles size={12} className={generatingImageId === (selectedDesignModal._id || selectedDesignModal.id) ? "animate-spin" : ""} />
                          <span>Generate AI Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(selectedDesignModal.compiledPrompt)}
                          className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#4A1525] border border-[#E0D3C1] hover:bg-[#FAF3E8]"
                        >
                          {copySuccess ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span>{copySuccess ? "Copied!" : "Copy Prompt"}</span>
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs italic leading-relaxed text-[#7A6D61] bg-white p-3 rounded-lg border border-[#EFE7DC]">
                      "{selectedDesignModal.compiledPrompt}"
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between border-t border-[#eadfd2] bg-[#FAF6F0] px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrintSpec(selectedDesignModal)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white px-3.5 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#F8F5EF]"
                  >
                    <Printer size={14} />
                    <span>Print Spec</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSpec(selectedDesignModal)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white px-3.5 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#F8F5EF]"
                  >
                    <Download size={14} />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
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
                      navigate("/manufacturer/create-design", { state: { design: d } });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white hover:bg-[#6A1F35] shadow-xs"
                  >
                    <Edit3 size={14} />
                    <span>Open in Studio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <RAG />
    </div>
  );
}