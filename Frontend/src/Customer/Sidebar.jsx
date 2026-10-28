import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  Sparkles,
  Award,
  User,
  Heart,
  Palette,
  LogOut,
  ChevronLeft,
  QrCode
} from "lucide-react";
import QRScannerModal from "../components/QRScannerModal";

export default function CustomerSidebar() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("customerSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem(
      "customerSidebarCollapsed",
      JSON.stringify(collapsed)
    );
    document.body.classList.toggle(
      "customer-sidebar-collapsed",
      collapsed
    );

    return () => {
      document.body.classList.remove("customer-sidebar-collapsed");
    };
  }, [collapsed]);

  const userEmail = localStorage.getItem("userEmail") || "";
  const [favCount, setFavCount] = useState(0);

  React.useEffect(() => {
    if (userEmail) {
      fetch(`${API_BASE_URL}/api/customer/wishlist?customerEmail=${encodeURIComponent(userEmail)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.status === "success" && Array.isArray(j.data)) {
            setFavCount(j.data.length);
          }
        })
        .catch(() => {});
    }
  }, [userEmail]);

  const menuItems = [
    { name: "Explore Handlooms", path: "/customer", icon: ShoppingBag },
    { name: "Liked Products", path: "/customer/wishlist", icon: Heart, badge: favCount > 0 ? favCount : null },
    { name: "My Orders & Tracking", path: "/customer/orders", icon: Clock },
    { name: "Custom Saree Designs", path: "/customer/design", icon: Palette },
    { name: "Custom Loom Booking", path: "/customer/booking", icon: Sparkles },
    { name: "Master Weavers", path: "/customer/manufacturers", icon: Award },
    { name: "My Profile", path: "/customer/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
    navigate("/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#eadfd2] bg-[#fffdf9] shadow-[4px_0_20px_rgba(60,35,20,0.06)] transition-all duration-300 ${
        collapsed ? "w-[78px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex h-[90px] shrink-0 items-center border-b border-[#eadfd2] ${
        collapsed ? "justify-center px-[10px]" : "justify-center px-[20px]"
      }`}>
        <img
          src="/images/logo.png"
          alt="Vastra Logo"
          className={`object-contain transition-all duration-300 ${
            collapsed ? "h-[44px] w-[44px]" : "h-[60px] w-[150px]"
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/kathar.png";
          }}
        />
      </div>

      {/* Nav Menu */}
      <nav className="flex flex-1 flex-col px-[12px] py-[24px]">
        {!collapsed && (
          <p className="mb-[12px] px-[13px] text-[11px] font-semibold uppercase tracking-[1.5px] text-[#a49a8d]">
            Customer Portal
          </p>
        )}

        <div className="flex flex-col gap-[6px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/customer"}
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
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <span className="text-[14px] font-medium flex-1">{item.name}</span>
                    )}
                    {item.badge && !collapsed && (
                      <span className="rounded-full bg-[#A44747] px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                    {isActive && !collapsed && !item.badge && (
                      <span className="absolute right-[10px] h-[6px] w-[6px] rounded-full bg-[#D09229]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Quick Action: Scan Saree QR Code */}
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className={`group relative flex h-[48px] items-center rounded-[10px] bg-[#FAF0E1] text-[#4A1525] border border-[#E8DEC8] transition-all duration-200 hover:bg-[#F5E5D0] cursor-pointer mt-2 ${
              collapsed ? "justify-center px-0" : "gap-[14px] px-[14px]"
            }`}
            title="Scan Saree QR Authenticity Tag"
          >
            <QrCode className="h-5 w-5 shrink-0 text-[#A16B16]" />
            {!collapsed && (
              <span className="text-[13px] font-bold flex-1 text-left">Scan Saree QR</span>
            )}
            {!collapsed && (
              <span className="rounded-md bg-[#4A1525] px-1.5 py-0.5 text-[9px] font-bold text-[#FCDA8B]">
                Camera
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="shrink-0 border-t border-[#eadfd2] px-[12px] py-[16px]">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={`mb-[8px] flex h-[44px] w-full items-center rounded-[10px] text-[#746b62] transition-all hover:bg-[#f5eee5] hover:text-[#4A1525] cursor-pointer ${
            collapsed ? "justify-center" : "gap-[14px] px-[14px]"
          }`}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && <span className="text-[14px] font-medium">Collapse</span>}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex h-[44px] w-full items-center rounded-[10px] text-[#8a3f3f] transition-all hover:bg-[#f9eeee] hover:text-[#a52f2f] cursor-pointer ${
            collapsed ? "justify-center" : "gap-[14px] px-[14px]"
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-[14px] font-medium">Logout</span>}
        </button>
      </div>

      {/* Live QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </aside>
  );
}
