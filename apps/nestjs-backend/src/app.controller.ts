import { Controller, Get } from "@nestjs/common";

@Controller("api/v1")
export class AppController {
  @Get("health")
  health() {
    return {
      status: "ok",
      extractionProvider: "Vercel AI Gateway",
      extractionModel: process.env.AI_GATEWAY_MODEL ?? "minimax/minimax-m3.1-flash",
      extractionConfigured: Boolean(process.env.AI_GATEWAY_API_KEY),
      searchProvider: "Tako Search via AI Gateway",
      searchModel: process.env.AI_GATEWAY_MODEL ?? "minimax/minimax-m3.1-flash",
      searchConfigured: Boolean(process.env.AI_GATEWAY_API_KEY),
      searchFallbackConfigured: Boolean(process.env.AI_GATEWAY_API_KEY),
    };
  }

  @Get("catalog/categories")
  categories() {
    return { data: ["Nông sản", "Thực phẩm", "Đồ uống", "Thủ công mỹ nghệ", "Khác"] };
  }
}
