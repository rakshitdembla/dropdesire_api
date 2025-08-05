import mongoose from "mongoose";

const couponUsedSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: [true, "Coupn reference is required"],
  },

  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    required: [true, "usedBy (user) reference is required"],
  },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order reference is required"],
    index: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const CouponUsed = mongoose.model("CouponUsed", couponUsedSchema);
export default CouponUsed;
