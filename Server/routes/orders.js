import express from "express";
import Order from "../models/orders.js";
import { protect } from "../Middleware/authmiddleware.js";

const router = express.Router();

// ✅ POST: Create order
router.post("/", protect, async (req, res) => {
  try {
    const { cartItemId, productType, deliveryDetails } = req.body;
    const userId = req.user._id;

    const newOrder = await Order.create({
      userId,
      cartItemId,
      productType,
      deliveryDetails,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ GET: All orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cartItemId")
      .populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ GET: Orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("cartItemId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders", error: err.message });
  }
});

// ✅ PUT: Update order status by ID
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
