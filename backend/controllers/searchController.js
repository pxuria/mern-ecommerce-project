// controllers/searchController.js

import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) return res.status(400).json({ message: "Please provide a search query" });

  try {
    // Search products by name, brand, or description
    const products = await Product.find({
      $or: [
        { name: new RegExp(query, "i") }, // Search by product name
        { brand: new RegExp(query, "i") }, // Search by brand
        { description: new RegExp(query, "i") }, // Search by description
      ],
    });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred while searching");
  }
});

export default searchProducts;
