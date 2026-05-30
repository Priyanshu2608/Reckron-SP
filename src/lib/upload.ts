import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

// Initialize Cloudinary if credentials exist
const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file (Buffer or Base64) to Cloudinary or falls back to local disk storage
 * @param fileBuffer The buffer of the file to save
 * @param fileName Original name of the file
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string): Promise<string> {
  if (isCloudinaryConfigured) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "reckron-sp",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Cloudinary returned empty result"));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to local storage:", error);
    }
  }

  // Fallback: Store locally in public/uploads/
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename to prevent overwrites
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext).replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save the file
    await fs.writeFile(filePath, fileBuffer);

    // Return the public web URL
    return `/uploads/${uniqueFileName}`;
  } catch (error) {
    console.error("Local storage upload failed:", error);
    throw new Error("Image upload failed");
  }
}
