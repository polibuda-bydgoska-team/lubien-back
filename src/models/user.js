const mongoose = require("mongoose");

const ROLE = require("../config/userRoles");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    addressAditionalInfo: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: false,
    },
    postCode: {
      type: String,
      required: true,
    },
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  role: { type: String, default: ROLE.BASIC },
});

module.exports = mongoose.model("User", userSchema);
