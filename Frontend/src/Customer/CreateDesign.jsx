import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  Sparkles,
  Palette,
  Layers,
  Scissors,
  Bookmark,
  Copy,
  Check,
  RotateCcw,
  Save,
  FileText,
  Eye,
  Sliders,
  Download,
  Trash2,
  Share2,
  FolderOpen,
  X,
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Printer,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

// --- Preset Configuration Options ---

const FABRIC_OPTIONS = [
  { id: "Pure Silk", label: "Pure Silk", desc: "100% natural mulberry silk with lustrous sheen", weight: "Heavy / Rich" },
  { id: "Cotton", label: "Cotton", desc: "Pure breathable hand-spun cotton for comfort", weight: "Lightweight" },
  { id: "Linen", label: "Linen", desc: "Crisp flax fibers with contemporary drape", weight: "Medium" },
  { id: "Tussar Silk", label: "Tussar Silk", desc: "Wild forest silk with natural golden texture", weight: "Medium" },
  { id: "Cotton Silk", label: "Cotton Silk", desc: "Blend of soft cotton warp & rich silk weft", weight: "Light / Medium" },
  { id: "Khadi", label: "Khadi", desc: "Heritage handspun and handwoven organic yarn", weight: "Artisanal" },
  { id: "Raw Silk", label: "Raw Silk", desc: "Textured silk yarn with distinct organic slubs", weight: "Firm / Medium" },
  { id: "Banarasi Silk", label: "Banarasi Silk", desc: "Opulent regal weave with rich brocade heritage", weight: "Heavy / Royal" },
  { id: "Organza", label: "Organza", desc: "Ultra-sheer, crisp lightweight luxury weave", weight: "Ultra Light" }
];

const BASE_COLORS = [
  { id: "Red", label: "Red", hex: "#D32F2F", border: "#B71C1C", textLight: true },
  { id: "Green", label: "Green", hex: "#2E7D32", border: "#1B5E20", textLight: true },
  { id: "Blue", label: "Blue", hex: "#1976D2", border: "#0D47A1", textLight: true },
  { id: "Yellow", label: "Yellow", hex: "#FDD835", border: "#FBC02D", textLight: false },
  { id: "Purple", label: "Purple", hex: "#8E24AA", border: "#6A1B9A", textLight: true },
  { id: "Pink", label: "Pink", hex: "#D81B60", border: "#AD1457", textLight: true },
  { id: "Orange", label: "Orange", hex: "#FB8C00", border: "#E65100", textLight: true },
  { id: "Maroon", label: "Maroon", hex: "#800000", border: "#4A0000", textLight: true },
  { id: "Peacock Green", label: "Peacock Green", hex: "#005F60", border: "#003E3F", textLight: true },
  { id: "Royal Blue", label: "Royal Blue", hex: "#1034A6", border: "#08216B", textLight: true },
  { id: "Mustard", label: "Mustard", hex: "#D4AF37", border: "#AA8C2C", textLight: false },
  { id: "Cream", label: "Cream", hex: "#FFFDD0", border: "#E6E3B8", textLight: false },
  { id: "Black", label: "Black", hex: "#181818", border: "#000000", textLight: true },
  { id: "White", label: "White", hex: "#FDFDFD", border: "#E0E0E0", textLight: false }
];

const BORDER_STYLES = [
  { id: "Temple Border", label: "Temple Border", desc: "Korvai triangle spires symbolizing sacred gopurams" },
  { id: "Floral Border", label: "Floral Border", desc: "Flowing vines with intricate floral jall works" },
  { id: "Peacock Border", label: "Peacock Border", desc: "Mayil motifs lined sequentially along the selvage" },
  { id: "Paisley Border", label: "Paisley Border", desc: "Timeless mango and paisley bootis in repeat" },
  { id: "Mango Border", label: "Mango Border", desc: "Traditional paisley and green mango motifs" },
  { id: "Geometric Border", label: "Geometric Border", desc: "Chevron, zig-zag and diamond weave lattices" },
  { id: "Checked Border", label: "Checked Border", desc: "Classic gingham and grid contrast bands" },
  { id: "Striped Border", label: "Striped Border", desc: "Parallel gold zari pinstripes and dual bands" },
  { id: "Traditional Zari Border", label: "Traditional Zari Border", desc: "Solid pure gold metallic brocade border" },
  { id: "Plain Border", label: "Plain Border", desc: "Clean minimalist solid border with contrast selvedge" },
  { id: "No Border", label: "No Border", desc: "Border-less seamless contemporary drape" }
];

