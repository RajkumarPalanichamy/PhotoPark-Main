import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect } from "../Middleware/authmiddleware.js";
import Order from "../models/orders.js";

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_eh4eCol0GXNXUS",
  key_secret: "br31ViuH329G0OwBaXJ2eMQl",
});

// ✅ POST: Create payment order
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, currency = "INR", cartItemId, productType, deliveryDetails } = req.body;
    const userId = req.user._id;

    if (!amount || !deliveryDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        cartItemId: cartItemId ? cartItemId.toString() : "frame_order",
        productType,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database with pending status
    const orderData = {
      userId,
      productType,
      deliveryDetails,
      status: "pending",
      paymentId: razorpayOrder.id,
      amount: amount,
    };
    
    // Only add cartItemId if it exists (for non-frame orders)
    if (cartItemId) {
      orderData.cartItemId = cartItemId;
    }
    
    const newOrder = await Order.create(orderData);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ Payment order creation failed:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// ✅ POST: Verify payment
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification data" });
    }

    // Verify signature using the same key_secret used for order creation
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "br31ViuH329G0OwBaXJ2eMQl")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update order status to completed
    if (dbOrderId) {
      await Order.findByIdAndUpdate(dbOrderId, {
        status: "completed",
        paymentId: razorpay_payment_id,
        paymentStatus: "success",
        paidAt: new Date(),
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// ✅ GET: Get payment status
router.get("/status/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      status: order.status,
      paymentStatus: order.paymentStatus,
      amount: order.amount,
    });
  } catch (error) {
    console.error("❌ Failed to get payment status:", error);
    res.status(500).json({ error: "Failed to get payment status" });
  }
});

export default router; 