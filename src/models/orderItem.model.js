import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },

    qty: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      max: [99, "Quantity must not exceed 99"],
    },

    isVariant: {
      type: Boolean,
      default: false,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    isResell: {
      type: Boolean,
      default: false,
    },

    resellPrice: {
      type: Number,
      min: [1, "Resell price must be at least ₹1"],
      max: [999999, "Resell price must not exceed ₹999,999"],
    },

    dropshippedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DropshipStore",
    },

    resellPaymentMode: {
      type: String,
      enum: ["prepaid", "cod"],
    },

    basePrice: {
      type: Number,
      trim: true,
      required: ["true", "Base price (per product) is required"],
      min: [1, "Base price must be at least ₹1"],
      max: [999999, "Base price must not exceed ₹999,999"],
    },

    OrderStatus: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled", "RTO"],
      default: "pending",
    },

    isCancellable: {
      type: Boolean,
      default: false,
    },

    shippingCharge: {
      type: Number,
      required: [true, "Shipping charge is required"],
      min: [0, "Shipping charge cannot be negative"],
      max: [999, "Shipping charge must not exceed ₹999"],
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "unpaid",
    },

    marginPayStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },

    taxPercentage: {
      type: Number,
      required: [true, "Tax percentage is required"],
      min: [0, "Tax cannot be negative"],
      max: [100, "Tax cannot exceed 100%"],
    },

    trackingId: {
      type: String,
      trim: true,
      minlength: [5, "Tracking Id must be at least 5 characters long"],
      maxlength: [100, "Tracking Id must not exceed 100 characters"],
    },

    courierName: {
      type: String,
      trim: true,
      minlength: [2, "courierName must be at least 2 characters long"],
      maxlength: [60, "courierName must not exceed 60 characters"],
    },

    trackingStatus: {
      type: String,
      enum: [
        "processing",
        "waiting_for_pickup",
        "shipped",
        "in_transit",
        "delivered",
        "rto_initiated",
        "rto_in_transit",
        "rto_delivered",
        "failed_attempt",
      ],
      trim: true,
      default: "pending",
    },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping address is required"],
    },

    transactionId: {
      type: String,
      trim: true,
      minlength: [5, "Transaction Id must be at least 5 characters long"],
      maxlength: [150, "Transaction Id must not exceed 100 characters"],
    },

    paymentMethod: {
      type: String,
      enum: ["prepaid"],
      default: "prepaid",
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "none"],
      default: "razorpay",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },

    deliveryMethod: {
      type: String,
      enum: ["standard", "express", "same_day"],
      default: "standard",
    },

    totalPrice: {
      type: Number,
      trim: true,
      required: ["true", "Total price is required"],
      min: [1, "Total price must be at least ₹1"],
      max: [999999, "Total price must not exceed ₹999,999"],
    },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
