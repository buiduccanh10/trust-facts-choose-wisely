"use client";

import { useEffect, useRef, useState } from "react";
import { metricsService } from "@/lib/api";

interface PageViewCount {
  count: number;
  persistent: boolean;
}

export function PageViewCounter() {
  const requested = useRef(false);
  const [pageViews, setPageViews] = useState<PageViewCount | "error" | null>(null);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    void metricsService.recordPageView()
      .then(setPageViews)
      .catch(() => setPageViews("error"));
  }, []);

  return (
    <p className="page-views" aria-live="polite">
      <span className="page-views-dot" aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      {pageViews && pageViews !== "error" ? (
        <span>
          Tổng lượt xem: <strong>{pageViews.count.toLocaleString("vi-VN")}</strong>
          {!pageViews.persistent && <small> · lưu tạm</small>}
        </span>
      ) : pageViews === "error" ? (
        <span>Lượt xem hiện không khả dụng</span>
      ) : (
        <span>Đang tải lượt xem...</span>
      )}
    </p>
  );
}
