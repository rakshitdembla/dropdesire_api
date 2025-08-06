import Address from "../../models/address.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import validator from "validator";
import mongoose from "mongoose";

const updateAddress = asyncHandler(async (req, res) => {
  let { addressId } = req.params;
  addressId = addressId?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address reference ID");
  }

  // Find the address
  const existingAddress = await Address.findById(addressId);
  if (!existingAddress || existingAddress.isDeleted) {
    throw new ApiError(404, "Address not found");
  }

  // Ownership check
  if (existingAddress.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized to update this address");
  }

  // Extract and sanitize fields
  let {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    landmark,
    type,
  } = req.body;

  fullName = fullName?.trim();
  phone = phone?.trim();
  addressLine1 = addressLine1?.trim();
  addressLine2 = addressLine2?.trim();
  city = city?.trim();
  state = state?.trim();
  landmark = landmark?.trim();
  type = type?.trim();
  pincode = pincode ? Number(pincode) : undefined;

  // Validate fields (only if provided)
  if (fullName && (fullName.length < 2 || fullName.length > 50)) {
    throw new ApiError(400, "Full Name must be between 2 and 50 characters");
  }

  if (phone && !validator.isMobilePhone(phone, "en-IN", { strictMode: true })) {
    throw new ApiError(400, "Invalid Indian phone number");
  }

  if (addressLine1 && (addressLine1.length < 5 || addressLine1.length > 200)) {
    throw new ApiError(
      400,
      "Address Line 1 must be between 5 and 200 characters"
    );
  }

  if (addressLine2 && (addressLine2.length < 5 || addressLine2.length > 200)) {
    throw new ApiError(
      400,
      "Address Line 2 must be between 5 and 200 characters"
    );
  }

  if (city && (city.length < 2 || city.length > 100)) {
    throw new ApiError(400, "City must be between 2 and 100 characters");
  }

  if (state && (state.length < 2 || state.length > 100)) {
    throw new ApiError(400, "State must be between 2 and 100 characters");
  }

  if (typeof pincode !== "undefined") {
    if (!Number.isInteger(pincode) || pincode < 100000 || pincode > 999999) {
      throw new ApiError(400, "Pincode must be a 6-digit number");
    }
  }

  if (landmark && landmark.length > 200) {
    throw new ApiError(400, "Landmark must not exceed 200 characters");
  }

  const validTypes = ["Home", "Office", "Other"];
  if (type && !validTypes.includes(type)) {
    throw new ApiError(400, "Type must be one of Home, Office, or Other");
  }

  // Prepare update object
  const updates = {
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(addressLine1 && { addressLine1 }),
    ...(addressLine2 && { addressLine2 }),
    ...(city && { city }),
    ...(state && { state }),
    ...(pincode && { pincode }),
    ...(landmark && { landmark }),
    ...(type && { type }),
  };

  // No update fields
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  // Update
  await Address.findByIdAndUpdate(addressId, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address updated successfully"));
});

export default updateAddress;
