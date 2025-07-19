import FrameOrder from "../models/framesorder.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Create a new frame order
export const createFrameOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingDetails } = req.body;

    if (!items?.length || !shippingDetails?.fullName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const uploadedItems = [];

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

      // Upload frame and user image to Cloudinary
      const [frameUpload, userUpload] = await Promise.all([
        cloudinary.uploader.upload(item.frameImageUrl, {
          folder: "frames/frame_images",
        }),
        cloudinary.uploader.upload(item.userImageUrl, {
          folder: "frames/user_images",
        }),
      ]);

      uploadedItems.push({
        title: item.title,
        shape: item.shape,
        color: item.color,
        size: item.size,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.total),
        frameImageUrl: frameUpload.secure_url,
        userImageUrl: userUpload.secure_url,
      });
    }

    const newOrder = new FrameOrder({
      userId,
      items: uploadedItems,
      shippingDetails,
      status: "Pending",
    });

    await newOrder.save();

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
