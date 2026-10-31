import { IMAGE_COMPRESSION_OPTIONS } from "./constants";

/**
 * Compresses an image file for verification using browser-image-compression.
 * If compression fails, falls back to the original file.
 */
export async function compressImageForVerification(file: File): Promise<Blob | File> {
  try {
    const { default: compressImage } = await import("browser-image-compression");
    return await compressImage(file, IMAGE_COMPRESSION_OPTIONS);
  } catch (error) {
    // If client-side compression fails (e.g. unsupported web worker or format), fallback to original file
    console.warn("Client-side image compression failed, using original file:", error);
    return file;
  }
}
