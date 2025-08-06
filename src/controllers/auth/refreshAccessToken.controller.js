import User from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized Request.");
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "No user is associated with this refresh token");
    }

    if (refreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const generatedRefreshToken = await user.generateRefreshToken();
    const generatedAccessToken = await user.generateAccessToken();

    return res
      .status(200)
      .cookie("accessToken", generatedAccessToken, options)
      .cookie("refreshToken", generatedRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: generatedAccessToken,
            refrehToken: generatedRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (e) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export default refreshAccessToken;
