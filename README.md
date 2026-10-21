# RightWISE

RightWISE helps shoppers inspect Vietnamese product labels and compare OCOP claims with evidence linked from official government domains. A result without sufficient evidence is reported as **unverified**, not as fake or authentic.

## Workspace

- `apps/web`: Next.js App Router frontend. The original RightWISE visual style and marketing page are retained; the verification widget uses React and accessible Radix tabs.
- `apps/api`: NestJS API, image normalization, URL safety checks, Vercel AI Gateway extraction/search, evidence matching, and 24-hour cache.
- Deploy each directory as a separate Vercel project from this repository.

## Requirements and local development

- Node.js 20.19+ (22 LTS recommended)
- pnpm 12+
- An AI Gateway key for live verification
- Upstash Redis for a persistent 24-hour cache (required on Vercel)

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set `AI_GATEWAY_API_KEY` in `apps/api/.env`. Start the API and web app in separate terminals:

```sh
pnpm dev:api
pnpm dev:web
```

The API listens on `http://localhost:3000`; the web app listens on `http://localhost:3001`. API routes:

- `GET /api/v1/health`
- `GET /api/v1/catalog/categories`
- `POST /api/v1/verifications/image` (`multipart/form-data`, field `file`)
- `POST /api/v1/verifications/url` (`application/json`, `{ "url": "https://..." }`)

Run checks:

```sh
pnpm typecheck
pnpm test
pnpm build:api
pnpm build:web
```

## AI and evidence policy

The default vision model is `inclusionai/ling-3.0-flash-vl-free`. The API enforces a model ID ending in `-free` and pins inference to Novita; it does not silently fall back to a paid model. When the free route is throttled or unavailable, verification returns a retry-later error. `AI_GATEWAY_API_KEY` stays in the NestJS deployment and is never exposed to the browser.

The model only extracts label fields. Search is used only when a result is not cached; only result URLs under `gov.vn` or its subdomains are retained as evidence. Application code checks product, producer/brand, and OCOP star text before returning a verified result. The search result is supporting evidence, not a legal registry; users are directed to open and check the original source. No match means “unverified”, not “not certified”.

Successful results are cached for 24 hours by SHA-256 fingerprint in Upstash Redis. Uploaded images and fetched page contents are processed in memory and are not persisted by the application. The cache stores the structured verification result and official evidence metadata. URL fetching only permits public HTTP(S) pages, revalidates redirects, rejects private IP ranges, limits response size/time, and strips active page content before extraction.

A free vision model does not guarantee higher throughput than Gemini. Google AI Pro/Antigravity subscriptions provide coding-agent product entitlements; they do not provide a supported, production Gemini API quota for this application. Model and search quotas are separate from any Antigravity subscription. Browser search is a paid-per-use tool (currently listed at $7 per 1,000 searches in AI Gateway); configure spend limits and do not enable auto top-up. Check current provider availability and pricing before production launch.

## Deploy to Vercel

Create two projects from the same Git repository:

### Web project

- Root Directory: `apps/web`
- Framework preset: Next.js
- Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://<api-project-domain>`

### API project

- Root Directory: `apps/api`
- Framework preset: NestJS (Vercel detects `src/main.ts`)
- Set server-only variables for Preview and Production:
  - `AI_GATEWAY_API_KEY`
  - `AI_GATEWAY_MODEL=minimax/minimax-m3.1-flash`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - `WEB_ORIGIN=https://<web-project-domain>` (add approved preview origins comma-separated if needed)

Add these values in Vercel Project Settings; do not commit secrets. The API requires Upstash in Vercel to preserve cache behavior across serverless instances. `apps/api/vercel.json` raises the verification function duration to 60 seconds. Deploy the API first, then set the API URL on the web project and deploy the web project.
