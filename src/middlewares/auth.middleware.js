import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const jwtVerify = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.sign(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token, User not found.");
    }

    if (user.userStatus !== "active") {
      throw new ApiError(401, `Your account is in ${user.userStatus} state`);
    }

    req.user = user;
    next();
  } catch (e) {
    throw new ApiError(401, "Invalid access token");
  }
});

export default jwtVerify;
