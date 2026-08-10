import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/manufacturer",
      icon: DashboardIcon,
    },
    {
      name: "Products",
      path: "/manufacturer/products",
      icon: ProductionQuantityLimitsIcon,
    },
    {
      name: "Orders",
      path: "/manufacturer/orders",
      icon: CommentIcon,
    },
    {
      name: "Profile",
      path: "/manufacturer/profile",
      icon: PersonIcon,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    navigate("/");
  };

  return (
    <aside className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#eadfd2] bg-[#fffdf9] shadow-[4px_0_20px_rgba(60,35,20,0.06)] transition-all duration-300 ${collapsed ? "w-[78px]" : "w-[250px]"}`}>

      {/* Logo Section */}
      <div className={`flex h-[90px] shrink-0 items-center border-b border-[#eadfd2] ${collapsed ? "justify-center px-[10px]" : "justify-center px-[20px]"}`}>
        <img src="/images/kathar.png" alt="Vastra Logo" className={`object-contain transition-all duration-300 ${collapsed ? "h-[48px] w-[48px]" : "h-[65px] w-[160px]"}`} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-[12px] py-[24px]">

        {/* Section Title */}
        {!collapsed && (
          <p className="mb-[12px] px-[13px] text-[11px] font-semibold uppercase tracking-[1.5px] text-[#a49a8d]">
            Manufacturer
          </p>
        )}

        {/* Menu Items */}
        <div className="flex flex-col gap-[6px]">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/manufacturer"}
                title={collapsed ? item.name : ""}
                className={({ isActive }) =>
                  `group relative flex h-[48px] items-center rounded-[10px] transition-all duration-200 ${
                    collapsed ? "justify-center px-0" : "gap-[14px] px-[14px]"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#4A1525] to-[#7A263B] text-white shadow-[0_5px_14px_rgba(74,21,37,0.18)]"
                      : "text-[#625b54] hover:bg-[#f5eee5] hover:text-[#4A1525]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      sx={{
                        fontSize: 21,
                        color: "inherit",
                      }}
                    />

                    {!collapsed && (
                      <span className="text-[14px] font-medium">
                        {item.name}
                      </span>
                    )}

                    {/* Active Indicator */}
                    {isActive && !collapsed && (
                      <span className="absolute right-[10px] h-[6px] w-[6px] rounded-full bg-[#D09229]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-[#eadfd2] px-[12px] py-[16px]">

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={`mb-[8px] flex h-[46px] w-full items-center rounded-[10px] text-[#746b62] transition-all duration-200 hover:bg-[#f5eee5] hover:text-[#4A1525] ${collapsed ? "justify-center" : "justify-start gap-[14px] px-[14px]"}`}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <KeyboardArrowLeftIcon
            sx={{
              fontSize: 23,
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />

          {!collapsed && (
            <span className="text-[14px] font-medium">
              Collapse
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className={`flex h-[48px] w-full items-center rounded-[10px] text-[#8a3f3f] transition-all duration-200 hover:bg-[#f9eeee] hover:text-[#a52f2f] ${collapsed ? "justify-center" : "gap-[14px] px-[14px]"}`}
          title="Logout"
        >
          <LogoutIcon sx={{ fontSize: 21 }} />

          {!collapsed && (
            <span className="text-[14px] font-medium">
              Logout
            </span>
          )}
        </button>

      </div>

    </aside>
  );
}