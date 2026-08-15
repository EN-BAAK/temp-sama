import multer, { Options } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { MimeType } from "../types/variables";

const ALLOWED_MIME_TYPES: MimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const PROPERTIES_DIR = "uploads/properties";

if (!fs.existsSync(PROPERTIES_DIR)) {
  fs.mkdirSync(PROPERTIES_DIR, { recursive: true });
}

const imageFileFilter: Options["fileFilter"] = (_, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP images are allowed."));
  }
};

export const safeUnlink = (filePath?: string | null) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err);
    }
  }
};

const PropertiesStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, PROPERTIES_DIR);
  },
  filename: (_, file, cb) => {
    const safeExtension = ALLOWED_MIME_TYPES[file.mimetype] || path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${randomName}${safeExtension}`);
  },
});

export const uploadPropertyFiles = multer({
  storage: PropertiesStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 11,
  },
});