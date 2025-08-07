import Payment from "../../../models/payment.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import mongoAggregator from "mon";

const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    user: req.user._id,
    isDeleted: {
      $ne: true,
    },
  }).sort({ createdAt: -1 });
});
