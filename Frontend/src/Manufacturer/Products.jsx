import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
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
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
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

  // QR Code Modal State
  const [selectedQrProduct, setSelectedQrProduct] = useState(null);
  const [copiedUid, setCopiedUid] = useState(false);

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
        `${API_BASE_URL}/api/manufacturer/products?manufacturerId=${encodeURIComponent(userEmail)}`
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
      (product.uniqueId && product.uniqueId.toLowerCase().includes(searchText)) ||
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

  // Handle Save (Creates unique ID and QR code)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide product name and price.");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingProduct
        ? `${API_BASE_URL}/api/manufacturer/products/${editingProduct.id || editingProduct._id}`
        : `${API_BASE_URL}/api/manufacturer/products`;
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
      if (json.status === "success" && json.data) {
        await fetchProducts();
        setIsModalOpen(false);
        setSelectedQrProduct(json.data);
        showNotification(
          editingProduct
            ? "Product details updated successfully!"
            : "Product created! Unique ID & QR Code generated successfully."
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
      const res = await fetch(`${API_BASE_URL}/api/manufacturer/products/${id}`, {
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

  // Copy Unique ID to clipboard
  const handleCopyUid = (uid) => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  // Download QR Code image
  const handleDownloadQr = (product) => {
    if (!product || !product.qrCode) return;
    const link = document.createElement("a");
    link.href = product.qrCode;
    link.download = `VASTRA-QR-${product.uniqueId || product.code || "product"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Product Authenticity Label / Tag
  const handlePrintLabel = (product) => {
    if (!product) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Authenticity Label - ${product.name}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              color: #292421;
              display: flex;
              justify-content: center;
              background: #faf8f5;
            }
            .tag-card {
              width: 380px;
              border: 2px solid #4A1525;
              border-radius: 16px;
              padding: 24px;
              background: #fff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              text-align: center;
            }
            .brand-header {
              border-bottom: 2px dashed #E5DCD0;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }
            .brand-title {
              font-size: 18px;
              font-weight: 900;
              color: #4A1525;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .brand-sub {
              font-size: 10px;
              color: #A16B16;
              font-weight: 700;
              letter-spacing: 1px;
            }
            .qr-img {
              width: 180px;
              height: 180px;
              margin: 10px auto;
              border: 1px solid #E5DCD0;
              border-radius: 12px;
              padding: 6px;
            }
            .uid-badge {
              background: #FAF0E1;
              color: #4A1525;
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: bold;
              display: inline-block;
              margin: 8px 0;
              border: 1px solid #E5DCD0;
            }
            .product-name {
              font-size: 16px;
              font-weight: bold;
              color: #4A1525;
              margin: 8px 0 4px;
            }
            .specs {
              font-size: 11px;
              color: #7A6D61;
              line-height: 1.5;
            }
            .price {
              font-size: 18px;
              font-weight: 900;
              color: #4A1525;
              margin-top: 12px;
            }
            .certified {
              margin-top: 14px;
              font-size: 9px;
              color: #2E7D32;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="tag-card">
            <div class="brand-header">
              <div class="brand-title">Vastra Handloom</div>
              <div class="brand-sub">Authentic Artisan Verification Tag</div>
            </div>
            <img src="${product.qrCode}" class="qr-img" alt="QR Code" />
            <div><span class="uid-badge">UID: ${product.uniqueId || product.code}</span></div>
            <div class="product-name">${product.name}</div>
            <div class="specs">
              Category: <strong>${product.category}</strong> | Weave: <strong>${product.weave}</strong><br />
              Fabric: <strong>${product.fabric}</strong><br />
              Loom Guild: <strong>${product.manufacturerId || "Kathar Weaves"}</strong>
            </div>
            <div class="price">₹${Number(product.price).toLocaleString("en-IN")}</div>
            <div class="certified">✓ 100% Authentic Handloom & Silk Mark Certified</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                Inventory & Authenticity
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Products & QR Inventory
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Manage authentic sarees, automated Unique Product IDs, and printable QR verification tags.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95 cursor-pointer"
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
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8F8175]">QR Authenticated</p>
                <h3 className="font-serif text-xl font-bold text-[#A16B16]">
                  {products.length} Tags Generated
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
              placeholder="Search by saree name, unique ID, weave, fabric or code..."
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
                className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  category === cat
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
            <p className="text-xs text-[#8F8175]">Loading products and QR codes...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CBBF] p-12 text-center">
            <Package className="h-12 w-12 text-[#B8AAA0]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#4A1525]">No Products Found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8F8175]">
              No products match your search or filter. Click "Add Product" to create one with a unique ID & QR Code.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 rounded-xl bg-[#4A1525] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
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
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#4A1525] shadow-xs">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-[#D09229] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* QR Badge on Image */}
                  <button
                    type="button"
                    onClick={() => setSelectedQrProduct(p)}
                    title="View Authenticity QR Code"
                    className="absolute bottom-3 right-3 flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#4A1525] shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <QrCode size={13} className="text-[#D09229]" />
                    <span>QR Code</span>
                  </button>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => setSelectedQrProduct(p)}
                      title="View QR Code & Authenticity Tag"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF0E1] text-[#A16B16] shadow-sm hover:bg-white active:scale-95 cursor-pointer"
                    >
                      <QrCode size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      title="Edit Product"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#292421] shadow-sm hover:bg-white active:scale-95 cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id || p._id, p.name)}
                      title="Delete Product"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-95 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4 bg-white">
                  <div>
                    {/* Unique Product ID Tag */}
                    <div className="flex items-center justify-between text-[11px] text-[#8F8175]">
                      <span className="font-mono font-semibold text-[#4A1525] bg-[#FAF0E1] px-2 py-0.5 rounded-md border border-[#E8DEC8] truncate max-w-[170px]" title={p.uniqueId || p.code}>
                        UID: {p.uniqueId ? p.uniqueId.slice(0, 18) + "..." : p.code}
                      </span>
                      <span className="font-semibold text-[#A16B16]">{p.weave}</span>
                    </div>

                    <h3 className="mt-2 font-serif text-base font-bold text-[#292421] group-hover:text-[#4A1525] transition-colors leading-snug">
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
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedQrProduct(p)}
                          className="flex items-center gap-1 rounded-xl border border-[#D09229] bg-[#FAF0E1] px-2.5 py-1.5 text-xs font-bold text-[#A16B16] hover:bg-[#F3E5D0] transition cursor-pointer"
                        >
                          <QrCode size={13} />
                          <span>QR Tag</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="rounded-xl border border-[#D9CBBF] px-2.5 py-1.5 text-xs font-bold text-[#56493F] transition hover:border-[#4A1525] hover:text-[#4A1525] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Authenticity Modal */}
        {selectedQrProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#F0E8DF] bg-[#FAF6F0] px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A1525] text-white">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#4A1525]">
                      Authenticity QR Certificate
                    </h3>
                    <p className="text-[10px] text-[#A16B16] font-semibold">
                      Silk Mark & Handloom Certified
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedQrProduct(null)}
                  className="rounded-lg p-1.5 text-[#8F8175] hover:bg-[#EAE0D4] hover:text-[#292421] transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-center space-y-4">
                {/* QR Code Card */}
                <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9CBBF] bg-[#FAF8F4] p-5 shadow-xs">
                  {selectedQrProduct.qrCode ? (
                    <img
                      src={selectedQrProduct.qrCode}
                      alt="Product QR Code"
                      className="h-44 w-44 rounded-xl border border-[#E5DCD0] bg-white p-2 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-white text-xs text-stone-400">
                      Generating QR...
                    </div>
                  )}

                  {/* Unique ID with Copy */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-white border border-[#E0D3C1] px-3 py-1.5 shadow-2xs">
                    <span className="font-mono text-xs font-bold text-[#4A1525]">
                      {selectedQrProduct.uniqueId || selectedQrProduct.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyUid(selectedQrProduct.uniqueId || selectedQrProduct.code)}
                      className="text-[#8F8175] hover:text-[#4A1525] transition cursor-pointer"
                      title="Copy Unique ID"
                    >
                      {copiedUid ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                  {copiedUid && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1">Copied Unique ID to clipboard!</span>
                  )}
                </div>

                {/* Product Summary Details */}
                <div className="rounded-2xl border border-[#EFE7DC] bg-[#FAF8F4] p-3.5 text-left text-xs space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#8F8175]">Product Name:</span>
                    <span className="font-bold text-[#292421] text-right truncate max-w-[200px]">
                      {selectedQrProduct.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F8175]">Category & Fabric:</span>
                    <span className="font-medium text-[#292421]">
                      {selectedQrProduct.category} • {selectedQrProduct.fabric}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F8175]">Weaving Craft:</span>
                    <span className="font-medium text-[#A16B16]">{selectedQrProduct.weave}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#8F8175]">Price:</span>
                    <span className="font-serif text-sm font-bold text-[#4A1525]">
                      ₹{typeof selectedQrProduct.price === "number" ? selectedQrProduct.price.toLocaleString("en-IN") : selectedQrProduct.price}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadQr(selectedQrProduct)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#4A1525] bg-white py-2.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Download size={14} />
                    <span>Download QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrintLabel(selectedQrProduct)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#4A1525] py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] transition cursor-pointer shadow-md active:scale-95"
                  >
                    <Printer size={14} />
                    <span>Print Saree Tag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                    {editingProduct ? "Edit Handloom Product" : "Add New Handloom Product"}
                  </h3>
                  <p className="text-[11px] text-[#A16B16] font-medium">
                    Automatically creates Unique Product ID & Silk Mark QR Code
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#8F8175] hover:text-[#292421] cursor-pointer"
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
                    className="flex-1 rounded-xl border border-[#D9CBBF] py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating ID & Saving...</span>
                      </>
                    ) : (
                      <span>Save & Generate QR</span>
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