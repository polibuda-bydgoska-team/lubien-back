const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");
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
      .populate("cart.items.productId")
      .exec();
    const products = user.cart.items;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((p) => {
        return {
          name: p.productId.title,
          amount: p.productId.price * 100,
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

exports.webhook = async (req, res, next) => {
  try {
    const event = req.body;

    switch (event.type) {
      case checkout.session.completed:
        const userIdinString = event.data.object.client_reference_id;
        const userId = mongoose.Types.ObjectId(userIdinString);
        checkoutSessionCompleted(userId);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send();
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
