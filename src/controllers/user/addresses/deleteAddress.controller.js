import Address from "../../../models/address.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteAddress = asyncHandler(async (req, res) => {
  let { addressId } = req.params;

  // Trim address reference
  addressId = addressId?.trim();

  // Validate address reference
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Address reference Id is not valid");
  }

  // Find address
  const address = await Address.findById(addressId);

  // Check if address exists
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Check if already deleted
  if (address.isDeleted) {
    throw new ApiError(400, "Address is already deleted.");
  }

  // Check address associated user
  if (address.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to delete this address");
  }

  // Mark address as deleted
  address.isDeleted = true;
  await address.save();

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Address deleted successfully"));
});

export default deleteAddress;
