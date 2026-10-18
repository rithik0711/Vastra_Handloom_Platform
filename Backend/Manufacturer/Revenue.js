const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Schemas & Models
const bookingSchema = new mongoose.Schema({}, { collection: "Bookings", strict: false });
const BookingModel =
  mongoose.models.ManufacturerBooking ||
  mongoose.model("ManufacturerBooking", bookingSchema, "Bookings");

const manufacturerSchema = new mongoose.Schema({}, { collection: "Manufacturer", strict: false });
const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", manufacturerSchema, "Manufacturer");

const revenueSchema = new mongoose.Schema({}, { collection: "Revenue", strict: false });
const RevenueModel =
  mongoose.models.RevenueCollection ||
  mongoose.model("RevenueCollection", revenueSchema, "Revenue");

const productSchema = new mongoose.Schema({}, { collection: "Products", strict: false });
const ProductModel =
  mongoose.models.ManufacturerProduct ||
  mongoose.model("ManufacturerProduct", productSchema, "Products");

// Helper to parse currency strings to numbers
const parseAmount = (amount) => {
  if (typeof amount === "number") return amount;
  if (!amount) return 0;
  const clean = String(amount)
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");
  return Number(clean) || 0;
};

// Helper to parse dates
const parseDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) return parsed;

  const parts = String(date).trim().split(" ");
  if (parts.length === 3) {
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const day = Number(parts[0]);
    const month = months[parts[1]];
    const year = Number(parts[2]);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
};

