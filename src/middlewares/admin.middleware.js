import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiResponse.js";

const verifyAdmin = asyncHandler(async (req, _, next) => {
  const user = req.user;

  if (user.isAdmin) {
    next();
  } else {
    throw new ApiError(401, "You are not authorized as an admin.");
  }
});

export default verifyAdmin;
