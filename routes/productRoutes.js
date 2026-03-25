import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nextshop_products",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let image = req.body.image; 
    
    // If multer processed a file, use its path
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    const product = await Product.create({ name, description, price, image });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

router.get("/search/:key", async (req, res) => {
  const result = await Product.find({
    name: { $regex: req.params.key, $options: "i" },
  });
  res.json(result);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updateData = { name, description, price };
    
    if (req.body.image) updateData.image = req.body.image;
    if (req.file && req.file.path) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
