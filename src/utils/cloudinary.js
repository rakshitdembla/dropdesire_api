import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (e) {
    console.log("Error in uploading on cloudinary");
    return null;
  } finally {
    fs.unlinkSync(localFilePath);
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return false;

  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response?.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return false;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
