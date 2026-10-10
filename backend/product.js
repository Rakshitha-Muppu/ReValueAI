const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");

router.get("/", getProducts);
router.post("/", addProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;