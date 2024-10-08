import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");

console.log(`Upload Directory: ${uploadDir}`);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory at ${uploadDir}`);
}

export default uploadDir;
