import express from "express";
import multer from "multer";
import path from "path";
import SpecialOffersdata from "../models/specialoffers.js";
import { fileURLToPath } from "url";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const route = express.Router();

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../specialoffersUploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//---------------- POST --------------------
route.post("/", upload.single("image"), async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    // Parse sizes
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

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/specialoffersUploads/${req.file.filename}`
      : null;

    const posting = new SpecialOffersdata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      image,
      quantity,
    });

    const PostingComplete = await posting.save();
    return res.status(201).json(PostingComplete);
  } catch (error) {
    console.error("New Arrival POST error:", error.message);
    return res.status(400).json({ message: error.message || "Something went wrong" });
  }
});

//---------------- GET ALL --------------------
route.get("/", async (req, res) => {
  try {
    const getPost = await SpecialOffersdata.find();
    return res.json(getPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

//---------------- GET BY ID --------------------
route.get("/:id", async (req, res) => {
  try {
    const getPostId = await SpecialOffersdata.findById(req.params.id);
    if (!getPostId) {
      return res.status(404).json({ message: "NOT FOUND" });
    }
    return res.json(getPostId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

//---------------- PUT/UPDATE --------------------
route.put("/:id", upload.single("image"), async (req, res) => {
    try {
      const post = await SpecialOffersdata.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "NOT FOUND" });
      }
  
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
  
      if (rating !== undefined) {
        const parsedRating = Number(rating);
        if (isNaN(parsedRating)) {
          return res.status(400).json({ message: "Invalid rating" });
        }
        post.rating = parsedRating;
      }
  
      if (thickness) post.thickness = thickness;
      if (stock) post.stock = stock;
      if (quantity !== undefined) {
        const parsedQty = Number(quantity);
        if (isNaN(parsedQty)) {
          return res.status(400).json({ message: "Invalid quantity" });
        }
        post.quantity = parsedQty;
      }
  
      if (sizes) {
        let parsedSizes = sizes;
        if (typeof sizes === "string") {
          try {
            parsedSizes = JSON.parse(sizes);
          } catch (err) {
            return res.status(400).json({ message: "Invalid sizes format" });
          }
        }
  
        if (!Array.isArray(parsedSizes)) {
          return res.status(400).json({ message: "Sizes should be an array" });
        } 
  
        post.sizes = parsedSizes.map((size) => {
          const price = Number(size.price);
          const original = Number(size.original);
          if (
            typeof size.label !== "string" ||
            isNaN(price) ||
            isNaN(original)
          ) {
            throw new Error("Invalid size entry");
          }
          return { label: size.label, price, original };
        });
      }
  
      if (req.file) {
        post.image = `${req.protocol}://${req.get("host")}/specialoffersUploads/${req.file.filename}`;
      }
  
      const updatedPost = await post.save();
      return res.json(updatedPost);
    } catch (error) {
      console.error("Update error:", error.message);
      return res.status(500).json({ message: error.message });
    }
  });
  

//---------------- DELETE --------------------
route.delete("/:id", async (req, res) => {
  try {
    const deleted = await SpecialOffersdata.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "NOT FOUND" });
    }
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

export default route;
