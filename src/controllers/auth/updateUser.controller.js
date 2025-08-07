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
    try {
      const decodedToken = jwt.verify(email, process.env.EMAIL_SECRET);

      if (decodedToken.type !== "email_verification") {
        throw new ApiError(400, "Invalid token type.");
      }

      email = decodedToken.email.toLowerCase();
    } catch (e) {
      throw new ApiError(400, "Invalid email token provided");
    }
  }

  // Validate phone (if Exists)
  if (phone) {
    const phoneNumber = phone.replace(/[\s-]/g, "");

    if (!validator.isMobilePhone(phoneNumber, "en-IN", { strictMode: true })) {
      throw new ApiError(400, "Invalid phone number");
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
