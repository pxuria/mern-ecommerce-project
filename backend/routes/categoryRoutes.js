import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/categories").get(getCategories);
router
  .route("/:categoryId")
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory)
  .get(getCategory);

export default router;
