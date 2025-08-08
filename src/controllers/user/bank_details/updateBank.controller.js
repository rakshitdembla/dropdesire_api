import Bank from "../../../models/bank.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoose from "mongoose";
import sanitize from "../../../utils/sanitize.js";

const updateBankDetails = asyncHandler(async (req, res) => {
  let { bankId } = req.params;
  bankId = bankId?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(bankId)) {
    throw new ApiError(400, "Invalid bank reference ID");
  }

  // Find existing bank entry
  const existingBank = await Bank.findById(bankId);
  if (!existingBank || existingBank.isDeleted) {
    throw new ApiError(404, "Bank details not found");
  }

  // Ownership check
  if (existingBank.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized to update this bank detail");
  }

  let { upiId, bankName, accountHolderName, accountNumber, ifscCode } =
    req.body;

  // Trim & Sanitize Inputs
  [upiId, bankName, accountHolderName, accountNumber, ifscCode] = [
    upiId,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
  ].map((v) => sanitize(v?.trim()));

  // Validate fields if provided
  if (upiId && (upiId.length < 5 || upiId.length > 100)) {
    throw new ApiError(400, "UPI ID must be between 5 and 100 characters");
  }

  if (bankName && (bankName.length < 2 || bankName.length > 100)) {
    throw new ApiError(400, "Bank name must be between 2 and 100 characters");
  }

  if (
    accountHolderName &&
    (accountHolderName.length < 2 || accountHolderName.length > 100)
  ) {
    throw new ApiError(
      400,
      "Account holder name must be between 2 and 100 characters"
    );
  }

  if (accountNumber) {
    if (
      accountNumber.length < 8 ||
      accountNumber.length > 20 ||
      !/^\d+$/.test(accountNumber)
    ) {
      throw new ApiError(
        400,
        "Account number must be 8 to 20 digits and numeric only"
      );
    }
  }

  if (ifscCode && (ifscCode.length < 6 || ifscCode.length > 20)) {
    throw new ApiError(400, "IFSC Code must be between 6 and 20 characters");
  }

  // Prepare updates object
  const updates = {
    ...(upiId && { upiId }),
    ...(bankName && { bankName }),
    ...(accountHolderName && { accountHolderName }),
    ...(accountNumber && { accountNumber }),
    ...(ifscCode && { ifscCode }),
  };

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  // Update the bank document
  await Bank.findByIdAndUpdate(bankId, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bank details updated successfully"));
});

export default updateBankDetails;
