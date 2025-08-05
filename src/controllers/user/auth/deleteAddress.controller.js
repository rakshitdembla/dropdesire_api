import Address from "../../../models/address.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteAddress = asyncHandler(async (req, res) => {
  let { address } = req.body;

  // Trim address refrence
  address = address?.trim();

  // Validate address refrence
  if (!mongoose.Types.ObjectId.isValid(address)) {
    throw new ApiError(400, "Address refrence Id is not valid");
  }

  // Find address
  const existingAddress = await Address.findById(address);

  // Check if address exists
  if (!existingAddress) {
    throw new ApiError(404, "Address not found");
  }

  // Check if already deleted
  if (existingAddress.userDeleted) {
    throw new ApiError(400, "Address is already deleted.");
  }

  // Check address associated user
  if (existingAddress.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to delete this address");
  }

  // Mark address as deleted
  existingAddress.userDeleted = true;
  await existingAddress.save();

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Address deleted successfully"));
});

export default deleteAddress;
