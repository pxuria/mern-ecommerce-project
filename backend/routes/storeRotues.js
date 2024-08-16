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
router.route("/").get(getAllStores).post(authenticate, createStore);
router
  .route("/:storeId")
  .get(getStore)
  .put(authenticate, updateStore)
  .delete(authenticate, authorizeAdmin, deleteStore);

router.get("/:storeId/products", getProductsByStore);

export default router;
