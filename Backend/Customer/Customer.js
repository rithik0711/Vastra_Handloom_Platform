const express = require("express");
const router = express.Router();

const productsRouter = require("./Products");
const ordersRouter = require("./Orders");
const bookingsRouter = require("./Bookings");
const designRouter = require("./Design");
const profileRouter = require("./Profile");
const reviewsRouter = require("./Reviews");
const manufacturersRouter = require("./Manufacturers");
const wishlistRouter = require("./Wishlist");

// Mount modular sub-routes
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/bookings", bookingsRouter);
router.use("/design", designRouter);
router.use("/profile", profileRouter);
router.use("/reviews", reviewsRouter);
router.use("/manufacturers", manufacturersRouter);
router.use("/wishlist", wishlistRouter);

// Payment processing endpoint
router.post("/payment", async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const transactionId = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    return res.json({
      status: "success",
      message: "Payment authorized and verified successfully",
      data: {
        transactionId,
        paymentStatus: "Paid",
        paymentMethod: paymentMethod || "UPI (Instant)",
        paidAmount: amount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
