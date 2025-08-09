import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import sanitize from "../../utils/sanitize.js";
import ApiResponse from "../../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  let { fullName, email, phone, password } = req.body;

  // Trim inputs
  fullName = fullName?.trim();
  email = email?.trim();
  phone = phone?.trim();

  // Validate All Fields
  if ([fullName, email, phone, password].some((field) => !field)) {
    throw new ApiError(400, "All fields are mandatory");
  }

  //Sanitize Name
  fullName = sanitize(fullName);

  if (!fullName) {
    throw new ApiError(400, "Invalid full name");
  }

  // Validate Full Name
  if (fullName.length < 2 || fullName.length > 100) {
    throw new ApiError(400, "Full name must be between 2 and 100 characters");
  }

  //Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be 6-64 characters and include uppercase, lowercase, number, and special character"
    );
  }

  // Verify email token
  let userEmail;

  try {
    const decodedToken = jwt.verify(email, process.env.EMAIL_SECRET);

    if (decodedToken.type !== "email_verification") {
      throw new ApiError(400, "Invalid token type.");
    }

    userEmail = decodedToken.email.toLowerCase();

    if (!userEmail) {
      throw new ApiError(400, "Invalid email token provided");
    }
  } catch (e) {
    throw new ApiError(400, "Invalid email token provided");
  }

  // Verify phone token (phone is JWT token)
  let userPhone;
  try {
    const decodedPhoneToken = jwt.verify(phone, process.env.PHONE_SECRET);
    if (decodedPhoneToken.type !== "phone_verification") {
      throw new ApiError(400, "Invalid phone token type.");
    }
    userPhone = decodedPhoneToken.phoneNumber;

    if (!userPhone) {
      throw new ApiError(400, "Invalid or expired phone token provided");
    }
  } catch (e) {
    throw new ApiError(400, "Invalid or expired phone token provided");
  }

  // Create User
  let createdUser = await User.create({
    fullName,
    email: userEmail,
    phone: userPhone,
    password,
  });

  createdUser = createdUser.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;

  //Return Success Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
      },
      "User registered Successfully"
    )
  );
});

export default registerUser;
