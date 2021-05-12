const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const createError = require("../utils/createError");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

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
      success_url: "http://localhost:3000/checkout?finished=true",
      cancel_url: "http://localhost:3000/checkout?finished=false",
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
  const sig = req.headers["stripe-signature"];
  const payload = req.body;
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    checkoutSessionCompleted(event.data.object.client_reference_id);
  }

  res.status(200);
};

const checkoutSessionCompleted = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate("cart.items.product")
      .exec();
    let total = 0;
    products = user.cart.items;
    products.forEach((p) => {
      if (p.size === "large") {
        total += p.quantity * p.product.price.large;
      } else {
        total += p.quantity * p.product.price.extraLarge;
      }
    });
    const productsToOrder = user.cart.items.map((i) => {
      return {
        productId: i.product._id,
        title: i.product.title,
        price:
          i.size === "large"
            ? i.product.price.large
            : i.product.price.extraLarge,
        quantity: i.quantity,
        size: i.size,
        burnTime:
          i.size === "large"
            ? i.product.burnTime.large
            : i.product.burnTime.extraLarge,
        mainNotes: i.product.mainNotes,
        scentInspiration: i.product.scentInspiration,
        location: i.product.location,
        scentProfile: i.product.scentProfile,
        topNotes: i.product.topNotes,
        heartNotes: i.product.heartNotes,
        baseNotes: i.product.baseNotes,
        description: i.product.description,
        seriesName: i.product.seriesName,
        imagesURL: i.product.imagesURL,
      };
    });
    const order = new Order({
      orderId: nanoid(),
      products: productsToOrder,
      totalPrice: total,
      purchaser: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      },
      deliveryAddress: {
        street: user.address.street,
        houseNumber: user.address.houseNumber,
        addressAdditionalInfo: user.address.addressAdditionalInfo,
        city: user.address.city,
        county: user.address.county,
        postCode: user.address.postCode,
      },
    });
    await order.save();
    user.clearCart();
  } catch (error) {
    console.log(error);
  }
};
