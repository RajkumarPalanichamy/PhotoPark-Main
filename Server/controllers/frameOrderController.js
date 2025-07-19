import FrameOrder from "../models/framesorder.js";

// ✅ Create a new frame order
export const createFrameOrder = async (req, res) => {
  console.log("📥 POST /api/frameorders/create called");
  console.log("📦 Request body:", req.body);
  console.log("🔐 Auth headers:", req.headers.authorization);

  try {
    const userId = req.user._id;
    const { items, shippingDetails } = req.body;

    if (!items?.length || !shippingDetails?.fullName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

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

    const newOrder = new FrameOrder({
      userId,
      items: sanitizedItems,
      shippingDetails,
      status: "Pending",
    });

    await newOrder.save();
    console.log("✅ Order saved successfully");
    console.log("🛒 Saved Order Details:", newOrder);

    res.status(201).json({
      success: true,
      message: "✅ Frame order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Frame order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get orders by userId
export const getUserFrameOrders = async (req, res) => {
  try {
    const orders = await FrameOrder.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update order status
export const updateFrameOrderStatus = async (req, res) => {
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
};

// ✅ Admin: Get all orders
export const getAllFrameOrders = async (req, res) => {
  try {
    const orders = await FrameOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ error: err.message });
  }
};
