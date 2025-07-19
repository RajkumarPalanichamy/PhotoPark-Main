import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect } from "../Middleware/authmiddleware.js";
import {
  uploadImage,
  addToCart,
  getCartItemsByUser,
  getSingleCartItem,
  getCartItemByUserAndProduct,
  deleteCartItem,
} from "../controllers/addToCartController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../addtocartUploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();

// Routes
router.post("/api/upload-image", upload.single("image"), uploadImage);
router.post("/", addToCart);
router.get("/user/:userId", protect, getCartItemsByUser);
router.get("/:cartItemId", getSingleCartItem);
router.get("/user/:userId/product/:productId", protect, getCartItemByUserAndProduct);
router.delete("/:itemId", deleteCartItem);

export default router;
