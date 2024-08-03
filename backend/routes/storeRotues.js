import express from "express";
const router = express.Router();
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, authorizeAdmin).post(authenticate);
router
  .route("/:storeId")
  .get(authenticate)
  .put(authenticate)
  .delete(authenticate);

export default router;
