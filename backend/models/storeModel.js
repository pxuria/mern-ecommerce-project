import mongoose from "mongoose";

const storeSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: {
    city: { type: String, required: true },
    province: { type: String, required: true },
    address: { type: String, required: true },
  },
  description: { type: String },
  phoneNumber: { type: Number, required: true },
  email: { type: String },
  products: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const store = mongoose.model("Store", storeSchema);
export default store;
