import path from "path";
import express from "express";
import multer from "multer";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  // const filetypes = /jpe?g|png|webp/;
  // const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  // const extname = path.extname(file.originalname).toLowerCase();
  // const mimetype = file.mimetype;

  if (mimetype && extname)
    return cb(null, true);
  else
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif).'));

  // if (filetypes.test(extname) && mimetypes.test(mimetype)) {
  //   cb(null, true);
  // } else {
  //   cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
  // }
};

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
});

// @route   POST /api/upload/image-uploader
router.route("/").post((req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      res.status(400).json({ status: "fail", message: err.message })
    } else if (req.files && req.files.length > 0) {
      const filePaths = req.files.map(file => `/${file.path}`);

      res.status(201).json({
        status: "success",
        message: "images uploaded successfully",
        images: filePaths
      });
    } else {
      res.status(400).json({ status: "fail", message: "no image files provided" });
    }
  })
});

export default router;
