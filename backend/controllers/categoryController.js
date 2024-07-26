import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ status: "fail", message: "name is required" });

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return res.json({ error: "category already existed." });

    const category = await new Category({ name }).save();
    res.status(201).json({ status: "success", data: { category } });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });
    if (!category) return res.status(404).json({ status: "fail", message: "category not found" });

    category.name = name;
    const updatedCategory = await category.save();
    res.status(200).json({ status: "success", data: { updatedCategory } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error." });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json({ status: "success", message: "category deleted", data: removed });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error." });
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: "success", data: { categories } });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.categoryId });
    if (!category) res.status(404).json({ message: "category not found" });

    res.status(200).json({ status: "success", data: { category } });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export { createCategory, updateCategory, deleteCategory, getCategories, getCategory };
