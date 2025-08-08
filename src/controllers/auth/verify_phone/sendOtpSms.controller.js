import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import User from "../../../models/user.model.js";
import validator from "validator";
import crypto from "crypto";
import sendSMS from "../../../utils/twilio.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const RESEND_INTERVAL = 60 * 1000;
const type = "phone_verification";

const sendOtpPhone = asyncHandler(async (req, res) => {
  let { phone } = req.body;

  // Trim phone number
  phone = phone?.trim();

  // Validate Indian phone number
  const isValidPhone = validator.isMobilePhone(phone, "en-IN", {
    strictMode: true,
  });

  if (!isValidPhone) {
    throw new ApiError(400, "Please provide a valid Indian phone number");
  }

  // Check if user already exists with this phone number
  const user = await User.findOne({ phone, type });

  if (user) {
    throw new ApiError(400, "User already exists with this phone number.");
  }

  // Prevent resending too quickly
  const existingOtp = await Otp.findOne({ phone, type });

  if (
    existingOtp &&
    Date.now() - new Date(existingOtp.updatedAt).getTime() < RESEND_INTERVAL
  ) {
    throw new ApiError(
      429,
      "Please wait at least 1 minute before requesting a new OTP."
    );
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save or update OTP
  await Otp.findOneAndUpdate(
    { phone, type },
    {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
    { upsert: true }
  );

  // Send SMS via utility
  const sent = await sendSMS(
    phone.startsWith("+91") ? phone : `+91${phone}`,
    otp
  );

  if (!sent) {
    throw new ApiError(500, "Failed to send OTP via SMS.");
  }

  // Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to phone"));
});

export default sendOtpPhone;