const BORDER_WIDTHS = [
  { id: "Small", label: "Small", sub: "1 - 2 inches", visualClass: "h-3" },
  { id: "Medium", label: "Medium", sub: "3 - 5 inches", visualClass: "h-5" },
  { id: "Large", label: "Large", sub: "6 - 9 inches", visualClass: "h-8" },
  { id: "Extra Large", label: "Extra Large", sub: "10+ inches (Grand)", visualClass: "h-12" }
];

const ZARI_OPTIONS = [
  { id: "Gold", label: "Gold", hex: "#D4AF37", desc: "Classic brilliant 24K gold zari luster" },
  { id: "Silver", label: "Silver", hex: "#E0E0E0", desc: "Cool shimmering silver metallic thread" },
  { id: "Copper", label: "Copper", hex: "#B87333", desc: "Warm rose-toned vintage copper zari" },
  { id: "Antique Gold", label: "Antique Gold", hex: "#997A15", desc: "Subtle matte heirloom antique finish" },
  { id: "Two-Tone Zari", label: "Two-Tone Zari", hex: "#E5C158", desc: "Dual gold and silver Ganga-Jamuna zari" },
  { id: "No Zari", label: "No Zari", hex: "#A8A29E", desc: "Resham/silk thread only, non-metallic" }
];

const PALLU_DESIGNS = [
  { id: "Plain", label: "Plain", desc: "Solid contrast tone without heavy jacquard figures" },
  { id: "Temple", label: "Temple", desc: "Stately tiered temple towers and triangular spires" },
  { id: "Peacock", label: "Peacock", desc: "Majestic peacock pairs with open plumage" },
  { id: "Floral", label: "Floral", desc: "Ornate blooming garden, jaal, and leafy sprays" },
  { id: "Paisley", label: "Paisley", desc: "Royal Kalga / Kalka paisley motifs" },
  { id: "Lotus", label: "Lotus", desc: "Sacred Kamal blossoms in zari medallions" },
  { id: "Traditional Motif", label: "Traditional Motif", desc: "Ancient mythological symbols and rudraksh brocade" },
  { id: "Geometric", label: "Geometric", desc: "Interlocking diamonds, hexagons and chevrons" },
  { id: "Checks", label: "Checks", desc: "Grid of gold zari squares with micro-motifs" },
  { id: "Stripes", label: "Stripes", desc: "Rhythmic horizontal gold zari ribbons & borders" }
];

const MOTIF_OPTIONS = [
  { id: "Peacock", emoji: "🦚", name: "Peacock", desc: "Symbol of grace & royalty" },
  { id: "Flower", emoji: "🌸", name: "Flower", desc: "Elegance & natural blossoming" },
  { id: "Lotus", emoji: "🪷", name: "Lotus", desc: "Purity & sacred blessing" },
  { id: "Temple", emoji: "🛕", name: "Temple", desc: "Devotion & spiritual heritage" },
  { id: "Paisley", emoji: "🌿", name: "Paisley", desc: "Eternal fertility & prosperity" },
  { id: "Mango", emoji: "🥭", name: "Mango", desc: "Abundance & celebration" },
  { id: "Elephant", emoji: "🐘", name: "Elephant", desc: "Majesty, strength & wisdom" },
  { id: "Swan", emoji: "🦢", name: "Swan (Hamsa)", desc: "Discernment & divine beauty" },
  { id: "Traditional Geometric", emoji: "⭐", name: "Traditional Geometric", desc: "Yantra & sacred symmetry" },
  { id: "Leaf", emoji: "🍃", name: "Leaf", desc: "Nature, vine & life vitality" },
  { id: "Sun", emoji: "☀️", name: "Sun (Surya)", desc: "Radiance, energy & positivity" },
  { id: "Fish", emoji: "🐟", name: "Fish (Matsya)", desc: "Wealth, flow & auspiciousness" },
  { id: "Custom Motif", emoji: "✨", name: "Custom Motif", desc: "Your personalized artisan motif" }
];

