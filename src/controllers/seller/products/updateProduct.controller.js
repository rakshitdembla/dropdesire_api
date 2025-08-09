import Product from "../../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import sanitize from "../../../utils/sanitize.js";
import mongoose from "mongoose";

const updateProduct = asyncHandler(async (req, res) => {
  let { productId } = req.params;
  productId = productId?.trim();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product reference ID");
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new ApiError(404, "Product not found");
  }

  // Ownership check
  if (product.soldBy.toString() !== req.seller._id.toString()) {
    throw new ApiError(401, "Unauthorized to update this product");
  }

  // Extract fields
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

  // Sanitize text fields
  [title, description, miniDescription, brand, dimensions] = [
    title,
    description,
    miniDescription,
    brand,
    dimensions,
  ].map((v) => (v ? sanitize(v.toString().trim()) : v));

  // Validate fields only if provided
  if (title && (title.length < 5 || title.length > 100)) {
    throw new ApiError(
      400,
      "Product title must be between 5 and 100 characters"
    );
  }

  if (description && (description.length < 20 || description.length > 2000)) {
    throw new ApiError(
      400,
      "Product description must be between 20 and 2000 characters"
    );
  }

  if (
    miniDescription &&
    (miniDescription.length < 10 || miniDescription.length > 300)
  ) {
    throw new ApiError(
      400,
      "Mini description must be between 10 and 300 characters"
    );
  }

  if (category) {
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
  }

  if (tags) {
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
  }

  if (brand && (brand.length < 2 || brand.length > 64)) {
    throw new ApiError(400, "Brand must be between 2 and 64 characters");
  }

  if (dimensions && dimensions.length > 24) {
    throw new ApiError(400, "Dimensions must not exceed 24 characters");
  }

  // Validate numeric fields
  if (price !== undefined) {
    price = Number(price);
    if (isNaN(price) || price < 1 || price > 99999) {
      throw new ApiError(400, "Price must be between ₹1 and ₹99,999");
    }
  }

  if (mrp !== undefined) {
    mrp = Number(mrp);
    if (isNaN(mrp) || mrp < 1 || mrp > 999999) {
      throw new ApiError(400, "MRP must be between ₹1 and ₹999,999");
    }
  }

  if (stock !== undefined) {
    stock = Number(stock);
    if (isNaN(stock) || stock < 0 || stock > 9999) {
      throw new ApiError(400, "Stock must be between 0 and 9,999 units");
    }
  }

  if (taxPercentage !== undefined) {
    taxPercentage = Number(taxPercentage);
    if (isNaN(taxPercentage) || taxPercentage < 0 || taxPercentage > 100) {
      throw new ApiError(400, "Tax percentage must be between 0 and 100");
    }
  }

  if (shippingCharge !== undefined) {
    shippingCharge = Number(shippingCharge);
    if (isNaN(shippingCharge) || shippingCharge < 0 || shippingCharge > 999) {
      throw new ApiError(400, "Shipping charge must be between ₹0 and ₹999");
    }
  }

  // Prepare update object
  const updates = {
    ...(title && { title }),
    ...(description && { description }),
    ...(miniDescription && { miniDescription }),
    ...(category && { category }),
    ...(tags && { tags }),
    ...(brand && { brand }),
    ...(price !== undefined && { price }),
    ...(mrp !== undefined && { mrp }),
    ...(dimensions && { dimensions }),
    ...(stock !== undefined && { stock }),
    ...(taxPercentage !== undefined && { taxPercentage }),
    ...(shippingCharge !== undefined && { shippingCharge }),
  };

  // Update the product
  await Product.findByIdAndUpdate(productId, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product updated successfully"));
});

export default updateProduct;
