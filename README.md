# RightWISE

RightWISE helps shoppers inspect Vietnamese product labels and find product, producer, and OCOP information through Google Search. It presents reported information without treating a search result as a legal certification decision.

## Workspace

- `apps/nextjs-frontend`: Next.js App Router frontend. The original RightWISE visual style and marketing page are retained; the verification widget uses React and accessible Radix tabs.
- `apps/nestjs-backend`: NestJS API, image normalization, URL safety checks, MiniMax extraction, Google Search grounding with Tako Search fallback on Google HTTP 429, product and OCOP lookup, article-to-product information comparison, and 24-hour cache.
- Deploy each directory as a separate Vercel project from this repository.

## Requirements and local development

- Node.js 20.19+ (22 LTS recommended)
- pnpm 12+
- An AI Gateway key for image and page extraction
- A Gemini API key with Google Search grounding enabled for product lookup
- Upstash Redis for a persistent 24-hour cache (required on Vercel)

```sh
pnpm install
cp apps/nestjs-backend/.env.example apps/nestjs-backend/.env
cp apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env.local
```

Set `AI_GATEWAY_API_KEY` and `GEMINI_API_KEY` in `apps/nestjs-backend/.env`. Start the API and web app in separate terminals:

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

## AI and search flow

The default extraction model is `minimax/minimax-m3.1-flash`, configured with `AI_GATEWAY_MODEL`. Image input extracts label fields and searches product/producer information plus OCOP records where available. URL input extracts product identity, searches for information about the closest matching product, and presents a full summary plus the single best matching result so users can compare it with the submitted article. Google Search is primary; if Google returns HTTP 429, the API retries with Tako Search through AI Gateway. `GEMINI_API_KEY` is separate from and never exposed alongside `AI_GATEWAY_API_KEY` in the browser.

Image-search results are transformed into product information for the result view; the UI does not display a source list. URL results show the submitted page and one best matching result alongside the product summary. This helps users compare the linked article with public information; it is not a legal determination that the entire article or product is true or legitimate.

Successful results are cached for 24 hours by SHA-256 fingerprint in Upstash Redis. Uploaded images and fetched page contents are processed in memory and are not persisted by the application. The cache stores the structured verification result and official evidence metadata. URL fetching only permits public HTTP(S) pages, revalidates redirects, rejects private IP ranges, limits response size/time, and strips active page content before extraction.

Google Search grounding is billed and quota-limited separately from the AI Gateway extraction request. Google currently includes 5,000 monthly grounding search requests across Gemini 3+ models, then bills per search query; one product lookup may trigger multiple queries, and the separate Gemini model call also has token pricing. Tako Search is called only after Google returns HTTP 429 and is billed separately by AI Gateway; its introductory free period ended September 30, 2026. Google AI Pro/Antigravity subscriptions do not supply a production Gemini API key or API quota. Configure provider limits and budgets before production launch. Set `TAKO_SEARCH_FALLBACK_ENABLED=false` to disable the fallback.

## Deploy to Vercel

Create two projects from the same Git repository:

### Web project

- Root Directory: `apps/nextjs-frontend`
- Framework preset: Next.js
- Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://<api-project-domain>`

### API project

- Root Directory: `apps/nestjs-backend`
- Framework preset: NestJS (Vercel detects `src/main.ts`)
- Set server-only variables for Preview and Production:
  - `AI_GATEWAY_API_KEY`
  - `AI_GATEWAY_MODEL=minimax/minimax-m3.1-flash`
  - `GEMINI_API_KEY`
  - `GOOGLE_SEARCH_MODEL=gemini-3.5-flash-lite`
  - `TAKO_SEARCH_FALLBACK_ENABLED=true`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - `WEB_ORIGIN=https://<web-project-domain>` (add approved preview origins comma-separated if needed)

Add these values in Vercel Project Settings; do not commit secrets. The API requires Upstash in Vercel to preserve cache behavior across serverless instances. Deploy the API first, then set the API URL on the web project and deploy the web project.
