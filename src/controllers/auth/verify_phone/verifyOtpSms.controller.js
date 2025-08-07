import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const verifySmsOtp = asyncHandler(async (req, res) => {
  let { otp, phoneNumber } = req.body;

  // Trim and validate inputs
  otp = otp?.trim();
  phoneNumber = phoneNumber?.trim();

  const isValidPhone = validator.isMobilePhone(phoneNumber, "en-IN", {
    strictMode: true,
  });

  if (!isValidPhone) {
    throw new ApiError(400, "Please provide a valid Indian phone number");
  }

  if (!otp || otp.length !== 6) {
    throw new ApiError(400, "Please provide a valid 6-digit OTP to verify");
  }

  // Find OTP in DB
  const getOtp = await Otp.findOne({ phoneNumber });

  if (!getOtp) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Validate OTP match
  if (getOtp.otp.toString() !== otp.toString()) {
    throw new ApiError(400, "Invalid or expired OTP provided.");
  }

  // Validate expiry
  if (Date.now() > new Date(getOtp.expiresAt).getTime()) {
    throw new ApiError(400, "OTP has expired.");
  }

  // Generate JWT
  const phoneToken = jwt.sign(
    {
      phoneNumber: getOtp.phoneNumber,
      type: "phone_verification",
    },
    process.env.PHONE_SECRET,
    {
      expiresIn: process.env.PHONE_TOKEN_EXPIRY,
    }
  );

  // Delete OTP from DB
  await Otp.findByIdAndDelete(getOtp._id);

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { phone: phoneToken },
        "OTP verified successfully via phone"
      )
    );
});

export default verifySmsOtp;
