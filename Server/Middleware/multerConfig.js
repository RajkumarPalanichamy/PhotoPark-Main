import multer from "multer";
import path from "path";
import { __dirname } from "../utils/dirnameHelper.js";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../specialoffersUploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
