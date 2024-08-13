import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  // read jwt from the jwt cookie
  token = req.cookies.jwt || req.headers.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("failed authorized, token failed.");
    }
  } else {
    res.status(404);
    throw new Error("token not found.");
  }
});

// check for the admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not Authorized as an admin");
  }
};

export { authenticate, authorizeAdmin };
