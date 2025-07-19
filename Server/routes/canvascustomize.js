import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  createCanvas,
  getAllCanvas,
  getCanvasById,
  uploadImage,
  updateCanvas,
  deleteCanvas,
} from "../controllers/canvasCustomizeController.js";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../canvascustomizeUploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Setup multer
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), createCanvas);
router.get("/", getAllCanvas);
router.get("/:id", getCanvasById);
router.post("/upload", upload.single("image"), uploadImage);
router.put("/:id", upload.single("image"), updateCanvas);
router.delete("/:id", deleteCanvas);

export default router;
