import { Controller, Post, UploadedFile, UseInterceptors, Body, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { memoryStorage } from "multer";
import { z } from "zod";
import { VerificationService } from "./verification.service";

const UrlBody = z.object({ url: z.string().min(1).max(2_048) }).strict();

@Controller("api/v1/verifications")
export class VerificationController {
  constructor(private readonly verification: VerificationService) {}

  @Post("image")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024, files: 1 },
    fileFilter: (_request, file, callback) => {
      const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/avif", "image/tiff"]);
      callback(allowed.has(file.mimetype) ? null : new BadRequestException("Chỉ hỗ trợ JPEG, PNG, WebP, HEIC hoặc AVIF."), allowed.has(file.mimetype));
    },
  }))
  async image(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Vui lòng chọn ảnh nhãn sản phẩm.");
    return { data: await this.verification.verifyImage(file) };
  }

  @Post("url")
  async url(@Body() body: unknown) {
    const parsed = UrlBody.safeParse(body);
    if (!parsed.success) throw new BadRequestException("Vui lòng cung cấp URL hợp lệ.");
    return { data: await this.verification.verifyUrl(parsed.data.url) };
  }
}
