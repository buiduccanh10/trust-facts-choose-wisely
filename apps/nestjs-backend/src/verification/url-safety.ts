import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";
import { BadRequestException } from "@nestjs/common";

const MAX_REDIRECTS = 4;
const MAX_PAGE_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 8_000;

export async function fetchPublicPage(input: string): Promise<{ url: string; title: string; description: string; text: string }> {
  let current = normalizeUrl(input);
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertPublicHost(current.hostname);
    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: "text/html,text/plain;q=0.9", "User-Agent": "RightWISE/1.0 (+https://rightwise.app)" },
      });
    } catch {
      throw new BadRequestException("Trang liên kết không truy cập được hoặc đã hết thời gian chờ.");
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) throw new BadRequestException("Đường dẫn chuyển hướng quá nhiều lần hoặc không hợp lệ.");
      await response.body?.cancel();
      current = normalizeUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new BadRequestException(`Trang liên kết phản hồi HTTP ${response.status}.`);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new BadRequestException("Đường dẫn phải trỏ tới trang HTML hoặc văn bản công khai.");
    }
    const bytes = await readLimited(response, MAX_PAGE_BYTES);
    const html = new TextDecoder().decode(bytes);
    const $ = (await import("cheerio")).load(html);
    $("script,style,noscript,svg,iframe,nav,footer,header").remove();
    const title = $("meta[property='og:title']").attr("content") || $("title").text() || $("h1").first().text() || "";
    const description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content") || "";
    const text = `${title}\n${description}\n${$("body").text().replace(/\s+/g, " ").trim()}`.slice(0, 10_000);
    return { url: current.toString(), title: title.slice(0, 400), description: description.slice(0, 800), text };
  }
  throw new BadRequestException("Không thể tải trang liên kết.");
}

function normalizeUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new BadRequestException("URL không hợp lệ.");
  }
  if (!(["http:", "https:"].includes(url.protocol)) || url.username || url.password) {
    throw new BadRequestException("Chỉ chấp nhận URL HTTP/HTTPS công khai.");
  }
  if (!url.port || (url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) url.port = "";
  return url;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new BadRequestException("Không cho phép truy cập địa chỉ nội bộ.");
  }
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true }).catch(() => []);
  if (!addresses.length || addresses.some(({ address }) => {
    try {
      return ipaddr.parse(address).range() !== "unicast";
    } catch {
      return true;
    }
  })) {
    throw new BadRequestException("URL không phân giải tới địa chỉ IP công khai.");
  }
}

async function readLimited(response: Response, maxBytes: number): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new BadRequestException("Trang liên kết vượt quá giới hạn 2 MB.");
    }
    chunks.push(value);
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

export function normalizeSubmittedUrl(value: string): string {
  const url = normalizeUrl(value.trim());
  url.hash = "";
  ["utm_source", "utm_medium", "utm_campaign", "fbclid", "gclid"].forEach((key) => url.searchParams.delete(key));
  return url.toString();
}
