const { ValidationError } = require("admin-bro");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Admin = require("../../models/admin");

const after = async (response) => {
  if (response.record && response.record.errors) {
    response.record.errors.password = response.record.errors.encryptedPassword;
  }
  return response;
};
const before = async (request) => {
  if (request.payload.password) {
    if (!validator.isEmail(request.payload.email)) {
      throw new ValidationError({
        email: {
          message: "Invalid email",
        },
      });
    }
    if (!validator.isStrongPassword(request.payload.password)) {
      throw new ValidationError({
        password: {
          message:
            "The password must be a minimum of 8 characters, including at least one lowercase letter, one uppercase letter, one number and one character",
        },
      });
    }
    const emailExists = await Admin.findOne({ email: request.payload.email });
    if (emailExists) {
      throw new ValidationError({
        email: {
          message: "This email already exist",
        },
      });
    }
    request.payload = {
      ...request.payload,
      encryptedPassword: await bcrypt.hash(request.payload.password, 12),
      password: undefined,
    };
  }
  return request;
};

module.exports = { after, before };
