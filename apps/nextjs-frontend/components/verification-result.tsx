import type { VerificationResultData } from "@/types/verification";
import { cleanProductName } from "@/utils/formatters";

export type { VerificationResultData };

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
          <p className="result-narrative">{info.summary}</p>
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
