const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    large: { type: Number, required: true },
    extraLarge: { type: Number, required: true },
  },
  quantity: {
    large: { type: Number, required: true },
    extraLarge: { type: Number, required: true },
  },
  burnTime: {
    large: { type: Number, required: true },
    extraLarge: { type: Number, required: true },
  },
  mainNotes: {
    type: String,
    required: true,
  },
  scentInspiration: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  scentProfile: {
    type: String,
    required: true,
  },
  topNotes: {
    type: String,
    required: true,
  },
  heartNotes: {
    type: String,
    required: true,
  },
  baseNotes: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seriesName: {
    type: String,
    required: true,
  },
  imagesURL: [
    {
      type: String,
      required: true,
    },
  ],
  showOnHomePage: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
