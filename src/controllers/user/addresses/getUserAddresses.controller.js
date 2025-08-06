import Address from "../../../models/address.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
    isDeleted: { $ne: true },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, addresses, "User addresses fetched successfully")
    );
});

export default getUserAddresses;
