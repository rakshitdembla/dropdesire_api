import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import sanitize from "../../utils/sanitize.js";

const updateUser = asyncHandler(async (req, res) => {
  let { fullName, email, phone } = req.body;

  //Trim Inputs
  fullName = fullName?.trim();
  email = email?.trim();
  phone = phone?.trim();

  // Sanitize & Validate Full Name (if Provided)
  if (fullName) {
    fullName = sanitize(fullName);
    if (!fullName) {
      throw new ApiError(400, "Invalid full name");
    }
    if (fullName.length < 2 || fullName.length > 100) {
      throw new ApiError(400, "Full name must be between 2 and 100 characters");
    }
  }

  // Validate email (if Provided)
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

  //  Validate phone token (if Provided)
  if (phone) {
    try {
      const decodedToken = jwt.verify(phone, process.env.PHONE_SECRET);

      if (decodedToken.type !== "phone_verification") {
        throw new ApiError(400, "Invalid phone token type.");
      }

      phone = decodedToken.phoneNumber;
    } catch (e) {
      throw new ApiError(400, "Invalid or expired phone token provided.");
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
