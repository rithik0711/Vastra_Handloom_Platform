import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
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
  ArrowLeft
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
  { id: "Custom Motif", emoji: "✨", name: "Custom Motif", desc: "Manufacturer personalized design" }
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

// Curated Design Presets for fast starting points
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
  },
  {
    name: "Minimalist Festive Linen",
    tagline: "Mustard linen with subtle silver striped border",
    fabric: "Linen",
    baseColor: "Mustard",
    customBaseHex: "#D4AF37",
    borderStyle: "Striped Border",
    borderWidth: "Small",
    zari: "Silver",
    palluDesign: "Stripes",
    palluColor: "Contrast Color",
    customPalluHex: "#181818",
    motifs: ["Traditional Geometric"],
    customMotifText: "",
    bodyPattern: "Plain",
    patternDensity: "Minimal",
    occasion: "Festival",
    designStyle: "Minimal",
    additionalInstructions: "Organic 100-count linen yarn. Lightweight breathable summer festive wear with sleek tassel finishing."
  }
];

export default function CreateDesign() {
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
    "Double warp with 3-ply pure silk. Korvai interlocking temple border with solid gold zari pallu. Finishing with handcrafted tasseling."
  );

  // --- UI Aux State ---
  const [designTitle, setDesignTitle] = useState(initialDesign?.title || initialDesign?.name || "Maharani Bridal Kanchipuram Edition");
  const [activeTab, setActiveTab] = useState("studio"); // 'studio' | 'spec' | 'prompt'
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [fullVisualizer, setFullVisualizer] = useState(false);
  const [generatedAiImageUrl, setGeneratedAiImageUrl] = useState(initialDesign?.imageUrl || "");
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(initialDesign?.imageUrl ? "ai" : "canvas"); // 'canvas' | 'ai'

  const userEmail = localStorage.getItem("userEmail") || "kathar_weaves";

  // Compute active base hex color
  const currentBaseColorHex = useMemo(() => {
    const found = BASE_COLORS.find((c) => c.id === baseColor);
    return found ? found.hex : customBaseHex;
  }, [baseColor, customBaseHex]);

  // Compute active pallu hex color
  const currentPalluColorHex = useMemo(() => {
    if (palluColor === "Same as Body") return currentBaseColorHex;
    if (palluColor === "Contrast Color") {
      // Return complementary or high contrast
      if (baseColor === "Red" || baseColor === "Maroon") return "#2E7D32";
      if (baseColor === "Green" || baseColor === "Peacock Green") return "#D32F2F";
      if (baseColor === "Blue" || baseColor === "Royal Blue") return "#FB8C00";
      if (baseColor === "Yellow" || baseColor === "Mustard") return "#8E24AA";
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

  // Load Saved Designs from API or LocalStorage on mount
  useEffect(() => {
    fetchSavedDesigns();
  }, []);

  const fetchSavedDesigns = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/design?manufacturerId=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setSavedDesigns(json.data);
      } else {
        const local = localStorage.getItem("vastra_saved_designs");
        if (local) setSavedDesigns(JSON.parse(local));
      }
    } catch (err) {
      console.warn("Backend fetch failed, falling back to localStorage", err);
      const local = localStorage.getItem("vastra_saved_designs");
      if (local) setSavedDesigns(JSON.parse(local));
    }
  };

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle Motif Selection
  const toggleMotif = (motifId) => {
    setSelectedMotifs((prev) => {
      if (prev.includes(motifId)) {
        return prev.filter((m) => m !== motifId);
      } else {
        return [...prev, motifId];
      }
    });
  };

  // Apply a curated preset
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

  // Reset to initial state
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all design specifications?")) {
      applyPreset(DESIGN_PRESETS[0]);
      showNotification("Reset all specifications to default.");
    }
  };

  // Compile Comprehensive AI Image Prompt & Artisan Specification - Pure Saree Product (No Humans)
  const compiledPrompt = useMemo(() => {
    const motifsDesc = selectedMotifs.length > 0
      ? selectedMotifs
          .map((m) => (m === "Custom Motif" ? customMotifText || "Custom Artisan Motif" : m))
          .join(", ")
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

  // Copy Prompt or Spec to Clipboard
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setIsCopied(true);
    showNotification("AI Weaving Prompt copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Generate AI Image with FLUX Engine
  const handleGenerateAiImage = async () => {
    setIsGeneratingAiImage(true);
    showNotification("Generating realistic saree image with FLUX model...", "info");
    try {
      const res = await fetch("http://localhost:5000/api/manufacturer/design/generate-image", {
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
      showNotification("AI Saree rendering ready!");
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Save current design specification
  const handleSaveDesign = async () => {
    const payload = {
      title: designTitle.trim() || "Untitled Saree Design",
      manufacturerId: userEmail,
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
      const res = await fetch("http://localhost:5000/api/manufacturer/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === "success") {
        showNotification("Design specification saved successfully!");
        fetchSavedDesigns();
      } else {
        throw new Error(json.message || "Failed to save design");
      }
    } catch (err) {
      console.warn("Backend save failed, saving to localStorage:", err);
      const currentList = [...savedDesigns];
      const newEntry = { ...payload, _id: Date.now().toString(), createdAt: new Date().toISOString() };
      currentList.unshift(newEntry);
      setSavedDesigns(currentList);
      localStorage.setItem("vastra_saved_designs", JSON.stringify(currentList));
      showNotification("Design saved to local storage!");
    } finally {
      setSavingLoading(false);
    }
  };

  // Delete saved design
  const handleDeleteSavedDesign = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this saved design?")) return;

    try {
      await fetch(`http://localhost:5000/api/manufacturer/design/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Backend delete error:", err);
    }

    const updated = savedDesigns.filter((d) => (d._id || d.id) !== id);
    setSavedDesigns(updated);
    localStorage.setItem("vastra_saved_designs", JSON.stringify(updated));
    showNotification("Design removed from collection.");
  };

  // Download Spec as JSON
  const handleDownloadJSON = () => {
    const spec = {
      title: designTitle,
      manufacturer: userEmail,
      exportDate: new Date().toISOString(),
      specifications: {
        fabric,
        baseColor: { name: baseColor, hex: currentBaseColorHex },
        border: { style: borderStyle, width: borderWidth },
        zari: { type: zari, hex: currentZariHex },
        pallu: { design: palluDesign, color: palluColor, hex: currentPalluColorHex },
        motifs: selectedMotifs.map((m) => (m === "Custom Motif" ? customMotifText || m : m)),
        body: { pattern: bodyPattern, density: patternDensity },
        metadata: { occasion, designStyle, additionalInstructions }
      },
      aiPrompt: compiledPrompt
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(spec, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${designTitle.replace(/\s+/g, "_")}_Vastra_Design_Spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Technical specification downloaded as JSON!");
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
                Handloom Master Weaver Studio
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Saree Design Generator
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Configure every detail of your handloom creation—fabric, colors, border, zari, pallu, motifs, and weaving instructions.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/manufacturer/design")}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-3.5 text-xs font-semibold text-[#4A1525] shadow-xs transition hover:bg-[#fffaf3] hover:border-[#D09229] active:scale-95"
            >
              <ArrowLeft size={16} className="text-[#4A1525]" />
              <span>Back to Designs</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSavedDrawerOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-3.5 text-xs font-semibold text-[#4A1525] shadow-xs transition hover:bg-[#fffaf3] hover:border-[#D09229] active:scale-95"
            >
              <FolderOpen size={16} className="text-[#D09229]" />
              <span>Saved Designs</span>
              <span className="ml-1 rounded-full bg-[#4A1525]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#4A1525]">
                {savedDesigns.length}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-3.5 text-xs font-semibold text-[#7A6D61] shadow-xs transition hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 active:scale-95"
              title="Reset all fields"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDesign}
              disabled={savingLoading}
              className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{savingLoading ? "Saving..." : "Save Design"}</span>
            </button>
          </div>
        </div>

        {/* --- Notification Toast --- */}
        {notification && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl border p-4 text-xs font-bold shadow-sm transition-all duration-300 ${
              notification.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{notification.msg}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950">
              <X size={16} />
            </button>
          </div>
        )}

        {/* --- Presets Banner Bar --- */}
        <div className="mt-6 rounded-2xl border border-[#E8DFC8] bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#F5ECE0] p-4 shadow-xs">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A1525] text-[#D09229]">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A1525]">Quick Heritage Presets</h4>
                <p className="text-[11px] text-[#7A6D61]">Load curated master loom configurations in one tap</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {DESIGN_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="group flex items-center gap-1.5 rounded-lg border border-[#E0D3C1] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#4A1525] backdrop-blur-xs transition hover:border-[#4A1525] hover:bg-[#4A1525] hover:text-white"
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Main 2-Column Grid Studio Layout --- */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ========================================================= */}
          {/* LEFT COLUMN: The Detailed Configuration Form (7 Columns)  */}
          {/* ========================================================= */}
          <div className="space-y-6 lg:col-span-7">
            {/* Design Name Header Input */}
            <div className="rounded-2xl border border-[#eadfd2] bg-white p-5 shadow-xs">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                Design Title & Collection Name
              </label>
              <input
                type="text"
                value={designTitle}
                onChange={(e) => setDesignTitle(e.target.value)}
                placeholder="e.g. Royal Kanchipuram Peacock Brocade..."
                className="mt-2 w-full rounded-xl border border-[#E8DFC8] bg-[#FFFDF9] px-4 py-2.5 font-serif text-lg font-bold text-[#4A1525] outline-none transition focus:border-[#4A1525] focus:ring-2 focus:ring-[#4A1525]/10"
              />
            </div>

            {/* 1. Fabric Selection */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    1
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Fabric & Material</h3>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-bold text-[#9B8068]">
                  Selected: {fabric}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {FABRIC_OPTIONS.map((item) => {
                  const isSelected = fabric === item.id;
                  return (
                    <label
                      key={item.id}
                      onClick={() => setFabric(item.id)}
                      className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all duration-200 ${
                        isSelected
                          ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20"
                          : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                          {item.label}
                        </span>
                        <input
                          type="radio"
                          name="fabric"
                          checked={isSelected}
                          onChange={() => setFabric(item.id)}
                          className="h-4 w-4 accent-[#4A1525]"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-[#7A6D61] leading-snug">{item.desc}</p>
                      <span className="mt-2 inline-block text-[10px] font-medium uppercase tracking-wider text-[#9B8068]">
                        {item.weight}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 2. Base Color Selection & Custom Color Picker */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    2
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Base Body Color</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: currentBaseColorHex }}
                  />
                  <span className="text-[11px] font-bold text-[#4A1525]">{baseColor}</span>
                </div>
              </div>

              {/* Color Swatch Radio Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {BASE_COLORS.map((col) => {
                  const isSelected = baseColor === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setBaseColor(col.id)}
                      className={`group relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20"
                          : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-black/15 shadow-2xs transition group-hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className={`text-xs font-semibold ${isSelected ? "text-[#4A1525]" : "text-[#4A423A]"}`}>
                        {col.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Picker Box */}
              <div className="mt-4 rounded-xl border border-dashed border-[#D09229]/60 bg-[#FFFDF9] p-3.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        id="customBaseColorInput"
                        value={customBaseHex}
                        onChange={(e) => {
                          setCustomBaseHex(e.target.value);
                          setBaseColor("Custom");
                        }}
                        className="h-9 w-10 cursor-pointer rounded-lg border border-[#E0D3C1] bg-white p-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#4A1525]">Custom Base Color Picker</span>
                      <p className="text-[11px] text-[#7A6D61]">Choose any specialized dye shade or pantone match</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#9B8068]">Hex Code:</span>
                    <input
                      type="text"
                      value={customBaseHex}
                      onChange={(e) => {
                        setCustomBaseHex(e.target.value);
                        setBaseColor("Custom");
                      }}
                      className="w-24 rounded-lg border border-[#E0D3C1] bg-white px-2 py-1 text-xs font-mono font-bold text-[#4A1525] uppercase outline-none focus:border-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => setBaseColor("Custom")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        baseColor === "Custom"
                          ? "bg-[#4A1525] text-white"
                          : "border border-[#E0D3C1] bg-white text-[#4A1525] hover:bg-[#F8F5EF]"
                      }`}
                    >
                      Apply Custom
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Border Style & Width */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    3
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Border Configuration</h3>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-bold text-[#9B8068]">
                  {borderWidth} • {borderStyle}
                </span>
              </div>

              {/* Border Width Selection */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Border Width (Loom Selvedge Span)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BORDER_WIDTHS.map((bw) => {
                    const isSelected = borderWidth === bw.id;
                    return (
                      <button
                        key={bw.id}
                        type="button"
                        onClick={() => setBorderWidth(bw.id)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20"
                            : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                          {bw.label}
                        </span>
                        <span className="text-[10px] text-[#7A6D61]">{bw.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Border Style Selection */}
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Border Style & Jacquard Motifs
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {BORDER_STYLES.map((bs) => {
                    const isSelected = borderStyle === bs.id;
                    return (
                      <label
                        key={bs.id}
                        onClick={() => setBorderStyle(bs.id)}
                        className={`flex cursor-pointer items-start justify-between rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 ring-2 ring-[#4A1525]/20"
                            : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <div className="pr-2">
                          <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                            {bs.label}
                          </span>
                          <p className="mt-0.5 text-[11px] text-[#7A6D61] leading-tight">{bs.desc}</p>
                        </div>
                        <input
                          type="radio"
                          name="borderStyle"
                          checked={isSelected}
                          onChange={() => setBorderStyle(bs.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#4A1525]"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. Zari Type Selection */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    4
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Zari & Metallic Thread</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-black/20 shadow-2xs"
                    style={{ backgroundColor: currentZariHex }}
                  />
                  <span className="text-[11px] font-bold text-[#4A1525]">{zari}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {ZARI_OPTIONS.map((z) => {
                  const isSelected = zari === z.id;
                  return (
                    <label
                      key={z.id}
                      onClick={() => setZari(z.id)}
                      className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? "border-[#4A1525] bg-[#4A1525]/5 ring-2 ring-[#4A1525]/20"
                          : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-2xs"
                            style={{ backgroundColor: z.hex }}
                          />
                          <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                            {z.label}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="zari"
                          checked={isSelected}
                          onChange={() => setZari(z.id)}
                          className="h-4 w-4 accent-[#4A1525]"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-[#7A6D61] leading-snug">{z.desc}</p>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 5. Pallu Design & Pallu Color */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    5
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Pallu (Aanchal) Design & Color</h3>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-bold text-[#9B8068]">
                  {palluDesign} • {palluColor}
                </span>
              </div>

              {/* Pallu Design Selection */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Pallu Brocade Jacquard Pattern
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PALLU_DESIGNS.map((pd) => {
                    const isSelected = palluDesign === pd.id;
                    return (
                      <button
                        key={pd.id}
                        type="button"
                        onClick={() => setPalluDesign(pd.id)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20 font-bold text-[#4A1525]"
                            : "border-[#EFE7DC] bg-[#FFFDF9] text-[#4A423A] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <span className="text-xs">{pd.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pallu Color Selection */}
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Pallu Contrast & Color Tone
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PALLU_COLORS.map((pc) => {
                    const isSelected = palluColor === pc.id;
                    return (
                      <button
                        key={pc.id}
                        type="button"
                        onClick={() => setPalluColor(pc.id)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20 font-bold text-[#4A1525]"
                            : "border-[#EFE7DC] bg-[#FFFDF9] text-[#4A423A] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        {pc.color !== "inherit" && pc.color !== "custom" && (
                          <span
                            className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15"
                            style={{ backgroundColor: pc.color }}
                          />
                        )}
                        <span className="text-xs font-semibold">{pc.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Pallu Color Picker if Custom Color is selected */}
                {palluColor === "Custom Color" && (
                  <div className="mt-3 rounded-xl border border-dashed border-[#D09229]/60 bg-[#FFFDF9] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={customPalluHex}
                          onChange={(e) => setCustomPalluHex(e.target.value)}
                          className="h-8 w-9 cursor-pointer rounded-lg border border-[#E0D3C1] bg-white p-0.5"
                        />
                        <span className="text-xs font-bold text-[#4A1525]">Custom Pallu Color Hex:</span>
                      </div>
                      <input
                        type="text"
                        value={customPalluHex}
                        onChange={(e) => setCustomPalluHex(e.target.value)}
                        className="w-24 rounded-lg border border-[#E0D3C1] bg-white px-2 py-1 text-xs font-mono font-bold text-[#4A1525] uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 6. Traditional Motifs (Multi-Select) */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    6
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A1525]">Traditional Motifs</h3>
                    <p className="text-[11px] text-[#7A6D61]">Allowing multi-motif jacquard selection</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMotifs(MOTIF_OPTIONS.map((m) => m.id))}
                    className="text-[11px] font-semibold text-[#4A1525] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[#E0D3C1]">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMotifs([])}
                    className="text-[11px] font-semibold text-[#7A6D61] hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Motifs Multi-Select Checkbox Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {MOTIF_OPTIONS.map((m) => {
                  const isChecked = selectedMotifs.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      onClick={() => toggleMotif(m.id)}
                      className={`group relative flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 transition-all select-none ${
                        isChecked
                          ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20"
                          : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by label onClick
                        className="h-4 w-4 shrink-0 accent-[#4A1525] rounded"
                      />
                      <span className="text-base">{m.emoji}</span>
                      <div className="overflow-hidden">
                        <p className={`truncate text-xs font-bold ${isChecked ? "text-[#4A1525]" : "text-[#292421]"}`}>
                          {m.name}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Custom Motif Input if Custom Motif is checked */}
              {selectedMotifs.includes("Custom Motif") && (
                <div className="mt-4 rounded-xl border border-dashed border-[#D09229] bg-[#FFFDF9] p-3.5">
                  <label className="block text-xs font-bold text-[#4A1525]">Custom Motif Description / Spec</label>
                  <input
                    type="text"
                    value={customMotifText}
                    onChange={(e) => setCustomMotifText(e.target.value)}
                    placeholder="e.g. Royal Yali, Rudraksh garland, Gandaberunda two-headed eagle..."
                    className="mt-1.5 w-full rounded-lg border border-[#E0D3C1] bg-white px-3 py-2 text-xs font-medium text-[#4A1525] outline-none focus:border-[#4A1525]"
                  />
                </div>
              )}
            </section>

            {/* 7. Body Pattern & Pattern Density */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    7
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Body Pattern & Density</h3>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-bold text-[#9B8068]">
                  {bodyPattern} • {patternDensity}
                </span>
              </div>

              {/* Body Pattern Selection */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Body Weave Pattern
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BODY_PATTERNS.map((bp) => {
                    const isSelected = bodyPattern === bp.id;
                    return (
                      <label
                        key={bp.id}
                        onClick={() => setBodyPattern(bp.id)}
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 ring-2 ring-[#4A1525]/20"
                            : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                            {bp.label}
                          </span>
                          <input
                            type="radio"
                            name="bodyPattern"
                            checked={isSelected}
                            onChange={() => setBodyPattern(bp.id)}
                            className="h-3.5 w-3.5 accent-[#4A1525]"
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#7A6D61] leading-tight">{bp.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pattern Density Selection */}
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Pattern Density (Spacing on Saree Body)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PATTERN_DENSITIES.map((pd) => {
                    const isSelected = patternDensity === pd.id;
                    return (
                      <label
                        key={pd.id}
                        onClick={() => setPatternDensity(pd.id)}
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 ring-2 ring-[#4A1525]/20"
                            : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                            {pd.label}
                          </span>
                          <input
                            type="radio"
                            name="patternDensity"
                            checked={isSelected}
                            onChange={() => setPatternDensity(pd.id)}
                            className="h-3.5 w-3.5 accent-[#4A1525]"
                          />
                        </div>
                        <span className="mt-1 text-[10px] text-[#9B8068]">{pd.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 8. Saree Occasion & Design Style */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    8
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Occasion & Design Aesthetic</h3>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-bold text-[#9B8068]">
                  {occasion} • {designStyle}
                </span>
              </div>

              {/* Occasion Selection */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Saree Occasion Target
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {OCCASIONS.map((occ) => {
                    const isSelected = occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setOccasion(occ.id)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 shadow-xs ring-2 ring-[#4A1525]/20 font-bold text-[#4A1525]"
                            : "border-[#EFE7DC] bg-[#FFFDF9] text-[#4A423A] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <span className="text-base">{occ.icon}</span>
                        <span className="text-xs font-semibold">{occ.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Design Style Selection */}
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Design Style & Character
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DESIGN_STYLES.map((ds) => {
                    const isSelected = designStyle === ds.id;
                    return (
                      <label
                        key={ds.id}
                        onClick={() => setDesignStyle(ds.id)}
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-[#4A1525] bg-[#4A1525]/5 ring-2 ring-[#4A1525]/20"
                            : "border-[#EFE7DC] bg-[#FFFDF9] hover:border-[#D09229] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? "text-[#4A1525]" : "text-[#292421]"}`}>
                            {ds.label}
                          </span>
                          <input
                            type="radio"
                            name="designStyle"
                            checked={isSelected}
                            onChange={() => setDesignStyle(ds.id)}
                            className="h-3.5 w-3.5 accent-[#4A1525]"
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#7A6D61] leading-tight">{ds.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 9. Additional Instructions & Notes */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-xs transition hover:border-[#D09229]/50">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1525] text-[11px] font-bold text-white">
                    9
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1525]">Additional Instructions & Notes</h3>
                </div>
                <span className="text-[11px] text-[#9B8068]">Manufacturer / Weaver Memo</span>
              </div>

              <div className="mt-4">
                <p className="text-xs text-[#7A6D61]">
                  Add specific technical weaving notes, warp/weft specifications, loom tension, custom border proportions, tassel styling, or buyer requests:
                </p>
                <textarea
                  rows={4}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Enter detailed weaving instructions, counts, reed/pick ratio, dyeing nuances, buyer customizations..."
                  className="mt-2.5 w-full rounded-xl border border-[#E0D3C1] bg-[#FFFDF9] p-3.5 text-xs text-[#292421] leading-relaxed outline-none transition focus:border-[#4A1525] focus:ring-2 focus:ring-[#4A1525]/10"
                />

                {/* Quick Instruction Snippet Badges */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-[#9B8068]">Quick tags:</span>
                  {[
                    "Korvai Interlocking",
                    "Double Warp 3-Ply",
                    "Petni Pallu Joint",
                    "Hand-twisted Tassels",
                    "Silk Mark Certified",
                    "Gold Tested Zari",
                    "Eco-friendly Vegetable Dye"
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setAdditionalInstructions((prev) =>
                          prev.includes(tag) ? prev : prev ? `${prev}. ${tag}` : tag
                        )
                      }
                      className="rounded-md border border-[#E8DFC8] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4A1525] hover:bg-[#4A1525] hover:text-white transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Real-Time Saree Visualizer & Blueprint Generator (5 Columns) */}
          {/* ========================================================================= */}
          <div className="space-y-6 lg:col-span-5">
            {/* Sticky Container */}
            <div className="sticky top-6 space-y-6">
              {/* Studio Visualizer Card */}
              <div className="overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-md">
                {/* Visualizer Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E8DC] bg-gradient-to-r from-[#4A1525] to-[#6A1F35] px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-[#D09229]" />
                    <span className="font-serif text-sm font-bold tracking-wide">Live Saree Visualizer</span>
                  </div>

                  {/* Mode Selector & Generate Button */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center rounded-lg bg-black/20 p-0.5 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("canvas")}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                          previewMode === "canvas" ? "bg-white text-[#4A1525] shadow-xs" : "text-white/80 hover:text-white"
                        }`}
                      >
                        2D Swatch
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("ai")}
                        className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold transition ${
                          previewMode === "ai" ? "bg-[#D09229] text-white shadow-xs" : "text-amber-200 hover:text-white"
                        }`}
                      >
                        <Sparkles size={11} />
                        <span>AI Render</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiImage}
                      disabled={isGeneratingAiImage}
                      className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#D09229] to-[#E5C158] px-2.5 py-1 text-[10px] font-bold text-[#3d2c0e] shadow-xs transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                      title="Generate photorealistic image using Black Forest Labs FLUX"
                    >
                      <Sparkles size={12} className={isGeneratingAiImage ? "animate-spin" : ""} />
                      <span>{isGeneratingAiImage ? "Generating..." : "Generate AI"}</span>
                    </button>
                  </div>
                </div>

                {/* --- Interactive Artistic Saree Canvas / AI Render --- */}
                <div className="p-5 bg-[#FAF6F0]">
                  {previewMode === "ai" ? (
                    <div className="relative mx-auto flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#D8CCBD] bg-[#1a1412] shadow-inner">
                      {isGeneratingAiImage ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-full border-2 border-[#D09229] border-t-transparent animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto text-[#D09229] animate-pulse" size={20} />
                          </div>
                          <p className="mt-4 font-serif text-sm font-bold text-amber-200">
                            Weaving AI Photorealistic Render...
                          </p>
                          <p className="mt-1 max-w-xs text-[11px] text-[#C4B5A5]">
                            Synthesizing {fabric}, {zari} zari brocade, and {palluDesign} pallu motifs via FLUX engine.
                          </p>
                        </div>
                      ) : generatedAiImageUrl ? (
                        <div className="group relative h-full w-full">
                          <img
                            src={generatedAiImageUrl}
                            alt={designTitle}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="flex justify-between items-start">
                              <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur-xs">
                                FLUX AI Generation
                              </span>
                              <button
                                type="button"
                                onClick={() => window.open(generatedAiImageUrl, "_blank")}
                                className="rounded bg-black/60 p-1 text-white hover:text-amber-300"
                                title="Open Full Resolution"
                              >
                                <ExternalLink size={13} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-white/90 font-serif truncate max-w-[180px]">
                                {designTitle}
                              </span>
                              <button
                                type="button"
                                onClick={handleGenerateAiImage}
                                className="flex items-center gap-1 rounded bg-[#D09229] px-2 py-1 text-[10px] font-bold text-[#3d2c0e] hover:bg-amber-400 active:scale-95"
                              >
                                <RefreshCw size={10} />
                                <span>Re-generate</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                          <div className="rounded-full bg-[#FAF3E8]/10 p-3 text-[#D09229] ring-1 ring-[#D09229]/30">
                            <Sparkles size={24} />
                          </div>
                          <h4 className="mt-3 font-serif text-sm font-bold text-amber-200">No AI Render Generated Yet</h4>
                          <p className="mt-1 max-w-xs text-[11px] text-[#C4B5A5]">
                            Click "Generate AI" to create a photorealistic visual representation of your saree design blueprint.
                          </p>
                          <button
                            type="button"
                            onClick={handleGenerateAiImage}
                            className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D09229] to-[#E5C158] px-4 py-2 text-xs font-bold text-[#3d2c0e] shadow-md transition hover:brightness-105 active:scale-95"
                          >
                            <Sparkles size={14} />
                            <span>Generate with FLUX AI</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative mx-auto flex h-64 w-full flex-col overflow-hidden rounded-xl border border-[#D8CCBD] shadow-inner">
                      {/* Top Border Band */}
                      {borderStyle !== "No Border" && (
                        <div
                          className={`w-full shrink-0 flex items-center justify-between px-3 border-b border-black/10 transition-all ${
                            borderWidth === "Small"
                              ? "h-4"
                              : borderWidth === "Medium"
                              ? "h-6"
                              : borderWidth === "Large"
                              ? "h-9"
                              : "h-12"
                          }`}
                          style={{
                            backgroundColor:
                              palluColor === "Gold" ? currentZariHex : currentPalluColorHex || "#800000",
                            backgroundImage: `radial-gradient(circle, ${currentZariHex} 15%, transparent 20%)`,
                            backgroundSize: "8px 8px"
                          }}
                        >
                          <span className="text-[9px] font-bold text-white/90 drop-shadow-xs truncate">
                            {borderStyle}
                          </span>
                          <span className="text-[9px] font-serif text-amber-200">{zari} Zari</span>
                        </div>
                      )}

                      {/* Middle Section: Pallu (Left) + Body (Right) */}
                      <div className="flex flex-1 overflow-hidden">
                        {/* Left: Pallu Section */}
                        <div
                          className="relative flex w-1/3 flex-col justify-between border-r-2 border-[#D4AF37]/50 p-2.5 text-white shadow-md"
                          style={{
                            backgroundColor: currentPalluColorHex,
                            backgroundImage: `radial-gradient(circle, ${currentZariHex}33 10%, transparent 15%), linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2))`
                          }}
                        >
                          <div className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs text-amber-300">
                            Pallu • {palluDesign}
                          </div>

                          {/* Pallu Motif Render */}
                          <div className="flex flex-col items-center justify-center gap-1 my-auto">
                            <span className="text-2xl drop-shadow-md">
                              {selectedMotifs.includes("Peacock")
                                ? "🦚"
                                : selectedMotifs.includes("Lotus")
                                ? "🪷"
                                : selectedMotifs.includes("Temple")
                                ? "🛕"
                                : selectedMotifs.includes("Elephant")
                                ? "🐘"
                                : "✨"}
                            </span>
                            <span className="text-[9px] font-bold text-center text-white/90">
                              {selectedMotifs[0] || palluDesign}
                            </span>
                          </div>

                          <div className="flex justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentZariHex }} />
                            ))}
                          </div>
                        </div>

                        {/* Right: Saree Body Field */}
                        <div
                          className="relative flex flex-1 flex-col justify-between p-3"
                          style={{
                            backgroundColor: currentBaseColorHex,
                            backgroundImage:
                              bodyPattern === "Plain"
                                ? "none"
                                : `radial-gradient(circle, ${currentZariHex}44 10%, transparent 12%)`,
                            backgroundSize:
                              patternDensity === "Minimal"
                                ? "32px 32px"
                                : patternDensity === "Light"
                                ? "24px 24px"
                                : patternDensity === "Medium"
                                ? "16px 16px"
                                : "10px 10px"
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-bold text-white/90 backdrop-blur-xs">
                              Body: {baseColor}
                            </span>
                            <span className="rounded bg-white/30 px-1.5 py-0.5 text-[9px] font-semibold text-black/80 backdrop-blur-xs">
                              {bodyPattern}
                            </span>
                          </div>

                          {/* Body Motifs Field Representation */}
                          <div className="flex flex-wrap items-center justify-center gap-3 my-auto opacity-70">
                            {selectedMotifs.slice(0, 3).map((mId, i) => {
                              const obj = MOTIF_OPTIONS.find((o) => o.id === mId);
                              return (
                                <span key={i} className="text-sm drop-shadow-xs">
                                  {obj?.emoji || "✨"}
                                </span>
                              );
                            })}
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] font-bold text-white/80 drop-shadow-xs">
                              {occasion} Edition
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Border Band */}
                      {borderStyle !== "No Border" && (
                        <div
                          className={`w-full shrink-0 flex items-center justify-between px-3 border-t border-black/10 transition-all ${
                            borderWidth === "Small"
                              ? "h-4"
                              : borderWidth === "Medium"
                              ? "h-6"
                              : borderWidth === "Large"
                              ? "h-9"
                              : "h-12"
                          }`}
                          style={{
                            backgroundColor:
                              palluColor === "Gold" ? currentZariHex : currentPalluColorHex || "#800000",
                            backgroundImage: `radial-gradient(circle, ${currentZariHex} 15%, transparent 20%)`,
                            backgroundSize: "8px 8px"
                          }}
                        >
                          <span className="text-[9px] font-bold text-white/90 drop-shadow-xs truncate">
                            {borderStyle} ({borderWidth})
                          </span>
                          <span className="text-[9px] font-mono text-amber-200">{currentZariHex}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visualizer Footer Badges */}
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8DFC8] pt-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#4A1525]">Zari:</span>
                      <span className="rounded bg-white px-2 py-0.5 font-semibold text-[#625b54] border border-[#E0D3C1]">
                        {zari}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#4A1525]">Style:</span>
                      <span className="rounded bg-white px-2 py-0.5 font-semibold text-[#625b54] border border-[#E0D3C1]">
                        {designStyle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#4A1525]">Motifs:</span>
                      <span className="rounded bg-[#4A1525] px-2 py-0.5 font-bold text-white">
                        {selectedMotifs.length} active
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- Tab Selector for Prompt / Spec --- */}
                <div className="flex border-t border-[#EFE7DC] bg-[#FFFDF9]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("studio")}
                    className={`flex-1 py-2.5 text-center text-xs font-bold transition ${
                      activeTab === "studio"
                        ? "border-b-2 border-[#4A1525] text-[#4A1525] bg-[#FAF6F0]"
                        : "text-[#7A6D61] hover:text-[#4A1525]"
                    }`}
                  >
                    Specifications Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("prompt")}
                    className={`flex-1 py-2.5 text-center text-xs font-bold transition ${
                      activeTab === "prompt"
                        ? "border-b-2 border-[#4A1525] text-[#4A1525] bg-[#FAF6F0]"
                        : "text-[#7A6D61] hover:text-[#4A1525]"
                    }`}
                  >
                    AI Weave Prompt
                  </button>
                </div>

                {/* --- Tab Content 1: Specifications Sheet --- */}
                {activeTab === "studio" && (
                  <div className="p-4 text-xs space-y-3 bg-white max-h-[380px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">1. Fabric</span>
                        <span className="font-bold text-[#4A1525]">{fabric}</span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">2. Base Color</span>
                        <span className="font-bold text-[#4A1525] flex items-center gap-1">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-black/20"
                            style={{ backgroundColor: currentBaseColorHex }}
                          />
                          {baseColor}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">3. Border</span>
                        <span className="font-bold text-[#4A1525]">
                          {borderWidth} • {borderStyle}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">4. Zari Type</span>
                        <span className="font-bold text-[#4A1525]">{zari}</span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">5. Pallu Design</span>
                        <span className="font-bold text-[#4A1525]">
                          {palluDesign} ({palluColor})
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">6. Body Pattern</span>
                        <span className="font-bold text-[#4A1525]">
                          {bodyPattern} ({patternDensity})
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">7. Occasion</span>
                        <span className="font-bold text-[#4A1525]">{occasion}</span>
                      </div>
                      <div className="rounded-lg bg-[#FAF6F0] p-2 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block">8. Design Style</span>
                        <span className="font-bold text-[#4A1525]">{designStyle}</span>
                      </div>
                    </div>

                    {/* Motifs Summary */}
                    <div className="rounded-lg bg-[#FAF6F0] p-2.5 border border-[#E8DFC8]">
                      <span className="text-[#9B8068] font-bold block text-[10px] uppercase">
                        Selected Traditional Motifs ({selectedMotifs.length})
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedMotifs.map((m) => {
                          const item = MOTIF_OPTIONS.find((o) => o.id === m);
                          return (
                            <span
                              key={m}
                              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#4A1525] border border-[#E0D3C1]"
                            >
                              <span>{item?.emoji || "✨"}</span>
                              <span>{m === "Custom Motif" ? customMotifText || m : m}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Additional Weaver Instructions */}
                    {additionalInstructions && (
                      <div className="rounded-lg bg-[#FAF6F0] p-2.5 border border-[#E8DFC8]">
                        <span className="text-[#9B8068] font-bold block text-[10px] uppercase">
                          Manufacturer Instructions
                        </span>
                        <p className="mt-1 text-[11px] text-[#4A423A] leading-relaxed italic">
                          "{additionalInstructions}"
                        </p>
                      </div>
                    )}

                    {/* Export Actions Bar */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white py-2 text-xs font-bold text-[#4A1525] hover:bg-[#F8F5EF] transition active:scale-95"
                      >
                        <Download size={14} />
                        <span>Export Spec JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white px-3 py-2 text-xs font-bold text-[#7A6D61] hover:bg-[#F8F5EF] transition"
                        title="Print Specification"
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* --- Tab Content 2: AI Weave Prompt --- */}
                {activeTab === "prompt" && (
                  <div className="p-4 text-xs space-y-3 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#9B8068] uppercase tracking-wider">
                        Generated AI Weaving Prompt
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleGenerateAiImage}
                          disabled={isGeneratingAiImage}
                          className="flex items-center gap-1 rounded-lg bg-[#D09229] px-2.5 py-1 text-[11px] font-bold text-[#3d2c0e] hover:bg-amber-400 transition active:scale-95 disabled:opacity-50"
                        >
                          <Sparkles size={12} className={isGeneratingAiImage ? "animate-spin" : ""} />
                          <span>{isGeneratingAiImage ? "Generating..." : "Generate AI Image"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className="flex items-center gap-1 rounded-lg bg-[#4A1525] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#6A1F35] active:scale-95"
                        >
                          {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{isCopied ? "Copied!" : "Copy Prompt"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E0D3C1] bg-[#FAF6F0] p-3 text-[11px] font-mono leading-relaxed text-[#4A1525] select-all max-h-52 overflow-y-auto">
                      {compiledPrompt}
                    </div>

                    <p className="text-[10px] text-[#7A6D61] leading-tight">
                      * Powered by Black Forest Labs FLUX AI engine. Generates photorealistic saree visualizations based on your exact weaving configurations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SAVED DESIGNS DRAWER / MODAL                             */}
        {/* ========================================================= */}
        {isSavedDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E0D3C1] bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#EFE7DC] bg-[#FAF6F0] px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <FolderOpen size={20} className="text-[#4A1525]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A1525]">Saved Design Specifications</h3>
                    <p className="text-[11px] text-[#7A6D61]">
                      {savedDesigns.length} saved custom handloom creations
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="rounded-full p-1.5 text-[#7A6D61] hover:bg-[#EFE7DC] hover:text-[#4A1525]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {savedDesigns.length === 0 ? (
                  <div className="py-12 text-center">
                    <FolderOpen size={36} className="mx-auto text-[#D8CCBD]" />
                    <p className="mt-2 text-sm font-bold text-[#4A1525]">No saved designs yet</p>
                    <p className="mt-1 text-xs text-[#7A6D61]">
                      Click "Save Design" on the top right to store your custom handloom saree creations.
                    </p>
                  </div>
                ) : (
                  savedDesigns.map((d) => (
                    <div
                      key={d._id || d.id || Math.random()}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#EFE7DC] bg-[#FFFDF9] p-4 transition hover:border-[#D09229] hover:shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-bold text-[#4A1525]">{d.title || "Saree Design"}</h4>
                          <span className="rounded bg-[#FAF3E8] px-2 py-0.5 text-[10px] font-bold text-[#9B8068]">
                            {d.fabric}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6D61]">
                          {d.baseColor} Base • {d.borderWidth} {d.borderStyle} • {d.zari} Zari • {d.occasion}
                        </p>
                        {d.motifs && d.motifs.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {d.motifs.slice(0, 4).map((m, i) => (
                              <span key={i} className="rounded bg-white px-1.5 py-0.2 text-[9px] border border-[#E8DFC8]">
                                {m}
                              </span>
                            ))}
                            {d.motifs.length > 4 && (
                              <span className="text-[9px] text-[#9B8068]">+{d.motifs.length - 4} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            applyPreset({
                              name: d.title,
                              fabric: d.fabric,
                              baseColor: d.baseColor,
                              customBaseHex: d.customBaseHex,
                              borderStyle: d.borderStyle,
                              borderWidth: d.borderWidth,
                              zari: d.zari,
                              palluDesign: d.palluDesign,
                              palluColor: d.palluColor,
                              customPalluHex: d.customPalluHex,
                              motifs: d.motifs || [],
                              customMotifText: d.customMotifText,
                              bodyPattern: d.bodyPattern,
                              patternDensity: d.patternDensity,
                              occasion: d.occasion,
                              designStyle: d.designStyle,
                              additionalInstructions: d.additionalInstructions
                            });
                            setIsSavedDrawerOpen(false);
                          }}
                          className="rounded-lg bg-[#4A1525] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#6A1F35] transition active:scale-95"
                        >
                          Load Design
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedDesign(d._id || d.id, e)}
                          className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Saved Design"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-[#EFE7DC] bg-[#FAF6F0] px-6 py-3 text-right">
                <button
                  type="button"
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="rounded-xl border border-[#E0D3C1] bg-white px-4 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#F8F5EF]"
                >
                  Close
                </button>
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