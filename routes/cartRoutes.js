import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "User ID required" });

  let cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) cart = await Cart.create({ userId, items: [] });
  res.json(cart);
});

router.post("/", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { productId, quantity } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });

  const existing = cart.items.find((item) => item.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ productId, quantity });

  await cart.save();
  res.json(cart);
});

router.put("/", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (item) item.quantity = quantity;

  await cart.save();
  res.json(cart);
});

router.delete("/:productId", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  await cart.save();
  res.json(cart);
});

export default router;
