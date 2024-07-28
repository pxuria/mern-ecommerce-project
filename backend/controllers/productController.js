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

export { addProduct, updateProduct, deleteProduct };
