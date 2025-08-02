const asyncHandler = async (fn) => {
  try {
    await fn(req, res, next);
  } catch (e) {
    next(e);
  }
};
