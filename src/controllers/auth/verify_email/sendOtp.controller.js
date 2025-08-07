import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import User from "../../../models/user.model.js";
import sendEmail from "../../../utils/nodemailer.js";
import validator from "validator";
import crypto from "crypto";

const RESEND_INTERVAL = 60 * 1000;

const sendOtp = asyncHandler(async (req, res) => {
  let { email } = req.body;

  // Trim email
  email = email?.trim().toLowerCase();

  // Validate Email
  const validateEmail = validator.isEmail(email);

  if (!validateEmail) {
    throw new ApiError(400, "Please provide a valid email");
  }

  if (email.length > 254) {
    throw new ApiError(400, "Email must not exceed 254 characters");
  }

  // Check if user already exists with this email

  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(400, "User already exists with this email.");
  }

  // Prevent resending too quickly
  const existingOtp = await Otp.findOne({ email });

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

  // Save new or update existing OTP
  await Otp.findOneAndUpdate(
    { email },
    {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
    { upsert: true }
  );

  // 📧 Send OTP Email
  const subject = "Your OTP for DropDesire Email Verification";
  const text = `Your OTP is: ${otp}. It is valid for 5 minutes.`;

  const sendOTP = await sendEmail(email, subject, text);

  if (!sendOTP) {
    throw new ApiError(500, "Failed to send OTP.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Otp sent successfully"));
});

export default sendOtp;
