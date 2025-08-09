import Product from "../../../models/product.model.js";
import ProductAsset from "../../../models/productAsset.model.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import mongoose from "mongoose";

const addNewAsset = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const assetFile = req.file?.path;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Validate asset
  if (!assetFile) {
    throw new ApiError(400, "Asset file is required");
  }

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check ownership
  if (product.user.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorized to add assets to this product"
    );
  }

  // Check assets length
  if (product.assets.length >= 9) {
    throw new ApiError(400, "You can upload a maximum of 9 product assets");
  }

  // Upload new asset to Cloudinary
  const uploadedAsset = await uploadOnCloudinary(assetFile);

  if (!uploadedAsset) {
    throw new ApiError(500, "Failed to upload asset to cloud");
  }

  // Create ProductAsset
  const createdAsset = await ProductAsset.create({
    type: "image",
    url: uploadedAsset.url,
    publicId: uploadedAsset.public_id,
    index: product.assets.length,
    product: product._id,
  });

  // Link asset to product
  product.assets.push(createdAsset._id);
  await product.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { asset: createdAsset }, "Asset added successfully")
    );
});

export default addNewAsset;
