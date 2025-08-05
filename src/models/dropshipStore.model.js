import mongoose from "mongoose";
import validator from "validator";

const dropshipStoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      minlength: [2, "Store name must be at least 2 characters"],
      maxlength: [50, "Store name must not exceed 50 characters"],
    },

    phone: {
      type: String,
      required: [true, "Store phone number is required"],
      maxlength: [24, "Phone must not exceed 15 characters"],
      trim: true,
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "en-IN", { strictMode: true }),
        message: "Phone number must be a valid Indian number with +91",
      },
    },

    email: {
      type: String,
      required: [true, "Store email is required"],
      trim: true,
      maxlength: [254, "Email must not exceed 254 characters"],
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },

    logo: {
      type: String,
      trim: true,
    },

    logoPublicId: {
      type: String,
      trim: true,
    },

    thankyouMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Thank you message must not exceed 500 characters"],
    },

    paymentDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Store owner (user) reference is required"],
      index: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Store address is required"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const DropshipStore = mongoose.model("DropshipStore", dropshipStoreSchema);

export default DropshipStore;
