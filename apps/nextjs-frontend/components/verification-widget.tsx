"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { type ChangeEvent, type DragEvent, useEffect, useState } from "react";

type Evidence = { title: string; url: string; excerpt: string; retrievedAt: string };
type Point = { criteria: string; on_label: string; official_record: string; is_match: boolean | null; note: string };
type Result = {
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
  local_ocop_record: {
    is_certified: boolean | null;
    official_stars: number | null;
    official_product_name: string | null;
    certifying_authority: string | null;
    district: string | null;
    province: string | null;
    recognition_details: string | null;
  };
  verdict: { code: string; title: string; severity: "success" | "warning" | "danger"; confidence_score: number };
  comparison_text: string;
  comparison_points: Point[];
  consumer_advice: string;
  evidence: Evidence[];
};

const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const maxFileBytes = 12 * 1024 * 1024;

export function VerificationWidget() {
  const [mode, setMode] = useState("image");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const chooseFile = (nextFile?: File) => {
    setError("");
    setResult(null);
    if (!nextFile) return;
    setFile(null);
    if (!nextFile.type.startsWith("image/")) {
      setError("Tệp này không phải ảnh. Hãy chọn JPEG, PNG hoặc WebP.");
      return;
    }
    if (nextFile.size > maxFileBytes) {
      setError("Ảnh vượt quá giới hạn 12 MB. Hãy chọn ảnh nhỏ hơn.");
      return;
    }
    setFile(nextFile);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const runVerification = async () => {
    setError("");
    setResult(null);
    if (mode === "image" && !file) {
      setError("Vui lòng chụp ảnh hoặc chọn ảnh nhãn mác trước.");
      return;
    }
    if (mode === "url" && !url.trim()) {
      setError("Vui lòng nhập đường dẫn sản phẩm cần kiểm tra.");
      return;
    }

    setLoading(true);
    try {
      let response: Response;
      if (mode === "image") {
        const { default: compressImage } = await import("browser-image-compression");
        const preparedImage = await compressImage(file as File, {
          maxSizeMB: 3.8,
          maxWidthOrHeight: 1800,
          useWebWorker: true,
          fileType: "image/jpeg",
        });
        const form = new FormData();
        form.append("file", preparedImage, "rightwise-label.jpg");
        response = await fetch(`${apiBase}/api/v1/verifications/image`, { method: "POST", body: form });
      } else {
        response = await fetch(`${apiBase}/api/v1/verifications/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
      }

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = typeof body.message === "string" ? body.message : "Không thể hoàn tất lượt kiểm tra.";
        throw new Error(message);
      }
      setResult(body.data as Result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới RightWISE API.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUrl("");
    setResult(null);
    setError("");
    setMode("image");
  };

  const severity = result?.verdict.severity ?? "warning";
  const localRecord = result?.local_ocop_record;

  return (
    <section className="snap" id="kiem-tra-anh" aria-labelledby="snapTitle">
      <div className="wrap">
        <div className="snap-card" id="snapCard">
          <div className="snap-header-row">
            <div className="snap-head">
              <span className="eyebrow">Thẩm định OCOP</span>
              <h2 className="snap-title" id="snapTitle">Kiểm tra nhãn mác &amp; Tra cứu chứng chỉ OCOP địa phương</h2>
              <p className="snap-lead">Chụp hoặc tải ảnh bao bì sản phẩm. RightWISE đọc thông tin nhãn và tìm bằng chứng OCOP từ nguồn chính thức.</p>
            </div>
            <ol className="stepper" aria-label="Ba bước kiểm tra ảnh">
              <li className={!loading && !result ? "now" : result || loading ? "done" : ""} data-s="1"><b>1</b><span>Chụp / Tải ảnh</span></li>
              <li className={loading ? "now" : result ? "done" : ""} data-s="2"><b>2</b><span>Đọc &amp; đối chiếu</span></li>
              <li className={result ? "now done" : ""} data-s="3"><b>3</b><span>Xem bằng chứng</span></li>
            </ol>
          </div>

          <div className="snap-workspace" id="snapWorkspace" aria-busy={loading}>
            <div className="snap-col-media">
              <Tabs.Root value={mode} onValueChange={setMode}>
                <Tabs.List className="verify-mode-tabs" aria-label="Phương thức thẩm định">
                  <Tabs.Trigger className={`verify-mode-btn${mode === "image" ? " active" : ""}`} value="image">Kiểm tra bằng ảnh</Tabs.Trigger>
                  <Tabs.Trigger className={`verify-mode-btn${mode === "url" ? " active" : ""}`} value="url">Kiểm tra bằng link</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="image" className="media-mode-image">
                  <div className={`shot${previewUrl ? " has" : ""}`} id="shot" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
                    {!previewUrl && <div className="ph" id="photoPh"><span className="ph-ico">📦</span><b>Ảnh nhãn sản phẩm</b><small>Kéo thả ảnh vào đây hoặc dùng các nút bên dưới</small></div>}
                    {previewUrl && <div className="view" id="photoView"><img id="photoImg" src={previewUrl} alt="Ảnh nhãn bao bì bạn vừa chọn" /></div>}
                    {loading && <div className="ai-scanner"><div className="scan-laser" /><div className="scan-box"><div className="spinner" /><div><b style={{ display: "block", color: "var(--forest)", fontSize: "1.02rem" }}>Đang phân tích &amp; đối chiếu...</b><span style={{ fontSize: ".84rem", color: "var(--soft)" }}>Đọc nhãn và tìm nguồn OCOP chính thức</span></div></div></div>}
                  </div>
                  {!previewUrl && <div className="pick" id="snapPickRow">
                    <label className="bigbtn main" htmlFor="photoCam"><span>Chụp ảnh bao bì bây giờ</span><input className="sr" type="file" id="photoCam" accept="image/*" capture="environment" onChange={onFileChange} /></label>
                    <label className="bigbtn alt" htmlFor="photoLib"><span>Chọn ảnh tem mác có sẵn</span><input className="sr" type="file" id="photoLib" accept="image/*" onChange={onFileChange} /></label>
                  </div>}
                  {previewUrl && <div className="media-controls"><div className="media-toolbar"><p className="pmeta" id="photoMeta" aria-live="polite">{file?.name} · {Math.max(1, Math.round((file?.size ?? 0) / 1024))} KB</p><button type="button" className="btn-trash" title="Bỏ chọn ảnh" aria-label="Bỏ chọn ảnh" onClick={() => setFile(null)}>Bỏ ảnh</button></div><button type="button" className="btn-scan-primary" id="btnAiScan" onClick={runVerification} disabled={loading}>Phân tích ảnh &amp; đối chiếu</button></div>}
                </Tabs.Content>
                <Tabs.Content value="url" className="media-mode-url">
                  <div className="url-verify-card">
                    <div className="url-input-label"><b>Đường dẫn sản phẩm hoặc bài giới thiệu</b><span>RightWISE chỉ đọc nội dung công khai của trang.</span></div>
                    <div className="url-field-row"><div className="url-input-icon" aria-hidden="true">🔗</div><input type="url" id="urlInput" className="url-input-field" placeholder="https://..." autoComplete="url" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void runVerification(); }} /><button type="button" className="btn-clear-url" title="Xóa đường link" aria-label="Xóa đường link" hidden={!url} onClick={() => setUrl("")}>Xóa</button></div>
                    <div className="url-info-banner">Trang bị chặn hoặc không truy cập được sẽ được ghi là chưa xác minh.</div>
                    <button type="button" className="btn-scan-primary" id="btnUrlScan" onClick={runVerification} disabled={loading}>Kiểm tra đường dẫn</button>
                  </div>
                  {loading && <div className="ai-scanner inline"><div className="spinner" /><span>Đang đọc trang và tìm bằng chứng chính thức...</span></div>}
                </Tabs.Content>
              </Tabs.Root>
              {error && <p className="verification-error" role="alert">{error}</p>}
              <p className="verification-privacy">Ảnh và nội dung trang chỉ xử lý trong lượt kiểm tra. Kết quả được cache tối đa 24 giờ để hạn chế gọi AI lặp lại.</p>
            </div>

            <div className="snap-col-results" id="snapColResults">
              {!result && <div className="results-empty-state" id="resultsEmptyState"><div className="empty-icon">🔍</div><h3>Chưa có kết quả kiểm tra</h3><p>Thêm ảnh hoặc đường dẫn để bắt đầu. Kết quả sẽ kèm nguồn dẫn khi tìm thấy bằng chứng phù hợp.</p><ul className="empty-features"><li>Đọc thông tin nhà sản xuất</li><li>Đối chiếu tuyên bố OCOP</li><li>Hiển thị nguồn tham khảo</li></ul></div>}
              {result && <div className="ai-results-dashboard" id="aiResultsPanel">
                <div className={`verdict-banner ${severity}`} id="verdictBanner">
                  <div className="verdict-top"><div className="verdict-badge" id="aiVerdictBadge"><span>{severity === "success" ? "✅" : severity === "danger" ? "⚠️" : "🔎"}</span><span>{result.verdict.title}</span></div><span className="match-score-pill" id="aiMatchScore">{result.status === "verified" ? "Có nguồn chính thức khớp" : result.status === "conflict" ? "Cần kiểm tra sai khác" : "Chưa xác minh"}</span></div>
                  <p className="verdict-explain" id="aiVerdictExplain">Trạng thái: {result.status === "verified" ? "khớp nguồn" : result.status === "conflict" ? "có sai khác" : "chưa đủ bằng chứng"}</p>
                </div>
                <Tabs.Root defaultValue="narrative">
                  <Tabs.List className="results-tab-bar" aria-label="Thông tin kết quả">
                    <Tabs.Trigger className="tab-btn" data-radix-tab="true" value="narrative">Đối chiếu</Tabs.Trigger>
                    <Tabs.Trigger className="tab-btn" data-radix-tab="true" value="matrix">Tiêu chí</Tabs.Trigger>
                    <Tabs.Trigger className="tab-btn" data-radix-tab="true" value="official">Hồ sơ &amp; nguồn</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content className="tab-pane" value="narrative"><div className="narrative-body" id="aiComparisonNarrative">{result.comparison_text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="advice-card" id="consumerAdviceBox"><b>Lời khuyên cho người mua</b><p id="consumerAdviceText">{result.consumer_advice}</p></div></Tabs.Content>
                  <Tabs.Content className="tab-pane" value="matrix"><div className="matrix-table-wrap"><table className="matrix-table" id="matrixTable"><thead><tr><th>Tiêu chí</th><th>Trên nhãn</th><th>Nguồn đối chiếu</th><th>Nhận định</th></tr></thead><tbody id="matrixTableBody">{result.comparison_points.map((point) => <tr key={point.criteria}><td><b>{point.criteria}</b></td><td>{point.on_label || "—"}</td><td>{point.official_record || "—"}</td><td><span className={`check-pill ${point.is_match === true ? "match" : point.is_match === false ? "diff" : ""}`}>{point.note}</span></td></tr>)}</tbody></table></div></Tabs.Content>
                  <Tabs.Content className="tab-pane" value="official"><div className="official-record-card"><div className="official-grid"><div className="official-item"><span className="lbl">Tình trạng OCOP:</span><span id="offCertStatus" className={`check-pill ${localRecord?.is_certified ? "match" : ""}`}>{localRecord?.is_certified === true ? "Đã khớp nguồn" : "Chưa xác minh"}</span></div><div className="official-item"><span className="lbl">Xếp hạng:</span><span id="offStars" className="stars-val">{localRecord?.official_stars ? `★${"★".repeat(localRecord.official_stars - 1)} OCOP ${localRecord.official_stars} sao` : "Chưa xác minh"}</span></div><div className="official-item full"><span className="lbl">Sản phẩm:</span><span id="offProduct" className="val-bold">{localRecord?.official_product_name ?? "Chưa có hồ sơ nguồn đủ khớp"}</span></div><div className="official-item"><span className="lbl">Cơ quan công nhận:</span><span id="offAuthority">{localRecord?.certifying_authority ?? "Chưa xác định"}</span></div><div className="official-item"><span className="lbl">Địa bàn OCOP:</span><span id="offLocation">{[localRecord?.district, localRecord?.province].filter(Boolean).join(", ") || "Chưa xác định"}</span></div><div className="official-item full"><span className="lbl">Đợt / quyết định:</span><span id="offDetails">{localRecord?.recognition_details ?? "Nguồn tìm được chưa nêu thông tin này"}</span></div></div></div><div className="advice-card"><b>Nguồn tham khảo</b>{result.evidence.length ? <ul className="evidence-list">{result.evidence.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>{item.excerpt && <p>{item.excerpt}</p>}<small>Truy xuất {new Date(item.retrievedAt).toLocaleString("vi-VN")}</small></li>)}</ul> : <p>Không tìm thấy nguồn chính thức đủ khớp trong lượt tra cứu này.</p>}</div></Tabs.Content>
                </Tabs.Root>
                <div className="results-actions"><button type="button" className="btn btn-ghost btn-sm" id="btnCheckAnother" onClick={reset}>Kiểm tra sản phẩm khác</button></div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
