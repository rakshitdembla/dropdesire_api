import Product from "../../models/product.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteProduct = asyncHandler(async (req, res) => {
  let { productId } = req.params;

  // Trim product reference
  productId = productId?.trim();

  // Validate product reference
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Product reference Id is not valid");
  }

  // Find product
  const product = await Product.findById(productId);

  // Check if product exists
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if already deleted
  if (product.isDeleted) {
    throw new ApiError(400, "Product is already deleted.");
  }

  // Check ownership (soldBy matches logged-in seller)
  if (product.soldBy.toString() !== req.seller._id.toString()) {
    throw new ApiError(401, "You are not authorized to delete this product");
  }

  // Mark product as deleted
  product.isDeleted = true;
  await product.save();

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Product deleted successfully"));
});

export default deleteProduct;
