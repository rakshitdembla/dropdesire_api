import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  let { otp, email } = req.body;
  const type = "forgot_password";

  // Trim Inputs
  otp = otp?.trim();
  email = email?.trim().toLowerCase();

  // Validate inputs
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  if (email.length > 254) {
    throw new ApiError(400, "Email must not exceed 254 characters");
  }

  if (!otp || otp.length !== 6) {
    throw new ApiError(400, "Please provide a valid 6 digit OTP to verify");
  }

  // Check if otp exists
  const getOtp = await Otp.findOne({ email, type });
  if (!getOtp) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Verify otp match
  if (getOtp.otp.toString() !== otp.toString()) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Verify otp validity
  if (Date.now() > new Date(getOtp.expiresAt).getTime()) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Generate JWT for password reset
  const resetToken = jwt.sign(
    {
      email: getOtp.email,
      type: type,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: process.env.EMAIL_TOKEN_EXPIRY,
    }
  );

  // Delete Otp
  await Otp.findByIdAndDelete(getOtp._id);

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetToken },
        "OTP verified successfully. You can now reset your password."
      )
    );
});

export default verifyForgotPasswordOtp;
