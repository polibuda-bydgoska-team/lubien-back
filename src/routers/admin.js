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
const isAuth = require("../middleware/isAuth");
const isAdminAuth = require("../middleware/isAdminAuth");

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

router.get("/users", isAuth, isAdminAuth, getUsers);

router.get("/users/:userId", isAuth, isAdminAuth, getUser);

router.get("/orders", isAuth, isAdminAuth, getOrders);

router.get("/orders/:orderId", isAuth, isAdminAuth, getOrder);

router.get("/products", isAuth, isAdminAuth, getProducts);

router.get("/products/:productId", isAuth, isAdminAuth, getProduct);

router.post("/product", validators, isAuth, isAdminAuth, addProduct);

router.put("/product/:productId", validators, isAuth, isAdminAuth, editProduct);

router.delete("/product/:productId", isAuth, isAdminAuth, deleteProduct);

module.exports = router;
