import express from "express";
const router = express.Router();
import {
  createStore,
  getAllStores,
  deleteStore,
  getStore,
  updateStore,
  getProductsByStore,
} from "../controllers/storeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").get(getAllStores).post(authenticate, createStore);
router
  .route("/:storeId")
  .get(authenticate, getStore)
  .put(authenticate, updateStore)
  .delete(authenticate, deleteStore);

router.get("/:storeId/products", getProductsByStore);

export default router;
