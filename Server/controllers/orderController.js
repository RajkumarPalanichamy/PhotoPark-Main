import Order from "../models/orders.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// ✅ Create Order with Cloudinary image upload
export const createOrder = async (req, res) => {
  try {
    const { cartItemId, productType, deliveryDetails, amount } = req.body;
    const userId = req.user._id;

    const allowedTypes = ["acrylic", "canvas", "backlight", "square", "circle"];
    if (!allowedTypes.includes(productType)) {
      return res.status(400).json({ error: "❌ Invalid productType" });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "orders");
      imageUrl = result.secure_url;
    }

    const newOrder = await Order.create({
      userId,
      cartItemId,
      productType,
      deliveryDetails,
      amount,
      image: imageUrl,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cartItemId")
      .populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ Get user-specific orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("cartItemId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders", error: err.message });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req, res) => {
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
};
