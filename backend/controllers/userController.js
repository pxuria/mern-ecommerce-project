import User from "../models/userModel";
import asyncHandler from "../middlewares/asyncHandler";

const createUser = asyncHandler(async (req, res) => {
  res.send("hello");
});
const getUsers = async () => {};
const getUser = async () => {};
const deleteUser = async () => {};
const updateUser = async () => {};

export { createUser };
