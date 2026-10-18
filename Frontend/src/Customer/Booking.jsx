import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  Sparkles,
  Calendar,
  Layers,
  Palette,
  Clock,
  CheckCircle2,
  Send,
  HelpCircle,
  ShieldCheck,
  Bookmark,
  Check,
  ArrowRight,
  User,
  IndianRupee,
  Ruler,
  Upload,
  Image as ImageIcon,
  X,
  Building,
  MapPin,
  Star
} from "lucide-react";

export default function CustomerBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedDesign = location.state?.selectedDesign || null;
  const initialMfr = searchParams.get("manufacturer") || location.state?.initialManufacturer || "Kathar Weaves";
  const initialArtisan = searchParams.get("artisanName") || location.state?.initialArtisan || "Rithikeswaran M";

  const userEmail = localStorage.getItem("userEmail") || "";

  const [manufacturersList, setManufacturersList] = useState([]);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(passedDesign);
  const [designSource, setDesignSource] = useState(passedDesign ? "blueprint" : "upload"); // "blueprint" | "upload"
  const [uploadedImage, setUploadedImage] = useState(passedDesign?.imageUrl || "");
  const [uploadFileName, setUploadFileName] = useState("");

  const [formData, setFormData] = useState({
    manufacturer: initialMfr,
    artisanName: initialArtisan,
    loomType: "Traditional Pit Loom (Pure Silk)",
    fabricChoice: passedDesign?.fabric ? `${passedDesign.fabric} & ${passedDesign.zari || "Gold"} Zari` : "Pure Mulberry Silk & 24k Gold Zari",
    zariType: passedDesign?.zari ? `${passedDesign.zari} Zari` : "Tested Half-Fine Gold Zari",
    customPattern: passedDesign?.title || (passedDesign?.motifs ? `${passedDesign.motifs.join(", ")} Motifs` : "Custom Bespoke Saree"),
    bodyColor: passedDesign?.baseColor || "Crimson Red",
    borderColor: passedDesign?.borderStyle ? `${passedDesign.borderWidth || ""} ${passedDesign.borderStyle}` : "Temple Gold Contrast",
    dimensions: "Standard 6.3m (with 0.8m blouse piece)",
    targetCompletion: "Within 3-4 Weeks",
    notes: passedDesign?.additionalInstructions || "",
    customerName: localStorage.getItem("userName") || "",
    customerEmail: userEmail,
    customerPhone: "",
    deliveryAddress: ""
  });

  // Fetch manufacturers, customer profile, and customer designs dynamically from DB
  useEffect(() => {
    // 1. Fetch live manufacturers from DB
    fetch("http://localhost:5000/api/customer/manufacturers")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setManufacturersList(json.data);
          const currentMfr = json.data.find(
            (m) => (m.name || m.businessName) === initialMfr
          ) || json.data[0];

          setFormData((prev) => ({
            ...prev,
            manufacturer: currentMfr.name || currentMfr.businessName,
            artisanName: currentMfr.artisanName || currentMfr.ownerName || prev.artisanName
          }));
        }
      })
      .catch((err) => console.warn("Manufacturers fetch note:", err));

    // 2. Fetch Customer Profile from DB
    fetch(`http://localhost:5000/api/customer/profile?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setFormData((prev) => ({
            ...prev,
            customerName: json.data.fullName || prev.customerName,
            customerEmail: json.data.email || userEmail,
            customerPhone: json.data.phone || prev.customerPhone,
            deliveryAddress: json.data.deliveryAddress || prev.deliveryAddress
          }));
        }
      })
      .catch((err) => console.warn("Profile fetch note:", err));

    // 3. Fetch Customer Designs from DB
    fetch(`http://localhost:5000/api/customer/design?customerEmail=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data)) {
          setSavedDesigns(json.data);
          if (json.data.length > 0 && !passedDesign) {
            setDesignSource("blueprint");
          }
        }
      })
      .catch((err) => console.warn("Designs note:", err));
  }, [userEmail, initialMfr]);

  // Handle selecting a saved blueprint
  const handleSelectDesign = (des) => {
    setSelectedDesign(des);
    if (des) {
      setUploadedImage(des.imageUrl || "");
      setFormData((prev) => ({
        ...prev,
        fabricChoice: `${des.fabric || "Pure Silk"} & ${des.zari || "Gold"} Zari`,
        zariType: `${des.zari || "Gold"} Zari`,
        customPattern: des.title || (des.motifs?.length ? `${des.motifs.join(", ")} Motifs` : prev.customPattern),
        bodyColor: des.baseColor || prev.bodyColor,
        borderColor: des.borderStyle ? `${des.borderWidth || ""} ${des.borderStyle}` : prev.borderColor,
        notes: des.additionalInstructions || prev.notes
      }));
    }
  };

  // Handle custom image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Booking & Navigate to Payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const finalImage = uploadedImage || selectedDesign?.imageUrl || "/images/kanchi.png";

    navigate("/customer/payment", {
      state: {
        isCustomBooking: true,
        orderData: {
          ...formData,
          price: 3000,
          amount: "₹3,000",
          product: selectedDesign?.title || formData.customPattern || `Custom Bespoke Weave (${formData.fabricChoice})`,
          designTitle: selectedDesign?.title || formData.customPattern,
          designId: selectedDesign?._id || selectedDesign?.id || "",
          designImage: finalImage,
          imageUrl: finalImage,
          image: finalImage,
          designDetails: selectedDesign || {
            fabric: formData.fabricChoice,
            baseColor: formData.bodyColor,
            borderStyle: formData.borderColor,
            zari: formData.zariType,
            customPattern: formData.customPattern,
            notes: formData.notes,
            customUploadedImage: uploadedImage
          }
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Bespoke Loom Reservation
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            Book Custom Handloom Saree on Loom
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Select a verified master weaver, upload your own saree photo or select an AI blueprint, and reserve your dedicated pit loom.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Custom Order Wizard Form (8 Cols) */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleProceedToPayment}
              className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-6"
            >
              {/* Step 1: Select Master Weaver Guild */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                  <h2 className="font-serif text-lg font-bold text-[#4A1525] flex items-center gap-2">
                    <Building size={18} className="text-[#D09229]" />
                    <span>1. Select Master Weaver & Handloom Guild</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-[#8F8175]">
                    {manufacturersList.length} Guilds Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {manufacturersList.map((m) => {
                    const name = m.name || m.businessName;
                    const isSelected = formData.manufacturer === name;
                    return (
                      <div
                        key={m._id || m.id || name}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            manufacturer: name,
                            artisanName: m.artisanName || m.ownerName || prev.artisanName
                          }))
                        }
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#4A1525] bg-[#FAF3E8] ring-2 ring-[#4A1525]/15 shadow-xs"
                            : "border-[#EFE7DC] bg-[#FAF8F4] hover:border-[#D09229] hover:bg-white"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E0D3C1] font-serif font-bold text-[#4A1525]">
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-xs font-bold text-[#4A1525] truncate">{name}</h4>
                            {isSelected && <Check size={14} className="text-[#4A1525] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#7A6D61] truncate">
                            Master: <strong>{m.artisanName || m.ownerName}</strong>
                          </p>
                          <p className="text-[10px] text-[#8F8175] mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-[#D09229]" />
                            <span>{m.location}</span>
                            <span className="mx-1">•</span>
                            <span>{m.activeLooms || 18} Looms</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Saree Design Source (Upload vs Saved Blueprint) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                  <h2 className="font-serif text-lg font-bold text-[#4A1525] flex items-center gap-2">
                    <Palette size={18} className="text-[#D09229]" />
                    <span>2. Saree Design & Visual Reference</span>
                  </h2>

                  {/* Toggle Tabs */}
                  <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#EFE7DC]">
                    <button
                      type="button"
                      onClick={() => setDesignSource("upload")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        designSource === "upload"
                          ? "bg-[#4A1525] text-white shadow-xs"
                          : "text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      Upload Saree Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesignSource("blueprint")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        designSource === "blueprint"
                          ? "bg-[#4A1525] text-white shadow-xs"
                          : "text-[#7A6D61] hover:text-[#4A1525]"
                      }`}
                    >
                      Saved AI Blueprints ({savedDesigns.length})
                    </button>
                  </div>
                </div>

                {/* Mode A: Upload Custom Saree Image */}
                {designSource === "upload" && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border-2 border-dashed border-[#D9CBBF] bg-[#FAF8F4] p-6 text-center hover:bg-[#FAF3E8] transition">
                      {uploadedImage ? (
                        <div className="space-y-3">
                          <img
                            src={uploadedImage}
                            alt="Uploaded saree reference"
                            className="h-44 w-full max-w-sm mx-auto object-cover rounded-xl border border-[#E5DCD0] shadow-sm"
                          />
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                              ✓ Reference Photo Attached {uploadFileName ? `(${uploadFileName})` : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedImage("");
                                setUploadFileName("");
                              }}
                              className="text-xs text-red-600 hover:underline font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 text-[#D09229] mx-auto" />
                          <div>
                            <p className="font-serif text-sm font-bold text-[#4A1525]">
                              Upload Your Own Saree Image / Reference Photo
                            </p>
                            <p className="text-xs text-[#7A6D61] mt-0.5">
                              Upload wedding moodboard photos, family heirloom samples, or pattern sketches (PNG, JPG, WEBP)
                            </p>
                          </div>
                          <label className="inline-block mt-2 cursor-pointer rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#6A1F35] transition">
                            <span>Browse & Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mode B: Select From Saved AI Blueprints */}
                {designSource === "blueprint" && (
                  <div className="space-y-3">
                    {savedDesigns.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#D9CBBF] bg-[#FAF8F4] p-6 text-center">
                        <p className="font-serif text-sm font-bold text-[#4A1525]">No Saved Blueprints in Studio</p>
                        <p className="text-xs text-[#7A6D61] mt-1">
                          You haven't saved any AI custom designs yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate("/customer/create-design")}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                        >
                          <Sparkles size={13} />
                          <span>Launch Saree Studio</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {savedDesigns.map((des) => {
                          const isSelected = selectedDesign && (selectedDesign._id || selectedDesign.id) === (des._id || des.id);
                          return (
                            <div
                              key={des._id || des.id}
                              onClick={() => handleSelectDesign(des)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                                isSelected
                                  ? "border-[#4A1525] bg-[#FAF3E8] ring-2 ring-[#4A1525]/15 shadow-xs"
                                  : "border-[#EFE7DC] bg-white hover:border-[#D09229]"
                              }`}
                            >
                              {des.imageUrl ? (
                                <img
                                  src={des.imageUrl}
                                  alt={des.title}
                                  className="h-14 w-14 rounded-lg object-cover border border-[#E0D3C1] shrink-0"
                                />
                              ) : (
                                <div
                                  className="h-14 w-14 rounded-lg shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                                  style={{ backgroundColor: des.customBaseHex || "#800000" }}
                                >
                                  ✦
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-serif text-xs font-bold text-[#4A1525] truncate">
                                  {des.title}
                                </p>
                                <p className="text-[10px] text-[#7A6D61] truncate">
                                  {des.fabric} • {des.zari} Zari
                                </p>
                                <p className="text-[10px] text-[#A16B16] truncate">
                                  {des.borderStyle}
                                </p>
                              </div>
                              {isSelected && (
                                <span className="h-5 w-5 rounded-full bg-[#4A1525] text-white flex items-center justify-center shrink-0">
                                  <Check size={12} />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3: Weaving Specifications */}
              <div className="space-y-4 pt-2">
                <h2 className="font-serif text-lg font-bold text-[#4A1525] border-b border-[#F0E8DF] pb-3 flex items-center gap-2">
                  <Ruler size={18} className="text-[#D09229]" />
                  <span>3. Custom Weave Specifications</span>
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Fabric Choice</label>
                    <input
                      type="text"
                      value={formData.fabricChoice}
                      onChange={(e) => setFormData({ ...formData, fabricChoice: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Body Base Color</label>
                    <input
                      type="text"
                      value={formData.bodyColor}
                      onChange={(e) => setFormData({ ...formData, bodyColor: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Border Style & Zari</label>
                    <input
                      type="text"
                      value={formData.borderColor}
                      onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Custom Pattern & Motif</label>
                    <input
                      type="text"
                      value={formData.customPattern}
                      onChange={(e) => setFormData({ ...formData, customPattern: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Special Artisan Loom Instructions</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specify custom pallu length, blouse styling, or specific warp density..."
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Deposit Pricing Box */}
              <div className="rounded-2xl bg-[#FAF0E1] border border-[#E8DFC8] p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#A16B16] uppercase tracking-wider">
                    Loom Slot Booking Advance Deposit
                  </p>
                  <p className="text-xs text-[#7A6D61]">
                    Remaining balance payable upon photorealistic loom completion
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl font-bold text-[#4A1525]">₹3,000</p>
                  <p className="text-[10px] text-[#7A6D61]">Est. Full Total: ₹14,500</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 cursor-pointer"
              >
                <span>Authorize Advance Deposit & Reserve Loom</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          {/* Right Column: Summary & Artisan Guarantee (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Visual Attachment Preview Card */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-[#4A1525]">Attached Saree Blueprint</h3>
              <div className="overflow-hidden rounded-2xl border border-[#E0D3C1] bg-[#1a1412] h-52 relative">
                <img
                  src={uploadedImage || selectedDesign?.imageUrl || "/images/kanchi.png"}
                  alt="Attached reference"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 text-white text-xs font-bold">
                  <span>{selectedDesign?.title || formData.customPattern}</span>
                </div>
              </div>
              <div className="text-xs text-[#7A6D61] space-y-1">
                <p><strong>Selected Guild:</strong> {formData.manufacturer}</p>
                <p><strong>Assigned Weaver:</strong> {formData.artisanName}</p>
                <p><strong>Fabric:</strong> {formData.fabricChoice}</p>
              </div>
            </div>

            {/* Artisan Guarantee */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-gradient-to-br from-[#4A1525] to-[#7A263B] p-6 text-white shadow-xs">
              <div className="flex items-center gap-2 text-[#FCDA8B] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Bespoke Artisan Guarantee</span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-bold">100% Dedicated Pit Loom</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80">
                Your saree is woven on a single dedicated loom by the designated master weaver. We send live photo and video updates as warp drafting begins.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
