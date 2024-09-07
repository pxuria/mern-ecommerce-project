import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getProductsByUserId,
  getUserById,
  loginUser,
  logoutCurrentUser,
  sendOtp,
  updateCurrentUserProfile,
  updateUserById,
  verifyOtp,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/").post(createUser).get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route("/profile").get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile);

// OTP routes
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

//admin routes
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, getUserById)
  .put(authenticate, updateUserById);

router.route("/:id/products").get(authenticate, getProductsByUserId);

export default router;
