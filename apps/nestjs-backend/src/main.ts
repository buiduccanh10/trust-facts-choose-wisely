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

// Suppress benign AI SDK compatibility warnings from being logged to stderr
(globalThis as unknown as { AI_SDK_LOG_WARNINGS: boolean }).AI_SDK_LOG_WARNINGS = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rawOrigins = (process.env.WEB_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  app.enableCors({
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!requestOrigin) return callback(null, true);

      const cleanOrigin = requestOrigin.replace(/\/+$/, "");

      // If no WEB_ORIGIN configured, allow any vercel.app and localhost
      if (!rawOrigins.length) {
        if (cleanOrigin.endsWith(".vercel.app") || cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) {
          return callback(null, true);
        }
      }

      // Check against configured origins (exact match or wildcard)
      if (rawOrigins.includes("*") || rawOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow any Vercel deployment if WEB_ORIGIN contains a vercel.app domain
      if (cleanOrigin.endsWith(".vercel.app") && rawOrigins.some((o) => o.endsWith(".vercel.app"))) {
        return callback(null, true);
      }

      // Allow localhost in development
      if (cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) {
        return callback(null, true);
      }

      callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    exposedHeaders: ["*"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
