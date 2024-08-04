import express from "express";
const router = express.Router();
import { createStore, getAllStores } from "../controllers/storeController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, authorizeAdmin, getAllStores).post(authenticate, createStore);
router.route("/:storeId").get(authenticate).put(authenticate).delete(authenticate);

export default router;
