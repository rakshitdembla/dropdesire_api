import User from "../../../models/user.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are mandatory");
  }

  // Validate Email
  const validateEmail = validator.isEmail(email);

  if (!validateEmail) {
    throw new ApiError(400, "Please provide a valid email");
  }

  if (email.length > 254) {
    throw new ApiError(400, "Email must not exceed 254 characters");
  }

  //Validate Password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be 6-64 characters and include uppercase, lowercase, number, and special character"
    );
  }

  // Find User
  const user = await User.findOne({ email: email }).select(
    "fullName email phone accessToken refreshToken"
  );

  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }

  // Check Password
  const verifyPassword = await user.isPasswordCorrect(password);

  if (!verifyPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate Tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Send Cookies & Response
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export default loginUser;
