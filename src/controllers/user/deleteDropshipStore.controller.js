import DropshipStore from "../../models/dropshipStore.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteDropshipStore = asyncHandler(async (req, res) => {
  let { storeRefrence } = req.body;

  // Trim store refrence
  storeRefrence = storeRefrence?.trim();

  // Validate address refrence
  if (!mongoose.Types.ObjectId.isValid(storeRefrence)) {
    throw new ApiError(400, "Dropship store refrence Id is not valid");
  }

  // Find Dropship Store
  const existingStore = await DropshipStore.findById(storeRefrence);

  // Check if address exists
  if (!existingStore) {
    throw new ApiError(404, "Dropship store not found");
  }

  // Check if already deleted
  if (existingStore.isDeleted) {
    throw new ApiError(400, "Dropship Store is already deleted.");
  }

  // Check store associated user
  if (existingStore.user.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorized to delete this dropship store"
    );
  }

  // Mark store as deleted
  existingStore.isDeleted = true;
  await existingStore.save();

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Store deleted successfully"));
});

export default deleteDropshipStore;
