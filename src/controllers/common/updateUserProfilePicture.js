import User from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import ApiResponse from "../../utils/apiResponse.js";

const updateUserProfilePicture = asyncHandler(async (req, res) => {
  const newProfilePicPath = req.file?.path;

  // Validate file
  if (!newProfilePicPath) {
    throw new ApiError(400, "New profile picture file is required");
  }

  // Find the user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Upload to Cloudinary
  const uploadedProfilePic = await uploadOnCloudinary(newProfilePicPath);
  if (!uploadedProfilePic) {
    throw new ApiError(500, "Failed to upload profile picture");
  }

  // Delete existing profile picture from Cloudinary (if exists)
  if (user.profilePublicId) {
    await deleteFromCloudinary(user.profilePublicId);
  }

  // Update user document
  user.profilePic = uploadedProfilePic.url;
  user.profilePublicId = uploadedProfilePic.public_id;
  await user.save();

  // Send response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile picture updated successfully"));
});

export default updateUserProfilePicture;
