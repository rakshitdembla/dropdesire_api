import ProductAsset from "../../../models/productAsset.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../../utils/cloudinary.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const updateProductAsset = asyncHandler(async (req, res) => {
  let { assetId } = req.params;
  const newAsset = req.file?.path;

  // Trim input
  assetId = assetId?.trim();

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(assetId)) {
    throw new ApiError(400, "Invalid asset ID");
  }

  // Validate new asset
  if (!newAsset) {
    throw new ApiError(400, "New product asset is required");
  }

  // Find the asset
  const asset = await ProductAsset.findById(assetId).populate("product");

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  if (!asset.product) {
    throw new ApiError(400, "Associated product not found");
  }

  // Check ownership
  if (asset.product.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to update this product");
  }

  // Upload new photo to Cloudinary
  const uploadedPhotoResponse = await uploadOnCloudinary(newAsset);

  if (!uploadedPhotoResponse) {
    throw new ApiError(500, "Failed to upload new asset on cloud");
  }

  // Delete old primary photo from Cloudinary
  if (asset.publicId) {
    await deleteFromCloudinary(asset.publicId);
  }

  // Update product photo fields
  asset.url = uploadedPhotoResponse.url;
  asset.publicId = uploadedPhotoResponse.public_id;
  await asset.save();

  // Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Asset updated successfully."));
});

export default updateProductAsset;
