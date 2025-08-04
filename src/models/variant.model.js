import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  parentProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Parent product reference is required"],
  },

  title: {
    type: String,
    required: [true, "Variant title is required"],
    trim: true,
    minlength: [2, "Variant title must be at least 2 characters long"],
    maxlength: [100, "Variant title must not exceed 100 characters"],
  },

  description: {
    type: String,
    trim: true,
    required: [true, "Product description is required"],
    minlength: [20, "Description should be at least 20 characters long"],
    maxlength: [1000, "Variant description must not exceed 1000 characters"],
  },

  miniDescription: {
    type: String,
    required: [true, "Mini description is required"],
    trim: true,
    minlength: [10, "Mini description should be at least 10 characters long"],
    maxlength: [300, "Mini description should not exceed 300 characters"],
  },

  assets: [
    {
      type: {
        type: String,
        enum: ["image", "video"],
        required: [true, "Asset type is required"],
      },
      url: {
        type: String,
        required: [true, "Asset URL is required"],
        trim: true,
      },
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator reference is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be at least ₹1"],
    max: [99999, "Price must not exceed ₹99,999"],
  },

  mrp: {
    type: Number,
    required: [true, "MRP is required"],
    min: [1, "MRP must be at least ₹1"],
    max: [999999, "MRP must not exceed ₹999,999"],
  },

  dimensions: {
    type: String,
    trim: true,
    maxlength: [24, "Dimensions must not exceed 24 characters"],
    required: [true, "Dimensions are required"],
  },

  stock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [0, "Stock cannot be negative"],
    max: [9999, "Stock must not exceed 9,999 units"],
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  totalPrice: {
    type: Number,
    required: [true, "Total price (with tax) is required"],
    min: [1, "Total price must be at least ₹1"],
    max: [999999, "Total price must not exceed ₹999,999"],
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "disapproved", "not-stock"],
    default: "pending",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
