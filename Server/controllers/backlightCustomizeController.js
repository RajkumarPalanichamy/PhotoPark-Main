import BacklightCustomizedata from "../models/backlightcustomize.js";
import path from "path";

const ALLOWED_SHAPES = ["Portrait", "Landscape", "Square"];

export const createBacklightCustomize = async (req, res) => {
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

    const parsedSizes = sizes.map(size => {
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
      ? `${req.protocol}://${req.get("host")}/backlightcustomizeUploads/${req.file.filename}`
      : null;

    const posting = new BacklightCustomizedata({
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
    console.error("Backlight Customize POST error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllBacklightCustomize = async (req, res) => {
  try {
    const getPost = await BacklightCustomizedata.find();
    return res.json(getPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBacklightCustomizeById = async (req, res) => {
  try {
    const getPostId = await BacklightCustomizedata.findById(req.params.id);
    if (!getPostId) return res.status(404).json({ message: "NOT FOUND" });
    return res.json(getPostId);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadBacklightImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `${req.protocol}://${req.get("host")}/backlightcustomizeUploads/${req.file.filename}`;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBacklightCustomize = async (req, res) => {
  try {
    const post = await BacklightCustomizedata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

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
      post.sizes = parsedSizes.map(size => {
        const price = Number(size.price);
        const original = Number(size.original);
        if (isNaN(price) || isNaN(original)) {
          throw new Error("Invalid numeric input in sizes");
        }
        return { label: size.label, price, original };
      });
    }

    if (req.file) {
      post.uploadedImageUrl = `${req.protocol}://${req.get("host")}/backlightcustomizeUploads/${req.file.filename}`;
    }

    const UpdatedPost = await post.save();
    return res.json(UpdatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBacklightCustomize = async (req, res) => {
  try {
    const deleted = await BacklightCustomizedata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "NOT FOUND" });
    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
