import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full Name is required"],
      minlength: [2, "Full Name must be at least 2 characters long"],
      maxlength: [100, "Full Name must not exceed 100 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [24, "Phone must not exceed 24 characters"],
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "en-IN", { strictMode: true }),
        message: "Phone number must be a valid Indian number with +91",
      },
    },

    addressLine1: {
      type: String,
      required: [true, "Address Line 1 is required"],
      trim: true,
      minlength: [5, "Address Line 1 must be at least 5 characters long"],
      maxlength: [200, "Address Line 1 must not exceed 200 characters"],
    },

    addressLine2: {
      type: String,
      trim: true,
      required: [true, "Address Line 2 is required"],
      maxlength: [200, "Address Line 2 must not exceed 200 characters"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters long"],
      maxlength: [100, "City must not exceed 100 characters"],
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State must be at least 2 characters long"],
      maxlength: [100, "State must not exceed 100 characters"],
    },

    pincode: {
      type: Number,
      required: [true, "Pincode is required"],
      min: [100000, "Pincode must be at least 6 digits"],
      max: [999999, "Pincode must not exceed 6 digits"],
    },

    country: {
      type: String,
      trim: true,
      minlength: [2, "Country must be at least 2 characters long"],
      maxlength: [100, "Country must not exceed 100 characters"],
      default: "India",
    },

    landmark: {
      type: String,
      trim: true,
      maxlength: [200, "Landmark must not exceed 200 characters"],
    },

    type: {
      type: String,
      enum: ["Home", "Office", "Other"],
      required: [true, "Address type is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
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

const Address = mongoose.model("Address", addressSchema);
export default Address;
