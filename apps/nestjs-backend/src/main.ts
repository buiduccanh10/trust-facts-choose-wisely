import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Local development starts from the API package, while the shared .env lives
// at the repository root. Vercel-injected variables take precedence because
// dotenv does not overwrite existing process environment values by default.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.WEB_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);
  if (process.env.VERCEL && !allowedOrigins?.length) {
    throw new Error("WEB_ORIGIN must be configured on Vercel.");
  }
  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : ["http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
