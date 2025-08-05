import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      trim: true,
      minlength: [5, "Transaction ID must be at least 5 characters long"],
      maxlength: [100, "Transaction ID must not exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      trim: true,
      minlength: [1, "Amount must be at least 1 character long"],
      maxlength: [20, "Amount must not exceed 20 characters"],
    },

    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: [true, "Bank reference is required"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    userDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