// Core handler to fetch revenue data by ID
const getRevenueHandler = async (req, res) => {
  try {
    const rawId =
      req.params.id ||
      req.query.id ||
      req.query.manufacturerId ||
      req.headers["x-manufacturer-id"] ||
      req.headers["x-user-email"] ||
      "rithikeswaran.it23@bitsathy.ac.in";

    const targetId = String(rawId).trim();

    // 1. Resolve Manufacturer from DB
    let manufacturerDoc = null;

    if (mongoose.Types.ObjectId.isValid(targetId) && targetId.length === 24) {
      manufacturerDoc = await ManufacturerModel.findById(new mongoose.Types.ObjectId(targetId)).lean();
    }

    if (!manufacturerDoc) {
      manufacturerDoc = await ManufacturerModel.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${targetId}$`, "i") } },
          { businessName: { $regex: new RegExp(`^${targetId}$`, "i") } },
          { ownerName: { $regex: new RegExp(`^${targetId}$`, "i") } }
        ]
      }).lean();
    }

    // Default fallback to Kathar Weaves if none found and matches rithik or kathar
    if (!manufacturerDoc && (targetId.toLowerCase().includes("rithik") || targetId.toLowerCase().includes("kathar"))) {
      manufacturerDoc = await ManufacturerModel.findOne({
        $or: [
          { email: { $regex: /rithikeswaran/i } },
          { businessName: { $regex: /kathar/i } }
        ]
      }).lean();
    }

    // If still no document, grab the first manufacturer in DB or construct a default profile
    if (!manufacturerDoc) {
      const firstMfg = await ManufacturerModel.findOne({}).lean();
      if (firstMfg) {
        manufacturerDoc = firstMfg;
      } else {
        manufacturerDoc = {
          _id: "6a8739c237a1fbfeb9a55f83",
          businessName: "Kathar Weaves",
          ownerName: "Rithikeswaran M",
          email: "rithikeswaran.it23@bitsathy.ac.in",
          phone: "+91 9344681476",
          location: "Coimbatore, Tamil Nadu",
          loomsActive: 18,
          artisanCount: 32
        };
      }
    }

    // 2. Build identity matching variants
    const idVariants = new Set();
    idVariants.add(targetId);
    idVariants.add(targetId.toLowerCase());

    if (manufacturerDoc) {
      if (manufacturerDoc._id) {
        idVariants.add(String(manufacturerDoc._id));
      }
      if (manufacturerDoc.email) {
        idVariants.add(manufacturerDoc.email);
        idVariants.add(manufacturerDoc.email.toLowerCase());
      }
      if (manufacturerDoc.businessName) {
        idVariants.add(manufacturerDoc.businessName);
        idVariants.add(manufacturerDoc.businessName.toLowerCase());
        idVariants.add(manufacturerDoc.businessName.toLowerCase().replace(/\s+/g, "_"));
        idVariants.add(manufacturerDoc.businessName.toLowerCase().replace(/_/g, " "));
      }
      if (manufacturerDoc.ownerName) {
        idVariants.add(manufacturerDoc.ownerName);
      }
    }

    // Also include known Kathar aliases if relevant
    if (
      targetId.toLowerCase().includes("rithik") ||
      targetId.toLowerCase().includes("kathar") ||
      (manufacturerDoc?.businessName && manufacturerDoc.businessName.toLowerCase().includes("kathar"))
    ) {
      idVariants.add("kathar_weaves");
      idVariants.add("Kathar Weaves");
      idVariants.add("rithikeswaran.it23@bitsathy.ac.in");
      idVariants.add("Rithikeswaran M");
    }

    const variantsArray = Array.from(idVariants);

    // 3. Query Bookings, Revenue, and Products from MongoDB
    const [bookingsList, revenueDocs, productsList] = await Promise.all([
      BookingModel.find({
        $or: [
          { manufacturerId: { $in: variantsArray } },
          { manufacturer: { $in: variantsArray } },
          { artisanName: { $in: variantsArray } },
          { manufacturerId: { $regex: new RegExp(`^${targetId}$`, "i") } },
          { manufacturer: { $regex: new RegExp(`^${targetId}$`, "i") } }
        ]
      })
        .sort({ createdAt: -1 })
        .lean(),

      RevenueModel.find({
        $or: [
          { manufacturerId: { $in: variantsArray } },
          { manufacturer: { $in: variantsArray } }
        ]
      })
        .sort({ createdAt: -1 })
        .lean(),

      ProductModel.find({
        $or: [
          { manufacturerId: { $in: variantsArray } },
          { manufacturer: { $in: variantsArray } }
        ]
      }).lean()
    ]);

    // 4. Transform Bookings and Revenue into unified transaction items
    const orders = bookingsList.map((b) => {
      const isBespoke =
        (b.bookingId && b.bookingId.startsWith("BK")) ||
        b.orderType?.includes("Bespoke");
      const orderIdVal =
        b.orderId || b.bookingId || `ORD-${String(b._id).slice(-4).toUpperCase()}`;

      const dateVal =
        b.orderDate ||
        b.bookingDate ||
        b.date ||
        (b.createdAt
          ? new Date(b.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          : "10 Oct 2026");

      const rawAmt =
        parseAmount(b.amount) ||
        parseAmount(b.price) ||
        parseAmount(b.advancePaid) ||
        0;

      const fullAddr =
        b.deliveryAddress || b.shippingAddress || b.address || "";

      return {
        id: b._id,
        _id: b._id,
        orderId: orderIdVal,
        customer: b.customer || b.customerName || "Patron",
        customerEmail: b.customerEmail || b.email || "",
        customerPhone: b.customerPhone || b.phone || "",
        product:
          b.product ||
          b.customPattern ||
          b.fabricChoice ||
          "Handloom Silk Saree",
        category: b.category || (isBespoke ? "Bespoke Silk" : "Silk"),
        quantity: Number(b.quantity) || 1,
        date: dateVal,
        payment:
          b.paymentStatus === "Advance Paid" || b.paymentStatus === "Paid" || b.payment === "Paid"
            ? "Paid"
            : b.paymentStatus || b.payment || "Pending",
        status: b.status || "Completed",
        amount: b.amount || (rawAmt ? `₹${rawAmt.toLocaleString("en-IN")}` : "₹0"),
        rawAmount: rawAmt,
        address: fullAddr,
        orderType:
          b.orderType ||
          (isBespoke ? "Bespoke Loom Reservation" : "Ready-Made Handloom"),
        createdAt: b.createdAt || new Date()
      };
    });

    // Merge any independent ledger documents from the Revenue collection
    if (revenueDocs && revenueDocs.length > 0) {
      revenueDocs.forEach((r) => {
        const rawAmt = parseAmount(r.amount);
        orders.push({
          id: r._id,
          _id: r._id,
          orderId: r.transactionId || r.orderId || `REV-${String(r._id).slice(-4).toUpperCase()}`,
          customer: r.customer || "Patron",
          customerEmail: r.customerEmail || "",
          customerPhone: r.customerPhone || "",
          product: r.product || "Handloom Collection",
          category: r.category || "Silk",
          quantity: Number(r.quantity) || 1,
          date: r.date || new Date(r.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          payment: r.payment || "Paid",
          status: r.status || "Completed",
          amount: r.amount || `₹${rawAmt.toLocaleString("en-IN")}`,
          rawAmount: rawAmt,
          address: r.address || "",
          orderType: r.orderType || "Direct Sale",
          createdAt: r.createdAt || new Date()
        });
      });
    }

    // 5. Compute summary financial statistics
    const paidOrders = orders.filter(
      (o) =>
        o.payment === "Paid" ||
        o.status === "Completed" ||
        o.status === "Delivered"
    );

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.rawAmount, 0);

    const completedRevenue = orders
      .filter((o) => o.status === "Completed" || o.status === "Delivered")
      .reduce((sum, o) => sum + o.rawAmount, 0);

    const pendingRevenue = orders
      .filter(
        (o) =>
          o.status !== "Completed" &&
          o.status !== "Delivered" &&
          o.payment !== "Paid"
      )
      .reduce((sum, o) => sum + o.rawAmount, 0);

    const averageOrderValue =
      paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    // 6. Monthly Revenue calculation (Jan - Dec)
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlyMap = {};
    months.forEach((m) => {
      monthlyMap[m] = 0;
    });

    paidOrders.forEach((o) => {
      const d = parseDate(o.date) || (o.createdAt ? new Date(o.createdAt) : null);
      if (d && !isNaN(d.getTime())) {
        const mKey = months[d.getMonth()];
        if (monthlyMap[mKey] !== undefined) {
          monthlyMap[mKey] += o.rawAmount;
        }
      }
    });

    const maxMonthRev = Math.max(...Object.values(monthlyMap), 1);
    const monthlyRevenue = months.map((m) => ({
      month: m,
      revenue: monthlyMap[m] || 0,
      percentage: Math.round(((monthlyMap[m] || 0) / maxMonthRev) * 100)
    }));

    // 7. Product Revenue calculation
    const prodMap = {};
    paidOrders.forEach((o) => {
      const pName = o.product || "Handloom Product";
      if (!prodMap[pName]) {
        prodMap[pName] = {
          name: pName,
          category: o.category || "Silk",
          revenue: 0,
          quantity: 0
        };
      }
      prodMap[pName].revenue += o.rawAmount;
      prodMap[pName].quantity += o.quantity || 1;
    });

    const productRevenue = Object.values(prodMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map((item) => ({
        ...item,
        percentage:
          totalRevenue > 0
            ? Math.round((item.revenue / totalRevenue) * 100)
            : 0
      }));

    // 8. Return response
    return res.json({
      status: "success",
      queryId: targetId,
      data: {
        manufacturer: {
          _id: manufacturerDoc._id,
          id: manufacturerDoc._id,
          businessName: manufacturerDoc.businessName || "Kathar Weaves",
          ownerName: manufacturerDoc.ownerName || "Rithikeswaran M",
          email: manufacturerDoc.email || "rithikeswaran.it23@bitsathy.ac.in",
          phone: manufacturerDoc.phone || "+91 9344681476",
          location: manufacturerDoc.location || "Coimbatore, Tamil Nadu",
          specialization: manufacturerDoc.specialization || "Handloom Silk & Cotton Sarees",
          loomsActive: manufacturerDoc.loomsActive || 18,
          artisanCount: manufacturerDoc.artisanCount || 32,
          gstin: manufacturerDoc.gstin || "33AABCK1234F1Z9"
        },
        summary: {
          totalRevenue,
          formattedTotalRevenue: `₹${totalRevenue.toLocaleString("en-IN")}`,
          completedRevenue,
          formattedCompletedRevenue: `₹${completedRevenue.toLocaleString("en-IN")}`,
          pendingRevenue,
          formattedPendingRevenue: `₹${pendingRevenue.toLocaleString("en-IN")}`,
          averageOrderValue,
          formattedAverageOrderValue: `₹${averageOrderValue.toLocaleString("en-IN")}`,
          totalOrdersCount: orders.length,
          paidOrdersCount: paidOrders.length,
          totalProductsCount: productsList.length
        },
        monthlyRevenue,
        productRevenue,
        orders
      }
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Mount route variants for flexible ID querying
router.get("/", getRevenueHandler);
router.get("/:id", getRevenueHandler);

module.exports = router;
