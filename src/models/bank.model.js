import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
    index: true,
  },

  upiId: {
    type: String,
    required: [true, "UPI ID is required"],
    trim: true,
    minlength: [5, "UPI ID must be at least 5 characters long"],
    maxlength: [100, "UPI ID must not exceed 100 characters"],
  },

  bankName: {
    type: String,
    trim: true,
    required: [true, "Bank name is required"],
    minlength: [2, "Bank name must be at least 2 characters"],
    maxlength: [100, "Bank name must not exceed 100 characters"],
  },

  accountHolderName: {
    type: String,
    trim: true,
    required: [true, "Account holder is required"],
    minlength: [2, "Account holder name must be at least 2 characters"],
    maxlength: [100, "Account holder name must not exceed 100 characters"],
  },

  accountNumber: {
    type: String,
    trim: true,
    required: [true, "Account number is required"],
    minlength: [8, "Account number must be at least 8 digits"],
    maxlength: [20, "Account number must not exceed 20 digits"],
  },

  ifscCode: {
    type: String,
    trim: true,
    required: [true, "IFSC code is required"],
    minlength: [6, "IFSC Code must be at least 6 characters"],
    maxlength: [20, "IFSC Code must not exceed 20 characters"],
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const Bank = mongoose.model("Bank", bankSchema);
export default Bank;
