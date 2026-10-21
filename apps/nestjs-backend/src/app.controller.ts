import { Controller, Get } from "@nestjs/common";

@Controller("api/v1")
export class AppController {
  @Get("health")
  health() {
    return {
      status: "ok",
      provider: "Vercel AI Gateway",
      model: process.env.AI_GATEWAY_MODEL ?? "inclusionai/ling-3.0-flash-vl-free",
      configured: Boolean(process.env.AI_GATEWAY_API_KEY),
    };
  }

  @Get("catalog/categories")
  categories() {
    return { data: ["Nông sản", "Thực phẩm", "Đồ uống", "Thủ công mỹ nghệ", "Khác"] };
  }
}
