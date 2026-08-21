const mongoose = require("mongoose");

let isConnecting = false;

// Event listeners for real-time connection status
mongoose.connection.on("connected", () => {
    console.log(">>> MongoDB ATLAS CONNECTED SUCCESSFULLY");
    console.log(">>> Database: Vastra");
});

mongoose.connection.on("error", (err) => {
    console.error(">>> MongoDB Connection Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn(">>> MongoDB Disconnected");
});

const connectDB = async () => {
    if (mongoose.connection.readyState === 1 || isConnecting) {
        return;
    }

    isConnecting = true;

    // Use connection string from .env
    let uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Vastra";

    // Clean URI format
    if (uri.includes("mongodb.net/?")) {
        uri = uri.replace("mongodb.net/?", "mongodb.net/Vastra?");
    } else if (uri.endsWith("mongodb.net") || uri.endsWith("mongodb.net/")) {
        uri = uri.replace(/mongodb\.net\/?$/, "mongodb.net/Vastra");
    }

    try {
        mongoose.set("strictQuery", false);
        // Disable indefinite command buffering so operations fail fast if DB is disconnected
        mongoose.set("bufferCommands", false);

        await mongoose.connect(uri, {
            dbName: "Vastra",
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.error(">>> MONGODB CONNECTION FAILED:", error.message);
        console.error(">>> TIP: In MongoDB Atlas -> 'Network Access', ensure IP '0.0.0.0/0' (Allow Access from Anywhere) is added.");
    } finally {
        isConnecting = false;
    }
};

module.exports = connectDB;