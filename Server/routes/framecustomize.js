import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createFrameCustomize,
  uploadFrameImage,
  getAllFrames,
  getFrameById,
  updateFrameById,
  deleteFrameById,
} from "../controllers/frameCustomizeController.js";

const router = express.Router();

// Ensure upload directory exists
const uploadPath = path.join("frameuploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("userUploadedImage"), createFrameCustomize);
router.post("/upload-frame-image", upload.single("frameImage"), uploadFrameImage);

router.get("/", getAllFrames);
router.get("/:id", getFrameById);

router.put("/:id", upload.single("userUploadedImage"), updateFrameById);
router.delete("/:id", deleteFrameById);

export default router;
