import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User refrence is required."],
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: [true, "OrderItem refrence is required"],
      },
    ],

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CouponUsed",
    },

    transactionId: {
      type: String,
      trim: true,
      minlength: [5, "Transaction Id must be at least 5 characters long"],
      maxlength: [150, "Transaction Id must not exceed 100 characters"],
    },

    paidAt: {
      type: Date,
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required."],
      trim: true,
      min: [1, "Total amount must be at least ₹1"],
      max: [999999, "Total amount must not exceed ₹999,999"],
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
