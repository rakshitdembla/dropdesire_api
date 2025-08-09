import Product from "../../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../../utils/cloudinary.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const updateProductPrimaryPhoto = asyncHandler(async (req, res) => {
  let { productId } = req.params;
  const newPrimaryPhotoPath = req.file?.path;

  // Trim input
  productId = productId?.trim();

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Validate primary photo
  if (!newPrimaryPhotoPath) {
    throw new ApiError(400, "New product primary photo is required");
  }

  // Find the product
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Already deleted?
  if (product.isDeleted) {
    throw new ApiError(400, "Product is deleted");
  }

  // Check ownership
  if (product.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to update this product");
  }

  // Upload new photo to Cloudinary
  const uploadedPhotoResponse = await uploadOnCloudinary(newPrimaryPhotoPath);

  if (!uploadedPhotoResponse) {
    throw new ApiError(500, "Failed to upload new product photo");
  }

  // Delete old primary photo from Cloudinary
  if (product.primaryPhotoPublicId) {
    await deleteFromCloudinary(product.primaryPhotoPublicId);
  }

  // Update product photo fields
  product.primaryPhoto = uploadedPhotoResponse.url;
  product.primaryPhotoPublicId = uploadedPhotoResponse.public_id;
  await product.save();

  // Send success response
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Product primary photo updated successfully.")
    );
});

export default updateProductPrimaryPhoto;
