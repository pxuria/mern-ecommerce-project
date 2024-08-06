import express from "express";
const router = express.Router();
import { createStore, getAllStores, deleteStore, getStore, updateStore } from "../controllers/storeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, authorizeAdmin, getAllStores).post(authenticate, createStore);
router.route("/:storeId").get(authenticate, getStore).put(authenticate, updateStore).delete(authenticate, deleteStore);

export default router;
