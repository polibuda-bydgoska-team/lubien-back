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
  cart: {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product, size, quantity) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.product.toString() === product._id.toString() && cp.size === size;
  });

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQuantity = this.cart.items[cartProductIndex].quantity + quantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      product: product._id,
      size: size,
      quantity: quantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.raiseProductQuantityInCart = function (
  product,
  size,
  addValue
) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.product.toString() === product._id.toString() && cp.size === size;
  });
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQuantity = this.cart.items[cartProductIndex].quantity + addValue;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      product: product._id,
      size: size,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.reduceProductQuantityInCart = function (
  product,
  size,
  subtractValue
) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.product.toString() === product._id.toString() && cp.size === size;
  });
  let updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQuantity =
      this.cart.items[cartProductIndex].quantity - subtractValue;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  }

  if (updatedCartItems[cartProductIndex].quantity <= 0) {
    return this.removeFromCart(product, size);
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (product, size) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.product.toString() === product._id.toString() && cp.size === size;
  });

  this.cart.items.splice(cartProductIndex, 1);

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
