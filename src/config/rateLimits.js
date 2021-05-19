const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

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

exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many failed authentication attempts, please try logging in again later.",
  },
});

exports.loginSpeedLimiter = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 5,
  delayMs: 500,
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
