import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/my-orders").get(authenticate, getUserOrders);

export default router;
