import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    images: [{ type: String }],
    isConfirmed: { type: Boolean, default: false },
    width: { type: Number, min: 0, required: true },
    color: { type: String, required: true },
    Meterage: { type: Number, required: true },
    threadType: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0, min: 0 },
    category: { type: ObjectId, ref: "Category", required: true },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
