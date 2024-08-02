import mongoose from "mongoose";

const store = mongoose.Schema({
  name: { type: String, required: true },
});
