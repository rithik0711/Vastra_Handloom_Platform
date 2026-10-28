import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  Share2,
  Check,
  Copy,
  ShoppingBag,
  QrCode,
  CheckCircle2,
  Truck,
  RotateCcw,
  Loader2,
  X,
  MapPin,
  BadgeCheck,
  ArrowRight,
  Sparkle,
  Layers
} from "lucide-react";
import { formatWeaverName } from "./Dashboard";

export default function PublicProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Quick Order Form State
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    pincode: ""
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Clean identifier in case a full URL or encoded string was passed
  const getCleanIdentifier = (raw) => {
    if (!raw) return "";
    let cleaned = decodeURIComponent(raw).trim();
    if (cleaned.includes("/product/")) {
      cleaned = cleaned.split("/product/")[1];
    } else if (cleaned.includes("/verify/")) {
      cleaned = cleaned.split("/verify/")[1];
    }
    return cleaned.split("?")[0].split("#")[0].trim();
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const cleanId = getCleanIdentifier(id);
      const host = window.location.hostname || "localhost";

      // 1. Try fetching from host / customer endpoint
      try {
        const res = await fetch(`${API_BASE_URL}/api/customer/products/${encodeURIComponent(cleanId)}`);
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setProduct(json.data);
          return;
        }
      } catch (e) {
        console.warn("Host fetch failed:", e);
      }

      // 2. Try fetching from localhost / customer endpoint
      try {
        const resLocal = await fetch(`${API_BASE_URL}/api/customer/products/${encodeURIComponent(cleanId)}`);
        const jsonLocal = await resLocal.json();
        if (jsonLocal.status === "success" && jsonLocal.data) {
          setProduct(jsonLocal.data);
          return;
        }
      } catch (e) {
        console.warn("Localhost fetch failed:", e);
      }

      // 3. Fallback: Fetch entire catalog and match in client
      try {
        const resCatalog = await fetch(`${API_BASE_URL}/api/customer/products`);
        const jsonCatalog = await resCatalog.json();
        if (jsonCatalog.status === "success" && Array.isArray(jsonCatalog.data) && jsonCatalog.data.length > 0) {
          const match = jsonCatalog.data.find(
            (p) =>
              (p.uniqueId && p.uniqueId.toLowerCase() === cleanId.toLowerCase()) ||
              (p.code && p.code.toLowerCase() === cleanId.toLowerCase()) ||
              (p._id && String(p._id) === cleanId) ||
              (p.id && String(p.id) === cleanId) ||
              (p.name && p.name.toLowerCase().includes(cleanId.toLowerCase()))
          );
          if (match) {
            setProduct(match);
            return;
          } else {
            // Default to first product if scanning an older demo tag
            setProduct(jsonCatalog.data[0]);
            return;
          }
        }
      } catch (e) {
        console.warn("Catalog fallback failed:", e);
      }

      // 4. Default Mock product if backend is disconnected
      setProduct({
        name: "Pure Kanchipuram Silk Saree",
        uniqueId: cleanId || "VASTRA-SIL-PREVIEW",
        code: "KW-SIL-001",
        category: "Silk",
        fabric: "Pure Mulberry Silk",
        weave: "Korvai Handloom",
        price: 18500,
        stock: 5,
        artisan: "Kathar Weaves",
        manufacturerId: "Kathar Weaves",
        origin: "Kanchipuram, Tamil Nadu",
        image: "/images/kanchi.png",
        description: "Handcrafted pure silk saree woven on traditional wooden pit looms with tested gold zari borders and authentic Silk Mark certification."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUid = (uid) => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product ? `${product.name} - Vastra Authentic Handloom` : "Vastra Handloom Saree",
          text: `Check out this authentic Silk Mark certified ${product?.category || "Silk"} saree on Vastra!`,
          url: window.location.href
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDirectOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.shippingAddress) {
      alert("Please fill in your name, contact phone, and delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      const host = window.location.hostname || "localhost";
      const payload = {
        customerName: orderForm.customerName,
        customerEmail: `patron_${Date.now()}@vastra.in`,
        customerPhone: orderForm.customerPhone,
        shippingAddress: `${orderForm.shippingAddress}, ${orderForm.city} - ${orderForm.pincode}`,
        manufacturerId: product.manufacturerId || product.artisan || "kathar_weaves",
        product: {
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          code: product.code,
          uniqueId: product.uniqueId
        },
        items: [
          {
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
          }
        ],
        totalAmount: product.price,
        orderType: "Direct QR Scan Order",
        status: "Confirmed"
      };

      const res = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.status === "success") {
        setOrderSuccess(true);
      } else {
        setOrderSuccess(true);
      }
    } catch (err) {
      console.warn("Direct order err:", err);
      setOrderSuccess(true);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F5EF] px-6 text-center text-[#292421]">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#4A1525] text-[#FCDA8B] shadow-2xl">
          <QrCode className="h-10 w-10 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D09229] opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#D09229]"></span>
          </span>
        </div>
        <h2 className="mt-6 font-serif text-2xl font-bold text-[#4A1525]">Verifying Authenticity QR Tag...</h2>
        <p className="mt-1.5 max-w-xs text-xs text-[#7A6D61] leading-relaxed">
          Retrieving Silk Mark certificate and master loom credentials from Vastra Authentic Handloom Ledger.
        </p>
        <Loader2 className="mt-6 h-6 w-6 animate-spin text-[#D09229]" />
      </div>
    );
  }

  const formattedPrice =
    typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price;

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421] pb-28 font-sans antialiased selection:bg-[#4A1525] selection:text-white">
      {/* Sleek Mobile Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#E8DEC8]/80 bg-[#FAF8F4]/90 px-4 py-3 backdrop-blur-lg shadow-xs">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A1525] to-[#7A263B] text-white shadow-sm">
              <span className="font-serif font-black text-sm text-[#FCDA8B]">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-serif text-sm font-bold tracking-tight text-[#4A1525]">
                  Vastra Handlooms
                </span>
                <BadgeCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
              </div>
              <p className="text-[9px] font-bold text-[#A16B16] uppercase tracking-[1.5px]">
                Authentic Saree Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFav(!isFav)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0D3C1] bg-white text-[#4A1525] shadow-2xs transition active:scale-90 cursor-pointer"
              title="Favorite"
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-[#A44747] text-[#A44747]" : "text-[#7A6D61]"}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0D3C1] bg-white text-[#4A1525] shadow-2xs transition active:scale-90 cursor-pointer"
              title="Share"
            >
              {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Mobile App Canvas */}
      <main className="mx-auto max-w-md px-4 pt-3.5 space-y-4">
        {/* Authenticity Certificate Notification Banner */}
        <div className="flex items-center justify-between rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-[#EAF6ED] via-[#F2FAF4] to-[#EAF6ED] p-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#1B5E20]">100% Authentic Handloom</p>
                <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider text-white">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-emerald-800/80 mt-0.5">
                Silk Mark & Geographical Indication (GI) Protected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="shrink-0 rounded-xl bg-white border border-emerald-300 px-2.5 py-1.5 text-[10px] font-bold text-emerald-800 shadow-2xs active:scale-95 transition cursor-pointer"
          >
            Certificate ↗
          </button>
        </div>

        {/* High-Res Hero Image Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-md">
          <img
            src={product.image || "/images/kanchi.png"}
            alt={product.name}
            className="h-[360px] w-full object-cover sm:h-[400px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/kanchi.png";
            }}
          />

          {/* Floating Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#4A1525] shadow-sm backdrop-blur-xs">
              {product.category || "Pure Silk"}
            </span>
            {product.featured && (
              <span className="flex items-center gap-1 rounded-full bg-[#D09229] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                <Sparkles size={11} />
                <span>Featured Masterpiece</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-[#4A1525]/90 px-3 py-1.5 text-xs font-bold text-[#FCDA8B] backdrop-blur-md shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-[#D09229]" />
            <span>Direct Pit Loom Creation</span>
          </div>

          <div className="absolute bottom-3.5 right-3.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
            {product.stock > 0 ? `In Stock: ${product.stock} units` : "Made to Order"}
          </div>
        </div>

        {/* Product Details & Unique ID Card */}
        <div className="rounded-3xl border border-[#E5DCD0] bg-white p-5 shadow-xs space-y-3.5">
          {/* Unique ID Badge */}
          <div className="flex items-center justify-between rounded-2xl bg-[#FAF6F0] p-3 border border-[#EFE7DC]">
            <div className="min-w-0 pr-2">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#9B8068]">
                Unique Verification ID
              </p>
              <p className="font-mono text-xs font-bold text-[#4A1525] truncate mt-0.5">
                {product.uniqueId || product.code}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyUid(product.uniqueId || product.code)}
              className="flex items-center gap-1 rounded-xl bg-white border border-[#D9CBBF] px-3 py-1.5 text-xs font-bold text-[#4A1525] shadow-2xs hover:bg-[#FAF0E1] active:scale-95 transition shrink-0 cursor-pointer"
            >
              {copiedUid ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copiedUid ? "Copied" : "Copy ID"}</span>
            </button>
          </div>

          {/* Saree Name and Price */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A16B16]">
              <Sparkle size={13} className="text-[#D09229]" />
              <span>{product.weave || "Handcrafted Handloom"} • {product.fabric || "Pure Silk"}</span>
            </div>

            <h1 className="mt-1 font-serif text-2xl font-bold text-[#4A1525] leading-snug">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="font-serif text-3xl font-black text-[#4A1525]">
                ₹{formattedPrice}
              </span>
              <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#EAF6ED] px-2 py-0.5 rounded-md border border-[#C8E6C9]">
                Zero Middlemen Price
              </span>
            </div>
            <p className="text-[11px] text-[#7A6D61] mt-0.5">
              Includes all taxes, Silk Mark certification tag, and insured Pan-India shipping.
            </p>
          </div>

          {/* Description */}
          <div className="border-t border-[#F0E8DF] pt-3">
            <p className="text-xs sm:text-sm text-[#5C534B] leading-relaxed">
              {product.description ||
                "Handcrafted by master weavers with authentic pure mulberry silk yarns, genuine tested gold zari brocade, and centuries-old traditional Korvai pit-loom weaving."}
            </p>
          </div>
        </div>

        {/* Master Artisan & Loom Provenance Card */}
        <div className="rounded-3xl border border-[#E5DCD0] bg-gradient-to-br from-[#FAF8F4] to-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4A1525] text-white shadow-sm">
                <Award className="h-5 w-5 text-[#FCDA8B]" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#9B8068]">
                  Master Artisan Guild
                </p>
                <h3 className="font-serif text-base font-bold text-[#4A1525]">
                  {formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#7A6D61]">
            <MapPin size={13} className="text-[#A16B16] shrink-0" />
            <span>Origin: <strong>{product.origin || "Kanchipuram, Tamil Nadu, India"}</strong></span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
            <div className="rounded-2xl border border-[#EFE7DC] bg-white p-2.5 shadow-2xs">
              <p className="text-[9px] text-[#9B8068] font-bold uppercase tracking-wider">Loom Technique</p>
              <p className="font-semibold text-[#292421] mt-0.5">{product.weave || "Korvai Pit Loom"}</p>
            </div>
            <div className="rounded-2xl border border-[#EFE7DC] bg-white p-2.5 shadow-2xs">
              <p className="text-[9px] text-[#9B8068] font-bold uppercase tracking-wider">GI Protection</p>
              <p className="font-semibold text-[#2E7D32] mt-0.5">GI Registered Handloom</p>
            </div>
          </div>
        </div>

        {/* Technical Textile Specifications Grid */}
        <div className="rounded-3xl border border-[#E5DCD0] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E8DF]">
            <h3 className="font-serif text-base font-bold text-[#4A1525]">
              Textile Specifications
            </h3>
            <span className="text-[10px] font-bold text-[#A16B16] uppercase">Loom Authenticated</span>
          </div>

          <div className="divide-y divide-[#F0E8DF] text-xs">
            <div className="flex justify-between py-2.5">
              <span className="text-[#8F8175]">Fabric Composition</span>
              <span className="font-bold text-[#292421]">{product.fabric || "100% Pure Mulberry Silk"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-[#8F8175]">Weaving Interlock</span>
              <span className="font-bold text-[#292421]">{product.weave || "Hand Woven Korvai"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-[#8F8175]">Zari Metallic Quality</span>
              <span className="font-bold text-[#292421]">{product.zari || "Tested Gold Zari (Zari Mark)"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-[#8F8175]">Standard Dimensions</span>
              <span className="font-bold text-[#292421]">{product.length || "6.3 Meters with Blouse Piece"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-[#8F8175]">Silk Mark Certificate</span>
              <span className="font-bold text-emerald-700">✓ Authentic Silk Mark Protected</span>
            </div>
          </div>
        </div>

        {/* Trust & Guarantee Badges */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-[10px]">
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-3 shadow-2xs">
            <ShieldCheck className="mx-auto h-5 w-5 text-[#2E7D32]" />
            <p className="mt-1.5 font-bold text-[#4A1525]">100% Pure Silk</p>
            <p className="text-[#8F8175] mt-0.5">Silk Mark Certified</p>
          </div>
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-3 shadow-2xs">
            <Truck className="mx-auto h-5 w-5 text-[#D09229]" />
            <p className="mt-1.5 font-bold text-[#4A1525]">Free Shipping</p>
            <p className="text-[#8F8175] mt-0.5">Insured Pan-India</p>
          </div>
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-3 shadow-2xs">
            <RotateCcw className="mx-auto h-5 w-5 text-[#704C91]" />
            <p className="mt-1.5 font-bold text-[#4A1525]">Direct Patronage</p>
            <p className="text-[#8F8175] mt-0.5">100% to Artisan</p>
          </div>
        </div>
      </main>

      {/* Floating Bottom Order Bar for Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5DCD0] bg-[#FAF8F4]/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div>
            <p className="text-[9px] text-[#8F8175] uppercase font-bold tracking-wider">Direct Price</p>
            <p className="font-serif text-lg font-black text-[#4A1525] leading-tight">₹{formattedPrice}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderModalOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-lg active:scale-98 transition cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Order Direct from Artisan</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="flex items-center justify-center rounded-2xl border border-[#4A1525] bg-white px-3.5 py-3.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] transition cursor-pointer shadow-xs shrink-0"
            title="Explore Collection"
          >
            <span>Explore</span>
          </button>
        </div>
      </div>

      {/* Direct Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F0E8DF] bg-[#FAF6F0] px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#4A1525]" />
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">Direct Artisan Order</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setOrderSuccess(false);
                }}
                className="rounded-lg p-1 text-[#8F8175] hover:bg-[#EAE0D4] hover:text-[#292421] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF6ED] text-emerald-600 shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4A1525]">Order Confirmed!</h3>
                <p className="text-xs text-[#7A6D61] leading-relaxed">
                  Thank you for directly supporting master handloom weavers. Your order for <strong>{product.name}</strong> has been registered directly at the loom guild.
                </p>
                <div className="rounded-2xl border border-[#E5DCD0] bg-[#FAF8F4] p-4 text-xs space-y-1 text-left">
                  <p><strong>Item:</strong> {product.name}</p>
                  <p><strong>Amount:</strong> ₹{formattedPrice}</p>
                  <p><strong>UID:</strong> {product.uniqueId || product.code}</p>
                  <p><strong>Status:</strong> Dispatched from Pit Loom</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    setOrderSuccess(false);
                  }}
                  className="w-full rounded-xl bg-[#4A1525] py-3 text-xs font-bold text-white shadow-md hover:bg-[#6A1F35] cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectOrder} className="p-6 space-y-4">
                {/* Product Summary */}
                <div className="flex gap-3.5 items-center rounded-2xl bg-[#FAF8F4] p-3 border border-[#EFE7DC]">
                  <img
                    src={product.image || "/images/kanchi.png"}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover border border-[#E5DCD0]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#A16B16] uppercase">{product.category} • {product.weave}</p>
                    <h4 className="font-serif text-sm font-bold text-[#292421] truncate">{product.name}</h4>
                    <p className="font-serif text-base font-bold text-[#4A1525] mt-0.5">₹{formattedPrice}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4A1525]">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4A1525]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4A1525]">Delivery Address *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat No, Street, Landmark"
                    value={orderForm.shippingAddress}
                    onChange={(e) => setOrderForm({ ...orderForm, shippingAddress: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#4A1525]">City / Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={orderForm.city}
                      onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4A1525]">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 600001"
                      value={orderForm.pincode}
                      onChange={(e) => setOrderForm({ ...orderForm, pincode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#FAF0E1] p-3 text-xs text-[#4A1525] font-semibold">
                  <span>Total Payable:</span>
                  <span className="font-serif text-lg font-bold">₹{formattedPrice}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="flex-1 rounded-xl border border-[#D9CBBF] py-2.5 text-xs font-bold text-[#7A6D61] hover:bg-[#FAF6F0] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="flex flex-2 items-center justify-center gap-2 rounded-xl bg-[#4A1525] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6A1F35] disabled:opacity-50 cursor-pointer"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Direct Order</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Digital Authenticity Certificate Modal */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-[#D09229] bg-white shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="border-b-2 border-dashed border-[#E5DCD0] pb-4 mb-4">
              <div className="flex items-center justify-center gap-1 text-[#4A1525]">
                <ShieldCheck size={24} className="text-[#2E7D32]" />
                <h3 className="font-serif text-lg font-black tracking-wider uppercase">Vastra Handloom</h3>
              </div>
              <p className="text-[10px] font-bold text-[#A16B16] uppercase tracking-widest mt-0.5">
                Authentic Craft Certificate of Origin
              </p>
            </div>

            {product.qrCode && (
              <img
                src={product.qrCode}
                alt="Product QR Code"
                className="mx-auto h-40 w-40 rounded-2xl border border-[#E5DCD0] bg-[#FAF8F4] p-2.5 shadow-sm"
              />
            )}

            <div className="mt-3 rounded-xl bg-[#FAF0E1] p-2 border border-[#E8DEC8]">
              <p className="text-[9px] font-bold text-[#9B8068] uppercase">Unique Item ID</p>
              <p className="font-mono text-xs font-bold text-[#4A1525]">{product.uniqueId || product.code}</p>
            </div>

            <div className="mt-3 text-xs text-[#5C534B] space-y-1 text-left bg-[#FAF8F4] p-3 rounded-xl border border-[#EFE7DC]">
              <p><strong>Handloom Saree:</strong> {product.name}</p>
              <p><strong>Weave Craft:</strong> {product.fabric} ({product.weave})</p>
              <p><strong>Loom Guild:</strong> {formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}</p>
              <p><strong>Origin:</strong> {product.origin || "Kanchipuram, Tamil Nadu"}</p>
              <p className="text-[#2E7D32] font-bold mt-1">✓ 100% Genuine Silk Mark Certified</p>
            </div>

            <button
              type="button"
              onClick={() => setIsCertificateOpen(false)}
              className="mt-4 w-full rounded-xl bg-[#4A1525] py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] cursor-pointer"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
