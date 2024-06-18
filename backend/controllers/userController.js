import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  if (!username || !email || !password)
    throw new Error("please fill the inputs");

  const userExists = await User.findOne({ email });
  if (userExists)
    res.status(400).json({ status: "fail", message: "user alreaduy existed" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "new user created",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        // password: newUser.password,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error("please provide a new user");
  }
});
// const getUsers = async () => {};
// const getUser = async () => {};
// const deleteUser = async () => {};
// const updateUser = async () => {};

export { createUser };
