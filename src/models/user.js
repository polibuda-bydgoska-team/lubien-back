const mongoose = require("mongoose");

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
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  orders: {
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
    items: [
      {
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
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
