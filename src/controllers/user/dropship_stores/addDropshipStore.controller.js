import DropshipStore from "../../../models/dropshipStore.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import ApiResponse from "../../../utils/apiResponse.js";
import validator from "validator";
import mongoose from "mongoose";

const addDropshipStore = asyncHandler(async (req, res) => {
  let { storeName, phone, email, thankyouMessage, paymentDetails, address } =
    req.body;

  const logo = req.file?.path;

  // Trim Inputs
  storeName = storeName?.trim();
  phone = phone?.trim();
  email = email?.trim();
  thankyouMessage = thankyouMessage?.trim();
  paymentDetails = paymentDetails?.trim();
  address = address?.trim();

  // Check mandatory fields
  if (
    [storeName, phone, email, paymentDetails, address].some((field) => !field)
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  // Check User Stores Limit

  const existingStores = await DropshipStore.find({
    user: req.user?._id,
    isDeleted: {
      $ne: true,
    },
  });

  //? Check if user is premium

  const isUserPremium = req.user?.isPremium;

  if (isUserPremium) {
    if (existingStores.length >= 3) {
      throw new ApiError(
        400,
        "User already has 3 exisiting Dropshipping stores"
      );
    }
  } else {
    if (existingStores.length >= 1) {
      throw new ApiError(
        400,
        "User already has 1 exisiting Dropshipping stores. Upgrade to premium to increase limit to 3."
      );
    }
  }

  // Validate storeName length
  if (storeName.length < 2 || storeName.length > 50) {
    throw new ApiError(400, "Store name must be between 2 and 50 characters");
  }

  // Validate phone number (Indian format, strict mode)
  if (!validator.isMobilePhone(phone, "en-IN", { strictMode: true })) {
    throw new ApiError(
      400,
      "Phone number must be a valid Indian number with +91"
    );
  }

  // Validate email format and length
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (email.length > 254) {
    throw new ApiError(400, "Email must not exceed 254 characters");
  }

  // Validate thank you message length (only if provided)
  if (thankyouMessage && thankyouMessage.length > 500) {
    throw new ApiError(400, "Thank you message must not exceed 500 characters");
  }

  // Validate ObjectId fields
  if (!mongoose.Types.ObjectId.isValid(paymentDetails)) {
    throw new ApiError(400, "Invalid paymentDetails ID");
  }

  if (!mongoose.Types.ObjectId.isValid(address)) {
    throw new ApiError(400, "Invalid address ID");
  }

  // Upload logo on cloud
  let cloudinaryLogo;
  let cloudinaryPublicId;

  if (logo) {
    const uploadedLogo = await uploadOnCloudinary(logo);

    if (!uploadedLogo?.url || !uploadedLogo?.public_id) {
      throw new ApiError(400, "Error while uploading on avatar");
    }

    cloudinaryLogo = uploadedLogo.url;
    cloudinaryPublicId = uploadedLogo.public_id;
  }

  // Save in Database
  const createdDropshipStore = await DropshipStore.create({
    storeName,
    phone,
    email,
    ...(cloudinaryLogo && { logo: cloudinaryLogo }),
    ...(cloudinaryPublicId && { logoPublicId: cloudinaryPublicId }),
    thankyouMessage,
    paymentDetails,
    user: req.user._id,
    address,
  }).select("-isDeleted");

  // Send Response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { createdDropshipStore },
        "Dropship store added successfully"
      )
    );
});

export default addDropshipStore;

//! Deep sanitize pending
