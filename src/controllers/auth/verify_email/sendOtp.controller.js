import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import Otp from "../../../models/otp.model.js";
import sendEmail from "../../../utils/nodemailer.js";

const RESEND_INTERVAL = 60 * 1000;

const sendOtp = asyncHandler(async (req, res) => {
  const email = req.user.email;

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
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
