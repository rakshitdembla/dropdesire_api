import Bank from "../../../models/bank.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const addBank = asyncHandler(async (req, res) => {
  let { upiId, bankName, accountHolderName, accountNumber, ifscCode } =
    req.body;

  // Trim Inputs
  upiId = upiId?.trim();
  bankName = bankName?.trim();
  accountHolderName = accountHolderName?.trim();
  accountNumber = accountNumber?.trim();
  ifscCode = ifscCode?.trim();

  // Check mandatory fields
  if (
    [upiId, bankName, accountHolderName, accountNumber, ifscCode].some(
      (field) => !field
    )
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  // Check if user already has bank linked

  const exisitingBank = await Bank.findOne({
    user: req.user?._id,
    isDeleted: {
      $ne: true,
    },
  });

  if (exisitingBank) {
    throw new ApiError(400, "User already have an linked bank account");
  }

  // Validate UPI ID (basic pattern check)
  if (upiId.length < 5 || upiId.length > 100) {
    throw new ApiError(400, "UPI ID must be between 5 and 100 characters");
  }

  // Validate bank name
  if (bankName.length < 2 || bankName.length > 100) {
    throw new ApiError(400, "Bank name must be between 2 and 100 characters");
  }

  // Validate account holder name
  if (accountHolderName.length < 2 || accountHolderName.length > 100) {
    throw new ApiError(
      400,
      "Account holder name must be between 2 and 100 characters"
    );
  }

  // Validate account number
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

  // Validate IFSC code
  if (ifscCode.length < 6 || ifscCode.length > 20) {
    throw new ApiError(400, "IFSC Code must be between 6 and 20 characters");
  }

  // Save Bank Info
  const bank = await Bank.create({
    user: req.user._id,
    upiId,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
  });

  res
    .status(201)
    .json(new ApiResponse(201, bank, "Bank account linked successfully"));
});

export default addBank;
