import User from "../../models/user.model.js";
import DeletedUser from "../../models/deletedUser.model.js";
import Address from "../../models/address.model.js";
import Bank from "../../models/bank.model.js";
import Cart from "../../models/cart.model.js";
import CartItem from "../../models/cartItem.model.js";
import Coupon from "../../models/coupon.model.js";
import CouponUsed from "../../models/couponUsed.model.js";
import DropshipStore from "../../models/dropshipStore.model.js";
import Order from "../../models/order.model.js";
import OrderItem from "../../models/orderItem.model.js";
import Payment from "../../models/payment.model.js";
import Product from "../../models/product.model.js";
import Review from "../../models/review.model.js";
import Seller from "../../models/seller.model.js";
import Variant from "../../models/variant.model.js";
import Wishlist from "../../models/wishlist.model.js";
import WishlistItem from "../../models/wishlistItem.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import validator from "validator";
import ApiResponse from "../../utils/apiResponse.js";

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user.toObject();
  const userId = user._id.toString();

  delete user._id;

  // Backup user to DeletedUser collection
  await DeletedUser.create({ ...user, oldId: userId });

  // Soft delete related documents (flag-based)
  await Promise.all([
    Address.updateMany({ user: userId }, { isDeleted: true }),
    Bank.updateMany({ user: userId }, { isDeleted: true }),
    CouponUsed.updateMany({ user: userId }, { isDeleted: true }),
    DropshipStore.updateMany({ user: userId }, { isDeleted: true }),
    Coupon.updateMany({ user: userId }, { isDeleted: true }),
    Product.updateMany({ user: userId }, { isDeleted: true }),
    Review.updateMany({ user: userId }, { isDeleted: true }),
    Seller.updateMany({ user: userId }, { isDeleted: true }),
    Variant.updateMany({ user: userId }, { isDeleted: true }),

    Order.updateMany({ user: userId }, { userDeleted: true }),
    OrderItem.updateMany({ user: userId }, { userDeleted: true }),
    Payment.updateMany({ user: userId }, { userDeleted: true }),
  ]);

  // Hard delete non-critical dependent data
  await Promise.all([
    Cart.deleteMany({ user: userId }),
    CartItem.deleteMany({ user: userId }),
    Wishlist.deleteMany({ user: userId }),
    WishlistItem.deleteMany({ user: userId }),
  ]);

  // Hard delete user
  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export default deleteUser;
