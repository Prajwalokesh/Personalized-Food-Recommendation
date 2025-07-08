import path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFileId = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    const fileName = `${uniqueFileId}${extension}`;
    file.filename = fileName;
    req.file = file;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
export default upload;
