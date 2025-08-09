import WishlistItem from "../../../models/wishlistItem.model.js";
import Wishlist from "../../../models/wishlist.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const removeFromWishlist = asyncHandler(async (req, res) => {
  let { wishlistItemId } = req.params;
  const userId = req.user._id;

  wishlistItemId = wishlistItemId?.trim();

  if (!wishlistItemId) {
    throw new ApiError(400, "Invalid wishlist item reference.");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId, items: wishlistItemId },
    { $pull: { items: wishlistItemId } },
    { new: true }
  );

  if (!wishlist) {
    throw new ApiError(400, "User doesn't have this item in wishlist.");
  }

  // Delete the wishlist item
  await WishlistItem.findByIdAndDelete(wishlistItemId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item removed from wishlist successfully"));
});

export default removeFromWishlist;