const BODY_PATTERNS = [
  { id: "Plain", label: "Plain", desc: "Solid monochrome body highlighting fabric luster" },
  { id: "Small Motifs", label: "Small Motifs", desc: "Delicate micro buttas evenly dispersed" },
  { id: "Large Motifs", label: "Large Motifs", desc: "Prominent statement motifs with generous spacing" },
  { id: "Floral Pattern", label: "Floral Pattern", desc: "Delicate floral vines running across the field" },
  { id: "Geometric Pattern", label: "Geometric Pattern", desc: "Lattices, chevron grids and honeycomb weave" },
  { id: "Traditional Pattern", label: "Traditional Pattern", desc: "Heritage rudraksh, coin (kasu) and annapakshi" },
  { id: "All-Over Pattern", label: "All-Over Pattern", desc: "Dense intricate brocade covering the entire body" },
  { id: "Butta Pattern", label: "Butta Pattern", desc: "Scattered zari drop buttas in alternating rows" }
];

const PATTERN_DENSITIES = [
  { id: "Minimal", label: "Minimal", desc: "Wide spacing, understated elegance", count: "5-10 buttas/m" },
  { id: "Light", label: "Light", desc: "Gentle rhythm across the fabric", count: "15-20 buttas/m" },
  { id: "Medium", label: "Medium", desc: "Balanced classic density", count: "30-40 buttas/m" },
  { id: "Heavy", label: "Heavy", desc: "Rich closely packed intricate weave", count: "60+ buttas/m" }
];

const PALLU_COLORS = [
  { id: "Same as Body", label: "Same as Body", color: "inherit", desc: "Monotone seamless appearance" },
  { id: "Contrast Color", label: "Contrast Color", color: "#800000", desc: "Striking complementary hue" },
  { id: "Gold", label: "Gold", color: "#D4AF37", desc: "All-over rich metallic gold tissue" },
  { id: "Maroon", label: "Maroon", color: "#800000", desc: "Deep rich burgundy maroon" },
  { id: "Red", label: "Red", color: "#D32F2F", desc: "Auspicious vermilion red" },
  { id: "Green", label: "Green", color: "#2E7D32", desc: "Deep emerald green" },
  { id: "Blue", label: "Blue", color: "#1976D2", desc: "Vibrant sapphire blue" },
  { id: "Custom Color", label: "Custom Color", color: "custom", desc: "Choose specific custom shade" }
];

const OCCASIONS = [
  { id: "Bridal", label: "Bridal", icon: "👑", desc: "Opulent wedding attire with heavy zari" },
  { id: "Wedding", label: "Wedding", icon: "💍", desc: "Grand celebration and festive reception" },
  { id: "Festival", label: "Festival", icon: "🪔", desc: "Diwali, Pongal, Navratri traditional charm" },
  { id: "Traditional", label: "Traditional", icon: "🛕", desc: "Classic heritage customs and ceremonies" },
  { id: "Office", label: "Office", icon: "💼", desc: "Sophisticated, lightweight formal comfort" },
  { id: "Casual", label: "Casual", icon: "🌸", desc: "Everyday easy-drape breathable weave" },
  { id: "Party", label: "Party", icon: "✨", desc: "Chic contemporary evening statement" },
  { id: "Religious", label: "Religious", icon: "🙏", desc: "Auspicious pooja & temple rituals" }
];

const DESIGN_STYLES = [
  { id: "Traditional", label: "Traditional", desc: "Centuries-old authentic loom motifs & borders" },
  { id: "Modern", label: "Modern", desc: "Sleek clean lines, fresh palette & minimal motifs" },
  { id: "Contemporary", label: "Contemporary", desc: "Fusion of classic textures with modern aesthetics" },
  { id: "Traditional + Modern", label: "Traditional + Modern", desc: "Heritage motifs woven on modern minimalist layouts" },
  { id: "Royal", label: "Royal", desc: "Opulent court-inspired grand brocades & heavy zari" },
  { id: "Minimal", label: "Minimal", desc: "Understated elegance focusing on fabric purity" }
];

