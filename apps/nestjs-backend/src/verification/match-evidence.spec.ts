import { describe, expect, it } from "vitest";
import { isOfficialSource, type ProductExtraction, type SourceEvidence } from "../ai/ai-gateway.service";
import { buildVerification } from "./match-evidence";

const label: ProductExtraction = {
  brand: "Hợp tác xã Măng Đen",
  manufacturer: "Hợp tác xã Măng Đen",
  address: "Xã Măng Đen, huyện Kon Plông, tỉnh Kon Tum",
  productName: "Rượu sim Măng Đen",
  location: "Kon Tum",
  claimedStars: 4,
  hasOcopLogo: true,
  hasQrCode: null,
  rawTextSummary: "Nhãn ghi sản phẩm OCOP 4 sao.",
};

const official: SourceEvidence = {
  title: "Rượu sim Măng Đen đạt OCOP 4 sao",
  url: "https://kontum.gov.vn/tin-tuc/ruou-sim",
  excerpt: "Hợp tác xã Măng Đen tại Kon Tum có sản phẩm Rượu sim Măng Đen đạt OCOP 4 sao.",
  retrievedAt: "2026-10-21T00:00:00.000Z",
};

describe("buildVerification", () => {
  it("accepts HTTPS government domains and rejects lookalike hosts", () => {
    expect(isOfficialSource("https://province.gov.vn/ocop")).toBe(true);
    expect(isOfficialSource("https://gov.vn.example.com/ocop")).toBe(false);
    expect(isOfficialSource("http://province.gov.vn/ocop")).toBe(false);
  });

  it("confirms only a matching record from an official government domain", () => {
    const response = buildVerification(label, [official]);
    expect(response.status).toBe("verified");
    expect(response.evidence).toEqual([official]);
    expect(response.local_ocop_record.official_stars).toBe(4);
  });

  it("ignores matching-looking evidence from non-government domains", () => {
    const response = buildVerification(label, [{ ...official, url: "https://ocop-example.com/record" }]);
    expect(response.status).toBe("unverified");
    expect(response.evidence).toEqual([]);
    expect(response.local_ocop_record.is_certified).toBeNull();
  });

  it("reports a star mismatch as a conflict without implying fraud", () => {
    const response = buildVerification(label, [{ ...official, title: "Rượu sim Măng Đen đạt OCOP 3 sao", excerpt: "Hợp tác xã Măng Đen tại Kon Tum có sản phẩm Rượu sim Măng Đen đạt OCOP 3 sao." }]);
    expect(response.status).toBe("conflict");
    expect(response.verdict.severity).toBe("warning");
    expect(response.comparison_text).toContain("không thể kết luận sản phẩm giả");
  });

  it("does not conclude when the official result lacks a matching entity", () => {
    const response = buildVerification(label, [{ ...official, excerpt: "Một sản phẩm khác đạt OCOP 4 sao." }]);
    expect(response.status).toBe("unverified");
  });

  it("does not conclude when a provided label locality is absent from the official excerpt", () => {
    const response = buildVerification(label, [{ ...official, excerpt: "Hợp tác xã Măng Đen có sản phẩm Rượu sim Măng Đen đạt OCOP 4 sao." }]);
    expect(response.status).toBe("unverified");
  });
});
