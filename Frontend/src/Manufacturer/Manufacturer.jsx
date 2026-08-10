import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

/* =========================================================
   GLOBAL ICON COMPONENT
========================================================= */

const Icon = ({ children, className = "h-[19px] w-[19px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/* =========================================================
   ICONS
========================================================= */

const ArrowUpIcon = () => (
  <Icon className="h-[13px] w-[13px]">
    <path d="M5 15l5-5 4 4 5-7" />
    <path d="M15 7h4v4" />
  </Icon>
);

const ArrowRightIcon = () => (
  <Icon className="h-[15px] w-[15px]">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
);

const PlusIcon = () => (
  <Icon className="h-[17px] w-[17px]">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

const BoxIcon = () => (
  <Icon>
    <path d="m4 7 8-4 8 4-8 4-8-4Z" />
    <path d="M4 7v10l8 4 8-4V7" />
    <path d="M12 11v10" />
  </Icon>
);

const OrdersIcon = () => (
  <Icon>
    <path d="M6 3h12l2 4H4l2-4Z" />
    <path d="M5 7h14l-1 13H6L5 7Z" />
    <path d="M9 11h6" />
  </Icon>
);

const PendingIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const RupeeIcon = () => (
  <Icon>
    <path d="M7 4h10" />
    <path d="M7 8h8" />
    <path d="M9 4c5 0 6 2 6 4s-1 4-6 4h-2l8 8" />
  </Icon>
);

const CheckIcon = () => (
  <Icon className="h-[18px] w-[18px]">
    <path d="m5 12 4 4L19 6" />
  </Icon>
);

const ChartIcon = () => (
  <Icon>
    <path d="M5 19V9" />
    <path d="M12 19V5" />
    <path d="M19 19v-7" />
  </Icon>
);

/* =========================================================
   DASHBOARD DATA
========================================================= */

const monthlyRevenue = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 68 },
  { month: "Apr", value: 84 },
  { month: "May", value: 76 },
  { month: "Jun", value: 92 },
  { month: "Jul", value: 88 },
  { month: "Aug", value: 100 },
];

const orders = [
  {
    id: "VAS1024",
    initials: "KS",
    customer: "Kavya",
    product: "Kanchipuram Silk Saree",
    amount: "₹8,500",
    status: "In Production",
    statusClass: "bg-[#fff4df] text-[#a16b16]",
  },
  {
    id: "VAS1021",
    initials: "MS",
    customer: "Meena",
    product: "Cotton Handloom Saree",
    amount: "₹4,200",
    status: "Completed",
    statusClass: "bg-[#eaf6ed] text-[#3d8a5b]",
  },
  {
    id: "VAS1018",
    initials: "AR",
    customer: "Anitha",
    product: "Custom Zari Saree",
    amount: "₹11,500",
    status: "Quality Check",
    statusClass: "bg-[#f4eafa] text-[#704c91]",
  },
  {
    id: "VAS1015",
    initials: "SP",
    customer: "Sowmya",
    product: "Linen Handloom Saree",
    amount: "₹5,600",
    status: "Pending",
    statusClass: "bg-[#fbeeee] text-[#a44747]",
  },
];

/* =========================================================
   MANUFACTURER DASHBOARD
========================================================= */

const Manufacturer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#292421]">

      <Sidebar />

      <main className="min-h-screen ml-[78px] lg:ml-[250px] px-[16px] py-[20px] sm:px-[25px] sm:py-[25px] lg:px-[38px] lg:py-[30px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-[7px]">

              <span className="h-[6px] w-[6px] rounded-full bg-[#D09229]" />

              <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#9b8068]">
                Manufacturer Dashboard
              </p>

            </div>

            <h1 className="mt-[5px] text-[29px] font-semibold tracking-[-1px] text-[#4A1525] sm:text-[32px] lg:text-[36px]">
              Kathar Weaves
            </h1>

            <p className="mt-[4px] text-[12px] text-[#786f67] sm:text-[13px]">
              Your handloom business at a glance.
            </p>

          </div>

          <div className="flex items-center gap-[10px]">

            <button
              onClick={() => navigate("/manufacturer/products")}
              className="flex h-[40px] items-center gap-[7px] rounded-[10px] border border-[#dfd4c9] bg-white px-[13px] text-[11px] font-semibold text-[#5c4c42] shadow-sm transition hover:border-[#c9b7a5] hover:bg-[#fcfaf7]"
            >
              <BoxIcon />
              Products
            </button>

            <button
              onClick={() => navigate("/manufacturer/products")}
              className="flex h-[40px] items-center gap-[7px] rounded-[10px] bg-gradient-to-r from-[#4A1525] to-[#8b4b31] px-[14px] text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(74,21,37,0.18)] transition hover:-translate-y-[1px]"
            >
              <PlusIcon />
              Add Product
            </button>

            <div className="hidden h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-[#4A1525] to-[#C88A2B] text-[12px] font-bold text-white shadow-sm sm:flex">
              KW
            </div>

          </div>

        </header>

        {/* =================================================
            HERO BANNER
        ================================================= */}

        <section className="relative mt-[22px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#451322] via-[#642039] to-[#8a4d32] px-[20px] py-[22px] shadow-[0_12px_35px_rgba(74,21,37,0.16)] sm:px-[28px] sm:py-[25px]">

          <div className="absolute right-[-55px] top-[-75px] h-[190px] w-[190px] rounded-full border border-white/[0.06]" />

          <div className="absolute bottom-[-90px] right-[120px] h-[190px] w-[190px] rounded-full bg-[#D09229]/[0.08]" />

          <div className="absolute right-[18%] top-[25px] h-[60px] w-[60px] rounded-full border border-[#D09229]/[0.15]" />

          <div className="relative z-10 flex flex-col justify-between gap-[20px] lg:flex-row lg:items-center">

            <div className="max-w-[650px]">

              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#e7c689]">
                Authentic Handloom • Crafted With Tradition
              </p>

              <h2 className="mt-[7px] text-[22px] font-semibold tracking-[-0.5px] text-white sm:text-[26px]">
                Grow your craft. Grow your business.
              </h2>

              <p className="mt-[6px] max-w-[570px] text-[11px] leading-[1.7] text-white/[0.68] sm:text-[13px]">
                Manage products, customer requests, production and orders
                from one beautiful workspace.
              </p>

            </div>

            <button
              onClick={() => navigate("/manufacturer/orders")}
              className="flex w-fit items-center gap-[7px] rounded-full bg-[#D09229] px-[16px] py-[9px] text-[11px] font-bold text-white transition hover:bg-[#dfa345]"
            >
              View Orders
              <ArrowRightIcon />
            </button>

          </div>

        </section>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="mt-[20px] grid grid-cols-2 gap-[10px] xl:grid-cols-4">

          <KpiCard
            icon={<BoxIcon />}
            title="Total Products"
            value="24"
            trend="8%"
            subtitle="vs last month"
            iconBg="bg-[#f5e9ed]"
            iconColor="text-[#4A1525]"
          />

          <KpiCard
            icon={<OrdersIcon />}
            title="Total Orders"
            value="18"
            trend="12%"
            subtitle="vs last month"
            iconBg="bg-[#f7eddc]"
            iconColor="text-[#a16b16]"
          />

          <KpiCard
            icon={<PendingIcon />}
            title="Pending Orders"
            value="06"
            trendText="Needs attention"
            iconBg="bg-[#f8eee4]"
            iconColor="text-[#a96832]"
          />

          <KpiCard
            icon={<RupeeIcon />}
            title="Monthly Revenue"
            value="₹1.25L"
            trend="15%"
            subtitle="vs last month"
            iconBg="bg-[#f0eadb]"
            iconColor="text-[#806020]"
          />

        </section>

        {/* =================================================
            REVENUE + ORDER STATUS
        ================================================= */}

        <section className="mt-[20px] grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">

          {/* REVENUE */}

          <div className="rounded-[17px] border border-[#e6ddd3] bg-white shadow-[0_5px_20px_rgba(60,35,20,0.045)]">

            <div className="flex items-center justify-between border-b border-[#eee7df] px-[18px] py-[16px] sm:px-[20px]">

              <div className="flex items-center gap-[9px]">

                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#f5e9ed] text-[#4A1525]">
                  <ChartIcon />
                </div>

                <div>

                  <h3 className="text-[14px] font-semibold text-[#403a35]">
                    Revenue Overview
                  </h3>

                  <p className="text-[9px] text-[#958c83]">
                    Monthly performance
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-[#f5f0e9] px-[9px] py-[5px] text-[9px] font-semibold text-[#705d4e]">
                Last 8 months
              </div>

            </div>

            <div className="px-[18px] pb-[20px] pt-[20px] sm:px-[25px]">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[9px] uppercase tracking-[1px] text-[#9a9086]">
                    Current Revenue
                  </p>

                  <p className="mt-[3px] text-[25px] font-semibold tracking-[-0.7px] text-[#403a35]">
                    ₹1.25L
                  </p>

                </div>

                <div className="flex items-center gap-[4px] text-[10px] font-semibold text-[#3d8a5b]">
                  <ArrowUpIcon />
                  15.4%
                </div>

              </div>

              {/* BAR CHART */}

              <div className="mt-[20px] flex h-[190px] items-end gap-[8px] border-b border-[#eee7df] sm:gap-[14px]">

                {monthlyRevenue.map((item, index) => (

                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >

                    <div className="relative flex h-full items-end justify-center">

                      <div
                        className={`w-full max-w-[32px] rounded-t-[7px] transition-all duration-300 group-hover:opacity-80 ${
                          index === monthlyRevenue.length - 1
                            ? "bg-gradient-to-t from-[#4A1525] to-[#9d5c39]"
                            : "bg-[#eadfd6]"
                        }`}
                        style={{
                          height: `${item.value}%`,
                        }}
                      />

                      <div className="absolute bottom-[calc(100%+7px)] hidden rounded-[6px] bg-[#3f202a] px-[7px] py-[4px] text-[8px] text-white shadow-md group-hover:block">
                        ₹{item.value}k
                      </div>

                    </div>

                    <p className="mt-[8px] text-center text-[9px] text-[#938980]">
                      {item.month}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* ORDER STATUS */}

          <div className="rounded-[17px] border border-[#e6ddd3] bg-white shadow-[0_5px_20px_rgba(60,35,20,0.045)]">

            <div className="border-b border-[#eee7df] px-[20px] py-[16px]">

              <h3 className="text-[14px] font-semibold text-[#403a35]">
                Order Status
              </h3>

              <p className="mt-[2px] text-[9px] text-[#958c83]">
                Current order distribution
              </p>

            </div>

            <div className="p-[20px]">

              <div className="flex items-center gap-[20px]">

                {/* DONUT */}

                <div className="relative flex h-[135px] w-[135px] shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#4A1525_0deg_120deg,#D09229_120deg_200deg,#8b6c98_200deg_260deg,#d9cec4_260deg_360deg)]">

                  <div className="flex h-[98px] w-[98px] flex-col items-center justify-center rounded-full bg-white">

                    <span className="text-[24px] font-semibold text-[#403a35]">
                      18
                    </span>

                    <span className="text-[8px] uppercase tracking-[1px] text-[#9a9086]">
                      Orders
                    </span>

                  </div>

                </div>

                {/* LEGEND */}

                <div className="flex flex-1 flex-col gap-[13px]">

                  <StatusRow
                    color="bg-[#4A1525]"
                    label="Completed"
                    count="06"
                    percentage="33%"
                  />

                  <StatusRow
                    color="bg-[#D09229]"
                    label="In Production"
                    count="06"
                    percentage="33%"
                  />

                  <StatusRow
                    color="bg-[#8b6c98]"
                    label="Quality Check"
                    count="03"
                    percentage="17%"
                  />

                  <StatusRow
                    color="bg-[#d9cec4]"
                    label="Pending"
                    count="03"
                    percentage="17%"
                  />

                </div>

              </div>

              <button
                onClick={() => navigate("/manufacturer/orders")}
                className="mt-[20px] flex w-full items-center justify-center gap-[5px] rounded-[9px] border border-[#ded2c7] py-[9px] text-[10px] font-semibold text-[#614d41] transition hover:bg-[#faf6f0]"
              >
                Manage All Orders
                <ArrowRightIcon />
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT ORDERS + PRODUCTION
        ================================================= */}

        <section className="mt-[20px] grid grid-cols-1 gap-[18px] xl:grid-cols-[1.5fr_1fr]">

          {/* RECENT ORDERS */}

          <div className="rounded-[17px] border border-[#e6ddd3] bg-white shadow-[0_5px_20px_rgba(60,35,20,0.045)]">

            <div className="flex items-center justify-between border-b border-[#eee7df] px-[20px] py-[16px]">

              <div>

                <h3 className="text-[14px] font-semibold text-[#403a35]">
                  Recent Orders
                </h3>

                <p className="mt-[2px] text-[9px] text-[#958c83]">
                  Latest customer activity
                </p>

              </div>

              <button
                onClick={() => navigate("/manufacturer/orders")}
                className="flex items-center gap-[4px] text-[10px] font-semibold text-[#6b273b] transition hover:text-[#4A1525]"
              >
                View All
                <ArrowRightIcon />
              </button>

            </div>

            <div>

              {orders.map((order, index) => (

                <div
                  key={order.id}
                  className={`flex items-center justify-between gap-[10px] px-[18px] py-[13px] transition hover:bg-[#fcfaf7] sm:px-[20px] ${
                    index !== orders.length - 1
                      ? "border-b border-[#f0ebe5]"
                      : ""
                  }`}
                >

                  <div className="flex min-w-0 items-center gap-[10px]">

                    <div className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-[10px] bg-[#f6eee5] text-[10px] font-bold text-[#6b273b]">
                      {order.initials}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-[11px] font-semibold text-[#403a35] sm:text-[12px]">
                        {order.product}
                      </p>

                      <p className="mt-[2px] truncate text-[9px] text-[#958c83]">
                        #{order.id} • {order.customer}
                      </p>

                    </div>

                  </div>

                  <div className="shrink-0 text-right">

                    <p className="text-[11px] font-bold text-[#403a35]">
                      {order.amount}
                    </p>

                    <span
                      className={`mt-[3px] inline-block rounded-full px-[7px] py-[3px] text-[8px] font-semibold ${order.statusClass}`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* PRODUCTION */}

          <div className="rounded-[17px] border border-[#e6ddd3] bg-white shadow-[0_5px_20px_rgba(60,35,20,0.045)]">

            <div className="border-b border-[#eee7df] px-[20px] py-[16px]">

              <h3 className="text-[14px] font-semibold text-[#403a35]">
                Production Overview
              </h3>

              <p className="mt-[2px] text-[9px] text-[#958c83]">
                Current manufacturing progress
              </p>

            </div>

            <div className="p-[20px]">

              <ProductionItem
                label="Kanchipuram Silk Saree"
                value="85%"
                progress="85%"
              />

              <ProductionItem
                label="Custom Zari Saree"
                value="62%"
                progress="62%"
              />

              <ProductionItem
                label="Cotton Handloom Saree"
                value="100%"
                progress="100%"
                completed
              />

              <ProductionItem
                label="Linen Handloom Saree"
                value="40%"
                progress="40%"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mt-[20px] grid grid-cols-2 gap-[10px] sm:grid-cols-4">

          <QuickAction
            icon={<PlusIcon />}
            title="Add Product"
            subtitle="Create new saree"
            onClick={() => navigate("/manufacturer/products")}
          />

          <QuickAction
            icon={<OrdersIcon />}
            title="View Orders"
            subtitle="Manage requests"
            onClick={() => navigate("/manufacturer/orders")}
          />

          <QuickAction
            icon={<BoxIcon />}
            title="Inventory"
            subtitle="Check stock"
            onClick={() => navigate("/manufacturer/products")}
          />

          <QuickAction
            icon={<CheckIcon />}
            title="Profile"
            subtitle="Business details"
            onClick={() => navigate("/manufacturer/profile")}
          />

        </section>

        {/* =================================================
            VERIFIED MANUFACTURER
        ================================================= */}

        <div className="mt-[20px] flex flex-col gap-[12px] rounded-[15px] border border-[#e5dbcf] bg-[#fbf7f1] px-[17px] py-[14px] sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-[10px]">

            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#4A1525] text-white">
              <CheckIcon />
            </div>

            <div>

              <p className="text-[11px] font-semibold text-[#403a35]">
                Verified Manufacturer
              </p>

              <p className="mt-[2px] text-[9px] text-[#958c83]">
                Kathar Weaves • Authentic handloom business
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/manufacturer/profile")}
            className="flex items-center justify-center gap-[5px] rounded-[8px] border border-[#d8c9b8] px-[11px] py-[7px] text-[9px] font-semibold text-[#5b4035] transition hover:bg-white"
          >
            View Profile
            <ArrowRightIcon />
          </button>

        </div>

      </main>

    </div>
  );
};

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({
  icon,
  title,
  value,
  trend,
  trendText,
  subtitle,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-[15px] border border-[#e6ddd3] bg-white p-[15px] shadow-[0_5px_18px_rgba(60,35,20,0.035)] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(60,35,20,0.07)]">

      <div className="absolute right-[-20px] top-[-25px] h-[80px] w-[80px] rounded-full bg-[#faf4ed]" />

      <div className="relative flex items-start justify-between">

        <div
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        {trend && (
          <span className="flex items-center gap-[2px] text-[9px] font-semibold text-[#3d8a5b]">
            <ArrowUpIcon />
            {trend}
          </span>
        )}

        {trendText && (
          <span className="text-[9px] font-semibold text-[#a96832]">
            {trendText}
          </span>
        )}

      </div>

      <p className="relative mt-[15px] text-[10px] text-[#91877e]">
        {title}
      </p>

      <h3 className="relative mt-[2px] text-[24px] font-semibold tracking-[-0.6px] text-[#302a26]">
        {value}
      </h3>

      {subtitle && (
        <p className="relative mt-[1px] text-[8px] text-[#a09891]">
          {subtitle}
        </p>
      )}

    </div>
  );
};

/* =========================================================
   STATUS ROW
========================================================= */

const StatusRow = ({
  color,
  label,
  count,
  percentage,
}) => {
  return (
    <div className="flex items-center gap-[7px]">

      <span
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${color}`}
      />

      <span className="flex-1 text-[10px] text-[#756d65]">
        {label}
      </span>

      <span className="text-[10px] font-semibold text-[#403a35]">
        {count}
      </span>

      <span className="w-[27px] text-right text-[8px] text-[#a09891]">
        {percentage}
      </span>

    </div>
  );
};

/* =========================================================
   PRODUCTION ITEM
========================================================= */

const ProductionItem = ({
  label,
  value,
  progress,
  completed,
}) => {
  return (
    <div className="mb-[17px] last:mb-0">

      <div className="flex items-center justify-between">

        <p className="max-w-[75%] truncate text-[10px] font-medium text-[#655950]">
          {label}
        </p>

        <span
          className={`text-[9px] font-semibold ${
            completed
              ? "text-[#3d8a5b]"
              : "text-[#806020]"
          }`}
        >
          {completed ? "Completed" : value}
        </span>

      </div>

      <div className="mt-[7px] h-[6px] overflow-hidden rounded-full bg-[#eee7df]">

        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completed
              ? "bg-[#4f8a5e]"
              : "bg-gradient-to-r from-[#4A1525] to-[#D09229]"
          }`}
          style={{
            width: progress,
          }}
        />

      </div>

    </div>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
  icon,
  title,
  subtitle,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-[9px] rounded-[13px] border border-[#e6ddd3] bg-white p-[12px] text-left shadow-[0_4px_14px_rgba(60,35,20,0.03)] transition duration-200 hover:-translate-y-[2px] hover:border-[#d6c6b7] hover:shadow-[0_9px_20px_rgba(60,35,20,0.07)]"
    >

      <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5e9ed] text-[#4A1525] transition group-hover:bg-[#4A1525] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="truncate text-[10px] font-semibold text-[#403a35]">
          {title}
        </p>

        <p className="mt-[2px] truncate text-[8px] text-[#958c83]">
          {subtitle}
        </p>

      </div>

    </button>
  );
};

export default Manufacturer;