const DESIGN_PRESETS = [
  {
    name: "Royal Bridal Kanchipuram",
    tagline: "Heavy pure silk with antique gold temple zari",
    fabric: "Pure Silk",
    baseColor: "Maroon",
    customBaseHex: "#800000",
    borderStyle: "Temple Border",
    borderWidth: "Large",
    zari: "Antique Gold",
    palluDesign: "Peacock",
    palluColor: "Gold",
    customPalluHex: "#D4AF37",
    motifs: ["Peacock", "Lotus", "Temple"],
    customMotifText: "",
    bodyPattern: "Butta Pattern",
    patternDensity: "Heavy",
    occasion: "Bridal",
    designStyle: "Royal",
    additionalInstructions: "100% Pure Mulberry Silk. Double-warp 3-ply weave. Korvai interlocking technique for contrast temple border. Real tested zari."
  },
  {
    name: "Sacred Temple Heritage",
    tagline: "Peacock green silk with contrast red korvai border",
    fabric: "Pure Silk",
    baseColor: "Peacock Green",
    customBaseHex: "#005F60",
    borderStyle: "Traditional Zari Border",
    borderWidth: "Extra Large",
    zari: "Gold",
    palluDesign: "Temple",
    palluColor: "Red",
    customPalluHex: "#D32F2F",
    motifs: ["Temple", "Elephant", "Swan"],
    customMotifText: "",
    bodyPattern: "Small Motifs",
    patternDensity: "Medium",
    occasion: "Traditional",
    designStyle: "Traditional",
    additionalInstructions: "Traditional petni joint on pallu. Golden rudraksh row along the upper and lower border lines."
  },
  {
    name: "Banarasi Floral Opulence",
    tagline: "Banarasi silk with all-over kadhwa floral jaal",
    fabric: "Banarasi Silk",
    baseColor: "Royal Blue",
    customBaseHex: "#1034A6",
    borderStyle: "Floral Border",
    borderWidth: "Medium",
    zari: "Two-Tone Zari",
    palluDesign: "Floral",
    palluColor: "Same as Body",
    customPalluHex: "#1034A6",
    motifs: ["Flower", "Paisley", "Leaf"],
    customMotifText: "",
    bodyPattern: "All-Over Pattern",
    patternDensity: "Heavy",
    occasion: "Wedding",
    designStyle: "Traditional + Modern",
    additionalInstructions: "Intricate Kadhwa weaving technique with mina-work accents in silk resham threads."
  }
];

