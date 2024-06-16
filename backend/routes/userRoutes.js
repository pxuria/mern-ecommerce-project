import express from "express";
import { createUser } from "../controllers/userController";

const router = express.Router();

router.route("/").post(createUser);

export default router;
