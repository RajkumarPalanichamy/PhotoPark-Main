// routes/framesorder.js
import express from "express";
import FrameOrder from "../models/framesorder.js";
import { protect } from "../Middleware/authmiddleware.js";

const router = express.Router();

// ✅ Create Order (User Checkout)
router.post("/create", protect, async (req, res) => {
  console.log("📥 POST /api/frameorders/create called"); 
  console.log("📦 Request body:", req.body);
  console.log("🔐 Auth headers:", req.headers.authorization);
  try {
    // Get userId from authenticated user
    const userId = req.user._id;
    const { items, shippingDetails } = req.body;

    // Basic validation
    if (!items?.length || !shippingDetails?.fullName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 🧾 Log incoming items for debug
    console.log("🧾 Incoming frame order payload:", req.body);

    // Validate each item has required fields
    for (const item of items) {
      if (
        !item.title ||
        !item.shape ||
        !item.color ||
        !item.size ||
        !item.frameImageUrl ||
        !item.userImageUrl
      ) {
        return res.status(400).json({
          success: false,
          message: "❌ One or more required item fields are missing",
          item,
        });
      }
    }

    // Sanitize items
    const sanitizedItems = items.map((item) => ({
      title: item.title,
      frameImageUrl: item.frameImageUrl,
      userImageUrl: item.userImageUrl,
      shape: item.shape,
      color: item.color,
      size: item.size,
      price: Number(item.price),
      quantity: Number(item.quantity),
      total: Number(item.total),
    }));

    console.log("✅ Sanitized Items:", sanitizedItems);

    const newOrder = new FrameOrder({
      userId,
      items: sanitizedItems,
      shippingDetails,
      status: "Pending",
    });

    await newOrder.save();
    console.log("✅ Order saved successfully"); // 👉 ADD HERE
    console.log("🛒 Saved Order Details:", newOrder); // ✅ Add this line for debugging
    res.status(201).json({
      success: true,
      message: "✅ Frame order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Frame order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get orders by user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await FrameOrder.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const updatedOrder = await FrameOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// ✅ Admin: Get all frame orders
router.get("/", async (req, res) => {
  try {
    const orders = await FrameOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
