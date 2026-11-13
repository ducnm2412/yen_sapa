"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const CLIPS = [
  { src: "/videos/space-tour-1.mp4", label: "Không gian spa" },
  { src: "/videos/facial-led-device.mp4", label: "Chăm sóc da bằng công nghệ" },
  { src: "/videos/face-lifting.mp4", label: "Liệu trình nâng cơ mặt" },
];

/**
 * Nền hero: điện thoại 1 video toàn màn hình; từ md trở lên chia 3 cột, mỗi cột một video dọc phát lặp (muted, playsInline).
 * Ảnh LCP vẫn nằm bên dưới; mỗi video chỉ hiện lên (fade-in) khi đã thật sự phát.
 * Tạm dừng khi hero khuất màn hình / tab ẩn; không render khi prefers-reduced-motion.
 */
export function HeroVideoReel() {
  const [enabled, setEnabled] = useState(false);
  // Điện thoại chỉ phát 1 video (không tải 2 video còn lại); từ md trở lên chia 3 cột
  const [count, setCount] = useState(1);
  const [playing, setPlaying] = useState<boolean[]>(() => CLIPS.map(() => false));
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    const wide = window.matchMedia("(min-width: 768px)");
    const updateCount = () => setCount(wide.matches ? CLIPS.length : 1);
    updateCount();
    wide.addEventListener("change", updateCount);
    return () => {
      mq.removeEventListener("change", update);
      wide.removeEventListener("change", updateCount);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const section = wrapper.current?.closest("section") ?? wrapper.current;
    if (!section) return;
    let inView = true;
    const sync = () => {
      videos.current.forEach((video) => {
        if (!video) return;
        if (inView && !document.hidden) video.play().catch(() => {});
        else video.pause();
      });
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(section);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, count]);

  if (!enabled) return null;

  return (
    <div ref={wrapper} aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-1 gap-px md:grid-cols-3 bg-black/40">
      {CLIPS.slice(0, count).map((clip, i) => (
        <div key={clip.src} className="relative overflow-hidden">
          <video
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={clip.src}
            title={clip.label}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            onPlaying={() => setPlaying((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))}
            className={clsx(
              "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
              playing[i] ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: `${i * 200}ms` }}
          />
        </div>
      ))}
    </div>
  );
}
