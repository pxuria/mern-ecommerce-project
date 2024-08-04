import asyncHandler from "../middlewares/asyncHandler.js";
import Store from "../models/storeModel.js";

const getAllStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find({});
    res.status(200).json({ status: "success", results: stores.length, data: stores });
  } catch (error) {}
  console.log(error);
  res.status(400).json(error.message);
});

const createStore = asyncHandler(async (req, res) => {
  try {
    const { name, description, address, phoneNumber } = req.body;

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
    const store = new Store({ ...req.body, owner: req.user._id });
    await store.save();
    res.status(201).json({ status: "success ", data: { store } });
  } catch (error) {}
});

export { getAllStores, createStore };
