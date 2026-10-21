import { Module } from "@nestjs/common";
import { CacheService } from "./cache/cache.service";
import { AiGatewayService } from "./ai/ai-gateway.service";
import { AppController } from "./app.controller";
import { VerificationController } from "./verification/verification.controller";
import { VerificationService } from "./verification/verification.service";

@Module({
  controllers: [AppController, VerificationController],
  providers: [CacheService, AiGatewayService, VerificationService],
})
export class AppModule {}
