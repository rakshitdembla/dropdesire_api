import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: [true, "Cart reference is required"],
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product reference is required"],
  },

  qty: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Minimum quantity is 1"],
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

  dropshippedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DropshipStore",
  },

  resellPrice: {
    type: Number,
    min: [1, "Resell price must be at least ₹1"],
    max: [999999, "Resell price must not exceed ₹999,999"],
  },

  resellPaymentMode: {
    type: String,
    enum: ["cod", "prepaid"],
  },

  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Shipping address is required"],
  },

  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [1, "Amount must be at least ₹1"],
    max: [999999, "Amount must not exceed ₹999,999"],
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
