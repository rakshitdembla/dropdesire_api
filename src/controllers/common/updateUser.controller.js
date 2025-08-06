import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import validator from "validator";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";

const updateUser = asyncHandler(async (req, res) => {
  let { fullName, email, phone } = req.body;

  //Trim Inputs
  fullName = fullName?.trim();
  email = email?.trim();
  phone = phone?.trim();

  // Validate Full Name (if Exists)
  if (fullName && (fullName.length < 2 || fullName.length > 100)) {
    throw new ApiError(400, "Full name must be between 2 and 100 characters");
  }

  // Validate email (if Exists)
  if (email) {
    const validateEmail = validator.isEmail(email);

    if (!validateEmail) {
      throw new ApiError(400, "Please provide a valid email");
    }

    if (email.length > 254) {
      throw new ApiError(400, "Email must not exceed 254 characters");
    }
  }

  // Validate phone (if Exists)
  if (phone) {
    const phoneNumber = phone.replace(/[\s-]/g, "");

    if (!validator.isMobilePhone(phoneNumber, "en-IN", { strictMode: true })) {
      throw new ApiError(400, "Invalid phone number");
    }
  }

  // Check if already in email or phone already in use (if exists)
  if (email || phone) {
    const existingUser = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "Email is already in use");
      } else if (existingUser.phone === phone) {
        throw new ApiError(409, "Phone number is already in use");
      } else {
        throw new ApiError(409, "User already exists");
      }
    }
  }

  // Update User
  const updates = {
    ...(fullName && { fullName }),
    ...(email && { email }),
    ...(phone && { phone }),
  };

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  // Send Res
  return res.status(200).json(
    new ApiResponse(200, updatedUser, {
      new: true,
      runValidators: true,
    })
  );
});

export default updateUser;

//! Deep sanitize
