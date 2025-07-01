// routes/orders.js
import express from "express";
import FrameOrder from "../models/framesorder.js";

const router = express.Router();

// Create Order (User Checkout)
router.post("/create", async (req, res) => {
  try {
    const newOrder = new FrameOrder(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, message: "Order placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/user/:userId - Get all orders by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await FrameOrder.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// routes/frameorderRoutes.js
router.patch("/:id/status", async (req, res) => {
  try {
    const updatedOrder = await FrameOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Get All Orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await FrameOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
