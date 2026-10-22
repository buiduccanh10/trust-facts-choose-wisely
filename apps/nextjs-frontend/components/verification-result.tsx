export type VerificationResultData = {
  status: "verified" | "conflict" | "unverified";
  extracted: {
    brand: string | null;
    manufacturer: string | null;
    address: string | null;
    product_name: string | null;
    location: string | null;
    claimed_stars: number | null;
    has_ocop_logo: boolean | null;
    has_qr_code: boolean | null;
    raw_text_summary: string;
  };
  product_info: {
    product_name: string | null;
    brand: string | null;
    manufacturer: string | null;
    address: string | null;
    location: string | null;
    stars: number | null;
    stars_source: "google" | "official" | null;
    summary: string;
  };
  local_ocop_record: {
    is_certified: boolean | null;
    official_stars: number | null;
    official_product_name: string | null;
    certifying_authority: string | null;
    district: string | null;
    province: string | null;
    recognition_details: string | null;
  };
  verdict: { code: string; title: string; severity: "success" | "warning" | "danger"; confidence_score: number | null };
  comparison_text: string;
  comparison_points: { criteria: string; on_label: string; official_record: string; is_match: boolean | null; note: string }[];
  consumer_advice: string;
  evidence: { title: string; url: string; excerpt: string; retrievedAt: string }[];
  article_context?: {
    submitted_title: string;
    submitted_url: string;
    conclusion: string;
    best_match: { title: string; url: string; excerpt: string; retrievedAt: string } | null;
  };
};

type Props = {
  result: VerificationResultData;
  onReset: () => void;
};

export function VerificationResultPanel({ result, onReset }: Props) {
  const info = result.product_info;
  const articleContext = result.article_context;
  const product = (info.product_name ?? result.extracted.product_name)
    ?.replace(/\([^)]*\)/g, "")
    .replace(/[“”"']/g, "")
    .replace(/\s+/g, " ")
    .trim() || "Chưa đọc rõ tên sản phẩm";
  const hasSearchInfo = Boolean(info.product_name || info.brand || info.manufacturer || info.address || info.location || info.stars);
  const status = articleContext
    ? articleContext.conclusion
    : result.status === "conflict"
    ? "Hạng sao OCOP chưa khớp"
    : result.status === "verified"
      ? "Tìm thấy thông tin OCOP phù hợp"
      : hasSearchInfo
        ? "Đã tìm thấy thông tin sản phẩm"
        : "Chưa tìm thấy thông tin phù hợp";

  return (
    <section className="verification-result" aria-live="polite" aria-labelledby="verification-result-title">
      <header className={`result-overview ${articleContext ? articleContext.best_match ? "success" : "warning" : result.verdict.severity}`}>
        <div className="result-overview-icon" aria-hidden="true">
          {articleContext ? articleContext.best_match ? "✓" : "⌕" : result.status === "verified" ? "✓" : result.status === "conflict" ? "!" : "⌕"}
        </div>
        <div className="result-overview-copy">
          <p className="result-eyebrow">{articleContext ? "Đối chiếu bài viết" : "Thông tin sản phẩm"}</p>
          <h3 id="verification-result-title">{product}</h3>
          <p className="result-verdict">{status}</p>
        </div>
      </header>

      {articleContext && <p className="submitted-article">Bài viết bạn gửi: <a href={articleContext.submitted_url} target="_blank" rel="noreferrer noopener">{articleContext.submitted_title}</a></p>}

      {info.summary && (
        <div className="result-research-copy">
          <h4>{articleContext ? "Thông tin tìm được để đối chiếu" : "Thông tin sản phẩm"}</h4>
          <p className="result-narrative">{info.summary}</p>
        </div>
      )}

      {articleContext?.best_match && (
        <article className="best-match-article">
          <h4>Bài viết khớp nhất</h4>
          <a className="best-match-title" href={articleContext.best_match.url} target="_blank" rel="noreferrer noopener">{articleContext.best_match.title}</a>
          {articleContext.best_match.excerpt && <p className="best-match-content">{articleContext.best_match.excerpt}</p>}
        </article>
      )}

      <footer className="result-footer">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>Kiểm tra sản phẩm khác</button>
      </footer>
    </section>
  );
}
