"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const CLIPS = [
  { src: "/videos/space-tour-1.mp4", label: "Không gian spa" },
  { src: "/videos/facial-led-device.mp4", label: "Chăm sóc da bằng công nghệ" },
  { src: "/videos/face-lifting.mp4", label: "Liệu trình nâng cơ mặt" },
];

/**
 * Nền hero: màn hình chia 3 cột, mỗi cột một video dọc phát lặp (muted, playsInline).
 * Ảnh LCP vẫn nằm bên dưới; mỗi video chỉ hiện lên (fade-in) khi đã thật sự phát.
 * Tạm dừng khi hero khuất màn hình / tab ẩn; không render khi prefers-reduced-motion.
 */
export function HeroVideoReel() {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState<boolean[]>(() => CLIPS.map(() => false));
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapper} aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-3 gap-px bg-black/40">
      {CLIPS.map((clip, i) => (
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
