import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configuration
cloudinary.config({
  cloud_name: process.env.Cloudinary_Cloud_Name || "dmoxnrknc",
  api_key: process.env.Cloudinary_API_Key || "849124255532861",
  api_secret: process.env.Cloudinary_API_Secret || "6hF2mut413C1zZ6x_cLPEyqb6eA",
});
export async function uploadOnCloudinary(filepath) {
  try {
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filepath);
    return response;
  } catch (error) {
    fs.unlinkSync(filepath);
    console.log("error uploading file", error);
    return null;
  }
}
