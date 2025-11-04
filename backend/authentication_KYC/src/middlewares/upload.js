import multer from "multer";
import fs from "fs-extra";

const uploadDir = "uploads/kyc";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const uploadKYCFiles = upload.fields([
  { name: "driver_license", maxCount: 1 },
  { name: "national_id", maxCount: 1 },
]);
