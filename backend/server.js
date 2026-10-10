
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
});

app.get("/", (req, res) => {
  res.send("Re:Value AI backend is running!");
});

// Get all inventory products
app.get("/api/products", async (req, res) => {
  try {
    const db = app.locals.db;
    const products = await db.collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(products);
  } catch (error) {
    console.error("Fetch products failed:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Add a product
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      quantity,
      expiryDate,
      price,
      averageDailySales
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      typeof expiryDate !== "string" ||
      Number.isNaN(Date.parse(expiryDate)) ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(averageDailySales) ||
      averageDailySales < 0
    ) {
      return res.status(400).json({
        message: "Enter a valid name, positive quantity, expiry date, non-negative price and average daily sales."
      });
    }

    const product = {
      name: name.trim(),
      quantity,
      expiryDate,
      price,
      averageDailySales,
      createdAt: new Date()
    };

    const result = await app.locals.db
      .collection("products")
      .insertOne(product);

    res.status(201).json({
      message: "Product added successfully",
      product: { _id: result.insertedId, ...product }
    });
  } catch (error) {
    console.error("Add product failed:", error.message);
    res.status(500).json({ message: "Failed to add product" });
  }
});

async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB Atlas connected successfully!");

    app.locals.db = client.db("revalueai");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    await client.close().catch(() => {});
    process.exit(1);
  }
}

startServer();
