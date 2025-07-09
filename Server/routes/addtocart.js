import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import addtocartdata from "../models/addtocart.js";
import NewArrivaldata from "../models/newarrivals.js";
import SpecialOffersdata from "../models/specialoffers.js";
import { protect } from "../Middleware/authmiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../addtocartUploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Serve image upload
router.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5000/addtocartUploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// ✅ Add to cart – fixed productId validation for AcrylicCustomizedata
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      productId,
      productType,
      title,
      quantity,
      image,
      size,
      thickness,
      price,
      totalAmount,
      uploadedImageUrl,
    } = req.body;

    console.log("Incoming cart POST:", req.body);

    const allowedTypes = ["Newarrivaldata", "SpecialOffersdata", "AcrylicCustomizedata","Canvascustomizedata","Backlightcustomizedata"];
    if (!allowedTypes.includes(productType)) {
      return res.status(400).json({ error: "Invalid productType." });
    }

    if (!userId || !productType || !title || !price || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (!["AcrylicCustomizedata", "Canvascustomizedata","Backlightcustomizedata"].includes(productType) && !productId){
      return res
        .status(400)
        .json({ error: "productId is required for non-customized products." });
    }

    const cartItem = new addtocartdata({
      userId,
      productId: productId || null,
      productType,
      title,
      quantity,
      image,
      size,
      thickness,
      price,
      totalAmount,
      uploadedImageUrl,
    });

    const savedItem = await cartItem.save();
    console.log("✅ Saved to DB:", savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart." });
  }
});

// ✅ Get all cart items by userId
router.get("/user/:userId", protect, async (req, res) => {
  try {
    console.log("✅ Route hit: GET /api/cart/user/:userId");

    const requestedUserId = req.params.userId;

    if (req.user._id.toString() !== requestedUserId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. User ID does not match token." });
    }

    const items = await addtocartdata
      .find({ userId: requestedUserId })
      .populate("productId");

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching all cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
});

// ✅ Get single cart item by cartItemId
router.get("/:cartItemId", async (req, res) => {
  try {
    const item = await addtocartdata.findById(req.params.cartItemId).populate("productId");
    if (!item) return res.status(404).json({ error: "Cart item not found." });
    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching single cart item:", err);
    res.status(500).json({ error: "Failed to fetch cart item." });
  }
});

// ✅ Get specific cart item by userId + productId
router.get("/user/:userId/product/:productId", protect, async (req, res) => {
  const { userId, productId } = req.params;

  try {
    console.log("✅ Route hit: GET /api/cart/user/:userId/product/:productId");
    console.log("🔎 Params:", { userId, productId });

    if (req.user._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. User ID does not match token." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid userId or productId format" });
    }

    const item = await addtocartdata
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
      })
      .populate("productId");

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("❌ Error fetching cart item:", error);
    res.status(500).json({ error: "Failed to fetch cart item." });
  }
});

// ✅ Delete cart item by _id
router.delete("/:itemId", async (req, res) => {
  try {
    const deletedItem = await addtocartdata.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }
    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
});

export default router;