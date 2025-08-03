import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    bussinessName: {
      type: String,
      required: [true, "Business Name is required"],
      trim: true,
      minlength: [2, "Business Name must be at least 2 characters long"],
      maxlength: [100, "Business Name must not exceed 100 characters"],
    },

    bussinessType: {
      type: String,
      required: [true, "Business Type is required"],
      enum: ["Individual", "Company", "LLP", "Partnership", "Other"],
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      minlength: [10, "GST Number must be at least 10 characters long"],
      maxlength: [20, "GST Number must not exceed 20 characters"],
      uppercase: true,
    },

    panNumber: {
      type: String,
      trim: true,
      minlength: [10, "PAN Number must be at least 10 characters long"],
      maxlength: [10, "PAN Number must not exceed 10 characters"],
      uppercase: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Address is required"],
    },

    returnAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Return Address is required"],
    },

    sellerStatus: {
      type: String,
      enum: ["approved", "disapproved", "pending", "suspended"],
      default: "pending",
      required: true,
    },

    gstImages: {
      type: [String],
      required: ["true", "GST images are required"],
    },

    panImages: {
      type: [String],
      required: ["true", "Pan images are required"],
    },

    aadharImages: {
      type: [String],
      required: ["true", "Aadhar images are required"],
    },

    logo: {
      type: String,
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: [true, "Bank account is required"],
    },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
