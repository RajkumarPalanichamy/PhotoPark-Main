// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItemId: { type: mongoose.Schema.Types.ObjectId, ref: "AddToCart", required: true },
  productType: { type: String, required: true },
  deliveryDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
  },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
