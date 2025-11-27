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
    const { name, description, price, image } = req.body;

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

export default router;
