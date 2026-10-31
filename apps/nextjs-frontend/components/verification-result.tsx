import type { ReactNode } from "react";
import type { VerificationResultData } from "@/types/verification";
import { cleanProductName } from "@/utils/formatters";

export type { VerificationResultData };

function renderFormattedInline(text: string): ReactNode {
  if (text.includes("**")) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  const match = text.match(/^([^:]{2,35}:)\s*(.*)$/);
  if (match) {
    return (
      <>
        <strong>{match[1]}</strong> {match[2]}
      </>
    );
  }

  return text;
}

function FormattedNarrative({ content }: { content: string }) {
  if (!content) return null;

  let text = content;
  // If content is wrapped in raw JSON (e.g. from an old cache or fallback)
  if (text.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.summary === "string" && parsed.summary.trim()) {
        text = parsed.summary;
      }
    } catch {
      const summaryMatch = text.match(/"summary"\s*:\s*"([\s\S]*)/);
      if (summaryMatch) {
        let raw = summaryMatch[1];
        const end = raw.match(/^([\s\S]*?)(?<!\\)"/);
        if (end) raw = end[1];
        text = raw;
      }
    }
  }

  // Handle literal escaped newlines "\\n" -> "\n"
  text = text.replace(/\\n/g, "\n").replace(/\\"/g, '"');

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const hasBullets = lines.some((l) => /^[-*•]\s+/.test(l) || /^([^:]{2,35}:)/.test(l));

  if (!hasBullets) {
    return <p className="result-narrative">{text}</p>;
  }

  const elements: ReactNode[] = [];
  let currentBullets: string[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="narrative-bullet-list">
          {currentBullets.map((item, idx) => (
            <li key={idx}>{renderFormattedInline(item)}</li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    if (/^[-*•]\s+/.test(line)) {
      currentBullets.push(line.replace(/^[-*•]\s+/, ""));
    } else if (/^([^:]{2,35}:)\s*(.*)$/.test(line)) {
      currentBullets.push(line);
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${idx}`} className="narrative-paragraph">
          {renderFormattedInline(line)}
        </p>
      );
    }
  });
  flushBullets();

  return <div className="result-narrative">{elements}</div>;
}

interface VerificationResultPanelProps {
  result: VerificationResultData;
  onReset: () => void;
}

export function VerificationResultPanel({ result, onReset }: VerificationResultPanelProps) {
  const info = result.product_info;
  const articleContext = result.article_context;
  const product = cleanProductName(info.product_name ?? result.extracted.product_name);
  const hasSearchInfo = Boolean(
    info.product_name ||
    info.brand ||
    info.manufacturer ||
    info.address ||
    info.location ||
    info.stars
  );

  const status = articleContext
    ? articleContext.conclusion
    : result.status === "conflict"
    ? "Hạng sao OCOP chưa khớp"
    : result.status === "verified"
      ? "Tìm thấy thông tin OCOP phù hợp"
      : hasSearchInfo
        ? "Đã tìm thấy thông tin sản phẩm"
        : "Chưa tìm thấy thông tin phù hợp";

  const overviewSeverityClass = articleContext
    ? articleContext.best_match
      ? "success"
      : "warning"
    : result.verdict.severity;

  const overviewIcon = articleContext
    ? articleContext.best_match
      ? "✓"
      : "⌕"
    : result.status === "verified"
      ? "✓"
      : result.status === "conflict"
        ? "!"
        : "⌕";

  return (
    <section className="verification-result" aria-live="polite" aria-labelledby="verification-result-title">
      <header className={`result-overview ${overviewSeverityClass}`}>
        <div className="result-overview-icon" aria-hidden="true">
          {overviewIcon}
        </div>
        <div className="result-overview-copy">
          <p className="result-eyebrow">
            {articleContext ? "Đối chiếu bài viết" : "Thông tin sản phẩm"}
          </p>
          <h3 id="verification-result-title">{product}</h3>
          <p className="result-verdict">{status}</p>
        </div>
      </header>

      {articleContext && (
        <p className="submitted-article">
          Bài viết bạn gửi:{" "}
          <a href={articleContext.submitted_url} target="_blank" rel="noreferrer noopener">
            {articleContext.submitted_title}
          </a>
        </p>
      )}

      {info.summary && (
        <div className="result-research-copy">
          <h4>{articleContext ? "Thông tin tìm được để đối chiếu" : "Thông tin sản phẩm"}</h4>
          <FormattedNarrative content={info.summary} />
        </div>
      )}

      {articleContext?.best_match && (
        <article className="best-match-article">
          <h4>Bài viết khớp nhất</h4>
          <a
            className="best-match-title"
            href={articleContext.best_match.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {articleContext.best_match.title}
          </a>
          {articleContext.best_match.excerpt && (
            <p className="best-match-content">{articleContext.best_match.excerpt}</p>
          )}
        </article>
      )}

      <footer className="result-footer">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
          Kiểm tra sản phẩm khác
        </button>
      </footer>
    </section>
  );
}
