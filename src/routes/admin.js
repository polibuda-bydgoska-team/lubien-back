const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const validators = [
  body("title").trim().notEmpty(),
  body("price").trim().notEmpty().isFloat(),
  body("size")
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== "Large" || value !== "Extra Large") {
        throw new Error("Size must be a value of: Large or Extra Large");
      }
      return true;
    }),
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

router.get("/users");

router.get("/orders");

router.get("/users");

router.post("/product", validators);

router.put("/product/:productId", validators);

router.delete("/product/:productId");

module.exports = router;
