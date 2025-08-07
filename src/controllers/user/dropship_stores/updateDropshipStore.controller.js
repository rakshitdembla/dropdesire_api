import DropshipStore from "../../models/dropshipStore.model.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import validator from "validator";
import mongoose from "mongoose";

const updateDropshipStore = asyncHandler(async (req, res) => {
  let { storeId } = req.params;
  storeId = storeId?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    throw new ApiError(400, "Invalid store reference ID");
  }

  // Find the store
  const existingStore = await DropshipStore.findById(storeId);
  if (!existingStore || existingStore.isDeleted) {
    throw new ApiError(404, "Dropship store not found");
  }

  // Ownership check
  if (existingStore.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized to update this store");
  }

  // Extract and sanitize fields
  let { storeName, phone, email, thankyouMessage, paymentDetails, address } =
    req.body;

  storeName = storeName?.trim();
  phone = phone?.trim();
  email = email?.trim().toLowerCase();
  thankyouMessage = thankyouMessage?.trim();
  paymentDetails = paymentDetails?.trim();
  address = address?.trim();

  // Validate fields (only if provided)
  if (storeName && (storeName.length < 2 || storeName.length > 50)) {
    throw new ApiError(400, "Store name must be between 2 and 50 characters");
  }

  if (phone && !validator.isMobilePhone(phone, "en-IN", { strictMode: true })) {
    throw new ApiError(400, "Invalid Indian phone number");
  }

  if (email) {
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }
    if (email.length > 254) {
      throw new ApiError(400, "Email must not exceed 254 characters");
    }
  }

  if (thankyouMessage && thankyouMessage.length > 500) {
    throw new ApiError(400, "Thank you message must not exceed 500 characters");
  }

  if (paymentDetails && !mongoose.Types.ObjectId.isValid(paymentDetails)) {
    throw new ApiError(400, "Invalid paymentDetails ID");
  }

  if (address && !mongoose.Types.ObjectId.isValid(address)) {
    throw new ApiError(400, "Invalid address ID");
  }

  // Prepare update object
  const updates = {
    ...(storeName && { storeName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(thankyouMessage && { thankyouMessage }),
    ...(paymentDetails && { paymentDetails }),
    ...(address && { address }),
  };

  // No update fields
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  // Update store
  await DropshipStore.findByIdAndUpdate(storeId, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Dropship store updated successfully"));
});

export default updateDropshipStore;
