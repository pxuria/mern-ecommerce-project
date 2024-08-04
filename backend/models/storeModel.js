import mongoose from "mongoose";

const storeSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    address: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String },
    image: { type: String },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
