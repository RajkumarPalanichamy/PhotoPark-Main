import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  createBacklightCustomize,
  getAllBacklightCustomize,
  getBacklightCustomizeById,
  uploadBacklightImage,
  updateBacklightCustomize,
  deleteBacklightCustomize,
} from "../controllers/backlightCustomizeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../backlightcustomizeUploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), createBacklightCustomize);
router.get("/", getAllBacklightCustomize);
router.get("/:id", getBacklightCustomizeById);
router.post("/upload", upload.single("image"), uploadBacklightImage);
router.put("/:id", upload.single("image"), updateBacklightCustomize);
router.delete("/:id", deleteBacklightCustomize);

export default router;
