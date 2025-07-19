// controllers/paymentController.js
import crypto from "crypto";
import razorpay from "../utils/razorpayInstance.js";
import Frame from "../models/framesorder.js";
import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // ₹ to paisa
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      frameId,
      productType,
      deliveryDetails,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    if (productType === "frame") {
      await Frame.findByIdAndUpdate(frameId, { isPaid: true });
    }

    const newOrder = await Order.create({
      userId: req.user._id,
      cartItemId: frameId,
      productType,
      deliveryDetails,
      status: "paid",
    });

    res.status(200).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
