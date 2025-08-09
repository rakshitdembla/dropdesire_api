import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiResponse.js";
import Seller from "../models/seller.model.js";

const verifySeller = asyncHandler(async (req, _, next) => {
  const user = req.user;

  if (!user.isSeller) {
    throw new ApiError(401, "You are not a seller.");
  }

  const seller = await Seller.findOne({ user: user._id });

  if (!seller) {
    throw new ApiError(401, "You are not a seller.");
  }

  if (seller.sellerStatus === "approved") {
    req.seller = seller;
    next();
  } else if (seller.sellerStatus === "pending") {
    throw new ApiError(401, "Your seller account approval is pending.");
  } else {
    throw new ApiError(401, "Your seller account is not active.");
  }
});

export default verifySeller;
