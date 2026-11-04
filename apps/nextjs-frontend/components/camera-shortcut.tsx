"use client";

import { OPEN_CAMERA_EVENT } from "@/lib/events";

export function CameraShortcut() {
  return (
    <button
      type="button"
      className="btn btn-primary btn-sm"
      onClick={() => window.dispatchEvent(new Event(OPEN_CAMERA_EVENT))}
    >
      Chụp ảnh
    </button>
  );
}
