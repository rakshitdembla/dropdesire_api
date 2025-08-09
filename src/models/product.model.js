import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },

  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    minlength: [5, "Product title must be at least 5 characters long"],
    maxlength: [100, "Product title must not exceed 100 characters"],
  },

  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    minlength: [20, "Description should be at least 20 characters long"],
    maxlength: [2000, "Description should not exceed 2000 characters"],
  },

  miniDescription: {
    type: String,
    required: [true, "Mini description is required"],
    trim: true,
    minlength: [10, "Mini description should be at least 10 characters long"],
    maxlength: [300, "Mini description should not exceed 300 characters"],
  },

  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: [
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
    ],
  },

  tags: {
    type: [String],
    required: [true, "At least one tag is required"],
    enum: [
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
    ],
  },

  brand: {
    type: String,
    trim: true,
    minlength: [2, "Brand should be at least 2 characters long"],
    maxlength: [64, "Brand must not exceed 64 characters"],
    lowercase: true,
  },

  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: [true, "soldBy (Seller) reference is required"],
  },

  isTrending: {
    type: Boolean,
    default: false,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  primaryPhoto: {
    type: String,
    required: [true, "Primary photo of product is required."],
    trim: true,
  },

  primaryPhotoPublicId: {
    type: String,
    required: [true, "Primary photo of public Id is required."],
    trim: true,
  },

  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductAsset",
    },
  ],

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be at least ₹1"],
    max: [99999, "Price must not exceed ₹99,999"],
  },

  mrp: {
    type: Number,
    required: [true, "MRP is required"],
    min: [1, "MRP must be at least ₹1"],
    max: [999999, "MRP must not exceed ₹999,999"],
  },

  basePrice: {
    type: Number,
    required: [true, "Base price (without tax) is required"],
    min: [1, "Base price must be at least ₹1"],
    max: [999999, "Base price must not exceed ₹999,999"],
  },

  dimensions: {
    type: String,
    trim: true,
    maxlength: [24, "Dimensions must not exceed 24 characters"],
    required: [true, "Dimensions are required"],
  },

  stock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [0, "Stock cannot be negative"],
    max: [9999, "Stock must not exceed 9,999 units"],
  },

  isAvailable: {
    type: Boolean,
    required: true,
    default: false,
  },

  hasVariants: {
    type: Boolean,
    default: false,
  },

  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
  ],

  taxPercentage: {
    type: Number,
    required: [true, "Tax percentage is required"],
    min: [0, "Tax cannot be negative"],
    max: [100, "Tax cannot exceed 100%"],
  },

  totalPrice: {
    type: Number,
    required: [true, "Total price (with tax) is required"],
    min: [1, "Total price must be at least ₹1"],
    max: [999999, "Total price must not exceed ₹999,999"],
  },

  shippingCharge: {
    type: Number,
    required: [true, "Shipping charge is required"],
    min: [0, "Shipping charge cannot be negative"],
    max: [999, "Shipping charge must not exceed ₹999"],
    default: 0,
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "disapproved"],
    default: "pending",
  },

  currency: {
    type: String,
    enum: ["₹", "$"],
    default: "₹",
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
