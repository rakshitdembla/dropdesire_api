import Bank from "../../../models/bank.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const getUserBank = asyncHandler(async (req, res) => {
  const bank = await Bank.findOne({
    user: req.user._id,
    isDeleted: { $ne: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, bank, "Bank details fetched successfully"));
});

export default getUserBank;
