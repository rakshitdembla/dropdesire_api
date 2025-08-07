import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";

const verifyOtp = asyncHandler(async (req, res) => {
  const email = req.user.email;
  let { otp } = req.body;

  // Trim Inputs
  otp = otp?.trim();

  // Validate otp
  if (!otp || otp.length !== 6) {
    throw new ApiError(400, "Please provide a valid 6 digit otp to verify");
  }

  // Check if otp exists
  const getOtp = await Otp.findOne({ otp: otp });

  if (!getOtp) {
    throw new ApiError(400, "Invalid or expired otp provided.");
  }

  // Verify otp owner
  if (getOtp.email.toString() !== email.toString()) {
    throw new ApiError(400, "Invalid or expired otp provided.");
  }

  // Verify otp
  if (Date.now() > new Date(getOtp.expiresAt).getTime()) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Delete Otp
  await Otp.findByIdAndDelete(getOtp._id);

  // Send res
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Otp verified successfully."));
});
