import express from "express";
import formidable from "express-formidable";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getAllProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

router.route("/").get(getProducts).post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/all-products").get(getAllProducts);
router
  .route("/:id")
  .put(authenticate, authorizeAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct)
  .get(getProduct);

export default router;
