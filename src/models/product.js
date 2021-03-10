const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ["Large", "Extra Large"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
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
});

module.exports = mongoose.model("Product", productSchema);
