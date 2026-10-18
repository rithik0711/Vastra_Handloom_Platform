const express = require("express");
const mongoose = require("mongoose");

const galleryRoutes = require("./Gallery");
const productRoutes = require("./Products");
const orderRoutes = require("./Orders");
const profileRoutes = require("./Profile");
const customerRoutes = require("./Customers");
const revenueRoutes = require("./Revenue");

const router = express.Router();

const parseAmount = (amount) => {
  if (typeof amount === "number") return amount;
  if (!amount) return 0;
  return (
    Number(
      String(amount)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .replace(/[^\d.]/g, "")
    ) || 0
  );
};

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

// Dynamic Summary stats endpoint for Manufacturer Dashboard
router.get("/stats", async (req, res) => {
  try {
    const manufacturerId = (
      req.query.manufacturerId ||
      req.query.id ||
      req.headers["x-manufacturer-id"] ||
      "rithikeswaran.it23@bitsathy.ac.in"
    ).trim();

    const Bookings = mongoose.connection.collection("Bookings");
    const Product = mongoose.connection.collection("Products");
    const Manufacturer = mongoose.connection.collection("Manufacturer");

    // 1. Resolve Manufacturer
    let profile = null;
    if (mongoose.Types.ObjectId.isValid(manufacturerId) && manufacturerId.length === 24) {
      profile = await Manufacturer.findOne({ _id: new mongoose.Types.ObjectId(manufacturerId) });
    }
    if (!profile) {
      profile = await Manufacturer.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${manufacturerId}$`, "i") } },
          { businessName: { $regex: new RegExp(`^${manufacturerId}$`, "i") } },
          { ownerName: { $regex: new RegExp(`^${manufacturerId}$`, "i") } }
        ]
      });
    }
    if (!profile && (manufacturerId.toLowerCase().includes("rithik") || manufacturerId.toLowerCase().includes("kathar"))) {
      profile = await Manufacturer.findOne({
        $or: [{ email: { $regex: /rithikeswaran/i } }, { businessName: { $regex: /kathar/i } }]
      });
    }

    // 2. Build ID variants
    const mVariants = new Set([
      manufacturerId,
      "kathar_weaves",
      "Kathar Weaves",
      "rithikeswaran.it23@bitsathy.ac.in",
      "Rithikeswaran M"
    ]);

    if (profile) {
      if (profile._id) mVariants.add(String(profile._id));
      if (profile.email) mVariants.add(profile.email);
      if (profile.businessName) {
        mVariants.add(profile.businessName);
        mVariants.add(profile.businessName.toLowerCase().replace(/\s+/g, "_"));
      }
      if (profile.ownerName) mVariants.add(profile.ownerName);
    }

    const variantsArr = Array.from(mVariants);

    // 3. Fetch Orders, Products from MongoDB
    const [orders, products] = await Promise.all([
      Bookings.find({
        $or: [
          { manufacturerId: { $in: variantsArr } },
          { manufacturer: { $in: variantsArr } },
          { artisanName: { $in: variantsArr } },
          { manufacturerId: { $regex: new RegExp(`^${manufacturerId}$`, "i") } },
          { manufacturer: { $regex: new RegExp(`^${manufacturerId}$`, "i") } }
        ]
      })
        .sort({ createdAt: -1 })
        .toArray(),

      Product.find({
        $or: [
          { manufacturerId: { $in: variantsArr } },
          { manufacturer: { $in: variantsArr } }
        ]
      })
        .sort({ createdAt: -1 })
        .toArray()
    ]);

    const totalProducts = products.length;
    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (o) => o.status === "Completed" || o.status === "Delivered"
    ).length;

    const inProductionOrders = orders.filter(
      (o) =>
        o.status === "In Production" ||
        (o.status && o.status.toLowerCase().includes("production"))
    ).length;

    const qualityCheckOrders = orders.filter(
      (o) =>
        o.status === "Quality Check" ||
        (o.status && o.status.toLowerCase().includes("inspection"))
    ).length;

    const strictlyPendingOrders = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Order Placed" ||
        o.status === "Custom Request Confirmed" ||
        (o.status && (o.status.toLowerCase().includes("placed") || o.status.toLowerCase().includes("confirm")))
    ).length;

    const pendingOrders = totalOrders - completedOrders;

    // Calculate total and monthly revenue
    let totalRevenueSum = 0;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlyMap = {};
    months.forEach((m) => {
      monthlyMap[m] = 0;
    });

    orders.forEach((o) => {
      const amt =
        parseAmount(o.amount) ||
        parseAmount(o.price) ||
        parseAmount(o.advancePaid) ||
        0;

      // Count if paid, advance paid, or completed
      if (
        o.payment === "Paid" ||
        o.paymentStatus === "Paid" ||
        o.paymentStatus === "Advance Paid" ||
        o.status === "Completed" ||
        o.status === "Delivered" ||
        !o.status
      ) {
        totalRevenueSum += amt;
      }

      const rawDate =
        o.orderDate ||
        o.bookingDate ||
        o.date ||
        (o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          : "");

      if (rawDate) {
        const parts = String(rawDate).trim().split(" ");
        if (parts.length >= 2) {
          const monthKey = parts[1];
          if (monthlyMap[monthKey] !== undefined) {
            monthlyMap[monthKey] += amt;
          }
        }
      }
    });

    const maxMonthRev = Math.max(...Object.values(monthlyMap), 1);
    const monthlyRevenueChart = months.map((m) => ({
      month: m,
      revenue: monthlyMap[m] || 0,
      value:
        monthlyMap[m] > 0
          ? Math.max(Math.round(((monthlyMap[m] || 0) / maxMonthRev) * 100), 20)
          : 6
    }));

    // Format revenue string
    let formattedRevenue = "₹0";
    if (totalRevenueSum >= 100000) {
      formattedRevenue = `₹${(totalRevenueSum / 100000).toFixed(2)}L`;
    } else {
      formattedRevenue = `₹${totalRevenueSum.toLocaleString("en-IN")}`;
    }

    // Status breakdown percentages
    const calcPct = (cnt) =>
      totalOrders > 0 ? `${Math.round((cnt / totalOrders) * 100)}%` : "0%";

    const statusBreakdown = [
      {
        label: "Completed",
        count: completedOrders,
        percentage: calcPct(completedOrders),
        color: "bg-[#4A1525]"
      },
      {
        label: "In Production",
        count: inProductionOrders,
        percentage: calcPct(inProductionOrders),
        color: "bg-[#D09229]"
      },
      {
        label: "Quality Check",
        count: qualityCheckOrders,
        percentage: calcPct(qualityCheckOrders),
        color: "bg-[#8B6C98]"
      },
      {
        label: "Pending",
        count: strictlyPendingOrders,
        percentage: calcPct(strictlyPendingOrders),
        color: "bg-[#DDD2C6]"
      }
    ];

    // Recent orders (4-6 items)
    const recentOrders = orders.slice(0, 4).map((o) => ({
      id: o.orderId || `VAS${String(o._id).slice(-4).toUpperCase()}`,
      customer: o.customer || "Customer",
      product: o.product || "Handloom Product",
      amount:
        o.amount ||
        (o.price ? `₹${Number(o.price).toLocaleString("en-IN")}` : "₹0"),
      status: o.status || "Pending",
      statusClass: getStatusClass(o.status || "Pending"),
      date: o.date || ""
    }));

    // Production items progress
    const productionProgress = orders
      .filter(
        (o) =>
          o.status === "In Production" ||
          o.status === "Quality Check" ||
          o.status === "Completed"
      )
      .slice(0, 4)
      .map((o) => {
        let pct = "85%";
        let isDone = false;
        if (o.status === "Completed") {
          pct = "100%";
          isDone = true;
        } else if (o.status === "Quality Check") {
          pct = "75%";
        } else if (o.status === "In Production") {
          pct = "60%";
        }
        return {
          label: o.product || "Handloom Weave",
          value: pct,
          progress: pct,
          completed: isDone
        };
      });

    return res.json({
      status: "success",
      data: {
        businessName: profile?.businessName || "Kathar Weaves",
        ownerName: profile?.ownerName || "Rithikeswaran M",
        loomsActive: profile?.loomsActive || 18,
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        monthlyRevenue: formattedRevenue,
        rawRevenue: totalRevenueSum,
        revenueGrowth: "15%",
        productsGrowth: "8%",
        ordersGrowth: "12%",
        statusBreakdown,
        monthlyRevenueChart,
        recentOrders,
        productionProgress:
          productionProgress.length > 0
            ? productionProgress
            : [
                {
                  label: "Kanchipuram Silk Batch #12",
                  value: "85%",
                  progress: "85%",
                  completed: false
                },
                {
                  label: "Pure Zari Wedding Collection",
                  value: "100%",
                  progress: "100%",
                  completed: true
                }
              ]
      }
    });
  } catch (error) {
    console.error("Manufacturer stats error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.use("/gallery", galleryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/booking", orderRoutes);
router.use("/bookings", orderRoutes);
router.use("/profile", profileRoutes);
router.use("/customers", customerRoutes);
router.use("/revenue", revenueRoutes);

module.exports = router;