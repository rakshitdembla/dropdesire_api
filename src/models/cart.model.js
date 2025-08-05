import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Cart must be associated with a user"],
    index: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
