"use client";

import { useEffect, useState } from "react";

/**
 * Từ xoay vòng trong câu (mục 2.1 MOTION_EFFECTS_GUIDE). Từ đầu tiên được render phía server,
 * nên không JS / reduced-motion vẫn đọc được câu hoàn chỉnh. Screen reader đọc câu đầy đủ qua sr-only.
 */
export function RotatingWord({ words, interval = 2400 }: { words: readonly string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: number | undefined;
    const start = () => (id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval));
    const stop = () => window.clearInterval(id);
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [words.length, interval]);

  return (
    <span key={i} aria-hidden="true" className="animate-role-in inline-block">
      {words[i]}
    </span>
  );
}
