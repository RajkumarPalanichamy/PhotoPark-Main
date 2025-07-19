import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

export default router;
