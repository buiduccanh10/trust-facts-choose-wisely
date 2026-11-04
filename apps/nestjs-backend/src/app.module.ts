import { Module } from "@nestjs/common";
import { CacheService } from "./cache/cache.service";
import { AiGatewayService } from "./ai/ai-gateway.service";
import { AppController } from "./app.controller";
import { VerificationController } from "./verification/verification.controller";
import { VerificationService } from "./verification/verification.service";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsService } from "./metrics/metrics.service";

@Module({
  controllers: [AppController, VerificationController, MetricsController],
  providers: [CacheService, AiGatewayService, VerificationService, MetricsService],
})
export class AppModule {}
