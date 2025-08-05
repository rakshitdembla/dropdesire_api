import Bank from "../../models/bank.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

const deleteBank = asyncHandler(async (req, res) => {
  let { bankReference } = req.body;

  // Trim input
  bankReference = bankReference?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(bankReference)) {
    throw new ApiError(400, "Bank reference ID is not valid");
  }

  // Find bank
  const existingBank = await Bank.findById(bankReference);

  // Check if exists
  if (!existingBank) {
    throw new ApiError(404, "Bank account not found");
  }

  // Already deleted?
  if (existingBank.isDeleted) {
    throw new ApiError(400, "Bank account is already deleted");
  }

  // Check if bank belongs to the logged-in user
  if (existingBank.user.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorized to delete this bank account"
    );
  }

  // Soft delete
  existingBank.isDeleted = true;
  await existingBank.save();

  // Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bank account deleted successfully"));
});

export default deleteBank;
