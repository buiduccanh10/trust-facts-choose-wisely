"use client";

import { OPEN_CAMERA_EVENT } from "@/lib/events";

export function CameraShortcut() {
  return (
    <a
      className="btn btn-primary btn-sm"
      href="#kiem-tra-anh"
      onClick={() => window.dispatchEvent(new Event(OPEN_CAMERA_EVENT))}
    >
      Chụp ảnh
    </a>
  );
}
