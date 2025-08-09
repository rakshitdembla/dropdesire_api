import mongoose from "mongoose";

const productAssetSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    type: {
      type: String,
      enum: {
        values: ["image", "video"],
        message: "{VALUE} is not a valid asset format.",
      },
      required: [true, "Asset type is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Asset URL is required"],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      trim: true,
    },
    index: {
      type: Number,
      required: [true, "Asset index is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductAsset", productAssetSchema);
