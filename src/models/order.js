const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["In progress", "Sent", "Finalized"],
      default: "In progress",
    },
    products: [
      {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        burnTime: {
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
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    purchaser: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      houseNumber: {
        type: String,
        required: true,
      },
      addressAdditionalInfo: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
