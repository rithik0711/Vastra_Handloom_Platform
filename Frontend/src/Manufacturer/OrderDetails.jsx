import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  ArrowLeft,
  Sparkles,
  Printer,
  Download,
  Copy,
  Check,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Layers,
  Scissors,
  Bookmark,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Edit3
} from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const userEmail = localStorage.getItem("userEmail") || "kathar_weaves";

  useEffect(() => {
    if (!order && id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/orders/${id}`);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setOrder(json.data);
      } else {
        // Fallback fetch all orders and find
        const resAll = await fetch(`${API_BASE_URL}/api/manufacturer/orders?manufacturerId=${encodeURIComponent(userEmail)}`);
        const jsonAll = await resAll.json();
        if (jsonAll.status === "success" && Array.isArray(jsonAll.data)) {
          const found = jsonAll.data.find((o) => (o.orderId || o._id || o.id) === id);
          if (found) setOrder(found);
        }
      }
    } catch (err) {
      console.warn("Fetch order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    const orderKey = order._id || order.id || order.orderId;

    try {
      const res = await fetch(`${API_BASE_URL}/api/manufacturer/orders/${orderKey}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.status === "success") {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        showNotification(`Order status updated to: ${newStatus}`);
      }
    } catch (err) {
      setOrder((prev) => ({ ...prev, status: newStatus }));
      showNotification(`Order status updated to: ${newStatus}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyAddress = () => {
    if (!order) return;
    const address = order.deliveryAddress || `${order.address || ""}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`;
    navigator.clipboard.writeText(`${order.customer}\nPh: ${order.customerPhone || ""}\n${address}`);
    setCopied(true);
    showNotification("Customer shipping address copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintJobCard = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Order Placed":
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "In Production":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Quality Check":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Ready to Ship":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Completed":
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-stone-50 text-stone-800 border-stone-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <Sidebar />
        <main className="manufacturer-main flex min-h-screen flex-col items-center justify-center p-8">
          <RefreshCw className="animate-spin text-[#D09229]" size={36} />
          <p className="mt-3 font-serif text-base font-bold text-[#4A1525]">Loading Order Details...</p>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <Sidebar />
        <main className="manufacturer-main flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <p className="font-serif text-xl font-bold text-[#4A1525]">Order #{id} Not Found</p>
          <p className="mt-1 text-xs text-[#7A6D61]">The requested order record could not be loaded.</p>
          <button
            type="button"
            onClick={() => navigate("/manufacturer/orders")}
            className="mt-4 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
          >
            ← Back to Orders
          </button>
        </main>
      </div>
    );
  }

  // Extract design specifications if attached
  const design = order.designDetails || {};
  const displayImage = order.designImage || order.imageUrl || order.image || "/images/kanchi.png";
  const isCustom = order.orderType === "Custom Loom" || Boolean(order.designId) || Boolean(order.designDetails);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E5DCD0] pb-6">
          <div>
            <button
              type="button"
              onClick={() => navigate("/manufacturer/orders")}
              className="flex items-center gap-1 text-xs font-bold text-[#D09229] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Back to Orders List</span>
            </button>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-[#4A1525] sm:text-3xl">
                Order #{order.orderId || id}
              </h1>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(order.status)}`}
              >
                {order.status}
              </span>
              {isCustom && (
                <span className="rounded-full bg-[#FAF3E8] border border-[#E0D3C1] px-3 py-1 text-xs font-bold text-[#D09229] flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Custom Loom Weave</span>
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#7A6D61]">
              Placed on {order.orderDate || "Recent"} • Assigned Weaver: <strong>{order.artisanName || order.manufacturer || "Kathar Weaves"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintJobCard}
              className="flex items-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white px-3.5 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] shadow-2xs"
            >
              <Printer size={14} />
              <span>Print Loom Job Ticket</span>
            </button>

            {/* Quick Status Updater */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#E0D3C1] bg-white p-1 shadow-2xs">
              <span className="px-2 text-[11px] font-bold text-[#7A6D61]">Set Status:</span>
              <select
                disabled={updating}
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-lg bg-[#FAF8F4] px-2.5 py-1 text-xs font-bold text-[#4A1525] focus:outline-hidden cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="In Production">In Production</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Ready to Ship">Ready to Ship</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Saree Design Blueprint & Visual Render (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Design Image & Visualizer Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#D09229]" />
                  <h2 className="font-serif text-base font-bold text-[#4A1525]">
                    {isCustom ? "Custom Saree Design Blueprint" : "Product Specification"}
                  </h2>
                </div>
                {displayImage && (
                  <button
                    type="button"
                    onClick={() => window.open(displayImage, "_blank")}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#D09229] hover:underline"
                  >
                    <span>View High-Res</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>

              {/* Saree Image Showcase */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#E0D3C1] bg-[#1a1412] shadow-inner relative h-80">
                <img
                  src={displayImage}
                  alt={order.product}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4">
                  <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs w-fit">
                    ✨ {isCustom ? "Custom Saree AI Photorealistic Synthesis" : "Authentic Handloom Product"}
                  </span>
                  <div className="flex items-center justify-between text-white">
                    <span className="font-serif text-base font-bold">{order.product}</span>
                    <span className="font-serif text-sm font-bold text-amber-300">{order.amount}</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Fabric</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.fabric || order.fabricChoice || "Pure Mulberry Silk"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Base Color</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.baseColor || order.bodyColor || "Maroon"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Zari Grade</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.zari || order.zariType || "Gold Zari"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Border Style</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.borderStyle || order.borderColor || "Temple Border"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Pallu Motif</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.palluDesign || "Peacock"} ({design.palluColor || "Gold"})
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">Occasion</p>
                  <p className="mt-1 font-serif text-xs font-bold text-[#4A1525]">
                    {design.occasion || "Bridal"}
                  </p>
                </div>
              </div>

              {/* Motifs Chips */}
              {design.motifs && design.motifs.length > 0 && (
                <div className="mt-4 rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                    Selected Traditional Motifs (Buttas)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {design.motifs.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-[#E0D3C1] bg-white px-2.5 py-1 text-xs font-semibold text-[#4A1525]"
                      >
                        ✦ {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Master Weaver Notes */}
              {(design.additionalInstructions || order.notes) && (
                <div className="mt-4 rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                    Artisan Loom Notes & Instructions
                  </p>
                  <p className="mt-1.5 text-xs text-[#292421] leading-relaxed">
                    {design.additionalInstructions || order.notes}
                  </p>
                </div>
              )}

              {/* AI Rendering Prompt */}
              {design.compiledPrompt && (
                <div className="mt-4 rounded-xl border border-[#E8DFC8] bg-[#FAF3E8] p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A1525]">
                    AI Image Synthesis Prompt
                  </p>
                  <p className="mt-1 text-xs italic text-[#7A6D61] bg-white p-2.5 rounded-lg border border-[#EFE7DC]">
                    "{design.compiledPrompt}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer & Delivery Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Details Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <h3 className="font-serif text-base font-bold text-[#4A1525]">Customer Information</h3>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#D09229] hover:underline"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? "Copied!" : "Copy Address"}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF3E8] text-[#4A1525] shrink-0 font-bold">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#4A1525] text-sm">{order.customer || "Ananya Deshmukh"}</p>
                    <p className="text-[#7A6D61]">Verified Handloom Patron</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF3E8] text-[#4A1525] shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#292421]">{order.customerPhone || "+91 98451 23456"}</p>
                    <p className="text-[#7A6D61] text-[10px]">Primary Contact</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF3E8] text-[#4A1525] shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#292421]">{order.customerEmail || "Not specified"}</p>
                    <p className="text-[#7A6D61] text-[10px]">Email Address</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-[#F0E8DF]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF3E8] text-[#4A1525] shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#4A1525]">Shipping / Delivery Address</p>
                    <p className="mt-1 text-[#292421] leading-relaxed">
                      {order.deliveryAddress || `${order.address || ""}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Payment Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-[#4A1525] border-b border-[#F0E8DF] pb-3">
                Payment & Deposit Details
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Total Order Value:</span>
                  <span className="font-bold text-[#4A1525] text-sm">{order.amount || `₹${order.price || 14500}`}</span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-[#292421]">{order.paymentMethod || "UPI / Online"}</span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-semibold text-[#292421]">{order.transactionId || "TXN-847291"}</span>
                </div>
                <div className="flex justify-between text-[#7A6D61]">
                  <span>Payment Status:</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {order.paymentStatus || "Paid"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality & GI Authenticity Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-gradient-to-br from-[#4A1525] to-[#7A263B] p-6 text-white shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#FCDA8B] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Artisan Verification</span>
              </div>
              <h4 className="font-serif text-lg font-bold">100% Genuine Handloom</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Ensure Silk Mark certified tags and GI authenticity seals are physically affixed to the saree fold before marking as Ready to Ship.
              </p>
            </div>
          </div>
        </div>
      </main>

      <RAG />
    </div>
  );
}
