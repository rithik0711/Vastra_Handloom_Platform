require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const ragRoutes = require("./RAG/RAG");
const manufacturerRoutes = require("./Manufacturer/Manufacturer");
const customerRoutes = require("./Customer/Customer");
const ownerRoutes = require("./Owner/Owner");

const app = express();

// Middleware with 50MB payload limit for high-res photo uploads
app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        credentials: true
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "success",
        name: "Vastra Handloom Platform API",
        version: "1.0.0",
        message: "Vastra Node.js Backend is running seamlessly",
        endpoints: {
            manufacturer: "/api/manufacturer",
            customer: "/api/customer",
            owner: "/api/owner",
            rag: "/api/rag/query"
        }
    });
});

// Mount Routes
app.use("/api/rag", ragRoutes);
app.use("/api/manufacturer", manufacturerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/owner", ownerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Backend Error:", err.message);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found on Vastra Backend`
    });
});

const PORT = process.env.PORT || 5000;

// Start Server after connecting to MongoDB
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Vastra Backend running on http://localhost:${PORT}`);
    });
};

startServer();