import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { AiGatewayService, type ProductExtraction, type SourceEvidence, isOfficialSource } from "../ai/ai-gateway.service";
import { CacheService } from "../cache/cache.service";
import { buildVerification } from "./match-evidence";
import { fetchPublicPage, normalizeSubmittedUrl } from "./url-safety";
import type { VerificationResponse } from "./verification.types";

@Injectable()
export class VerificationService {
  constructor(private readonly ai: AiGatewayService, private readonly cache: CacheService) {}

  async verifyImage(file: Express.Multer.File): Promise<VerificationResponse> {
    if (!file?.buffer?.length) throw new BadRequestException("Ảnh tải lên rỗng hoặc không hợp lệ.");
    if (file.size > 4 * 1024 * 1024) throw new BadRequestException("Ảnh sau khi nén vượt quá giới hạn 4 MB.");
    const image = await this.normalizeImage(file.buffer);
    const key = `verification:image:${this.sha256(image)}`;
    const cached = await this.cache.get<VerificationResponse>(key);
    if (cached) return cached;

    const extracted = await this.ai.extractImage(image);
    const { evidence, error } = await this.findEvidence(extracted);
    const response = buildVerification(extracted, evidence, error);
    await this.cache.set(key, response);
    return response;
  }

  async verifyUrl(inputUrl: string): Promise<VerificationResponse> {
    if (!inputUrl?.trim()) throw new BadRequestException("Vui lòng cung cấp URL sản phẩm.");
    const normalizedUrl = normalizeSubmittedUrl(inputUrl);
    const key = `verification:url:${this.sha256(normalizedUrl)}`;
    const cached = await this.cache.get<VerificationResponse>(key);
    if (cached) return cached;

    const page = await fetchPublicPage(normalizedUrl);
    const extracted = await this.ai.extractPage(`URL: ${page.url}\nTiêu đề: ${page.title}\nMô tả: ${page.description}\nNội dung: ${page.text}`);
    const sourceEvidence: SourceEvidence[] = isOfficialSource(page.url)
      ? [{ title: page.title || page.url, url: page.url, excerpt: page.text.slice(0, 1_500), retrievedAt: new Date().toISOString() }]
      : [];
    const { evidence, error } = await this.findEvidence(extracted, sourceEvidence);
    const response = buildVerification(extracted, evidence, error);
    await this.cache.set(key, response);
    return response;
  }

  private async findEvidence(extracted: ProductExtraction, initial: SourceEvidence[] = []): Promise<{ evidence: SourceEvidence[]; error?: string }> {
    try {
      const evidence = await this.ai.searchOfficialSources(extracted);
      const merged = [...initial, ...evidence];
      const seen = new Set<string>();
      return { evidence: merged.filter((item) => !seen.has(item.url) && Boolean(seen.add(item.url))).slice(0, 4) };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) return { evidence: initial, error: error.message };
      return { evidence: initial, error: "Tra cứu nguồn OCOP tạm thời không khả dụng." };
    }
  }

  private async normalizeImage(input: Buffer): Promise<Buffer> {
    try {
      const image = sharp(input, { failOn: "error", limitInputPixels: 40_000_000 });
      const metadata = await image.metadata();
      if (!["jpeg", "png", "webp", "tiff", "heif", "avif"].includes(metadata.format ?? "")) {
        throw new BadRequestException("Chỉ hỗ trợ ảnh JPEG, PNG, WebP, HEIC hoặc AVIF.");
      }
      return await image.rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException("Không đọc được ảnh. Hãy thử JPG, PNG hoặc WebP.");
    }
  }

  private sha256(value: Buffer | string): string {
    return createHash("sha256").update(value).digest("hex");
  }
}
