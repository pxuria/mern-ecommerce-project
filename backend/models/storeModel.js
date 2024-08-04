import mongoose from "mongoose";

const storeSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    address: { type: String, required: true, trim: true },
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

const store = mongoose.model("Store", storeSchema);
export default store;
