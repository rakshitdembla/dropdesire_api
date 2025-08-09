import Product from "../../../models/product.model.js";
import ProductAsset from "../../../models/productAsset.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../../utils/cloudinary.js";
import ApiResponse from "../../../utils/apiResponse.js";
import sanitize from "../../../utils/sanitize.js";

const addProduct = asyncHandler(async (req, res) => {
  const primaryProductPhoto = req.files.primary?.[0];
  const productAssets = req.files.extraPhotos || [];

  let {
    title,
    description,
    miniDescription,
    category,
    tags,
    brand,
    price,
    mrp,
    dimensions,
    stock,
    taxPercentage,
    shippingCharge,
  } = req.body;

  // Parse tags if sent as a string
  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = tags.split(",").map((t) => t.trim());
    }
  }

  // Trim & Sanitize Inputs
  [title, description, miniDescription, brand, dimensions] = [
    title,
    description,
    miniDescription,
    brand,
    dimensions,
  ].map((v) => sanitize(v?.toString()?.trim()));

  // Check mandatory fields
  if (
    [
      title,
      description,
      primaryProductPhoto,
      miniDescription,
      category,
      tags,
      brand,
      price,
      mrp,
      dimensions,
      stock,
      taxPercentage,
      shippingCharge,
    ].some((field) => !field)
  ) {
    throw new ApiError(
      400,
      "Please ensure all required product fields are filled out correctly with valid information."
    );
  }

  // Validate title length
  if (title.length < 5 || title.length > 100) {
    throw new ApiError(
      400,
      "Product title must be between 5 and 100 characters long"
    );
  }

  // Validate description length
  if (description.length < 20 || description.length > 2000) {
    throw new ApiError(
      400,
      "Product description must be between 20 and 2000 characters long"
    );
  }

  // Validate miniDescription length
  if (miniDescription.length < 10 || miniDescription.length > 300) {
    throw new ApiError(
      400,
      "Mini description must be between 10 and 300 characters long"
    );
  }

  // Validate category
  const allowedCategories = [
    "electronics",
    "fashion",
    "home-decor",
    "toys",
    "beauty",
    "health",
    "gadgets",
    "mobile-accessories",
    "fitness",
    "pets",
    "kitchen",
    "seasonal",
    "trending",
    "dropshipping",
    "winning-products",
  ];
  if (!allowedCategories.includes(category)) {
    throw new ApiError(400, `Invalid category: ${category}`);
  }

  // Validate tags
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new ApiError(400, "At least one tag is required");
  }
  const allowedTags = [
    "new-arrival",
    "bestseller",
    "limited-stock",
    "flash-sale",
    "top-rated",
    "hot",
    "trending",
    "viral",
    "winning-product",
    "gift-idea",
    "dropshipping-favorite",
  ];
  for (let tag of tags) {
    if (!allowedTags.includes(tag)) {
      throw new ApiError(400, `Invalid tag: ${tag}`);
    }
  }

  // Validate brand length (if provided)
  if (brand && (brand.length < 2 || brand.length > 64)) {
    throw new ApiError(400, "Brand must be between 2 and 64 characters long");
  }

  // Validate primary photo
  if (!primaryProductPhoto) {
    throw new ApiError(400, "Primary photo of product is required");
  }

  // Validate price
  price = Number(price);
  if (isNaN(price) || price < 1 || price > 99999) {
    throw new ApiError(400, "Price must be between ₹1 and ₹99,999");
  }

  // Validate MRP
  mrp = Number(mrp);
  if (isNaN(mrp) || mrp < 1 || mrp > 999999) {
    throw new ApiError(400, "MRP must be between ₹1 and ₹999,999");
  }

  // Validate dimensions length
  if (dimensions.length > 24) {
    throw new ApiError(400, "Dimensions must not exceed 24 characters");
  }

  // Validate stock
  stock = Number(stock);
  if (isNaN(stock) || stock < 0 || stock > 9999) {
    throw new ApiError(400, "Stock must be between 0 and 9,999 units");
  }

  // Validate taxPercentage
  taxPercentage = Number(taxPercentage);
  if (isNaN(taxPercentage) || taxPercentage < 0 || taxPercentage > 100) {
    throw new ApiError(400, "Tax percentage must be between 0 and 100");
  }

  // Validate shippingCharge
  shippingCharge = Number(shippingCharge);
  if (isNaN(shippingCharge) || shippingCharge < 0 || shippingCharge > 999) {
    throw new ApiError(400, "Shipping charge must be between ₹0 and ₹999");
  }

  // Calculate base price
  const basePrice = price - (price * taxPercentage) / 100;

  // Calculate total price
  const totalPrice = price + shippingCharge;

  // Upload primary photo on cloudinary
  const uploadPrimaryPhoto = await uploadOnCloudinary(primaryProductPhoto.path);

  if (!uploadPrimaryPhoto) {
    throw new ApiError(500, "Failed to upload primary product photo on cloud");
  }

  const primaryPhoto = uploadPrimaryPhoto.url;
  const primaryPhotoPublicId = uploadPrimaryPhoto.public_id;

  const assets = [];
  try {
    // Upload extra assets
    for (const [index, asset] of productAssets.entries()) {
      const uploadAsset = await uploadOnCloudinary(asset.path);

      if (!uploadAsset)
        throw new ApiError(500, "Failed to upload product assets on cloud");

      const createdAsset = await ProductAsset.create({
        type: "image",
        url: uploadAsset.url,
        publicId: uploadAsset.public_id,
        index,
      });
      assets.push(createdAsset);
    }

    // Create product
    const product = await Product.create({
      user: req.user._id,
      soldBy: req.seller._id,
      title,
      description,
      miniDescription,
      category,
      tags,
      brand,
      primaryPhoto,
      primaryPhotoPublicId,
      assets: assets.map((el) => el._id),
      price,
      mrp,
      basePrice,
      dimensions,
      stock,
      taxPercentage,
      totalPrice,
      shippingCharge,
    });

    // Link product ID to assets in parallel
    await Promise.all(
      assets.map((el) => {
        el.productId = product._id;
        return el.save();
      })
    );

    return res
      .status(201)
      .json(new ApiResponse(201, { product }, "Product added successfully"));
  } catch (err) {
    // Cleanup Cloudinary primary photo
    await deleteFromCloudinary(primaryPhotoPublicId).catch(() => {});

    // Cleanup extra assets from Cloudinary
    await Promise.all(
      assets.map((a) => deleteFromCloudinary(a.publicId).catch(() => {}))
    );

    // Cleanup asset records from DB
    await Promise.all(
      assets.map((a) => ProductAsset.findByIdAndDelete(a._id).catch(() => {}))
    );

    throw err;
  }
});

export default addProduct;
