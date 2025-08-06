import DropshipStore from "../../../models/dropshipStore.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const getUserDropshipStores = asyncHandler(async (req, res) => {
  const stores = await DropshipStore.find({
    user: req.user._id,
    isDeleted: { $ne: true },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, stores, "Dropship stores fetched successfully"));
});

export default getUserDropshipStores;
