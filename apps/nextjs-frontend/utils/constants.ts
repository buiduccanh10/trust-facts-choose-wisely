export const MAX_FILE_BYTES = 12 * 1024 * 1024; // 12 MB

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const API_TIMEOUT_MS = 60000;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/avif",
  "image/tiff",
];

export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1280,
  useWebWorker: true,
  fileType: "image/jpeg",
};
