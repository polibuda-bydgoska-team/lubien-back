const createError = (message, statusCode, data) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data;
  throw error;
};

module.exports = createError;
