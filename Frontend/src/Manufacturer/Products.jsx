import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  X,
  Loader2,
  Upload,
  Image as ImageIcon
} from "lucide-react";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Silk",
    fabric: "Pure Silk",
    weave: "Hand Woven",
    price: "",
    stock: 10,
    maxStock: 20,
    featured: false,
    description: ""
  });

  const userEmail = localStorage.getItem("userEmail") || "kathar_weaves";

  // Fetch Products by Manufacturer ID
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/products?manufacturerId=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error("Products Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userEmail]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Image Upload with Canvas Compression
  const handleImageUpload = (e) => {
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
        setFormData((prev) => ({ ...prev, image: optimizedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      (product.name && product.name.toLowerCase().includes(searchText)) ||
      (product.fabric && product.fabric.toLowerCase().includes(searchText)) ||
      (product.weave && product.weave.toLowerCase().includes(searchText)) ||
      (product.code && product.code.toLowerCase().includes(searchText));

    const matchesCategory =
      category === "All" || product.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getStatusStyle = (status) => {
    if (status === "In Stock") {
      return "bg-[#EAF6ED] text-[#2E7D32] border-[#C8E6C9]";
    }
    if (status === "Low Stock") {
      return "bg-[#FFF4DF] text-[#A16B16] border-[#F5DEC0]";
    }
    return "bg-[#FBEEEE] text-[#A44747] border-[#F4CFCF]";
  };

  const getStockWidth = (stock, maxStock) => {
    if (stock === 0) return "0%";
    return `${Math.min((stock / (maxStock || 20)) * 100, 100)}%`;
  };

  const getStockColor = (status) => {
    if (status === "Low Stock") return "bg-[#D09229]";
    if (status === "Out of Stock") return "bg-[#A44747]";
    return "bg-emerald-600";
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Silk",
      fabric: "Pure Silk",
      weave: "Hand Woven",
      price: "",
      stock: 10,
      maxStock: 20,
      featured: false,
      description: ""
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || "",
      category: p.category || "Silk",
      fabric: p.fabric || "Pure Silk",
      weave: p.weave || "Hand Woven",
      price: p.price || "",
      stock: p.stock || 0,
      maxStock: p.maxStock || 20,
      image: p.image || "/images/kanchi.png",
      featured: Boolean(p.featured),
      description: p.description || ""
    });
    setIsModalOpen(true);
  };

  // Handle Save
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide product name and price.");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingProduct
        ? `http://localhost:5000/api/manufacturer/products/${editingProduct.id || editingProduct._id}`
        : "http://localhost:5000/api/manufacturer/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          maxStock: Number(formData.maxStock),
          manufacturerId: localStorage.getItem("userEmail") || "kathar_weaves"
        })
      });

      const json = await res.json();
      if (json.status === "success") {
        fetchProducts();
        setIsModalOpen(false);
        showNotification(
          editingProduct ? "Product details updated successfully!" : "New product added to catalog successfully!"
        );
      } else {
        alert(json.message || "Failed to save product.");
      }
    } catch (err) {
      console.error("Save product error:", err);
      alert("Error connecting to server to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/manufacturer/products/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.status === "success") {
        setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        showNotification("Product removed successfully.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Inventory Management
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Products & Handlooms
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Manage your authentic sarees, loom batches, live inventory stock and pricing.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{notification}</span>
          </div>
        )}

        {/* Quick KPI Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Total Products</p>
                <h3 className="font-serif text-xl font-bold text-[#4A1525]">{products.length}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6ED] text-[#2E7D32]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">In Stock</p>
                <h3 className="font-serif text-xl font-bold text-[#2E7D32]">
                  {products.filter((p) => p.stock > 5).length}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#A16B16]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Low Stock</p>
                <h3 className="font-serif text-xl font-bold text-[#A16B16]">
                  {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EAFA] text-[#704C91]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">Categories</p>
                <h3 className="font-serif text-xl font-bold text-[#704C91]">4 Handloom Weaves</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
            <input
              type="text"
              placeholder="Search by saree name, weave, fabric or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-4 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Silk", "Cotton", "Linen"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${category === cat
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
            <p className="text-xs text-[#8F8175]">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CBBF] p-12 text-center">
            <Package className="h-12 w-12 text-[#B8AAA0]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#4A1525]">No Products Found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8F8175]">
              No products match your search or filter. Click "Add Product" to create one.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id || p._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-56 w-full overflow-hidden bg-[#FAF6F0]">
                  <img
                    src={p.image || "/images/kanchi.png"}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/kanchi.png";
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#4A1525] shadow-xs">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-[#D09229] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      title="Edit Product"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#292421] shadow-sm hover:bg-white active:scale-95"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id || p._id, p.name)}
                      title="Delete Product"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-95"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8F8175]">
                      <span>{p.code}</span>
                      <span className="font-semibold text-[#A16B16]">{p.weave}</span>
                    </div>

                    <h3 className="mt-1 font-serif text-base font-bold text-[#292421] group-hover:text-[#4A1525] transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#7A6D61] line-clamp-2">
                      {p.fabric} • {p.description || "Authentic handcrafted handloom creation."}
                    </p>
                  </div>

                  {/* Stock Bar & Pricing */}
                  <div className="mt-4 border-t border-[#F0E8DF] pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#8F8175]">Stock: {p.stock} units</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EAE0D4]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getStockColor(p.status)}`}
                        style={{ width: getStockWidth(p.stock, p.maxStock) }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-serif text-lg font-bold text-[#4A1525]">
                        ₹{typeof p.price === "number" ? p.price.toLocaleString("en-IN") : p.price}
                      </p>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="rounded-xl border border-[#D9CBBF] px-3 py-1.5 text-xs font-bold text-[#56493F] transition hover:border-[#4A1525] hover:text-[#4A1525]"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                  {editingProduct ? "Edit Handloom Product" : "Add New Handloom Product"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#8F8175] hover:text-[#292421]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Product / Saree Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kanchipuram Pure Silk Saree"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    >
                      <option value="Silk">Silk</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Linen">Linen</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 8500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Fabric Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Mulberry Silk"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Weave Technique</label>
                    <input
                      type="text"
                      placeholder="e.g. Hand Woven Korvai"
                      value={formData.weave}
                      onChange={(e) => setFormData({ ...formData, weave: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Stock Count</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Max Loom Capacity</label>
                    <input
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Upload Image from Device */}
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Product Photo *</label>
                  <div className="mt-1.5 flex items-center gap-3">
                    {formData.image && (
                      <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] shrink-0 shadow-2xs">
                        <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D9CBBF] bg-[#FAF6F0] py-3 text-xs font-bold text-[#4A1525] hover:bg-[#F3ECE4] transition active:scale-98">
                      <Upload size={15} />
                      <span>{formData.image ? "Change Photo File" : "Choose Photo from Device"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe authentic weave highlights, zari border, motifs..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredProduct"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded-md text-[#4A1525] focus:ring-[#4A1525]"
                  />
                  <label htmlFor="featuredProduct" className="text-xs font-semibold text-[#56493F]">
                    Featured on Artisan Showcase
                  </label>
                </div>

                <div className="mt-5 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Product</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <RAG />
    </div>
  );
}