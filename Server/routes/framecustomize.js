import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import FrameCustomize from "../models/framescustomize.js";

const router = express.Router();

// Setup upload folder
const uploadPath = path.join("frameuploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ---------------------------
 ✅ POST: Create new FrameCustomize
---------------------------- */
router.post("/", upload.single("userUploadedImage"), async (req, res) => {
  try {
    const {
      shapeData, // stringified JSON
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "userUploadedImage is required" });
    }

    const newFrame = new FrameCustomize({
      shapeData: JSON.parse(shapeData),
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
      userUploadedImage: req.file.path,
    });

    const saved = await newFrame.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// 📸 Upload a single frame image (used in admin form)
router.post("/upload-frame-image", upload.single("frameImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Return the image URL so it can be used in shapeData
  return res.json({ url: req.file.path });
});

/* ---------------------------
 ✅ GET: All FrameCustomize entries
---------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await FrameCustomize.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------------------
 ✅ GET: Single FrameCustomize by ID
---------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const item = await FrameCustomize.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------------------
 ✅ PUT: Update FrameCustomize by ID
---------------------------- */
router.put("/:id", upload.single("userUploadedImage"), async (req, res) => {
  try {
    const {
      shapeData,
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
    } = req.body;

    const updates = {};
    if (shapeData) updates.shapeData = JSON.parse(shapeData);
    if (selectedShape) updates.selectedShape = selectedShape;
    if (selectedColor) updates.selectedColor = selectedColor;
    if (selectedFrameImage) updates.selectedFrameImage = selectedFrameImage;
    if (selectedSize) updates.selectedSize = selectedSize;
    if (quantity) updates.quantity = quantity;
    if (req.file) updates.userUploadedImage = req.file.path;

    const updated = await FrameCustomize.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ---------------------------
 ✅ DELETE: FrameCustomize by ID
---------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const item = await FrameCustomize.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Delete uploaded image if exists
    if (item.userUploadedImage && fs.existsSync(item.userUploadedImage)) {
      fs.unlink(item.userUploadedImage, (err) => {
        if (err) console.warn("Failed to delete userUploadedImage:", err.message);
      });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
