const validateUpdate = (updates, allowedUpdates) => {
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (isValidOperation) {
    return { isOperationValid: true };
  }

  const invalidUpdates = updates
    .filter((update) => !allowedUpdates.includes(update))
    .join(", ");

  return {
    isOperationValid: false,
    error:
      "Invalid updates! Fields: " + invalidUpdates + " should not be updated!",
  };
};

module.exports = validateUpdate;
