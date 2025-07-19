import FrameCustomize from "../models/framescustomize.js";
import fs from "fs";

// ✅ Create new FrameCustomize
export const createFrameCustomize = async (req, res) => {
  try {
    const {
      shapeData,
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
};

// ✅ Upload a frame image (used in admin form)
export const uploadFrameImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.json({ url: req.file.path });
};

// ✅ Get all entries
export const getAllFrames = async (req, res) => {
  try {
    const data = await FrameCustomize.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get by ID
export const getFrameById = async (req, res) => {
  try {
    const item = await FrameCustomize.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update by ID
export const updateFrameById = async (req, res) => {
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
};

// ✅ Delete by ID
export const deleteFrameById = async (req, res) => {
  try {
    const item = await FrameCustomize.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userUploadedImage && fs.existsSync(item.userUploadedImage)) {
      fs.unlink(item.userUploadedImage, (err) => {
        if (err) console.warn("Failed to delete image:", err.message);
      });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
