import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => res.send("✅ NextShop Backend Running!"));

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
