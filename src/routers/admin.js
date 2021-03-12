const express = require("express");
const { body } = require("express-validator");
const {
  getUsers,
  getUser,
  getOrders,
  getOrder,
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/admin");

const router = express.Router();

const validators = [
  body("title").trim().notEmpty(),
  body("price").trim().notEmpty().isFloat(),
  body("size").matches(/\b(?:Large|Extra Large)\b/),
  body("quantity").trim().notEmpty().isDecimal(),
  body("mainNotes").trim().notEmpty(),
  body("scentInspiration").trim().notEmpty(),
  body("location").trim().notEmpty(),
  body("scentProfile").trim().notEmpty(),
  body("topNotes").trim().notEmpty(),
  body("heartNotes").trim().notEmpty(),
  body("baseNotes").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("seriesName").trim().notEmpty(),
  body("imagesURL").notEmpty(),
];

router.get("/users", getUsers);

router.get("/users/:userId", getUser);

router.get("/orders", getOrders);

router.get("/orders/:orderId", getOrder);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.post("/product", validators, addProduct);

router.put("/product/:productId", validators, editProduct);

router.delete("/product/:productId", deleteProduct);

module.exports = router;
