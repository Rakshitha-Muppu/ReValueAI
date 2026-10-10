
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.get("/", (req, res) => {
  res.send("Re:Value AI backend is running!");
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
