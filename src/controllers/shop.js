const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const createError = require("../utils/createError");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.getProducts = async (req, res, next) => {
  try {
    return res.status(200).send(res.paginatedResults);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      createError("Could not find product", 404);
    }
    return res.status(200).send(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();
    const products = user.cart.items;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((p) => {
        return {
          name: p.product.title,
          amount:
            p.size === "large"
              ? p.product.price.large * 100
              : p.product.price.extraLarge * 100,
          currency: "GBP",
          quantity: p.quantity,
        };
      }),
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      mode: "payment",
      success_url: "http://localhost:3000/checkout?success=true",
      cancel_url: "http://localhost:3000/checkout?canceled=true",
    });

    res.send({ id: session.id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.webhook = (req, res, next) => {
  try {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event);

    if (event.type === "checkout.session.completed") {
      const userId = event.data.object.client_reference_id;
      console.log("USER: " + userId);
      checkoutSessionCompleted(userId);
    }

    res.status(200);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const checkoutSessionCompleted = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate("cart.items.productId")
      .execPopulate();
    let total = 0;
    products = user.cart.items;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });
    const productsToOrder = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      products: productsToOrder,
      totalPrice: total,
      user: {
        email: user.email,
        address: user.address,
        userId: user._id,
      },
    });
    await order.save();
    user.clearCart();
  } catch (error) {
    console.log(error);
  }
};
