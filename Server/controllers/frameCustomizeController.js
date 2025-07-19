import FrameCustomize from "../models/framescustomize.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Create new FrameCustomize with Cloudinary upload
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

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "framescustomize" },
      async (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ message: error.message });

        const newFrame = new FrameCustomize({
          shapeData: JSON.parse(shapeData),
          selectedShape,
          selectedColor,
          selectedFrameImage,
          selectedSize,
          quantity,
          userUploadedImage: cloudinaryResult.secure_url,
        });

        const saved = await newFrame.save();
        res.status(201).json(saved);
      }
    );

    // pipe memory buffer to upload_stream
    result.end(req.file.buffer);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Upload a frame image (used in admin form)
export const uploadFrameImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "framescustomize/frames" },
      (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ message: error.message });
        return res.json({ url: cloudinaryResult.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all
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

// ✅ Update
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

    // if new image provided, upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "framescustomize" },
          (error, cloudinaryResult) => {
            if (error) reject(error);
            else resolve(cloudinaryResult);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updates.userUploadedImage = result.secure_url;
    }

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

// ✅ Delete
export const deleteFrameById = async (req, res) => {
  try {
    const item = await FrameCustomize.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
