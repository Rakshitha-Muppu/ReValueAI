const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const productRoutes = require("./product");
const { analyzeExpiry } = require("./expiryAnalysis");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/test-route", (req, res) => {
  res.send("Updated server.js is working!");
});

const client = new MongoClient(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
});

// Health check
app.get("/", (req, res) => {
  res.send("Re:Value AI backend is running!");
});

// Product CRUD routes
app.use("/api/products", productRoutes);

// Expiry analysis
app.get("/api/analysis/expiry", async (req, res) => {
  try {
    const products = await app.locals.db
      .collection("products")
      .find({})
      .toArray();

    res.json(products.map(analyzeExpiry));
  } catch (error) {
    console.error("Expiry analysis failed:", error.message);
    res.status(500).json({
      message: "Failed to analyze expiry risk",
    });
  }
});

// Dashboard statistics
app.get("/api/dashboard", async (req, res) => {
  try {
    const products = await app.locals.db
      .collection("products")
      .find({})
      .toArray();

    const analyzedProducts = products.map(analyzeExpiry);

    const totalProducts = products.length;

    const totalUnits = products.reduce(
      (sum, product) => sum + (Number(product.quantity) || 0),
      0
    );

    const inventoryValue = products.reduce(
      (sum, product) =>
        sum +
        (Number(product.quantity) || 0) *
          (Number(product.price) || 0),
      0
    );

    const atRiskProducts = analyzedProducts.filter(
      (product) =>
        ["High", "Medium", "Expired"].includes(product.riskLevel)
    );

    const atRiskUnits = atRiskProducts.reduce(
      (sum, product) => sum + (Number(product.quantity) || 0),
      0
    );

    res.json({
      totalProducts,
      totalUnits,
      inventoryValue: Number(inventoryValue.toFixed(2)),
      atRiskCount: atRiskProducts.length,
      atRiskUnits,
      products: analyzedProducts,
    });
  } catch (error) {
    console.error("Dashboard fetch failed:", error.message);
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
});

// Start server after connecting to MongoDB
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing from backend/.env");
    process.exit(1);
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    app.locals.db = client.db("revalueai");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("MongoDB Atlas connected successfully!");
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    await client.close().catch(() => {});
    process.exit(1);
  }
}

startServer();