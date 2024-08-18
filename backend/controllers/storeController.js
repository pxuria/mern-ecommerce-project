import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";

// done
const getAllStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find({});
    if (!stores.length) return res.status(200).json({ status: "success", message: "there is no stores", data: [] });

    res.status(200).json({ status: "success", results: stores.length, data: stores });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const createStore = asyncHandler(async (req, res) => {
  const { name, description, address, phoneNumber } = req.body;

  const userId = req.headers.userid;

  const existingStore = await Store.findOne({ owner: userId });
  if (existingStore) return res.status(400).json({ message: "User already owns a store" });

  // validations
  switch (true) {
    case !name:
      return res.status(400).json({ error: "name is required" });
    case !description:
      return res.status(400).json({ error: "description is required" });
    case !address:
      return res.status(400).json({ error: "address is required" });
    case !phoneNumber:
      return res.status(400).json({ error: "phoneNumber is required" });
  }

  try {
    const store = new Store({ ...req.body, owner: userId });
    await store.save();

    // Update the user with the store reference
    const user = await User.findById(userId);
    user.isStoreOwner = true;
    user.store = store._id;
    await user.save();

    res.status(201).json({ status: "success ", data: store });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

// done
const deleteStore = asyncHandler(async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);

    if (store) {
      await Store.deleteOne({ _id: store._id });
      res.status(200).json({ status: "success", message: "store deleted" });
    } else {
      res.status(404);
      throw new Error("store not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// done
const getStore = asyncHandler(async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (store) {
      return res.status(200).json({ status: "success", data: store });
    } else {
      res.status(404);
      throw new Error("store not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("store not found.");
  }
});

const updateStore = asyncHandler(async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, address, description, phoneNumber, image } = req.body;

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    // Update the store fields if they are provided in the request
    if (name) store.name = name;
    if (address) store.address = address;
    if (description) store.description = description;
    if (phoneNumber) store.phoneNumber = phoneNumber;
    if (image) store.image = image;

    // Save the updated store
    const updatedStore = await store.save();
    res.status(200).json({
      status: "success",
      message: "Store updated successfully",
      data: updatedStore,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const getProductsByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const products = await Product.find({ store: storeId }).populate("store", "name address owner");
  const products2 = await Product.find({ store: storeId });
  console.log(products2);

  if (products && products.length >= 0)
    res.status(200).json({ status: "success", results: products.length, data: products });
  else {
    res.status(404);
    throw new Error("No products found for this store");
  }
});

export { getAllStores, createStore, deleteStore, getStore, updateStore, getProductsByStore };
