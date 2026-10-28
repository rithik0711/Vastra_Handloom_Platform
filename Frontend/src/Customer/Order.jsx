import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  Package,
  Sparkles,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Clock,
  RotateCcw,
  ArrowRight,
  Truck,
  Check,
  ShieldCheck,
  X,
  Search,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  Eye,
  Info
} from "lucide-react";

export default function CustomerOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    location.state?.isCustomBooking ? "custom" : "ready_made"
  );

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    if (userEmail) {
      fetchOrdersAndBookings();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchOrdersAndBookings = async () => {
    setLoading(true);
    try {
      const [resOrders, resBookings] = await Promise.all([
        fetch(`${API_BASE_URL}/api/customer/orders?customerEmail=${encodeURIComponent(userEmail)}`),
        fetch(`${API_BASE_URL}/api/customer/bookings?customerEmail=${encodeURIComponent(userEmail)}`)
      ]);

      const jsonOrders = await resOrders.json();
      const jsonBookings = await resBookings.json();

      if (jsonOrders.status === "success" && Array.isArray(jsonOrders.data)) {
        setOrders(jsonOrders.data);
      } else {
        setOrders([]);
      }
      if (jsonBookings.status === "success" && Array.isArray(jsonBookings.data)) {
        setBookings(jsonBookings.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn("Orders fetch err:", err);
      setOrders([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const readyMadeStagesList = [
    "Order Placed",
    "Quality Check",
    "Silk Mark Tagging",
    "Handloom Dispatched",
    "Delivered"
  ];

  const customLoomStagesList = [
    "Request Confirmed",
    "Silk Dyeing",
    "Loom Warping",
    "Artisan Weaving",
    "Finishing & Cut",
    "Insured Dispatch",
    "Delivered"
  ];

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.product && o.product.toLowerCase().includes(q)) ||
      (o.artisanName && o.artisanName.toLowerCase().includes(q)) ||
      (o.manufacturer && o.manufacturer.toLowerCase().includes(q)) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(q))
    );
  });

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (b.bookingId && b.bookingId.toLowerCase().includes(q)) ||
      (b.customPattern && b.customPattern.toLowerCase().includes(q)) ||
      (b.fabricChoice && b.fabricChoice.toLowerCase().includes(q)) ||
      (b.artisanName && b.artisanName.toLowerCase().includes(q)) ||
      (b.manufacturer && b.manufacturer.toLowerCase().includes(q)) ||
      (b.transactionId && b.transactionId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Loom Tracking & Manifests
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              My Orders & Custom Bookings
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Live tracking from master weaver pit-looms directly to your doorstep.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center rounded-2xl border border-[#E0D3C1] bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("ready_made")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "ready_made"
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "text-[#7A6D61] hover:text-[#4A1525]"
              }`}
            >
              <Package size={14} />
              <span>Ready-Made Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "custom"
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "text-[#7A6D61] hover:text-[#4A1525]"
              }`}
            >
              <Sparkles size={14} />
              <span>Custom Loom Reservations ({bookings.length})</span>
            </button>
          </div>
        </div>

        {/* Search by Order ID or Loom ID */}
        <div className="mt-6 flex items-center rounded-2xl border border-[#E5DCD0] bg-white p-3 shadow-xs">
          <Search size={16} className="text-[#9B8F84] ml-2 mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (e.g. ORD-1001), Loom ID (e.g. BK-501), or Product Name..."
            className="w-full bg-transparent text-xs text-[#292421] placeholder-[#A29487] focus:outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-stone-400 hover:text-stone-700 mr-2">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Ready Made Orders List */}
        {activeTab === "ready_made" && (
          <div className="mt-6 space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
                <Package className="mx-auto h-10 w-10 text-[#D09229]" />
                <p className="font-serif text-base font-bold text-[#4A1525] mt-2">No Ready-Made Orders Found</p>
                <p className="text-xs text-[#7A6D61] mt-1">Explore our authentic silk handlooms and place your first order.</p>
                <button
                  type="button"
                  onClick={() => navigate("/customer")}
                  className="mt-4 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Explore Handloom Sarees
                </button>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const stageNum = ord.currentStage || 1;
                return (
                  <div
                    key={ord._id || ord.orderId}
                    className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E8DF] pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.designImage || ord.image || "/images/kanchi.png"}
                          alt={ord.product}
                          className="h-16 w-16 rounded-2xl object-cover border border-[#E5DCD0]"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-[#A16B16] uppercase tracking-wider">
                            Order #{ord.orderId}
                          </span>
                          <h3 className="font-serif text-base font-bold text-[#4A1525]">{ord.product}</h3>
                          <p className="text-xs text-[#7A6D61]">
                            Weaver: <strong>{ord.artisanName || ord.manufacturer}</strong> • Ordered {ord.orderDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <p className="font-serif text-lg font-bold text-[#4A1525]">{ord.amount || `₹${ord.price}`}</p>
                          <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            {ord.paymentStatus || "Paid"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedItem({ ...ord, type: "order" })}
                          className="flex items-center gap-1 rounded-xl border border-[#D9CBBF] px-3 py-1.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF6F0]"
                        >
                          <Eye size={13} />
                          <span>Manifest</span>
                        </button>
                      </div>
                    </div>

                    {/* Progression Tracker */}
                    <div className="py-2">
                      <p className="text-[11px] font-bold text-[#9B8068] uppercase tracking-wider mb-3">
                        Live Handloom Progression (Stage {stageNum} of 5)
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {readyMadeStagesList.map((st, idx) => {
                          const isDone = stageNum >= idx + 1;
                          return (
                            <div key={idx} className="text-center space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition ${
                                  isDone ? "bg-[#4A1525]" : "bg-[#E5DCD0]"
                                }`}
                              />
                              <p className={`text-[10px] font-bold truncate ${isDone ? "text-[#4A1525]" : "text-[#B5A695]"}`}>
                                {st}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Custom Loom Reservations List */}
        {activeTab === "custom" && (
          <div className="mt-6 space-y-6">
            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-[#D09229]" />
                <p className="font-serif text-base font-bold text-[#4A1525] mt-2">No Custom Loom Bookings Found</p>
                <p className="text-xs text-[#7A6D61] mt-1">Book your own bespoke pit-loom slot with master weavers.</p>
                <button
                  type="button"
                  onClick={() => navigate("/customer/booking")}
                  className="mt-4 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Book Bespoke Loom Slot
                </button>
              </div>
            ) : (
              filteredBookings.map((bk) => {
                const stageNum = bk.currentStage || 1;
                return (
                  <div
                    key={bk._id || bk.bookingId}
                    className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E8DF] pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bk.image || "/images/kanchi.png"}
                          alt={bk.customPattern}
                          className="h-16 w-16 rounded-2xl object-cover border border-[#E5DCD0]"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-[#A16B16] uppercase tracking-wider">
                            Loom Reservation #{bk.bookingId}
                          </span>
                          <h3 className="font-serif text-base font-bold text-[#4A1525]">
                            {bk.customPattern || bk.fabricChoice}
                          </h3>
                          <p className="text-xs text-[#7A6D61]">
                            Dedicated Master Weaver: <strong>{bk.artisanName || bk.manufacturer}</strong> • Booked {bk.bookingDate || bk.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <p className="font-serif text-base font-bold text-[#4A1525]">
                            Advance: {bk.advancePaid} / Est. {bk.estimatedPrice}
                          </p>
                          <span className="inline-block rounded-full bg-[#FAF0E1] px-2.5 py-0.5 text-[10px] font-bold text-[#A16B16]">
                            {bk.status}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedItem({ ...bk, type: "booking" })}
                          className="flex items-center gap-1 rounded-xl border border-[#D9CBBF] px-3 py-1.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF6F0]"
                        >
                          <Eye size={13} />
                          <span>Loom Spec</span>
                        </button>
                      </div>
                    </div>

                    {/* Bespoke Loom 7-Stage Progression */}
                    <div className="py-2">
                      <p className="text-[11px] font-bold text-[#9B8068] uppercase tracking-wider mb-3">
                        Loom Weaving Progress (Stage {stageNum} of 7)
                      </p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {customLoomStagesList.map((st, idx) => {
                          const isDone = stageNum >= idx + 1;
                          return (
                            <div key={idx} className="text-center space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition ${
                                  isDone ? "bg-gradient-to-r from-[#D09229] to-[#4A1525]" : "bg-[#E5DCD0]"
                                }`}
                              />
                              <p className={`text-[9px] font-bold truncate ${isDone ? "text-[#4A1525]" : "text-[#B5A695]"}`}>
                                {st}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Detailed Tracking & Manifest Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A16B16]">
                    {selectedItem.type === "booking" ? "Bespoke Loom Reservation" : "Order Manifest"}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                    #{selectedItem.orderId || selectedItem.bookingId}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-[#FAF6F0] hover:text-stone-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#EFE7DC] bg-[#FAF8F4] p-4 text-xs space-y-2">
                  <p className="font-bold text-[#4A1525] border-b pb-1">Item & Guild Info</p>
                  <p><strong>Item:</strong> {selectedItem.product || selectedItem.customPattern}</p>
                  <p><strong>Weaver / Guild:</strong> {selectedItem.artisanName || selectedItem.manufacturer}</p>
                  <p><strong>Status:</strong> <span className="font-bold text-[#A16B16]">{selectedItem.status}</span></p>
                  <p><strong>Date:</strong> {selectedItem.orderDate || selectedItem.bookingDate || selectedItem.date}</p>
                  {selectedItem.transactionId && <p><strong>Txn ID:</strong> <span className="font-mono">{selectedItem.transactionId}</span></p>}
                </div>

                <div className="rounded-2xl border border-[#EFE7DC] bg-[#FAF8F4] p-4 text-xs space-y-2">
                  <p className="font-bold text-[#4A1525] border-b pb-1">Delivery Destination</p>
                  <p><strong>Recipient:</strong> {selectedItem.customer || selectedItem.customerName}</p>
                  {selectedItem.customerPhone && <p><strong>Phone:</strong> {selectedItem.customerPhone}</p>}
                  <p><strong>Address:</strong> {selectedItem.deliveryAddress || selectedItem.address || "Address on file"}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Close Manifest
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
