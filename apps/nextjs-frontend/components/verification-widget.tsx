"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { VerificationResultPanel } from "@/components/verification-result";
import { useVerification } from "@/hooks/use-verification";
import { formatFileSizeKB } from "@/utils/formatters";

export function VerificationWidget() {
  const {
    mode,
    setMode,
    file,
    previewUrl,
    url,
    setUrl,
    loading,
    error,
    result,
    clearFile,
    onFileChange,
    onDrop,
    runVerification,
    reset,
  } = useVerification();

  return (
    <section className="snap" id="kiem-tra-anh" aria-labelledby="snapTitle">
      <div className="wrap">
        <div className="snap-card" id="snapCard">
          <div className="snap-header-row">
            <div className="snap-head">
              <span className="eyebrow">Thẩm định OCOP</span>
              <h2 className="snap-title" id="snapTitle">
                Kiểm tra nhãn mác &amp; Tra cứu chứng chỉ OCOP địa phương
              </h2>
              <p className="snap-lead">
                Chụp hoặc tải ảnh bao bì sản phẩm. RightWISE đọc nhãn và tìm thông tin sản phẩm, cơ sở sản xuất và hạng OCOP.
              </p>
            </div>
            <ol className="stepper" aria-label="Ba bước kiểm tra ảnh">
              <li className={!loading && !result ? "now" : result || loading ? "done" : ""} data-s="1">
                <b>1</b>
                <span>Chụp / Tải ảnh</span>
              </li>
              <li className={loading ? "now" : result ? "done" : ""} data-s="2">
                <b>2</b>
                <span>Đọc &amp; đối chiếu</span>
              </li>
              <li className={result ? "now done" : ""} data-s="3">
                <b>3</b>
                <span>Thông tin tìm được</span>
              </li>
            </ol>
          </div>

          <div className="snap-workspace" id="snapWorkspace" aria-busy={loading}>
            <div className="snap-col-media">
              <Tabs.Root
                value={mode}
                onValueChange={(value) => setMode(value as "image" | "url")}
              >
                <Tabs.List className="verify-mode-tabs" aria-label="Phương thức thẩm định">
                  <Tabs.Trigger
                    className={`verify-mode-btn${mode === "image" ? " active" : ""}`}
                    value="image"
                  >
                    Kiểm tra bằng ảnh
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className={`verify-mode-btn${mode === "url" ? " active" : ""}`}
                    value="url"
                  >
                    Kiểm tra bằng link
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="image" className="media-mode-image">
                  <div
                    className={`shot${previewUrl ? " has" : ""}`}
                    id="shot"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={onDrop}
                  >
                    {!previewUrl && (
                      <div className="ph" id="photoPh">
                        <span className="ph-ico">📦</span>
                        <b>Ảnh nhãn sản phẩm</b>
                        <small>Kéo thả ảnh vào đây hoặc dùng các nút bên dưới</small>
                      </div>
                    )}
                    {previewUrl && (
                      <div className="view" id="photoView">
                        <img id="photoImg" src={previewUrl} alt="Ảnh nhãn bao bì bạn vừa chọn" />
                      </div>
                    )}
                    {loading && (
                      <div className="ai-scanner">
                        <div className="scan-laser" />
                        <div className="scan-box">
                          <div className="spinner" />
                          <div>
                            <b style={{ display: "block", color: "var(--forest)", fontSize: "1.02rem" }}>
                              Đang tìm thông tin sản phẩm...
                            </b>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!previewUrl && (
                    <div className="pick" id="snapPickRow">
                      <label className="bigbtn main" htmlFor="photoCam">
                        <span>Chụp ảnh bao bì bây giờ</span>
                        <input
                          className="sr"
                          type="file"
                          id="photoCam"
                          accept="image/*"
                          capture="environment"
                          onChange={onFileChange}
                        />
                      </label>
                      <label className="bigbtn alt" htmlFor="photoLib">
                        <span>Chọn ảnh tem mác có sẵn</span>
                        <input
                          className="sr"
                          type="file"
                          id="photoLib"
                          accept="image/*"
                          onChange={onFileChange}
                        />
                      </label>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="media-controls">
                      <div className="media-toolbar">
                        <p className="pmeta" id="photoMeta" aria-live="polite">
                          {file?.name} · {formatFileSizeKB(file?.size)} KB
                        </p>
                        <button
                          type="button"
                          className="btn-trash"
                          title="Bỏ chọn ảnh"
                          aria-label="Bỏ chọn ảnh"
                          onClick={clearFile}
                        >
                          Bỏ ảnh
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn-scan-primary"
                        id="btnAiScan"
                        onClick={runVerification}
                        disabled={loading}
                      >
                        Phân tích ảnh &amp; đối chiếu
                      </button>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value="url" className="media-mode-url">
                  <div className="url-verify-card">
                    <div className="url-input-label">
                      <b>Đường dẫn sản phẩm hoặc bài giới thiệu</b>
                      <span>RightWISE chỉ đọc nội dung công khai của trang.</span>
                    </div>
                    <div className="url-field-row">
                      <div className="url-input-icon" aria-hidden="true">
                        🔗
                      </div>
                      <input
                        type="url"
                        id="urlInput"
                        className="url-input-field"
                        placeholder="https://..."
                        autoComplete="url"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void runVerification();
                        }}
                      />
                      <button
                        type="button"
                        className="btn-clear-url"
                        title="Xóa đường link"
                        aria-label="Xóa đường link"
                        hidden={!url}
                        onClick={() => setUrl("")}
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="url-info-banner">
                      Trang bị chặn hoặc không truy cập được sẽ được ghi là chưa xác minh.
                    </div>
                    <button
                      type="button"
                      className="btn-scan-primary"
                      id="btnUrlScan"
                      onClick={runVerification}
                      disabled={loading}
                    >
                      Kiểm tra đường dẫn
                    </button>
                  </div>
                  {loading && (
                    <div className="ai-scanner inline">
                      <div className="spinner" />
                      <span>Đang đọc bài viết và đối chiếu thông tin sản phẩm...</span>
                    </div>
                  )}
                </Tabs.Content>
              </Tabs.Root>

              {error && (
                <p className="verification-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="snap-col-results" id="snapColResults">
              {!result && (
                <div className="results-empty-state" id="resultsEmptyState">
                  <div className="empty-icon">🔍</div>
                  <h3>
                    {mode === "url"
                      ? "Thông tin đối chiếu sẽ hiển thị tại đây"
                      : "Thông tin sản phẩm sẽ hiển thị tại đây"}
                  </h3>
                  <p>
                    {mode === "url"
                      ? "Dán link bài viết hoặc trang quảng cáo để đối chiếu các tuyên bố với thông tin độc lập."
                      : "Thêm ảnh nhãn để tìm thông tin sản phẩm và hồ sơ OCOP nếu có."}
                  </p>
                  <ul className="empty-features">
                    {(mode === "url"
                      ? [
                          "Nhận diện sản phẩm được nhắc tới",
                          "Đối chiếu từng tuyên bố",
                          "Dẫn nguồn tham khảo",
                        ]
                      : ["Tên và thương hiệu", "Cơ sở sản xuất", "Hạng OCOP nếu tìm thấy"]
                    ).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result && <VerificationResultPanel result={result} onReset={reset} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
