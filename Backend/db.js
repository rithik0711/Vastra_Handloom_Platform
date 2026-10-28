const mongoose = require("mongoose");

/**
 * Global connection cache to ensure connection reuse across invocations / requests.
 * Mongoose maintains an internal connection pool automatically when connected once.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// Event listeners for real-time connection status
mongoose.connection.on("connected", () => {
    console.log(">>> MongoDB ATLAS CONNECTED SUCCESSFULLY");
    console.log(">>> Database: Vastra (Global Connection Pool Active)");
});

mongoose.connection.on("error", (err) => {
    console.error(">>> MongoDB Connection Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn(">>> MongoDB Disconnected");
});

const connectDB = async () => {
    // 1. Return cached connection if already established (connection reuse)
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // 2. Reuse pending connection promise to prevent duplicate concurrent handshakes
    if (!cached.promise) {
        let uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Vastra";

        // Clean URI format
        if (uri.includes("mongodb.net/?")) {
            uri = uri.replace("mongodb.net/?", "mongodb.net/Vastra?");
        } else if (uri.endsWith("mongodb.net") || uri.endsWith("mongodb.net/")) {
            uri = uri.replace(/mongodb\.net\/?$/, "mongodb.net/Vastra");
        }

        mongoose.set("strictQuery", false);
        mongoose.set("bufferCommands", false);

        // Connection pooling configuration
        const options = {
            dbName: "Vastra",
            maxPoolSize: 20,          // Maintain up to 20 concurrent connections in pool
            minPoolSize: 5,           // Keep at least 5 warm connections open to avoid Atlas handshake latency
            maxIdleTimeMS: 30000,     // Close idle connections after 30 seconds
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(uri, options).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset so subsequent requests can retry
        console.error(">>> MONGODB CONNECTION FAILED:", error.message);
        console.error(">>> TIP: In MongoDB Atlas -> 'Network Access', ensure IP '0.0.0.0/0' is added.");
        throw error;
    }
};

module.exports = connectDB;