import express from "express";
import formidable from "express-formidable";

import { addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, formidable(), addProduct);
router
  .route("/:id")
  .put(authenticate, authorizeAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct);

export default router;
