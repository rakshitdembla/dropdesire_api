import User from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";

const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current Password & New Password is required.");
  }

  //Validate currentPassword
  if (!passwordRegex.test(currentPassword)) {
    throw new ApiError(400, "Current Password is not in valid format.");
  }

  //Validate newPassword
  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      "New Password must be 6-64 characters and include uppercase, lowercase, number, and special character"
    );
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export default changeUserPassword;
