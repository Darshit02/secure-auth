const clodinary = require("../config/coudinary");

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await clodinary.uploader.upload(filepath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = {
  uploadToCloudinary,
};
