import Product from "../../../models/product.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";

const getSellerProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 7;
  const skip = (page - 1) * limit;

  const sellerId = req.seller?._id;

  const products = await Product.find({
    soldBy: sellerId,
    isDeleted: {
      $ne: true,
    },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
      },
      "Products fetched successfully."
    )
  );
});

export default getSellerProducts;
