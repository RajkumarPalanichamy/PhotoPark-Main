import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createAcrylic,
  getAllAcrylic,
  getAcrylicById,
  uploadImage,
  updateAcrylic,
  deleteAcrylic,
} from "../controllers/acrylicCustomizeController.js";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../acryliccustomizeUploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const router = express.Router();

// Routes
router.post("/", upload.single("image"), createAcrylic);
router.get("/", getAllAcrylic);
router.get("/:id", getAcrylicById);
router.post("/upload", upload.single("image"), uploadImage);
router.put("/:id", upload.single("image"), updateAcrylic);
router.delete("/:id", deleteAcrylic);

export default router;
