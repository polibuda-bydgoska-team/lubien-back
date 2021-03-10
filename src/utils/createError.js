const createError = (type, payload) => {
  const error = new Error(type);
  error.details = payload;
  return error;
};

module.exports = createError;
