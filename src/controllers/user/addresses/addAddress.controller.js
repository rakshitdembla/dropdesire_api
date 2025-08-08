import Address from "../../../models/address.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import validator from "validator";
import sanitize from "../../../utils/sanitize.js";

const addAddress = asyncHandler(async (req, res) => {
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

  // Sanitize Inputs
  [fullName, phone, addressLine1, addressLine2, city, state, landmark, type] = [
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    landmark,
    type,
  ].map((v) => sanitize(v?.trim()));

  pincode = Number(pincode);

  // Check mandatory fields
  if (
    [
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      type,
    ].some((field) => !field)
  ) {
    throw new ApiError(
      400,
      "Please ensure all required fields are filled out correctly with valid information."
    );
  }

  // Check User Address Limit
  const existingAddresses = await Address.find({
    user: req.user?._id,
    isDeleted: {
      $ne: true,
    },
  });

  if (existingAddresses.length >= 3) {
    throw new ApiError(400, "User already has 3 exisiting addresses");
  }

  // Validate fullName length
  if (fullName.length < 2 || fullName.length > 50) {
    throw new ApiError(400, "Full Name must be between 2 and 50 characters");
  }

  // Validate phone number (Indian format, strict mode)
  if (!validator.isMobilePhone(phone, "en-IN", { strictMode: true })) {
    throw new ApiError(
      400,
      "Phone number must be a valid Indian number with +91"
    );
  }

  // Validate address line 1
  if (addressLine1.length < 5 || addressLine1.length > 200) {
    throw new ApiError(
      400,
      "Address Line 1 must be between 5 and 200 characters"
    );
  }

  // Validate address line 2
  if (addressLine2.length < 5 || addressLine2.length > 200) {
    throw new ApiError(
      400,
      "Address Line 2 must be between 5 and 200 characters"
    );
  }

  // Validate city
  if (city.length < 2 || city.length > 100) {
    throw new ApiError(400, "City must be between 2 and 100 characters");
  }

  // Validate state
  if (state.length < 2 || state.length > 100) {
    throw new ApiError(400, "State must be between 2 and 100 characters");
  }

  // Validate PinCode
  if (!Number.isInteger(pincode) || pincode < 100000 || pincode > 999999) {
    throw new ApiError(400, "Pincode must be a 6-digit number");
  }

  // Validate Landmark
  if (landmark && landmark.length > 200) {
    throw new ApiError(400, "Landmark must not exceed 200 characters");
  }

  // Validate type
  const validTypes = ["Home", "Office", "Other"];
  if (!validTypes.includes(type)) {
    throw new ApiError(400, "Type must be one of Home, Office, or Other");
  }

  // Save Address
  const newAddress = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    ...(landmark && { landmark }),
    type,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Address added successfully"));
});

export default addAddress;
