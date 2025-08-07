import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import validator from "validator";
import sanitize from "../../utils/sanitize.js";
import ApiResponse from "../../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  let { fullName, email, phone, password } = req.body;

  // Trim inputs
  fullName = fullName?.trim();
  email = email?.trim().toLowerCase();
  phone = phone?.trim();

  // Validate All Fields
  if ([fullName, email, phone, password].some((field) => !field)) {
    throw new ApiError(400, "All fields are mandatory");
  }

  // Validate Full Name
  if (fullName.length < 2 || fullName.length > 100) {
    throw new ApiError(400, "Full name must be between 2 and 100 characters");
  }

  //Sanitize Name
  fullName = sanitize(fullName);

  //Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be 6-64 characters and include uppercase, lowercase, number, and special character"
    );
  }

  // Validate Phone
  const phoneNumber = phone.replace(/[\s-]/g, "");

  if (!validator.isMobilePhone(phoneNumber, "en-IN", { strictMode: true })) {
    throw new ApiError(400, "Invalid phone number");
  }

  // Verify email token
  let userEmail;

  try {
    const decodedToken = jwt.verify(email, process.env.EMAIL_SECRET);

    if (decodedToken.type !== "email_verification") {
      throw new ApiError(400, "Invalid token type.");
    }

    userEmail = decodedToken.email.toLowerCase();
  } catch (e) {
    throw new ApiError(400, "Invalid email token provided");
  }

  // Create User
  const createdUser = await User.create({
    fullName,
    email: userEmail,
    phone,
    password,
  }).select("-password -refreshToken");

  //Return Success Response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export default registerUser;

//! Deep sanitize pending - NAME ONLY
