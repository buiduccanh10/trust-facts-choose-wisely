/**
 * Cleans product name by removing brackets, quotes, and extra whitespace.
 */
export function cleanProductName(name?: string | null): string {
  if (!name) return "Chưa đọc rõ tên sản phẩm";
  return (
    name
      .replace(/\([^)]*\)/g, "")
      .replace(/[“”"']/g, "")
      .replace(/\s+/g, " ")
      .trim() || "Chưa đọc rõ tên sản phẩm"
  );
}

/**
 * Formats a simulator number with comma decimal separator if under 10, or rounded integer if >= 10.
 */
export function formatSimulatorNumber(value: number): string {
  return value >= 10
    ? String(Math.round(value))
    : String(Math.round(value * 10) / 10).replace(".", ",");
}

/**
 * Formats bytes to KB with minimum 1 KB.
 */
export function formatFileSizeKB(bytes?: number): number {
  return Math.max(1, Math.round((bytes ?? 0) / 1024));
}
