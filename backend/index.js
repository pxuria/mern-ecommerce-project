//packages
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const port = process.env.PORT || 3000;
connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "/uploads");

if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true });

app.use("/uploads", express.static(uploadDir));


app.listen(port, () => console.log(`Server running on port: ${port}`));
