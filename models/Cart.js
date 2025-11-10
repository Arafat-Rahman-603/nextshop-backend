import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // from Clerk frontend
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
