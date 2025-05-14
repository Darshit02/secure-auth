const express = require("express");
const { updImage, getUploadedImages, deleteImage } = require("../controllers/image-storage");
const isAdminUser = require("../middleware/admin-middleware");
const authMiddleware = require("../middleware/auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  updImage
);

router.get("/get-images", authMiddleware, getUploadedImages);
router.delete("/del-image/:id", authMiddleware, isAdminUser, deleteImage);


module.exports = router;
