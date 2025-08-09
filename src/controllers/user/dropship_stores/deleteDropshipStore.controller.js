import DropshipStore from "../../models/dropshipStore.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteDropshipStore = asyncHandler(async (req, res) => {
  let { storeId } = req.params;

  // Trim store reference
  storeId = storeId?.trim();

  // Validate store reference
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    throw new ApiError(400, "Dropship store reference Id is not valid");
  }

  // Find Dropship Store
  const store = await DropshipStore.findById(storeId);

  // Check if store exists
  if (!store) {
    throw new ApiError(404, "Dropship store not found");
  }

  // Check if already deleted
  if (store.isDeleted) {
    throw new ApiError(400, "Dropship store is already deleted.");
  }

  // Check store ownership
  if (store.user.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorized to delete this dropship store"
    );
  }

  // Mark store as deleted
  store.isDeleted = true;
  await store.save();

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Store deleted successfully"));
});

export default deleteDropshipStore;
