const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const Image = require("../models/image");
const cloudinary = require("../config/coudinary");
const fs = require("fs");

const updImage = async (req, res) => {
  try {
    //check if image is provided or not
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }
    //upload image to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //store image url and public id in database
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo._id,
    });

    await newImage.save();
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUploadedImages = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("uploadedBy", "name email");

    if (images.length === 0) {
      res.status(404).json({  
        success: false,

        message: "No image found",
      });
    } else {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        limit: limit,
        message: "Image fetched successfully",
        data: {
          images,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteImage = async (req, res) => {
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo._id;
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    //check if image is uploaded by the user
    const isImageUploadedByUser = image.uploadedBy === userId;
    if (!isImageUploadedByUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }
    //delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  updImage,
  getUploadedImages,
  deleteImage,
};
