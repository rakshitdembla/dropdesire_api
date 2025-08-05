import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    orderedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: [true, "orderedItem reference is required"],
      index: true,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
    },

    comment: {
      type: String,
      trim: true,
      minlength: [2, "Comment must be at least 2 characters long"],
      maxlength: [500, "Comment must not exceed 500 characters"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
