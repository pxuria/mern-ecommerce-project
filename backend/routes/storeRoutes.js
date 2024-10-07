import express from "express";
import {
  createStore,
  getAllStores,
  deleteStore,
  getStore,
  updateStore,
  getProductsByStore,
} from "../controllers/storeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllStores);
router.route("/:storeId").get(getStore);
router.get("/:storeId/products", getProductsByStore);

router.route("/").post(authenticate, createStore);
router
  .route("/:storeId")
  .put(authenticate, updateStore)
  .delete(authenticate, authorizeAdmin, deleteStore);

export default router;
