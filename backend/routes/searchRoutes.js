import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const router = express.Router();
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { query } = req.query;
    console.log(query);

    if (!query) return res.status(400).json({ status: "fail", message: "Search query is required" });

    try {
      // Find products matching the query
      const products = await Product.find({ $text: { $search: query } }, { score: { $meta: "textScore" } }).sort({
        score: { $meta: "textScore" },
      });

      res.status(200).json({ status: "success", length: products.length, data: products });
    } catch (error) {
      res.status(500).json({ status: "fail", message: "Server error occurred" });
    }
  })
);

export default router;
