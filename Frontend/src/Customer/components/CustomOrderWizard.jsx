import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Layers,
  Palette,
  Clock,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  IndianRupee,
  Ruler,
  ArrowRight
} from "lucide-react";

export default function CustomOrderWizard({
  initialManufacturer = "Kathar Weaves",
  initialArtisan = "Rithikeswaran M",
  onSubmitSuccess
}) {
  const navigate = useNavigate();

  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("customerProfile") || "{}");
    } catch {
      return {};
    }
  })();

  const [formData, setFormData] = useState({
    manufacturer: initialManufacturer,
    artisanName: initialArtisan,
    loomType: "Traditional Pit Loom (Pure Silk)",
    fabricChoice: "Pure Mulberry Silk & 24k Gold Zari",
    zariType: "Tested Half-Fine Gold Zari",
    customPattern: "Peacock (Mayil) Motif with Contrast Korvai Border",
    bodyColor: "Crimson Red",
    borderColor: "Temple Gold Contrast",
    dimensions: "Standard 6.3m (with 0.8m blouse piece)",
    targetCompletion: "Within 3-4 Weeks",
    notes: "",
    customerName: savedProfile.fullName || "Ananya Deshmukh",
    customerEmail: savedProfile.email || localStorage.getItem("userEmail") || "customer@example.com",
    customerPhone: savedProfile.phone || "+91 98451 23456",
    deliveryAddress:
      savedProfile.shippingAddress ||
      "Flat 402, Lotus Residency, Indiranagar, Bengaluru, Karnataka - 560038"
  });

  useEffect(() => {
    if (initialManufacturer) {
      setFormData((prev) => ({
        ...prev,
        manufacturer: initialManufacturer,
        artisanName: initialArtisan || prev.artisanName
      }));
    }
  }, [initialManufacturer, initialArtisan]);

  const manufacturersList = [
    { name: "Kathar Weaves", artisan: "Rithikeswaran M", hub: "Coimbatore & Kanchi" },
    { name: "Aura Handlooms", artisan: "Senthil Kumar", hub: "Salem, Tamil Nadu" },
    { name: "Varanasi Silk Guild", artisan: "Rajeshwar Pandey", hub: "Varanasi, UP" },
    { name: "Chettinad Heritage Cotton", artisan: "Alagappan Muthiah", hub: "Karaikudi, TN" }
  ];

  const handleManufacturerChange = (mName) => {
    const found = manufacturersList.find((m) => m.name === mName);
    setFormData((prev) => ({
      ...prev,
      manufacturer: mName,
      artisanName: found ? found.artisan : prev.artisanName
    }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    navigate("/customer/payment", {
      state: {
        isCustomBooking: true,
        orderData: {
          ...formData,
          price: 3000,
          amount: "₹3,000",
          product: `Custom Bespoke Weave (${formData.fabricChoice})`
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleProceedToPayment}
        className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#4A1525]">
              Bespoke Loom Customization Form
            </h2>
            <p className="text-xs text-[#7A6D61] mt-0.5">
              Specify your unique handloom design, zari preferences, color palette, and dedicated weaver.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#FAF0E1] px-3 py-1 text-[11px] font-bold text-[#A16B16]">
            <Sparkles className="h-3.5 w-3.5" />
            100% Custom Weave
          </span>
        </div>

        {/* Section 1: Master Weaver Selection */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068]">
            1. Selected Master Weaver & Guild
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#4A1525]">Artisan Workshop / Guild</label>
              <select
                value={formData.manufacturer}
                onChange={(e) => handleManufacturerChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                {manufacturersList.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.hub})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Assigned Master Craftsman</label>
              <input
                type="text"
                value={formData.artisanName}
                onChange={(e) => setFormData({ ...formData, artisanName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Loom & Fabric Specifications */}
        <div className="space-y-4 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068]">
            2. Loom Mechanics & Yarn Specifications
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#4A1525]">Loom Type</label>
              <select
                value={formData.loomType}
                onChange={(e) => setFormData({ ...formData, loomType: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                <option>Traditional Pit Loom (Pure Silk)</option>
                <option>Jacquard Attachment Loom (Intricate Brocade / Zari)</option>
                <option>Frame Loom (Organic Cotton / Linen)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Zari Metallic Thread</label>
              <select
                value={formData.zariType}
                onChange={(e) => setFormData({ ...formData, zariType: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                <option>Tested Half-Fine Gold Zari</option>
                <option>Pure 24k Gold / Silver Zari (Premium)</option>
                <option>Antique Matte Zari</option>
                <option>Resham Thread Work (No Metallic)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Fabric & Yarn Composition</label>
            <input
              type="text"
              value={formData.fabricChoice}
              onChange={(e) => setFormData({ ...formData, fabricChoice: e.target.value })}
              placeholder="e.g., Pure Mulberry Silk (20/22 denier) with contrast Korvai interlocking"
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Section 3: Pattern, Palette & Dimensions */}
        <div className="space-y-4 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068]">
            3. Motif, Color Palette & Dimensions
          </p>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Bespoke Motif / Pattern</label>
            <input
              type="text"
              value={formData.customPattern}
              onChange={(e) => setFormData({ ...formData, customPattern: e.target.value })}
              placeholder="e.g., Mayil (Peacock), Rudraksham, Temple Gopuram, Floral Jaal"
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-[#4A1525]">Body Color</label>
              <input
                type="text"
                value={formData.bodyColor}
                onChange={(e) => setFormData({ ...formData, bodyColor: e.target.value })}
                placeholder="e.g., Crimson Red, Royal Peacock Blue"
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Border & Pallu Contrast</label>
              <input
                type="text"
                value={formData.borderColor}
                onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                placeholder="e.g., Temple Gold, Emerald Green"
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Target Delivery / Event Date</label>
              <input
                type="text"
                value={formData.targetCompletion}
                onChange={(e) => setFormData({ ...formData, targetCompletion: e.target.value })}
                placeholder="e.g., Within 3-4 Weeks / Wedding on 15 Oct"
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Special Instructions & Monogram Weaving</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add details about customized bride/groom initials in pallu, specific border width, or yarn count requests..."
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Section 4: Customer Details & Summary */}
        <div className="space-y-4 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068]">
            4. Delivery Details & Advance Deposit
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#4A1525]">Patron Name</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A1525]">Contact Phone</label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#4A1525]">Delivery Address</label>
            <textarea
              rows={2}
              required
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#FAF0E1] p-4 text-xs">
            <div>
              <p className="font-bold text-[#4A1525]">Estimated Order Total: ~₹14,500</p>
              <p className="text-[11px] text-[#7A6D61]">
                Initial advance deposit of <strong>₹3,000</strong> required to lock loom warp draft. Balance payable upon loom cutting & dispatch.
              </p>
            </div>
            <span className="mt-2 sm:mt-0 inline-flex items-center gap-1 font-bold text-[#4A1525] text-sm">
              Advance Payable Now: ₹3,000
            </span>
          </div>
        </div>

        {/* Submit to Payment */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-95 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#FCDA8B]" />
          <span>Proceed to Authorize Advance Payment (₹3,000)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
