import axios from "axios";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import createToken from "../utils/craeteToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, phoneNumber, isAdmin } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = new User({ username, email, password, phoneNumber, isAdmin });

  await newUser.save();
  const token = createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    isStoreOwner: newUser.isStoreOwner,
    token,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    // User not found
    res.status(404); // Unauthorized
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await existingUser.matchPassword(password);
  if (!isPasswordValid) {
    // Password is incorrect
    res.status(401); // Unauthorized
    throw new Error("Invalid email or password.");
  }

  try {
    const token = createToken(res, existingUser._id);

    res.status(200).json({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500);
    throw new Error("internal server error.");
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", results: users.length, data: { users } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isStoreOwner: user.isStoreOwner,
      store: user.isStoreOwner ? user.store : null,
      products: user.products,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.isStoreOwner) user.isStoreOwner = req.body.isStoreOwner;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isStoreOwner: updatedUser.isStoreOwner,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete the admin user.");
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ status: "success", message: "user deleted" });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, isStoreOwner, password, phoneNumber } = req.body;
  // const user = await User.findById(id).select("-password");
  const update = {
    ...(username && { username }),
    ...(email && { email }),
    ...(password && { password }),
    ...(phoneNumber && { phoneNumber }),
    ...(typeof isStoreOwner !== "undefined" && {
      isStoreOwner: Boolean(isStoreOwner),
    }),
  };

  // If the password is being updated, hash it before updating
  if (password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, update, {
    new: true,
    select: "-password",
  });

  if (updatedUser) {
    if (password) createToken(res, updatedUser._id);

    res.status(200).json({
      status: "success",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        password: updatedUser.password,
        phoneNumber: updatedUser.phoneNumber,
        isAdmin: updatedUser.isAdmin,
        isStoreOwner: updatedUser.isStoreOwner,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }

  // const user = await User.findById(id);

  // const isUserPassword = await user.matchPassword(password);
  // console.log(isUserPassword);

  // if (user) {
  // if (isUserPassword)
  //   return res
  //     .status(400)
  //     .json({ status: "fail", message: "this is your current password" });

  // username = username || user.username;
  // email = email || user.email;
  // password = password || user.password;
  // phoneNumber = phoneNumber || user.phoneNumber;

  // if (isStoreOwner) user.isStoreOwner = Boolean(isStoreOwner);

  // const updatedUser = await user.save();
  // console.log(updatedUser);

  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       _id: updatedUser._id,
  //       username: updatedUser.username,
  //       email: updatedUser.email,
  //       password: updatedUser.password,
  //       phoneNumber: updatedUser.phoneNumber,
  //       isAdmin: updatedUser.isAdmin,
  //       isStoreOwner: updatedUser.isStoreOwner,
  //     },
  //   });
  // } else {
  //   res.status(404);
  //   throw new Error("user not found.");
  // }
});

const getProductsByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const products = await Product.find({ owner: id });

  if (products) res.status(200).json({ status: "success", results: products.length, data: products });
  else {
    res.status(404);
    throw new Error("No products found for this user");
  }
});

const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Phone number is required.");
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Generate a 4 or 6-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Set OTP expiry to 2 minutes
  const otpExpiresIn = new Date(Date.now() + 2 * 60 * 1000);

  // Update user with the generated OTP and expiry time
  user.otp = otp;
  user.otpExpiresIn = otpExpiresIn;
  await user.save();

  try {
    var data = JSON.stringify({
      mobile: phoneNumber,
      templateId: 100000,
      parameters: [
        {
          name: "code",
          value: otp,
        },
      ],
    });

    const headers = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY,
      },
    };

    const response = await axios.post("https://api.sms.ir/v1/send/verify", data, headers);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.otpExpiresIn < Date.now()) {
    res.status(400);
    throw new Error("کد نامعتبر است. لطفا دوباره ارسال نمایید.");
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error("کد شما با کد ارسال شده تطابق ندارد.");
  }

  // OTP verified, mark user as verified and log them in
  user.isPhoneVerified = true;
  user.otp = undefined;
  user.otpExpiresIn = undefined;
  await user.save();

  // Generate JWT token for the user
  const token = createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    phoneNumber: user.phoneNumber,
    token,
  });
});

export {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getProductsByUserId,
  getUserById,
  loginUser,
  logoutCurrentUser,
  sendOtp,
  updateCurrentUserProfile,
  updateUserById,
  verifyOtp,
};
