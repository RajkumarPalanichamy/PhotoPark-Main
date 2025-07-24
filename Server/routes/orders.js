import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getUserOrders);
router.put("/:id", updateOrderStatus);

export default router;
