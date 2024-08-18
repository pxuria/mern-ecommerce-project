import Product from "../models/productModel.js";
import Store from "../models/storeModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      images,
      width,
      color,
      Meterage,
      threadType,
      description,
      price,
      category,
      store: storeId,
      owner,
    } = req.fields;

    if (!images || images.length === 0) return res.status(400).json({ message: "at least one image must be provided" });

    // validations
    switch (true) {
      case !name:
        return res.status(400).json({ error: "name is required" });
      case !color:
        return res.status(400).json({ error: "color is required" });
      case !Meterage:
        return res.status(400).json({ error: "Meterage is required" });
      case !width:
        return res.status(400).json({ error: "width is required" });
      case !description:
        return res.status(400).json({ error: "description is required" });
      case !category:
        return res.status(400).json({ error: "category is required" });
      case !price:
        return res.status(400).json({ error: "price is required" });
      case !threadType:
        return res.status(400).json({ error: "threadType is required" });
    }

    if (storeId) {
      const store = await Store.findById(storeId);
      if (!store) return res.status(404).json({ error: "Store not found" });

      // Check for duplicate product by name, store, color, and threadType
      const existingProduct = await Product.findOne({
        name,
        owner,
        color,
        threadType,
      });

      if (existingProduct)
        return res.status(400).json({
          error: "A product with the same name, store, color, and thread type already exists.",
        });
      store.products.push(product._id);
      await store.save();
    }

    const product = new Product({
      name,
      images,
      width,
      color,
      Meterage,
      threadType,
      description,
      price,
      category,
      store: storeId,
      owner,
    });
    console.log(product);
    await product.save();

    if (owner) {
      const user = await User.findById(owner);
      if (!user) return res.status(404).json({ error: "user not found" });

      user.products.push(product._id);
      await user.save();
    }

    res.status(201).json({ status: "success ", data: product });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, images, width, color, Meterage, threadType, description, price, category } = req.fields;

    if (!images || images.length === 0) return res.status(400).json({ message: "at least one image must be provided" });

    // validations
    switch (true) {
      case !name:
        return res.status(400).json({ error: "name is required" });
      case !color:
        return res.status(400).json({ error: "color is required" });
      case !Meterage:
        return res.status(400).json({ error: "Meterage is required" });
      case !width:
        return res.status(400).json({ error: "width is required" });
      case !description:
        return res.status(400).json({ error: "description is required" });
      // case !category:
      //   return res.status(400).json({ error: "category is required" });
      case !price:
        return res.status(400).json({ error: "price is required" });
      case !threadType:
        return res.status(400).json({ error: "threadType is required" });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true, runValidators: true }
    );
    // await product.save();
    res.json({ status: "success", data: product });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ status: "fail", message: "Product not found" });

    if (product.store)
      await Store.findByIdAndUpdate(product.store, {
        $pull: { products: product._id },
      });

    await User.findByIdAndUpdate(product.owner, {
      $pull: { products: product._id },
    });

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "product deleted", data: product });
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
    const products = await Product.find({
      ...keyword,
      isConfirmed: true,
    }).limit(pageSize);
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
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("owner", "username phoneNumber store isStoreOwner");
    if (product) {
      return res.status(200).json({ status: "success", data: product });
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
    const products = await Product.find({})
      .populate("category")
      .populate("owner", "username phoneNumber store isStoreOwner")
      .limit(100)
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
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
    const products = await Product.find({}).sort({ rating: -1 }).limit(10);
    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(10);
    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getProductsByUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ owner: userId });

    if (!products || products.length === 0) return res.status(404).json({ message: "No products found for this user" });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
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
  getProductsByUser,
};
