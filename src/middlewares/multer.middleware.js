import multer from "multer";
import path from "path";
import { formatFileDate } from "../utils/format-date.util.js";

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    switch (req.body.fileType) {
      case "profile":
        uploadPath = path.join(process.cwd(), "/src/public/profiles");
        break;
      case "product":
        uploadPath = path.join(process.cwd(), "/src/public/products");
        break;
      case "document":
        uploadPath = path.join(process.cwd(), "/src/public/documents");
        break;
      case "dni":
        uploadPath = path.join(process.cwd(), "/src/public/documents");
        break;
      case "addressDocument":
        uploadPath = path.join(process.cwd(), "/src/public/documents");
        break;
      case "accountDocument":
        uploadPath = path.join(process.cwd(), "/src/public/documents");
        break;
      default:
        return cb(new Error("Tipo de archivo no válido"));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s/g, "");
    cb(null, formatFileDate(Date.now()) + "-" + originalName);
  },
});

const upload = multer({ storage });

export default upload;
