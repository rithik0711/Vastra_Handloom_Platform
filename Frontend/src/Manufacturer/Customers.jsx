import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Star,
  MessageSquare,
  Sparkles,
  ChevronRight,
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [notification, setNotification] = useState(null);

  const userEmail =
    localStorage.getItem("userEmail") ||
    "rithikeswaran.it23@bitsathy.ac.in";

  // Fetch customers from database by manufacturerId
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/customers?manufacturerId=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setCustomers(json.data);
      }
    } catch (err) {
      console.error("Customers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [userEmail]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q));
    const matchStatus =
      filterStatus === "All" || c.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Save Note to MongoDB
  const handleSaveNote = async () => {
    if (!selectedCustomer) return;
    try {
      setSavingNote(true);
      const res = await fetch(
        `http://localhost:5000/api/manufacturer/customers/${selectedCustomer.id || selectedCustomer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: noteInput.trim() })
        }
      );
      const json = await res.json();

      if (json.status === "success") {
        const updated = { ...selectedCustomer, notes: noteInput.trim() };
        setSelectedCustomer(updated);
        setCustomers((prev) =>
          prev.map((c) =>
            (c.id === updated.id || c._id === updated._id ? updated : c)
          )
        );
        showNotification("Customer notes updated successfully!");
      }
    } catch (err) {
      console.error("Note save error:", err);
      alert("Error saving notes to database.");
    } finally {
      setSavingNote(false);
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
                Customer & Client Relations
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Customer Directory
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              View all handloom customer details, order histories, custom weave requests, and Customer preferences.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E5DCD0] bg-white px-4 py-2.5 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6EDF1] text-[#4A1525]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8F8175]">Total Customers</p>
                <p className="font-serif text-base font-bold text-[#4A1525]">{customers.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#E5DCD0] bg-white px-4 py-2.5 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF0E1] text-[#A16B16]">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8F8175]">VIP Customer</p>
                <p className="font-serif text-base font-bold text-[#A16B16]">
                  {customers.filter((c) => c.status === "VIP").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{notification}</span>
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-4 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "VIP", "Active", "New"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${filterStatus === st
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Content Grid */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
            <p className="text-xs text-[#8F8175]">Loading customer directory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CBBF] p-12 text-center">
            <Users className="h-12 w-12 text-[#B8AAA0]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#4A1525]">No Customers Found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8F8175]">
              No Customer match your search query or filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Customer List Cards */}
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((customer) => (
                <div
                  key={customer.id || customer._id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setNoteInput(customer.notes || "");
                  }}
                  className={`group flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center ${selectedCustomer?.id === customer.id || selectedCustomer?._id === customer._id
                    ? "border-[#4A1525] bg-[#FDF9F6] shadow-sm"
                    : "border-[#E5DCD0] bg-white"
                    }`}
                >
                  <div className="flex items-center gap-4">

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-[#292421] group-hover:text-[#4A1525] transition-colors">
                          {customer.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${customer.status === "VIP"
                            ? "bg-[#FAF0E1] text-[#A16B16] border border-[#F5DEC0]"
                            : customer.status === "Active"
                              ? "bg-[#EAF6ED] text-[#2E7D32] border border-[#C8E6C9]"
                              : "bg-[#FBEEEE] text-[#A44747] border border-[#F4CFCF]"
                            }`}
                        >
                          {customer.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#7A6D61]">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-[#9B8F84]" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-[#9B8F84]" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#9B8F84]" />
                          {customer.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#F0E8DF] pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#8F8175]">Total Spent</p>
                      <p className="font-serif text-sm font-bold text-[#4A1525]">
                        ₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-[#8F8175]">{customer.totalOrders} Orders</p>
                    </div>
                    <ChevronRight className="ml-3 hidden h-4 w-4 text-[#B8AAA0] group-hover:text-[#4A1525] sm:block" />
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Detail & Notes Pane */}
            <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs h-fit sticky top-6">
              {selectedCustomer ? (
                <div>
                  <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                    <div className="flex items-center gap-3">

                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#292421]">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-xs text-[#7A6D61]">{selectedCustomer.location}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${selectedCustomer.status === "VIP"
                        ? "bg-[#FAF0E1] text-[#A16B16]"
                        : "bg-[#EAF6ED] text-[#2E7D32]"
                        }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F5EFE8]">
                      <span className="text-[#8F8175]">Email Address</span>
                      <span className="font-medium text-[#292421]">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F5EFE8]">
                      <span className="text-[#8F8175]">Phone Number</span>
                      <span className="font-medium text-[#292421]">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F5EFE8]">
                      <span className="text-[#8F8175]">Total Purchases</span>
                      <span className="font-serif font-bold text-sm text-[#4A1525]">
                        ₹{Number(selectedCustomer.totalSpent || 0).toLocaleString("en-IN")} ({selectedCustomer.totalOrders} items)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F5EFE8]">
                      <span className="text-[#8F8175]">Favorite Weaves</span>
                      <span className="font-medium text-[#A16B16] text-right max-w-[180px] truncate">
                        {selectedCustomer.preferences}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F5EFE8]">
                      <span className="text-[#8F8175]">Last Order Date</span>
                      <span className="font-medium text-[#292421]">{selectedCustomer.lastOrderDate}</span>
                    </div>
                  </div>

                  {/* Weaver Notes */}
                  <div className="mt-5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B8068]">
                      Artisan / Loom Notes
                    </label>
                    <textarea
                      rows={3}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add notes on preferred warp density, custom border colors, etc..."
                      className="mt-2 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
                    />
                    <button
                      onClick={handleSaveNote}
                      disabled={savingNote}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2 text-xs font-bold text-white shadow-xs transition hover:opacity-95 disabled:opacity-50"
                    >
                      {savingNote ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          <span>Save Notes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserCheck className="h-10 w-10 text-[#C7B9AD]" />
                  <h4 className="mt-3 font-serif text-base font-bold text-[#4A1525]">
                    Select a Customer
                  </h4>
                  <p className="mt-1 max-w-[200px] text-xs text-[#8F8175]">
                    Click any customer from the list to review detailed order history, preferences and add weaver notes.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <RAG />
    </div>
  );
}