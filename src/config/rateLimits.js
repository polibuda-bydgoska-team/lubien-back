const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

exports.createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many accounts created from this IP, please try again after an hour.",
  },
});

exports.confirmationEmailResendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    message:
      "Too many confirmation account email requests from this IP, please try again after an hour.",
  },
});

exports.passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    message:
      "Too many password reset requests from this IP, please try again after an hour.",
  },
});
