import express from "express";
import formidable from "express-formidable";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getAllProducts,
  addProductReview,
  getTopProducts,
  getNewProducts,
  getProductsByUser,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();
router.route("/").get(getProducts).post(authenticate, formidable(), addProduct);

router.route("/all-products").get(getAllProducts);
router.route("/top-products").get(getTopProducts);
router.route("/new-products").get(getNewProducts);
router.route("/my-products/:userId").get(authenticate, getProductsByUser);

router
  .route("/:id")
  .put(authenticate, formidable(), updateProduct)
  .delete(authenticate, deleteProduct)
  .get(getProduct);

router
  .route("/:id/reviews")
  .post(authenticate, authorizeAdmin, checkId, addProductReview);

export default router;
