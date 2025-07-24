import express from "express";
import {
  createFrameOrder,
  getUserFrameOrders,
  updateFrameOrderStatus,
  getAllFrameOrders,
} from "../controllers/frameOrderController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createFrameOrder);
router.get("/user/:userId", getUserFrameOrders);
router.patch("/:id/status", updateFrameOrderStatus);
router.get("/", getAllFrameOrders);

export default router;
