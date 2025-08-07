import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import jwt from "jsonwebtoken";

const verifyOtp = asyncHandler(async (req, res) => {
  let { otp, email } = req.body;

  // Trim Inputs
  otp = otp?.trim();
  email = email?.trim().toLowerCase();

  // Validate inputs

  const validateEmail = validator.isEmail(email);

  if (!validateEmail) {
    throw new ApiError(400, "Please provide a valid email");
  }

  if (email.length > 254) {
    throw new ApiError(400, "Email must not exceed 254 characters");
  }

  if (!otp || otp.length !== 6) {
    throw new ApiError(400, "Please provide a valid 6 digit otp to verify");
  }

  // Check if otp exists
  const getOtp = await Otp.findOne({ email: email });

  if (!getOtp) {
    throw new ApiError(400, "Invalid or expired otp provided.");
  }

  // Verify otp
  if (getOtp.otp.toString() !== otp.toString()) {
    throw new ApiError(400, "Invalid or expired otp provided.");
  }

  // Verify otp validity
  if (Date.now() > new Date(getOtp.expiresAt).getTime()) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Generate JWT
  const emailToken = jwt.sign(
    {
      email: getOtp.email,
      type: "email_verification",
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: process.env.EMAIL_TOKEN_EXPIRY,
    }
  );

  // Delete Otp
  await Otp.findByIdAndDelete(getOtp._id);

  // Send res
  return res
    .status(200)
    .json(
      new ApiResponse(200, { email: emailToken }, "Otp verified successfully.")
    );
});

export default verifyOtp;
