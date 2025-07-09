// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItemId: { type: mongoose.Schema.Types.ObjectId, ref: "AddToCart", required: false },
  productType: { type: String, required: true },
  deliveryDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
  },
  status: { type: String, default: "pending", enum: ["pending", "completed", "failed", "cancelled"] },
  amount: { type: Number, required: true },
  paymentId: { type: String }, // Razorpay order ID
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  paidAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;