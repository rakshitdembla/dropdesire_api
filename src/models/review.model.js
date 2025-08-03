const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
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

    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
