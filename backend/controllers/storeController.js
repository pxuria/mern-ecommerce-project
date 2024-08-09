import asyncHandler from "../middlewares/asyncHandler.js";
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";

// done
const getAllStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find({});
    if (!stores.length) return res.status(200).json({ status: "success", data: "there is no stores" });

    res.status(200).json({ status: "success", results: stores.length, data: stores });
  } catch (error) {}
  console.log(error);
  res.status(400).json(error.message);
});

const createStore = asyncHandler(async (req, res) => {
  const { name, description, address, phoneNumber } = req.body;
  const userId = req.user._id;

  const existingStore = await Store.findOne({ owner: userId });
  if (existingStore) return res.status(400).json({ message: "User already owns a store" });

  try {
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
    res.status(400).json(error.message);
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
      return res.status(200).json({ status: "success", data: { store } });
    } else {
      res.status(404);
      throw new Error("store not found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "store not found." });
  }
});

const updateStore = asyncHandler(async (req, res) => {
  try {
    const { name, address, description, phoneNumber, email, image } = req.body;
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

export { getAllStores, createStore, deleteStore, getStore, updateStore };
