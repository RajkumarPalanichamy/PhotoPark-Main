import SpecialOffersdata from "../models/specialoffers.js";

// Helper to parse sizes safely
const parseSizes = (sizes) => {
  if (typeof sizes === "string") {
    sizes = JSON.parse(sizes);
  }

  return sizes.map((size) => {
    const price = Number(size.price);
    const original = Number(size.original);
    if (isNaN(price) || isNaN(original)) {
      throw new Error("Invalid numeric input in sizes");
    }
    return { label: size.label, price, original };
  });
};

// POST
export const createSpecialOffer = async (req, res) => {
  try {
    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/specialoffersUploads/${req.file.filename}`
      : null;

    const parsedSizes = parseSizes(sizes);
    const parsedRating = Number(rating);

    const newPost = new SpecialOffersdata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      image,
      quantity,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
export const getAllSpecialOffers = async (req, res) => {
  try {
    const posts = await SpecialOffersdata.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
export const getSpecialOfferById = async (req, res) => {
  try {
    const post = await SpecialOffersdata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT
export const updateSpecialOffer = async (req, res) => {
  try {
    const post = await SpecialOffersdata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) throw new Error("Invalid rating");
      post.rating = parsedRating;
    }
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity !== undefined) {
      const parsedQty = Number(quantity);
      if (isNaN(parsedQty)) throw new Error("Invalid quantity");
      post.quantity = parsedQty;
    }

    if (sizes) post.sizes = parseSizes(sizes);

    if (req.file) {
      post.image = `${req.protocol}://${req.get("host")}/specialoffersUploads/${req.file.filename}`;
    }

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteSpecialOffer = async (req, res) => {
  try {
    const deleted = await SpecialOffersdata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "NOT FOUND" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
