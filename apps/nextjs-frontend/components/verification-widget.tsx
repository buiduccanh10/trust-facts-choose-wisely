"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { type ChangeEvent, type DragEvent, useEffect, useState } from "react";
import { VerificationResultPanel, type VerificationResultData } from "@/components/verification-result";

type Evidence = { title: string; url: string; excerpt: string; retrievedAt: string };

const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const maxFileBytes = 12 * 1024 * 1024;

export function VerificationWidget() {
  const [mode, setMode] = useState("image");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerificationResultData | null>(null);

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
          maxSizeMB: 1.2,
          maxWidthOrHeight: 1280,
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
      setResult(body.data as VerificationResultData);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      if (/load failed|failed to fetch|network/i.test(message)) {
        setError("Yêu cầu quá thời gian chờ (timeout) hoặc kết nối mạng bị gián đoạn. Vui lòng thử lại.");
      } else {
        setError(message || "Không thể kết nối tới RightWISE API.");
      }
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

  return (
    <section className="snap" id="kiem-tra-anh" aria-labelledby="snapTitle">
      <div className="wrap">
        <div className="snap-card" id="snapCard">
          <div className="snap-header-row">
            <div className="snap-head">
              <span className="eyebrow">Thẩm định OCOP</span>
              <h2 className="snap-title" id="snapTitle">Kiểm tra nhãn mác &amp; Tra cứu chứng chỉ OCOP địa phương</h2>
              <p className="snap-lead">Chụp hoặc tải ảnh bao bì sản phẩm. RightWISE đọc nhãn và tìm thông tin sản phẩm, cơ sở sản xuất và hạng OCOP.</p>
            </div>
            <ol className="stepper" aria-label="Ba bước kiểm tra ảnh">
              <li className={!loading && !result ? "now" : result || loading ? "done" : ""} data-s="1"><b>1</b><span>Chụp / Tải ảnh</span></li>
              <li className={loading ? "now" : result ? "done" : ""} data-s="2"><b>2</b><span>Đọc &amp; đối chiếu</span></li>
              <li className={result ? "now done" : ""} data-s="3"><b>3</b><span>Thông tin tìm được</span></li>
            </ol>
          </div>

          <div className="snap-workspace" id="snapWorkspace" aria-busy={loading}>
            <div className="snap-col-media">
              <Tabs.Root value={mode} onValueChange={(value) => { setMode(value); setResult(null); setError(""); }}>
                <Tabs.List className="verify-mode-tabs" aria-label="Phương thức thẩm định">
                  <Tabs.Trigger className={`verify-mode-btn${mode === "image" ? " active" : ""}`} value="image">Kiểm tra bằng ảnh</Tabs.Trigger>
                  <Tabs.Trigger className={`verify-mode-btn${mode === "url" ? " active" : ""}`} value="url">Kiểm tra bằng link</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="image" className="media-mode-image">
                  <div className={`shot${previewUrl ? " has" : ""}`} id="shot" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
                    {!previewUrl && <div className="ph" id="photoPh"><span className="ph-ico">📦</span><b>Ảnh nhãn sản phẩm</b><small>Kéo thả ảnh vào đây hoặc dùng các nút bên dưới</small></div>}
                    {previewUrl && <div className="view" id="photoView"><img id="photoImg" src={previewUrl} alt="Ảnh nhãn bao bì bạn vừa chọn" /></div>}
                    {loading && <div className="ai-scanner"><div className="scan-laser" /><div className="scan-box"><div className="spinner" /><div><b style={{ display: "block", color: "var(--forest)", fontSize: "1.02rem" }}>Đang tìm thông tin sản phẩm...</b></div></div></div>}
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
                  {loading && <div className="ai-scanner inline"><div className="spinner" /><span>Đang đọc bài viết và đối chiếu thông tin sản phẩm...</span></div>}
                </Tabs.Content>
              </Tabs.Root>
              {error && <p className="verification-error" role="alert">{error}</p>}
            </div>

            <div className="snap-col-results" id="snapColResults">
              {!result && <div className="results-empty-state" id="resultsEmptyState"><div className="empty-icon">🔍</div><h3>{mode === "url" ? "Thông tin đối chiếu sẽ hiển thị tại đây" : "Thông tin sản phẩm sẽ hiển thị tại đây"}</h3><p>{mode === "url" ? "Dán link bài viết hoặc trang quảng cáo để đối chiếu các tuyên bố với thông tin độc lập." : "Thêm ảnh nhãn để tìm thông tin sản phẩm và hồ sơ OCOP nếu có."}</p><ul className="empty-features">{(mode === "url" ? ["Nhận diện sản phẩm được nhắc tới", "Đối chiếu từng tuyên bố", "Dẫn nguồn tham khảo"] : ["Tên và thương hiệu", "Cơ sở sản xuất", "Hạng OCOP nếu tìm thấy"]).map((feature) => <li key={feature}>{feature}</li>)}</ul></div>}
              {result && <VerificationResultPanel result={result} onReset={reset} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
