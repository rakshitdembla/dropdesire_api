import mongoose from "mongoose";

const wishListItemSchema = new mongoose.Schema(
  {
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WishList",
      required: [true, "Wishlist reference is required"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },

    isVariant: {
      type: Boolean,
      default: false,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
  },
  { timestamps: true }
);

const WishlistItem = mongoose.model("WishlistItem", wishListItemSchema);
export default WishlistItem;
