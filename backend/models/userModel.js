import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isStoreOwner: { type: Boolean, default: false },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
