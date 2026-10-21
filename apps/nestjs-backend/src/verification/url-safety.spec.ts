import { describe, expect, it } from "vitest";
import { BadRequestException } from "@nestjs/common";
import { fetchPublicPage, normalizeSubmittedUrl } from "./url-safety";

describe("normalizeSubmittedUrl", () => {
  it("removes fragments and common tracking parameters", () => {
    expect(normalizeSubmittedUrl("https://example.com/product?utm_source=ad&id=7#details"))
      .toBe("https://example.com/product?id=7");
  });

  it.each(["file:///etc/passwd", "http://user:pass@example.com", "not-a-url"])("rejects unsafe URL form %s", (url) => {
    expect(() => normalizeSubmittedUrl(url)).toThrow(BadRequestException);
  });
});

describe("fetchPublicPage", () => {
  it.each(["http://127.0.0.1", "http://[::1]", "http://localhost"])("blocks local address %s before fetching", async (url) => {
    await expect(fetchPublicPage(url)).rejects.toThrow(/Không cho phép truy cập địa chỉ nội bộ|địa chỉ IP công khai/);
  });
});
