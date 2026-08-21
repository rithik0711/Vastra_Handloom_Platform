import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import RAG from "./RAG";

import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Filter,
  ImagePlus,
  Maximize2,
  Settings,
  Wrench,
  X,
  Sparkles,
  Trash2,
  Upload,
  Link,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

const categories = [
  "All",
  "Looms",
  "Machines",
  "Tools",
  "Workshop",
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Add Photo Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Looms",
    description: "",
    image: "",
    featured: false
  });

  const userEmail = localStorage.getItem("userEmail") || "kathar_weaves";

  // Fetch Gallery from database by manufacturerId
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/gallery?manufacturerId=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setGalleryItems(json.data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [userEmail]);

  // Filter items
  const filteredImages = galleryItems.filter((item) => {
    const matchCat =
      activeCategory === "All" ||
      item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Category counts
  const categoryCounts = {
    all: galleryItems.length,
    looms: galleryItems.filter((i) => i.category === "Looms").length,
    machines: galleryItems.filter((i) => i.category === "Machines").length,
    tools: galleryItems.filter((i) => i.category === "Tools").length,
    workshop: galleryItems.filter((i) => i.category === "Workshop").length,
  };

  // Handle local file selection with smart image optimization
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1400;
        const MAX_HEIGHT = 1400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPreviewUrl(optimizedDataUrl);
        setFormData((prev) => ({ ...prev, image: optimizedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit new photo to MongoDB
  const handleAddPhotoSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a title for the photo.");
      return;
    }
    if (!formData.image.trim()) {
      alert("Please select an image file.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/manufacturer/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          manufacturerId: localStorage.getItem("userEmail") || "kathar_weaves"
        })
      });
      const json = await res.json();

      if (json.status === "success") {
        setGalleryItems((prev) => [json.data, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          title: "",
          category: "Looms",
          description: "",
          image: "",
          featured: false
        });
        setPreviewUrl("");
        showNotification("Photo added to showcase successfully!");
      } else {
        alert(json.message || "Failed to save photo.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(
        "Could not connect to backend server at http://localhost:5000. Please ensure 'node server.js' is running in the Backend folder."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete photo
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this photo from the gallery?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/manufacturer/gallery/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.status === "success") {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
        if (selectedImage && (selectedImage.id === id || selectedImage._id === id)) {
          setSelectedImage(null);
        }
        showNotification("Photo deleted successfully.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const openImage = (image) => setSelectedImage(image);
  const closeImage = () => setSelectedImage(null);

  const showPrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (item) => (item.id || item._id) === (selectedImage.id || selectedImage._id)
    );
    const previousIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[previousIndex]);
  };

  const showNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (item) => (item.id || item._id) === (selectedImage.id || selectedImage._id)
    );
    const nextIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(filteredImages[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Manufacturer Showcase
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Our Gallery
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Showcase the authentic looms, tools, machinery, and craftsmanship behind your handloom creations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95 lg:self-center"
          >
            <ImagePlus size={16} />
            <span>Add Photos</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{notification}</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Total Photos</p>
                <h3 className="font-serif text-xl font-bold text-[#4A1525]">{categoryCounts.all}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#A16B16]">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Looms</p>
                <h3 className="font-serif text-xl font-bold text-[#A16B16]">{categoryCounts.looms}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EAFA] text-[#704C91]">
                <Settings size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Machines</p>
                <h3 className="font-serif text-xl font-bold text-[#704C91]">{categoryCounts.machines}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6ED] text-[#2E7D32]">
                <Wrench size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Tools & Floor</p>
                <h3 className="font-serif text-xl font-bold text-[#2E7D32]">
                  {categoryCounts.tools + categoryCounts.workshop}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Category Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeCategory === cat
                    ? "bg-[#4A1525] text-white shadow-xs"
                    : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search gallery photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] px-4 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
            <p className="text-xs text-[#8F8175]">Loading showcase photos from database...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CBBF] p-12 text-center">
            <Camera className="h-12 w-12 text-[#B8AAA0]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#4A1525]">No Photos Found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8F8175]">
              No photos match your filter. Click "Add Photos" to upload your workshop images.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              Add First Photo
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => openImage(item)}
                className="group flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Photo Header Container */}
                <div className="relative h-52 w-full overflow-hidden bg-[#FAF6F0]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/handloom.png";
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#4A1525] shadow-xs backdrop-blur-xs">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="rounded-full bg-[#D09229] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id || item._id, e)}
                      title="Delete Photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700 active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#292421] shadow-sm backdrop-blur-xs">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </div>

                {/* Content & Description Below Image */}
                <div className="flex flex-1 flex-col justify-between p-4 bg-white border-t border-[#F0E8DF]">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#292421] group-hover:text-[#4A1525] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#62554A] leading-relaxed line-clamp-3">
                      {item.description || "Authentic handloom tools and production equipment."}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#F5EFE8] pt-2.5 text-[11px] text-[#8F8175]">
                    <span className="font-medium text-[#A16B16]">{item.category}</span>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Photo Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-5 w-5 text-[#4A1525]" />
                  <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                    Add Photo to Showcase
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-[#8F8175] hover:text-[#292421]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddPhotoSubmit} className="mt-5 space-y-4">
                {/* Upload Input */}
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Select Photo File *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!formData.image}
                    onChange={handleFileChange}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] file:mr-3 file:rounded-lg file:border-0 file:bg-[#4A1525] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="mt-1 text-[11px] text-[#8F8175]">Upload JPG, PNG or WEBP from your computer.</p>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-[#E5DCD0] bg-[#FAF6F0]">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Title & Category */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Photo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Pit Loom Setup"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    >
                      <option value="Looms">Looms</option>
                      <option value="Machines">Machines</option>
                      <option value="Tools">Tools</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief details about the machinery, artisan loom or weaving technique..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded-md text-[#4A1525] focus:ring-[#4A1525]"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-[#56493F]">
                    Mark as Featured Showcase Photo
                  </label>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 rounded-xl border border-[#D9CBBF] py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-4 w-4" />
                        <span>Save Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox / Fullscreen Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fadeIn">
            <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#1C1715] text-white shadow-2xl">
              {/* Top Controls */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#FCDA8B]">
                    {selectedImage.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">{selectedImage.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={closeImage}
                  className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Image */}
              <div className="relative flex flex-1 items-center justify-center bg-black p-4">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />

                {/* Left / Right Navigation */}
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-6 rounded-full bg-black/60 p-3 text-white backdrop-blur-xs transition hover:bg-black/80"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-6 rounded-full bg-black/60 p-3 text-white backdrop-blur-xs transition hover:bg-black/80"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Caption Footer */}
              <div className="border-t border-white/10 p-5 bg-[#171210]">
                <p className="text-xs text-white/80 leading-relaxed">
                  {selectedImage.description || "Authentic handloom tools and production environment."}
                </p>
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