import WishlistItem from "../../../models/wishlistItem.model.js";
import Wishlist from "../../../models/wishlist.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {
  let { productId, variantId } = req.params;
  const userId = req.user._id;

  // Trim ProductId
  productId = productId?.trim();

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product reference.");
  }

  // Validate variant ID if provided
  if (variantId && !mongoose.Types.ObjectId.isValid(variantId)) {
    throw new ApiError(400, "Invalid variant reference.");
  }

  // Get user wishlist

  let wishList = await Wishlist.findOne({ user: userId });

  if (!wishList) {
    wishList = await Wishlist.create({
      items: [],
      user: userId,
    });
  }

  // Check if WishlistItem already exists for this wishlist and product (and variant if given)
  const existingItem = await WishlistItem.findOne({
    wishList: wishList._id,
    product: productId,
    ...(variantId
      ? { variant: variantId, isVariant: true }
      : { variant: { $exists: false } }),
  });

  if (existingItem) {
    throw new ApiError(400, "This product is already in your wishlist");
  }

  // Create wishlist item
  const wishlistItem = await WishlistItem.create({
    wishList: wishList._id,
    product: productId,
    ...(variantId && { variant: variantId, isVariant: true }),
  });

  // Add created wishlist item to wishlist
  await Wishlist.findByIdAndUpdate(wishList._id, {
    $addToSet: { items: wishlistItem._id },
  });

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { wishList }, "Item added to wishlist successfully.")
    );
});

export default addToWishlist;
