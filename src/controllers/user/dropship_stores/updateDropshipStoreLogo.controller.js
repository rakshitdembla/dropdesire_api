import DropshipStore from "../../models/dropshipStore.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import ApiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const updateDropshipStoreLogo = asyncHandler(async (req, res) => {
  let { storeRefrence } = req.params;
  const newLogoPath = req.file?.path;

  // Trim Input
  storeRefrence = storeRefrence?.trim();

  // Validate store reference
  if (!mongoose.Types.ObjectId.isValid(storeRefrence)) {
    throw new ApiError(400, "Invalid store reference ID");
  }

  // Validate logo
  if (!newLogoPath) {
    throw new ApiError(400, "New logo file is required");
  }

  // Find the store
  const store = await DropshipStore.findById(storeRefrence);

  if (!store) {
    throw new ApiError(404, "Dropship store not found");
  }

  // Already deleted?
  if (store.isDeleted) {
    throw new ApiError(400, "Dropship store is deleted");
  }

  // Check ownership
  if (store.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to update this store");
  }

  // Upload on cloudinary
  const uploadedLogoResponse = await uploadOnCloudinary(newLogoPath);

  if (!uploadedLogoResponse) {
    throw new ApiError(500, "Failed to upload new logo on cloud");
  }

  // Delete existing logo from cloud
  if (store.logoPublicId) {
    await deleteFromCloudinary(store.logoPublicId);
  }

  // Update Logo
  store.logo = uploadedLogoResponse.url;
  store.logoPublicId = uploadedLogoResponse.public_id;
  await store.save();

  // Send Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Store logo updated successfully."));
});

export default updateDropshipStoreLogo;
