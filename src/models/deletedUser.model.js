import mongoose from "mongoose";
import validator from "validator";

const deletedUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      minlength: [2, "Full Name must be at least 2 characters long"],
      maxlength: [100, "Full Name must not exceed 100 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      maxlength: [254, "Email must not exceed 254 characters"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      maxlength: [24, "Phone must not exceed 24 characters"],
      unique: true,
      trim: true,
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "en-IN", { strictMode: true }),
        message: "Phone number must be a valid Indian number with +91",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
      trim: true,
    },

    profilePicture: {
      type: String,
      trim: true,
    },

    isSeller: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    adminType: {
      type: String,
      enum: {
        values: ["superadmin", "admin", "moderator", "editor", "support"],
        message: "{VALUE} is not a valid admin type",
      },
      trim: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    userStatus: {
      type: String,
      enum: {
        values: ["active", "inactive", "suspended", "banned"],
        message: "{VALUE} is not a valid user status",
      },
      default: "active",
      trim: true,
    },

    walletBalance: {
      type: Number,
      default: 0,
      min: [0, "walletBalance cannot be negative"],
      max: [9999, "walletBalance must not exceed 4 digits"],
    },

    dropshipStores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DropshipStore",
      },
    ],

    userAddresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    oldId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User old id is required"],
    },
  },
  { timestamps: true }
);

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);
export default DeletedUser;
