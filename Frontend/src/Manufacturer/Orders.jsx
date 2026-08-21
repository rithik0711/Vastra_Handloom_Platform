import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  X,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  Copy,
  Building,
  Navigation,
  Tag,
  MapPin,
  Loader2
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const userEmail =
    localStorage.getItem("userEmail") ||
    "rithikeswaran.it23@bitsathy.ac.in";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/manufacturer/orders?manufacturerId=${encodeURIComponent(
          userEmail
        )}`
      );
      const json = await response.json();
      console.log("Orders received from MongoDB:", json);

      if (json.status === "success" && Array.isArray(json.data)) {
        setOrders(json.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Orders database fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userEmail]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const getFullAddress = (order) => {
    if (!order) return "";
    const lines = [
      order.customer,
      order.customerPhone ? `Ph: ${order.customerPhone}` : "",
      order.address || "",
      order.city ? `${order.city}${order.state ? `, ${order.state}` : ""}` : order.state || "",
      order.pincode ? `PIN: ${order.pincode}` : ""
    ].filter(Boolean);

    return lines.join("\n");
  };

  const handleCopyAddress = async (addressText) => {
    if (!addressText) return;
    try {
      await navigator.clipboard.writeText(addressText);
      setCopiedAddress(true);
      showNotification("Customer delivery address copied!");
      setTimeout(() => {
        setCopiedAddress(false);
      }, 3000);
    } catch (error) {
      console.error("Copy address error:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await fetch(
        `http://localhost:5000/api/manufacturer/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );
      const json = await response.json();

      if (json.status === "success") {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId || o._id === orderId || o.orderId === orderId
              ? { ...o, status: newStatus }
              : o
          )
        );

        if (
          selectedOrder &&
          (selectedOrder.id === orderId ||
            selectedOrder._id === orderId ||
            selectedOrder.orderId === orderId)
        ) {
          setSelectedOrder((prev) => ({
            ...prev,
            status: newStatus
          }));
        }

        showNotification(`Order ${orderId} status updated to "${newStatus}".`);
      } else {
        showNotification("Unable to update order status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      showNotification("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const addr = (order.address || "").toLowerCase();

    const matchesSearch =
      (order.orderId && order.orderId.toLowerCase().includes(text)) ||
      (order.customerId && order.customerId.toLowerCase().includes(text)) ||
      (order.productId && order.productId.toLowerCase().includes(text)) ||
      (order.customer && order.customer.toLowerCase().includes(text)) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(text)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(text)) ||
      (order.product && order.product.toLowerCase().includes(text)) ||
      (order.category && order.category.toLowerCase().includes(text)) ||
      (order.city && order.city.toLowerCase().includes(text)) ||
      (order.state && order.state.toLowerCase().includes(text)) ||
      (order.pincode && String(order.pincode).toLowerCase().includes(text)) ||
      addr.includes(text);

    const matchesStatus =
      statusFilter === "All" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "Completed" || status === "Delivered") {
      return "bg-[#EAF6ED] text-[#2E7D32] border-[#C8E6C9]";
    }
    if (status === "In Production") {
      return "bg-[#FFF4DF] text-[#A16B16] border-[#F5DEC0]";
    }
    if (status === "Quality Check") {
      return "bg-[#F4EAFA] text-[#704C91] border-[#E8D4F5]";
    }
    if (status === "Ready to Ship") {
      return "bg-[#E6F4FA] text-[#1E6589] border-[#C9E7F6]";
    }
    return "bg-[#FBEEEE] text-[#A44747] border-[#F4CFCF]";
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Production & Fulfillment
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#4A1525] sm:text-4xl">
              Orders Management
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Live customer orders, shipping addresses, PIN codes, and dispatch statuses directly from MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E5DCD0] bg-white px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6EDF1] text-[#4A1525]">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8F8175]">Total Orders</p>
                <p className="font-serif text-base font-bold text-[#4A1525]">{orders.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#E5DCD0] bg-white px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF0E1] text-[#A16B16]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8F8175]">Pending & Production</p>
                <p className="font-serif text-base font-bold text-[#A16B16]">
                  {orders.filter((o) => o.status === "In Production" || o.status === "Pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold">{notification}</span>
          </div>
        )}

        {/* Filter & Search */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E5DCD0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Product, PIN, City, Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-4 text-xs focus:border-[#4A1525] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In Production", "Quality Check", "Ready to Ship", "Completed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${statusFilter === st
                    ? "bg-[#4A1525] text-white"
                    : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52]"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
            <p className="text-xs text-[#8F8175]">Fetching live orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CBBF] p-12 text-center">
            <Package className="h-12 w-12 text-[#B8AAA0]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#4A1525]">No Orders Found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8F8175]">
              No database records match the selected filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0E8DF] bg-[#FAF6F0] text-[11px] font-bold uppercase text-[#8F8175]">
                    <th className="px-5 py-4">Order ID & Date</th>
                    <th className="px-5 py-4">Customer & Contact</th>
                    <th className="px-5 py-4">Delivery Address & PIN</th>
                    <th className="px-5 py-4">Handloom Product</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status & Stage</th>
                    <th className="px-5 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE8]">
                  {filteredOrders.map((order) => {
                    const pin = order.pincode || "";
                    const city = order.city || "";
                    const state = order.state || "";
                    const addr = order.address || "";

                    return (
                      <tr
                        key={order.id || order._id || order.orderId}
                        className="transition hover:bg-[#FAF6F0]/60"
                      >
                        {/* Order ID & Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-serif text-sm font-bold text-[#4A1525]">{order.orderId}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8F8175]">
                            <Calendar size={11} className="text-[#A16B16]" />
                            {order.date}
                          </p>
                          {order.productId && (
                            <span className="mt-1 inline-block rounded bg-[#F5EFE8] px-1.5 py-0.5 font-mono text-[9px] text-[#9B8068]">
                              {order.productId}
                            </span>
                          )}
                        </td>

                        {/* Customer & Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="flex items-center gap-1.5 text-xs font-bold text-[#292421]">
                              <User size={12} className="text-[#4A1525]" />
                              {order.customer}
                            </p>
                            {order.customerPhone && (
                              <p className="flex items-center gap-1 text-[11px] text-[#7A6D61]">
                                <Phone size={11} />
                                <a href={`tel:${order.customerPhone}`} className="hover:text-[#4A1525] hover:underline font-medium">
                                  {order.customerPhone}
                                </a>
                              </p>
                            )}
                            {order.customerEmail && (
                              <p className="max-w-[160px] truncate text-[10px] text-[#9B8F84]">
                                {order.customerEmail}
                              </p>
                            )}
                            {order.customerId && (
                              <p className="font-mono text-[9px] text-[#A16B16]">
                                ID: {order.customerId}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Delivery Address & PIN Code */}
                        <td className="max-w-xs px-5 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-1.5">
                              <MapPin size={13} className="mt-0.5 shrink-0 text-[#D09229]" />
                              <p className="text-[11px] font-medium leading-tight text-[#423830]">
                                {addr || "Address not provided"}
                              </p>
                            </div>
                            {(pin || city) && (
                              <div className="flex items-center gap-2 pl-5">
                                {pin && (
                                  <span className="inline-flex rounded-md border border-[#F0DFCA] bg-[#FAF0E1] px-2 py-0.5 text-[10px] font-bold text-[#A16B16]">
                                    PIN: {pin}
                                  </span>
                                )}
                                {city && (
                                  <span className="text-[10px] font-medium text-[#8F8175]">
                                    {city}{state ? `, ${state}` : ""}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-5 py-4">
                          <p className="line-clamp-1 font-semibold text-[#292421]">{order.product}</p>
                          <p className="mt-0.5 text-[11px] font-medium text-[#A16B16]">
                            {order.category || "Silk"} • {order.quantity || 1} Qty
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="font-serif text-sm font-bold text-[#4A1525]">{order.amount}</p>
                          <span className="mt-0.5 inline-block text-[10px] font-bold text-emerald-700">
                            {order.payment || "Paid"}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <select
                            disabled={updatingId === (order.id || order._id || order.orderId)}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id || order._id || order.orderId, e.target.value)
                            }
                            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold focus:outline-none ${getStatusClass(
                              order.status
                            )}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Production">In Production</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Ready to Ship">Ready to Ship</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* View Details */}
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3 py-1.5 text-xs font-bold text-[#4A1525] transition hover:border-[#4A1525] hover:bg-[#FAF6F0]"
                          >
                            <Eye size={13} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A16B16]">
                      Order & Shipping Manifest
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h3 className="mt-0.5 font-serif text-2xl font-bold text-[#4A1525]">
                    #{selectedOrder.orderId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full p-2 text-[#8F8175] hover:bg-[#FAF6F0]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Weaving Details */}
                <div className="rounded-2xl border border-[#EBE3D7] bg-[#FAF6F0]/60 p-4">
                  <h4 className="flex items-center gap-2 border-b border-[#EBE3D7] pb-2 font-serif text-sm font-bold text-[#4A1525]">
                    <Package size={15} className="text-[#A16B16]" />
                    Weaving & Order Details
                  </h4>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-[#8F8175]">Product Ordered</span>
                      <span className="max-w-[180px] text-right font-bold text-[#4A1525]">
                        {selectedOrder.product}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Product ID</span>
                      <span className="font-mono">{selectedOrder.productId || "N/A"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Category</span>
                      <span className="font-semibold">{selectedOrder.category || "Cotton"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Quantity</span>
                      <span className="font-semibold">{selectedOrder.quantity || 1} Item(s)</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Total Amount</span>
                      <span className="font-serif text-base font-bold text-[#4A1525]">{selectedOrder.amount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Order Date</span>
                      <span>{selectedOrder.date}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8F8175]">Payment Status</span>
                      <span className="font-bold text-emerald-700">{selectedOrder.payment || "Paid"}</span>
                    </div>

                    <div className="border-t border-[#EBE3D7] pt-3">
                      <label className="mb-1.5 block text-xs font-bold text-[#4A1525]">
                        Update Production Stage
                      </label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedOrder.id || selectedOrder._id || selectedOrder.orderId,
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#D9CBBF] bg-white p-2.5 text-xs font-bold focus:border-[#4A1525] focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Production">In Production</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="rounded-2xl border border-[#EBE3D7] bg-[#FAF6F0]/60 p-4">
                  <h4 className="flex items-center gap-2 border-b border-[#EBE3D7] pb-2 font-serif text-sm font-bold text-[#4A1525]">
                    <Truck size={15} className="text-[#D09229]" />
                    Customer Delivery Address
                  </h4>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="flex items-center gap-1 text-[#8F8175]">
                        <User size={12} />
                        Customer Name
                      </span>
                      <span className="font-bold">{selectedOrder.customer}</span>
                    </div>

                    {selectedOrder.customerId && (
                      <div className="flex justify-between gap-4">
                        <span className="flex items-center gap-1 text-[#8F8175]">
                          <Tag size={12} />
                          Customer ID
                        </span>
                        <span className="font-mono text-[#A16B16] font-bold">{selectedOrder.customerId}</span>
                      </div>
                    )}

                    <div className="flex justify-between gap-4">
                      <span className="flex items-center gap-1 text-[#8F8175]">
                        <Phone size={12} />
                        Phone
                      </span>
                      <span className="font-bold text-[#4A1525]">
                        {selectedOrder.customerPhone || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="flex items-center gap-1 text-[#8F8175]">
                        <Mail size={12} />
                        Email
                      </span>
                      <span className="max-w-[180px] truncate font-medium">
                        {selectedOrder.customerEmail || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-[#8F8175]">
                        <Navigation size={12} />
                        PIN Code
                      </span>
                      <span className="rounded-lg bg-[#4A1525] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                        {selectedOrder.pincode || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="flex items-center gap-1 text-[#8F8175]">
                        <Building size={12} />
                        City & State
                      </span>
                      <span className="text-right font-bold">
                        {selectedOrder.city || ""}
                        {selectedOrder.state ? `, ${selectedOrder.state}` : ""}
                      </span>
                    </div>

                    {/* Delivery Card */}
                    <div className="mt-4 rounded-xl border border-dashed border-[#CBB8A6] bg-white p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                          <MapPin size={11} className="text-[#D09229]" />
                          Full Courier Address
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(getFullAddress(selectedOrder))}
                          className="flex items-center gap-1 rounded-md bg-[#FAF0E1] px-2 py-1 text-[10px] font-bold text-[#A16B16]"
                        >
                          {copiedAddress ? <Check size={11} /> : <Copy size={11} />}
                          {copiedAddress ? "Copied" : "Copy"}
                        </button>
                      </div>

                      <p className="mt-2 whitespace-pre-line rounded-lg border border-[#F0E8DF] bg-[#FAF6F0]/50 p-3 text-[11px] font-medium leading-relaxed text-[#292421]">
                        {selectedOrder.address || "No address specified"}
                        {selectedOrder.city || selectedOrder.state || selectedOrder.pincode ? (
                          <>
                            {"\n"}
                            {selectedOrder.city || ""}
                            {selectedOrder.state ? `, ${selectedOrder.state}` : ""}
                            {selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ""}
                          </>
                        ) : null}
                      </p>

                      {selectedOrder.deliveryNotes && (
                        <p className="mt-2 border-t border-[#F0E8DF] pt-2 text-[10px] italic text-[#8F8175]">
                          <strong>Delivery Note:</strong> {selectedOrder.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-[#F0E8DF] pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-[#D9CBBF] bg-white px-5 py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0]"
                >
                  Close
                </button>

                <button
                  onClick={() => handleCopyAddress(getFullAddress(selectedOrder))}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4A1525] px-5 py-2.5 text-xs font-bold text-white"
                >
                  <Copy size={13} />
                  Copy Dispatch Manifest
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <RAG />
    </div>
  );
}