import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon code is required"],
    minlength: [2, "Coupon code must be at least 2 characters long"],
    maxlength: [50, "Coupon code must not exceed 50 characters"],
    unique: true,
    trim: true,
    uppercase: true,
  },

  type: {
    type: String,
    required: [true, "Coupon type is required"],
    enum: ["percentage", "flat"],
  },

  discount: {
    type: Number,
    required: [true, "Discount value is required"],
    min: [0, "discount cannot be negative"],
  },

  maxDiscount: {
    type: Number,
    required: [true, "Maximum discount is required"],
    min: [0, "maxDiscount cannot be negative"],
  },

  minCartValue: {
    type: Number,
    required: [true, "Minimum cart value is required"],
    min: [0, "minCartValue cannot be negative"],
  },

  usageLimit: {
    type: Number,
    required: [true, "Usage limit is required"],
    min: [0, "usageLimit cannot be negative"],
  },

  usedCount: {
    type: Number,
    default: 0,
    min: [0, "usedCount cannot be negative"],
  },

  expiry: {
    type: Date,
    required: [true, "Expiry date is required"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  applicableOn: {
    type: [String],
    required: true,
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

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    required: [true, "createdBy (user) reference is required"],
  },

  usagePerUser: {
    type: Number,
    required: [true, "Usage per user limit is required"],
    min: [0, "usagePerUser cannot be negative"],
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
