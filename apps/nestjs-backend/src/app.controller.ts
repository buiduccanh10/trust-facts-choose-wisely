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
      searchProvider: "Google Search grounding with Tako Search fallback on HTTP 429",
      searchModel: process.env.GOOGLE_SEARCH_MODEL ?? "gemini-3.5-flash-lite",
      searchConfigured: Boolean(process.env.GEMINI_API_KEY),
      searchFallbackConfigured: Boolean(process.env.AI_GATEWAY_API_KEY),
    };
  }

  @Get("catalog/categories")
  categories() {
    return { data: ["Nông sản", "Thực phẩm", "Đồ uống", "Thủ công mỹ nghệ", "Khác"] };
  }
}
