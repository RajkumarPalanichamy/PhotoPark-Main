import express from "express";
import multer from "multer";
import path from "path";
import Canvascustomizedata from "../models/canvascustomize.js"
import { fileURLToPath } from "url";
import fs from "fs";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../canvascustomizeUploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

const ALLOWED_SHAPES = ["Portrait", "Landscape","Square" ];

//---------------- POST --------------------
// POST - Add new customized Canvas product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    if (!ALLOWED_SHAPES.includes(shape)) {
      return res.status(400).json({ message: "Invalid or missing shape" });
    }

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    const parsedSizes = sizes.map((size) => {
      const price = Number(size.price);
      const original = Number(size.original);
      if (isNaN(price) || isNaN(original)) {
        throw new Error("Invalid numeric input in sizes");
      }
      return { label: size.label, price, original };
    });

    const parsedRating = Number(rating);
    if (isNaN(parsedRating)) {
      return res.status(400).json({ message: "Invalid numeric input in rating" });
    }

    const uploadedImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/canvascustomizeUploads/${req.file.filename}`
      : null;

    const posting = new Canvascustomizedata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      uploadedImageUrl,
      quantity,
      shape,
    });

    const PostingComplete = await posting.save();
    return res.status(201).json(PostingComplete);

  } catch (error) {
    console.error("Canvas Customize POST error:", error.message);
    return res.status(400).json({ message: error.message || "Something went wrong" });
  }
});

//---------------- GET ALL --------------------
router.get("/", async (req, res) => {
  try {
    const getPost = await Canvascustomizedata.find();
    return res.json(getPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

//---------------- GET BY ID --------------------
router.get("/:id", async (req, res) => {
  try {
    const getPostId = await Canvascustomizedata.findById(req.params.id);
    if (!getPostId) {
      return res.status(404).json({ message: "NOT FOUND" });
    }
    return res.json(getPostId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});


// POST: Upload only image and return its URL
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/canvascustomizeUploads/${req.file.filename}`;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Image upload error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

//---------------- PUT/UPDATE --------------------
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const post = await Canvascustomizedata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const {
      title,
      content,
      rating,
      thickness,
      sizes,
      stock,
      quantity,
    } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) return res.status(400).json({ message: "Invalid rating" });
      post.rating = parsedRating;
    }
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity) post.quantity = quantity;

    if (sizes) {
      let parsedSizes = sizes;
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch {
          return res.status(400).json({ message: "Invalid sizes format" });
        }
      }
      post.sizes = parsedSizes.map((size) => {
        const price = Number(size.price);
        const original = Number(size.original);
        if (isNaN(price) || isNaN(original)) {
          throw new Error("Invalid numeric input in sizes");
        }
        return { label: size.label, price, original };
      });
    }

    if (req.file) {
      post.image = `${req.protocol}://${req.get("host")}/canvascustomizeUploads/${req.file.filename}`;
    }

    const UpdatedPost = await post.save();
    return res.json(UpdatedPost);
  } catch (error) {
    console.error("Update error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

//---------------- DELETE --------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Canvascustomizedata.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "NOT FOUND" });
    }
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
