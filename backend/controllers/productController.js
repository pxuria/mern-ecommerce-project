import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, category, price, quantity } = req.fields;

    // validations
    switch (true) {
      case !name:
        return res.status(400).json({ error: "name is required" });
      case !description:
        return res.status(400).json({ error: "description is required" });
      case !brand:
        return res.status(400).json({ error: "brand is required" });
      case !category:
        return res.status(400).json({ error: "category is required" });
      case !price:
        return res.status(400).json({ error: "price is required" });
      case !quantity:
        return res.status(400).json({ error: "quantity is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.status(201).json({ status: "success ", data: { product } });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, category, price, quantity } = req.fields;

    // validations
    switch (true) {
      case !name:
        return res.status(400).json({ error: "name is required" });
      case !description:
        return res.status(400).json({ error: "description is required" });
      case !brand:
        return res.status(400).json({ error: "brand is required" });
      case !category:
        return res.status(400).json({ error: "category is required" });
      case !price:
        return res.status(400).json({ error: "price is required" });
      case !quantity:
        return res.status(400).json({ error: "quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true });
    await product.save();
    res.json({ product });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "error", message: "product deleted", data: { product } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.status(200).json({
      status: "success",
      results: products.length,
      page: 1,
      pages: Math.ceil(count / pageSize),
      data: { products },
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json({ status: "success", data: { product } });
    } else {
      res.status(404);
      throw new Error("product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "product not found." });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate("category").limit(12).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", results: products.length, data: { products } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ status: "success", message: "review added", data: { review } });
    } else {
      res.status(404);
      throw new Error("product not found.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(1);
    res.status(200).json({ status: "success", data: { products } });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(10);
    res.status(200).json({ status: "success", results: products.length, data: { products } });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getAllProducts,
  addProductReview,
  getTopProducts,
  getNewProducts,
};
