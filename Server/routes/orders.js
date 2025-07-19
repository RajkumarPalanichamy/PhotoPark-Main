import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);         // Create order
router.get("/", getAllOrders);                  // Get all orders
router.get("/user/:userId", getUserOrders);     // Get user-specific orders
router.put("/:id", updateOrderStatus);          // Update order status

export default router;
