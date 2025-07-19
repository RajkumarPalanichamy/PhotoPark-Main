import express from "express";
import upload from "../middleware/upload.js";
import {
  createAcrylic,
  getAllAcrylic,
  getAcrylicById,
  uploadImage,
  updateAcrylic,
  deleteAcrylic,
} from "../controllers/acrylicCustomizeController.js";

const router = express.Router();

router.post("/", upload.single("image"), createAcrylic);
router.get("/", getAllAcrylic);
router.get("/:id", getAcrylicById);
router.post("/upload", upload.single("image"), uploadImage);
router.put("/:id", upload.single("image"), updateAcrylic);
router.delete("/:id", deleteAcrylic);

export default router;
