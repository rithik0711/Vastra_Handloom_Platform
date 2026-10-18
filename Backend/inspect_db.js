const mongoose = require("mongoose");
const connectDB = require("./db");

async function check() {
  await connectDB();
  const db = mongoose.connection.useDb("Vastra");
  const collections = await db.db.listCollections().toArray();
  console.log("Collections in Vastra DB:", collections.map(c => c.name));

  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`Collection: ${c.name} -> ${count} documents`);
    if (count > 0 && (c.name.toLowerCase().includes("book") || c.name.toLowerCase().includes("order") || c.name.toLowerCase().includes("mfg") || c.name.toLowerCase().includes("manuf"))) {
      const sample = await db.collection(c.name).find({}).limit(5).toArray();
      console.log(JSON.stringify(sample, null, 2));
    }
  }

  process.exit(0);
}

check().catch(err => {
  console.error("Inspect error:", err);
  process.exit(1);
});