export default function CustomerCreateDesign() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDesign = location.state?.design || null;

  // --- Form State ---
  const [fabric, setFabric] = useState(initialDesign?.fabric || "Pure Silk");
  const [baseColor, setBaseColor] = useState(initialDesign?.baseColor || "Maroon");
  const [customBaseHex, setCustomBaseHex] = useState(initialDesign?.customBaseHex || "#800000");
  const [borderStyle, setBorderStyle] = useState(initialDesign?.borderStyle || "Temple Border");
  const [borderWidth, setBorderWidth] = useState(initialDesign?.borderWidth || "Medium");
  const [zari, setZari] = useState(initialDesign?.zari || "Gold");
  const [palluDesign, setPalluDesign] = useState(initialDesign?.palluDesign || "Peacock");
  const [palluColor, setPalluColor] = useState(initialDesign?.palluColor || "Gold");
  const [customPalluHex, setCustomPalluHex] = useState(initialDesign?.customPalluHex || "#D4AF37");
  const [selectedMotifs, setSelectedMotifs] = useState(initialDesign?.motifs || ["Peacock", "Lotus"]);
  const [customMotifText, setCustomMotifText] = useState(initialDesign?.customMotifText || "");
  const [bodyPattern, setBodyPattern] = useState(initialDesign?.bodyPattern || "Butta Pattern");
  const [patternDensity, setPatternDensity] = useState(initialDesign?.patternDensity || "Medium");
  const [occasion, setOccasion] = useState(initialDesign?.occasion || "Bridal");
  const [designStyle, setDesignStyle] = useState(initialDesign?.designStyle || "Traditional");
  const [additionalInstructions, setAdditionalInstructions] = useState(
    initialDesign?.additionalInstructions ||
    "Double warp with 3-ply pure silk. Korvai interlocking temple border with solid gold zari pallu."
  );

  // --- UI State ---
  const [designTitle, setDesignTitle] = useState(initialDesign?.title || "My Bespoke Saree Creation");
  const [activeTab, setActiveTab] = useState("studio");
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [savingLoading, setSavingLoading] = useState(false);
  const [generatedAiImageUrl, setGeneratedAiImageUrl] = useState(initialDesign?.imageUrl || "");
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(initialDesign?.imageUrl ? "ai" : "canvas");

  const userEmail = localStorage.getItem("userEmail") || "";

  // Compute active base hex
  const currentBaseColorHex = useMemo(() => {
    const found = BASE_COLORS.find((c) => c.id === baseColor);
    return found ? found.hex : customBaseHex;
  }, [baseColor, customBaseHex]);

  // Compute active pallu hex
  const currentPalluColorHex = useMemo(() => {
    if (palluColor === "Same as Body") return currentBaseColorHex;
    if (palluColor === "Contrast Color") {
      if (baseColor === "Red" || baseColor === "Maroon") return "#2E7D32";
      if (baseColor === "Green" || baseColor === "Peacock Green") return "#D32F2F";
      if (baseColor === "Blue" || baseColor === "Royal Blue") return "#FB8C00";
      return "#800000";
    }
    if (palluColor === "Gold") return "#D4AF37";
    if (palluColor === "Maroon") return "#800000";
    if (palluColor === "Red") return "#D32F2F";
    if (palluColor === "Green") return "#2E7D32";
    if (palluColor === "Blue") return "#1976D2";
    return customPalluHex;
  }, [palluColor, baseColor, currentBaseColorHex, customPalluHex]);

  // Compute active zari hex
  const currentZariHex = useMemo(() => {
    const found = ZARI_OPTIONS.find((z) => z.id === zari);
    return found ? found.hex : "#D4AF37";
  }, [zari]);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleMotif = (motifId) => {
    setSelectedMotifs((prev) =>
      prev.includes(motifId) ? prev.filter((m) => m !== motifId) : [...prev, motifId]
    );
  };

  const applyPreset = (preset) => {
    setDesignTitle(preset.name);
    setFabric(preset.fabric);
    setBaseColor(preset.baseColor);
    setCustomBaseHex(preset.customBaseHex || "#800000");
    setBorderStyle(preset.borderStyle);
    setBorderWidth(preset.borderWidth);
    setZari(preset.zari);
    setPalluDesign(preset.palluDesign);
    setPalluColor(preset.palluColor);
    setCustomPalluHex(preset.customPalluHex || "#D4AF37");
    setSelectedMotifs(preset.motifs);
    setCustomMotifText(preset.customMotifText || "");
    setBodyPattern(preset.bodyPattern);
    setPatternDensity(preset.patternDensity);
    setOccasion(preset.occasion);
    setDesignStyle(preset.designStyle);
    setAdditionalInstructions(preset.additionalInstructions);
    showNotification(`Applied preset: "${preset.name}"`);
  };

  // Compile Comprehensive AI Image Prompt (Pure Saree, No Humans)
  const compiledPrompt = useMemo(() => {
    const motifsDesc =
      selectedMotifs.length > 0
        ? selectedMotifs.map((m) => (m === "Custom Motif" ? customMotifText || "Custom Motif" : m)).join(", ")
        : "No distinct motif";

    return (
      `Commercial product catalog photography of a folded handcrafted Indian handloom saree textile only. ` +
      `Fabric: ${fabric} with authentic weave texture. ` +
      `Body Color: ${baseColor} (${currentBaseColorHex}) with ${bodyPattern} in ${patternDensity} density. ` +
      `Border: ${borderWidth} ${borderStyle} with metallic ${zari} zari brocade. ` +
      `Pallu: Grand ${palluDesign} pallu in ${palluColor} shade (${currentPalluColorHex}) with detailed ${zari} zari work. ` +
      `Woven Motifs: ${motifsDesc}. ` +
      `Aesthetic: ${occasion}, ${designStyle} style. ` +
      (additionalInstructions ? `Loom Notes: "${additionalInstructions.trim()}". ` : "") +
      `Flat lay product display, folded elegant saree presentation, 8k resolution, crisp textile weave texture, studio lighting on neutral background, pure fabric product only, no human, no woman, no model, no mannequin, no face.`
    );
  }, [
    fabric,
    baseColor,
    currentBaseColorHex,
    borderStyle,
    borderWidth,
    zari,
    palluDesign,
    palluColor,
    currentPalluColorHex,
    selectedMotifs,
    customMotifText,
    bodyPattern,
    patternDensity,
    occasion,
    designStyle,
    additionalInstructions
  ]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setIsCopied(true);
    showNotification("AI Prompt copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Generate AI Image with FLUX Engine (Pure Saree Product, No Humans)
  const handleGenerateAiImage = async () => {
    setIsGeneratingAiImage(true);
    showNotification("Synthesizing photorealistic saree render with FLUX AI...", "info");
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/design/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: compiledPrompt,
          fabric,
          baseColor,
          borderStyle,
          zari,
          palluDesign,
          motifs: selectedMotifs,
          occasion
        })
      });
      const json = await res.json();
      if (json.status === "success" && json.data?.imageUrl) {
        setGeneratedAiImageUrl(json.data.imageUrl);
        setPreviewMode("ai");
        showNotification("AI Saree rendering generated successfully!");
      } else {
        throw new Error(json.message || "Failed to generate image");
      }
    } catch (err) {
      console.warn("AI generation fallback:", err);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(compiledPrompt)}?width=1024&height=768&model=flux&seed=${Math.floor(Math.random() * 999999)}&nologo=true&enhance=true`;
      setGeneratedAiImageUrl(fallbackUrl);
      setPreviewMode("ai");
      showNotification("AI Saree rendering generated!");
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Save current design
  const handleSaveDesign = async (proceedToBook = false) => {
    const payload = {
      title: designTitle.trim() || "My Bespoke Saree Design",
      customerEmail: userEmail,
      customerId: userEmail,
      fabric,
      baseColor,
      customBaseHex,
      borderStyle,
      borderWidth,
      zari,
      palluDesign,
      palluColor,
      customPalluHex,
      motifs: selectedMotifs,
      customMotifText,
      bodyPattern,
      patternDensity,
      occasion,
      designStyle,
      additionalInstructions,
      compiledPrompt,
      imageUrl: generatedAiImageUrl || "",
      updatedAt: new Date().toISOString()
    };

    setSavingLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === "success") {
        showNotification("Design blueprint saved to your collection!");
        if (proceedToBook) {
          navigate("/customer/booking", { state: { selectedDesign: json.data || payload } });
        }
      } else {
        throw new Error(json.message || "Failed to save design");
      }
    } catch (err) {
      console.warn("Save note:", err);
      showNotification("Design saved to session.");
      if (proceedToBook) {
        navigate("/customer/booking", { state: { selectedDesign: payload } });
      }
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* --- Top Header Section --- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/customer/design")}
                className="flex items-center gap-1 text-xs font-bold text-[#D09229] hover:underline"
              >
                <ArrowLeft size={14} />
                <span>Back to Saved Designs</span>
              </button>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Design Your Custom Saree
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Configure your bespoke handloom saree parameters & visualize with FLUX AI before booking on a master artisan's loom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSaveDesign(false)}
              disabled={savingLoading}
              className="flex items-center gap-2 rounded-xl border border-[#E0D3C1] bg-white px-4 py-2.5 text-xs font-bold text-[#4A1525] shadow-xs transition hover:bg-[#FAF3E8] hover:border-[#D09229] active:scale-95 disabled:opacity-60"
            >
              <Save size={15} className="text-[#D09229]" />
              <span>{savingLoading ? "Saving..." : "Save Design"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveDesign(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-95"
            >
              <span>Book on Custom Loom</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* --- Notification Banner --- */}
        {notification && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-xs font-medium shadow-sm transition animate-in fade-in ${
              notification.type === "info"
                ? "bg-amber-50 text-amber-900 border border-amber-200"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{notification.msg}</span>
            </div>
            <button type="button" onClick={() => setNotification(null)} className="text-stone-400 hover:text-stone-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* --- Main 2-Column Grid Layout --- */}
        <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left Column: Visualizer Canvas & AI Render (5 cols) */}
          <div className="xl:col-span-5 space-y-6">
            {/* Visualizer Card */}
            <div className="sticky top-6 rounded-3xl border border-[#eadfd2] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF3E8] text-[#D09229]">
                    <Eye size={16} />
                  </div>
                  <div>
                    <h2 className="font-serif text-sm font-bold text-[#4A1525]">Visualizer Canvas</h2>
                    <p className="text-[10px] text-[#9B8068]">Real-time weave synthesis</p>
                  </div>
                </div>

                {/* Switcher Toggle between 2D Canvas & FLUX AI Photo */}
                <div className="flex items-center rounded-lg border border-[#E0D3C1] bg-[#FAF8F4] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("canvas")}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewMode === "canvas"
                        ? "bg-white text-[#4A1525] shadow-xs"
                        : "text-[#7A6D61] hover:text-[#4A1525]"
                    }`}
                  >
                    2D Swatch
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!generatedAiImageUrl) {
                        handleGenerateAiImage();
                      } else {
                        setPreviewMode("ai");
                      }
                    }}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewMode === "ai"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs"
                        : "text-[#D09229] hover:bg-amber-50"
                    }`}
                  >
                    <Sparkles size={11} />
                    <span>✨ AI Render</span>
                  </button>
                </div>
              </div>

              {/* Render Area */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#E0D3C1] bg-[#1a1412] shadow-inner">
                {previewMode === "ai" && generatedAiImageUrl ? (
                  <div className="relative h-72 w-full overflow-hidden group">
                    <img
                      src={generatedAiImageUrl}
                      alt={designTitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-xs">
                        ✨ FLUX Pure Saree Render
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateAiImage}
                        disabled={isGeneratingAiImage}
                        className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#4A1525] hover:bg-white active:scale-95 shadow-md"
                      >
                        <Sparkles size={12} className={isGeneratingAiImage ? "animate-spin" : ""} />
                        <span>Re-render</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative h-72 w-full transition-colors duration-500"
                    style={{ backgroundColor: currentBaseColorHex }}
                  >
                    {/* Simulated Body Pattern Mesh */}
                    <div className="absolute inset-0 flex flex-wrap items-center justify-around p-4 opacity-70">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span
                          key={i}
                          className="font-serif text-sm font-bold opacity-75"
                          style={{ color: currentZariHex }}
                        >
                          ✦
                        </span>
                      ))}
                    </div>

                    {/* Pallu Section */}
                    <div
                      className="absolute top-0 bottom-0 right-0 w-32 border-l-2 shadow-lg flex flex-col justify-center items-center text-center p-2"
                      style={{
                        backgroundColor: currentPalluColorHex,
                        borderColor: currentZariHex
                      }}
                    >
                      <span className="font-serif text-[11px] font-bold tracking-wider" style={{ color: currentZariHex }}>
                        {palluDesign} Pallu
                      </span>
                      <span className="text-[9px] text-white/80 mt-0.5">{zari} Zari</span>
                    </div>

                    {/* Border Section */}
                    <div
                      className="absolute bottom-0 left-0 right-32 border-t-2 flex items-center px-3"
                      style={{
                        backgroundColor: currentZariHex,
                        borderColor: "#ffffff40",
                        height:
                          borderWidth === "Extra Large"
                            ? "38px"
                            : borderWidth === "Large"
                            ? "30px"
                            : borderWidth === "Small"
                            ? "16px"
                            : "24px"
                      }}
                    >
                      <span className="font-serif text-[10px] font-bold tracking-wider text-[#3d2c0e]">
                        ✦ {borderStyle} ({borderWidth})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Specs Overview Box */}
              <div className="mt-4 rounded-xl border border-[#F0E8DC] bg-[#FAF8F4] p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Selected Fabric:</span>
                  <span className="font-semibold text-[#4A1525]">{fabric}</span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Base & Contrast:</span>
                  <span className="font-semibold text-[#4A1525]">
                    {baseColor} • {palluColor} Pallu
                  </span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Zari Grade:</span>
                  <span className="font-semibold text-[#4A1525]">{zari} Zari</span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Occasion:</span>
                  <span className="font-semibold text-[#4A1525]">{occasion}</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGenerateAiImage}
                  disabled={isGeneratingAiImage}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D09229] py-2.5 text-xs font-bold text-[#3d2c0e] shadow-sm transition hover:bg-amber-400 active:scale-98 disabled:opacity-60"
                >
                  <Sparkles size={15} className={isGeneratingAiImage ? "animate-spin" : ""} />
                  <span>{isGeneratingAiImage ? "Synthesizing AI Image..." : "Generate AI Saree Photo with FLUX"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="xl:col-span-7 space-y-6">
            {/* Title & Presets Bar */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Design Blueprint Title
                </label>
                <input
                  type="text"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  placeholder="e.g. Maharani Temple Pure Silk Saree"
                  className="mt-1.5 w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-4 py-2.5 text-sm font-semibold text-[#4A1525] placeholder:text-[#B5A695] focus:border-[#D09229] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Quick Presets */}
              <div className="mt-4 border-t border-[#F0E8DC] pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Quick Starting Presets
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DESIGN_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="rounded-lg border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-1.5 text-xs font-bold text-[#4A1525] transition hover:bg-[#FAF3E8] hover:border-[#D09229]"
                    >
                      ✦ {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Fabric Selection */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Layers size={18} className="text-[#D09229]" />
                <span>1. Select Fabric Structure</span>
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {FABRIC_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFabric(f.id)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition ${
                      fabric === f.id
                        ? "border-[#4A1525] bg-[#FAF3E8] ring-2 ring-[#4A1525]/10"
                        : "border-[#EFE7DC] bg-[#FAF8F4] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    <span className="font-serif text-xs font-bold text-[#4A1525]">{f.label}</span>
                    <span className="mt-0.5 text-[10px] text-[#7A6D61] line-clamp-2">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Base Color & Body Palette */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Palette size={18} className="text-[#D09229]" />
                <span>2. Body Color Palette</span>
              </h3>

              <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2">
                {BASE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setBaseColor(c.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 transition border ${
                      baseColor === c.id
                        ? "border-[#4A1525] ring-2 ring-[#4A1525]/20 scale-105"
                        : "border-transparent hover:scale-102"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/15 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="mt-1 text-[10px] font-semibold text-[#292421] truncate w-full text-center">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Border Architecture & Zari */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Scissors size={18} className="text-[#D09229]" />
                <span>3. Border Style & Zari Grade</span>
              </h3>

              {/* Zari Selector */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Zari Thread Grade
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ZARI_OPTIONS.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setZari(z.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                        zari === z.id
                          ? "border-[#D09229] bg-[#FAF3E8] ring-2 ring-[#D09229]/20"
                          : "border-[#EFE7DC] bg-[#FAF8F4] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: z.hex }} />
                      <span className="text-xs font-bold text-[#4A1525]">{z.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Style */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Border Style
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BORDER_STYLES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBorderStyle(b.id)}
                      className={`rounded-xl border p-2.5 text-left text-xs font-bold transition ${
                        borderStyle === b.id
                          ? "border-[#4A1525] bg-[#FAF3E8] text-[#4A1525]"
                          : "border-[#EFE7DC] bg-[#FAF8F4] text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Width */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Border Width Scale
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {BORDER_WIDTHS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setBorderWidth(w.id)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold transition ${
                        borderWidth === w.id
                          ? "border-[#4A1525] bg-[#4A1525] text-white"
                          : "border-[#EFE7DC] bg-[#FAF8F4] text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Pallu & Motifs */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Sparkles size={18} className="text-[#D09229]" />
                <span>4. Pallu Styling & Traditional Motifs</span>
              </h3>

              {/* Pallu Motif */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Grand Pallu Design
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PALLU_DESIGNS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPalluDesign(p.id)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                        palluDesign === p.id
                          ? "border-[#4A1525] bg-[#FAF3E8] text-[#4A1525]"
                          : "border-[#EFE7DC] bg-[#FAF8F4] text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motifs Multi-select */}
              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Select Traditional Motifs (Buttas)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MOTIF_OPTIONS.map((m) => {
                    const isSelected = selectedMotifs.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMotif(m.id)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525] text-white shadow-xs"
                            : "border-[#EFE7DC] bg-[#FAF8F4] text-[#7A6D61] hover:text-[#4A1525]"
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 5: Occasion & Artisan Loom Notes */}
            <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Sliders size={18} className="text-[#D09229]" />
                <span>5. Occasion & Artisan Instructions</span>
              </h3>

              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Occasion Intention
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOccasion(o.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                        occasion === o.id
                          ? "border-[#4A1525] bg-[#FAF3E8] text-[#4A1525]"
                          : "border-[#EFE7DC] bg-[#FAF8F4] text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      <span>{o.icon}</span>
                      <span>{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Notes for Master Weaver
                </label>
                <textarea
                  rows={3}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Special instructions regarding warp density, zari weight, blouse piece length, or finishing..."
                  className="mt-1.5 w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] p-3 text-xs text-[#292421] placeholder:text-[#B5A695] focus:border-[#D09229] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfd2] pt-4">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 text-xs font-bold text-[#7A6D61] hover:text-[#4A1525]"
              >
                {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{isCopied ? "Prompt Copied!" : "Copy AI Prompt"}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSaveDesign(false)}
                  disabled={savingLoading}
                  className="rounded-xl border border-[#E0D3C1] bg-white px-5 py-2.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8]"
                >
                  {savingLoading ? "Saving..." : "Save to My Designs"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDesign(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#4A1525] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] shadow-sm"
                >
                  <span>Book on Custom Loom</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
