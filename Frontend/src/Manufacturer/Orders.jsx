import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const orders = [
    { id: "VAS1024", customer: "Kavya", initials: "KS", product: "Kanchipuram Silk Saree", category: "Silk", quantity: 1, price: "₹8,500", date: "09 Aug 2026", status: "In Production", payment: "Paid" },
    { id: "VAS1021", customer: "Meena", initials: "MS", product: "Traditional Cotton Saree", category: "Cotton", quantity: 2, price: "₹8,400", date: "08 Aug 2026", status: "Completed", payment: "Paid" },
    { id: "VAS1018", customer: "Anitha", initials: "AR", product: "Custom Zari Saree", category: "Silk", quantity: 1, price: "₹11,500", date: "07 Aug 2026", status: "Quality Check", payment: "Paid" },
    { id: "VAS1016", customer: "Priya", initials: "PM", product: "Handloom Cotton Saree", category: "Cotton", quantity: 3, price: "₹11,400", date: "06 Aug 2026", status: "Ready to Ship", payment: "Paid" },
    { id: "VAS1013", customer: "Divya", initials: "DK", product: "Linen Handloom Saree", category: "Linen", quantity: 1, price: "₹5,600", date: "05 Aug 2026", status: "Pending", payment: "Pending" },
    { id: "VAS1009", customer: "Lakshmi", initials: "LR", product: "Banarasi Handloom Saree", category: "Silk", quantity: 1, price: "₹9,800", date: "03 Aug 2026", status: "Delivered", payment: "Paid" },
  ];

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(text) ||
      order.customer.toLowerCase().includes(text) ||
      order.product.toLowerCase().includes(text);

    const matchesStatus =
      status === "All" || order.status === status;

    return matchesSearch && matchesStatus;
  });

  const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  );

  const FilterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[17px] w-[17px]">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );

  const ViewIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[17px] w-[17px]">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[14px] w-[14px]">
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[14px] w-[14px]">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );

  const ProductionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[14px] w-[14px]">
      <path d="M5 7h14M5 17h14M7 4v3M17 4v3M7 17v3M17 17v3" strokeLinecap="round" />
      <path d="M8 10h8v4H8z" />
    </svg>
  );

  const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[14px] w-[14px]">
      <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </svg>
  );

  const BoxIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[14px] w-[14px]">
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7M12 11v10" />
    </svg>
  );

  const getStatusStyle = (orderStatus) => {
    switch (orderStatus) {
      case "Completed":
      case "Delivered":
        return "bg-[#edf7ef] text-[#3d8154]";

      case "Ready to Ship":
        return "bg-[#edf5f7] text-[#367180]";

      case "In Production":
        return "bg-[#f6eaf0] text-[#7a2943]";

      case "Quality Check":
        return "bg-[#fff4df] text-[#a16b16]";

      default:
        return "bg-[#f4eee8] text-[#806e60]";
    }
  };

  const getStatusIcon = (orderStatus) => {
    switch (orderStatus) {
      case "Completed":
      case "Delivered":
        return <CheckIcon />;

      case "In Production":
        return <ProductionIcon />;

      case "Ready to Ship":
        return <TruckIcon />;

      case "Quality Check":
        return <BoxIcon />;

      default:
        return <ClockIcon />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      <Sidebar />

      <main className="ml-[78px] min-h-screen px-[20px] py-[24px] transition-all duration-300 lg:ml-[250px] lg:px-[38px] lg:py-[30px]">

        {/* Header */}
        <div className="flex flex-col gap-[18px] md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#a08b76]">
              Manufacturer
            </p>

            <h1 className="mt-[4px] text-[28px] font-semibold tracking-[-0.7px] text-[#4A1525]">
              Orders
            </h1>

            <p className="mt-[5px] text-[13px] text-[#746b62]">
              Track and manage customer saree orders.
            </p>
          </div>

          <div className="flex h-[44px] items-center gap-[9px] rounded-[10px] border border-[#e2d8cd] bg-white px-[15px]">

            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] bg-[#f5e9ed] text-[#6b273b]">
              <BoxIcon />
            </div>

            <div>
              <p className="text-[10px] text-[#958c83]">
                Total Orders
              </p>

              <p className="text-[13px] font-semibold text-[#403a35]">
                {orders.length} Orders
              </p>
            </div>

          </div>

        </div>

        {/* Statistics */}
        <div className="mt-[24px] grid grid-cols-2 gap-[12px] lg:grid-cols-4">

          <div className="rounded-[14px] border border-[#e8dfd5] bg-white p-[16px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">
            <p className="text-[11px] text-[#91877e]">Total Orders</p>
            <h2 className="mt-[5px] text-[24px] font-semibold text-[#403a35]">18</h2>
            <p className="mt-[3px] text-[10px] text-[#91877e]">All customer orders</p>
          </div>

          <div className="rounded-[14px] border border-[#e8dfd5] bg-white p-[16px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">
            <p className="text-[11px] text-[#91877e]">Pending</p>
            <h2 className="mt-[5px] text-[24px] font-semibold text-[#a16b16]">04</h2>
            <p className="mt-[3px] text-[10px] text-[#a16b16]">Awaiting action</p>
          </div>

          <div className="rounded-[14px] border border-[#e8dfd5] bg-white p-[16px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">
            <p className="text-[11px] text-[#91877e]">In Production</p>
            <h2 className="mt-[5px] text-[24px] font-semibold text-[#7a2943]">06</h2>
            <p className="mt-[3px] text-[10px] text-[#7a2943]">Currently weaving</p>
          </div>

          <div className="rounded-[14px] border border-[#e8dfd5] bg-white p-[16px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]">
            <p className="text-[11px] text-[#91877e]">Delivered</p>
            <h2 className="mt-[5px] text-[24px] font-semibold text-[#3d8154]">08</h2>
            <p className="mt-[3px] text-[10px] text-[#3d8154]">Successfully delivered</p>
          </div>

        </div>

        {/* Search + Filter */}
        <div className="mt-[24px] flex flex-col gap-[10px] rounded-[14px] border border-[#e8dfd5] bg-white p-[12px] shadow-[0_4px_15px_rgba(60,35,20,0.04)] sm:flex-row">

          <div className="relative flex-1">

            <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#9a9086]">
              <SearchIcon />
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer or saree..."
              className="box-border h-[42px] w-full rounded-[9px] border border-[#ddd4ca] bg-[#fffdfa] pl-[40px] pr-[12px] text-[12px] text-[#403a35] outline-none transition placeholder:text-[#aaa098] focus:border-[#8b5b24]"
            />

          </div>

          <div className="relative sm:w-[190px]">

            <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#8e847b]">
              <FilterIcon />
            </span>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="box-border h-[42px] w-full appearance-none rounded-[9px] border border-[#ddd4ca] bg-[#fffdfa] pl-[37px] pr-[10px] text-[12px] text-[#403a35] outline-none focus:border-[#8b5b24]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Production">In Production</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Ready to Ship">Ready to Ship</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>

          </div>

        </div>

        {/* Title */}
        <div className="mt-[24px]">

          <h2 className="text-[16px] font-semibold text-[#403a35]">
            Customer Orders
          </h2>

          <p className="mt-[2px] text-[11px] text-[#958c83]">
            {filteredOrders.length} orders found
          </p>

        </div>

        {/* Desktop Table */}
        <div className="mt-[14px] hidden overflow-hidden rounded-[15px] border border-[#e8dfd5] bg-white shadow-[0_4px_16px_rgba(60,35,20,0.05)] lg:block">

          <div className="grid grid-cols-[1.1fr_1.4fr_1.8fr_0.6fr_0.9fr_1fr_0.7fr] items-center border-b border-[#eee7df] bg-[#fcfaf7] px-[18px] py-[13px]">

            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Order</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Customer</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Product</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Qty</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Amount</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Status</p>
            <p className="text-right text-[10px] font-semibold uppercase tracking-[0.7px] text-[#948a81]">Action</p>

          </div>

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[1.1fr_1.4fr_1.8fr_0.6fr_0.9fr_1fr_0.7fr] items-center border-b border-[#f0ebe5] px-[18px] py-[15px] last:border-b-0 hover:bg-[#fffdfa]"
            >

              <div>
                <p className="text-[12px] font-semibold text-[#4A1525]">
                  #{order.id}
                </p>

                <p className="mt-[3px] text-[10px] text-[#999087]">
                  {order.date}
                </p>
              </div>

              <div className="flex items-center gap-[9px]">

                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f5e9ed] text-[10px] font-semibold text-[#6b273b]">
                  {order.initials}
                </div>

                <p className="text-[12px] font-medium text-[#4b443e]">
                  {order.customer}
                </p>

              </div>

              <div className="min-w-0">

                <p className="truncate text-[12px] font-medium text-[#403a35]">
                  {order.product}
                </p>

                <p className="mt-[3px] text-[10px] text-[#999087]">
                  {order.category}
                </p>

              </div>

              <p className="text-[12px] text-[#5e5750]">
                {order.quantity}
              </p>

              <div>

                <p className="text-[12px] font-semibold text-[#403a35]">
                  {order.price}
                </p>

                <p className={`mt-[2px] text-[9px] ${order.payment === "Paid" ? "text-[#3d8154]" : "text-[#a16b16]"}`}>
                  {order.payment}
                </p>

              </div>

              <div>

                <span className={`inline-flex items-center gap-[5px] rounded-full px-[8px] py-[5px] text-[9px] font-semibold ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>

              </div>

              <div className="flex justify-end">

                <button
                  type="button"
                  title="View Order"
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-[#756d65] transition hover:bg-[#f5eee5] hover:text-[#4A1525]"
                >
                  <ViewIcon />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Mobile / Tablet */}
        <div className="mt-[14px] grid grid-cols-1 gap-[12px] lg:hidden">

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[14px] border border-[#e8dfd5] bg-white p-[15px] shadow-[0_4px_15px_rgba(60,35,20,0.04)]"
            >

              <div className="flex items-start justify-between gap-[10px]">

                <div className="flex items-center gap-[10px]">

                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#f5e9ed] text-[11px] font-semibold text-[#6b273b]">
                    {order.initials}
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#403a35]">
                      {order.customer}
                    </p>

                    <p className="mt-[2px] text-[10px] text-[#948a81]">
                      #{order.id} • {order.date}
                    </p>
                  </div>

                </div>

                <span className={`inline-flex shrink-0 items-center gap-[4px] rounded-full px-[8px] py-[5px] text-[9px] font-semibold ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>

              </div>

              <div className="mt-[14px] rounded-[10px] bg-[#faf7f2] p-[12px]">

                <p className="text-[12px] font-semibold text-[#403a35]">
                  {order.product}
                </p>

                <p className="mt-[3px] text-[10px] text-[#958c83]">
                  {order.category} • {order.quantity} piece{order.quantity > 1 ? "s" : ""}
                </p>

              </div>

              <div className="mt-[13px] flex items-center justify-between">

                <div>
                  <p className="text-[10px] text-[#958c83]">
                    Order Amount
                  </p>

                  <p className="mt-[2px] text-[14px] font-semibold text-[#4A1525]">
                    {order.price}
                  </p>
                </div>

                <div className="flex items-center gap-[8px]">

                  <span className={`text-[10px] font-medium ${order.payment === "Paid" ? "text-[#3d8154]" : "text-[#a16b16]"}`}>
                    {order.payment}
                  </span>

                  <button
                    type="button"
                    className="flex h-[34px] items-center gap-[5px] rounded-[8px] border border-[#ddd2c7] px-[10px] text-[10px] font-semibold text-[#5d5148] transition hover:bg-[#f7f1e9]"
                  >
                    <ViewIcon />
                    View
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="mt-[14px] rounded-[15px] border border-dashed border-[#d8cec3] bg-white px-[20px] py-[60px] text-center">

            <div className="mx-auto flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#f5eee7] text-[#8f8175]">
              <BoxIcon />
            </div>

            <h3 className="mt-[10px] text-[16px] font-semibold text-[#403a35]">
              No orders found
            </h3>

            <p className="mt-[5px] text-[12px] text-[#958c83]">
              Try changing your search or status filter.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}