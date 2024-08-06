import mongoose, { mongo } from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    brand: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    width: { type: Number, min: 0, required: true },
    weight: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value !== undefined || this.length !== undefined;
        },
        message: `Either weight or length must be provided`,
      },
    },
    length: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value !== undefined || this.weight !== undefined;
        },
        message: `Either weight or length must be provided`,
      },
    },
    category: { type: ObjectId, ref: "Category", required: true },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0, min: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
