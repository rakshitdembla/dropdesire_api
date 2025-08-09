import Bank from "../../../models/bank.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteBank = asyncHandler(async (req, res) => {
  let { bankId } = req.params;

  // Trim input
  bankId = bankId?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(bankId)) {
    throw new ApiError(400, "Bank reference ID is not valid");
  }

  // Find bank
  const bank = await Bank.findById(bankId);

  // Check if exists
  if (!bank) {
    throw new ApiError(404, "Bank account not found");
  }

  // Already deleted?
  if (bank.isDeleted) {
    throw new ApiError(400, "Bank account is already deleted");
  }

  // Check if bank belongs to the logged-in user
  if (bank.user.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorized to delete this bank account"
    );
  }

  // Soft delete
  bank.isDeleted = true;
  await bank.save();

  // Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bank account deleted successfully"));
});

export default deleteBank;
