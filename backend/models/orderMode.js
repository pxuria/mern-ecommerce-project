import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  orderItems: [
    { name: { type: String, required: true } },
    { quantity: { type: Number, required: true } },
    { image: { type: String, required: true } },
    { price: { type: Number, required: true } },
    { product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Products" } },
  ],
});
