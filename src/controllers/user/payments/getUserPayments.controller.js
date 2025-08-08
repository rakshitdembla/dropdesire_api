import Payment from "../../../models/payment.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const getUserPayments = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 7;
  const skip = (page - 1) * limit;
  const payments = await Payment.find({
    user: req.user._id,
    isDeleted: {
      $ne: true,
    },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
      },
      "Payments fetched successfully."
    )
  );
});

export default getUserPayments;
