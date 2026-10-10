const { ObjectId } = require("mongodb");

function getCollection(req) {
  return req.app.locals.db.collection("products");
}

function isValidProduct(body) {
  return (
    typeof body.name === "string" &&
    body.name.trim().length > 0 &&
    Number.isFinite(body.quantity) &&
    body.quantity > 0 &&
    typeof body.expiryDate === "string" &&
    !Number.isNaN(Date.parse(body.expiryDate)) &&
    Number.isFinite(body.price) &&
    body.price >= 0 &&
    Number.isFinite(body.averageDailySales) &&
    body.averageDailySales >= 0
  );
}

async function getProducts(req, res) {
  try {
    const products = await getCollection(req)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(products);
  } catch (error) {
    console.error("Fetch products failed:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

async function addProduct(req, res) {
  try {
    if (!isValidProduct(req.body)) {
      return res.status(400).json({
        message:
          "Provide a name, positive quantity, valid expiry date, non-negative price, and non-negative average daily sales.",
      });
    }

    const product = {
      name: req.body.name.trim(),
      quantity: req.body.quantity,
      expiryDate: req.body.expiryDate,
      price: req.body.price,
      averageDailySales: req.body.averageDailySales,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await getCollection(req).insertOne(product);

    res.status(201).json({
      message: "Product added successfully",
      product: { _id: result.insertedId, ...product },
    });
  } catch (error) {
    console.error("Add product failed:", error.message);
    res.status(500).json({ message: "Failed to add product" });
  }
}

async function updateProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const allowedFields = [
      "name",
      "quantity",
      "expiryDate",
      "price",
      "averageDailySales",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const existing = await getCollection(req).findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const candidate = { ...existing, ...updates };

    if (!isValidProduct(candidate)) {
      return res.status(400).json({
        message: "Updated product fields are invalid",
      });
    }

    updates.name = candidate.name.trim();
    updates.updatedAt = new Date();

    const result = await getCollection(req).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    res.json({
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    console.error("Update product failed:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
}

async function deleteProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const result = await getCollection(req).deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product failed:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};