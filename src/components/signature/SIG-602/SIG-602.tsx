"use client";
// DUDI Signature SIG-602 v1.0.0 — Glowing Border Runner
// Ported to Next.js for Yên Spa — see README Port notes
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Sig602Props {
  className?: string;
  /** 1 calm · 2 default · 3 bold — tốc độ vệt sáng 0.7× / 1× / 1.4× */
  intensity?: 1 | 2 | 3;
  /** Độ dày viền, mọi đơn vị CSS (mặc định 3px) */
  thickness?: string;
}

const FACTOR = { 1: 0.7, 2: 1, 3: 1.4 } as const;

/** Vệt sáng vàng chạy quanh viền: nền mờ gold-500, đuôi gold-500 đậm, đầu sáng gold-300. */
function buildConic(angle: number, spread: number): string {
  const h = spread / 2;
  const q = spread / 4;
  return (
    `conic-gradient(from ${angle}deg,` +
    `rgba(184,151,90,0.28) 0deg,` +
    `rgba(184,151,90,0.28) ${360 - spread}deg,` +
    `rgba(184,151,90,0.75) ${360 - h}deg,` +
    `rgba(216,192,138,1) ${360 - q}deg,` +
    `rgba(184,151,90,0.75) ${360 - 2}deg,` +
    `rgba(184,151,90,0.28) 360deg)`
  );
}

/** Vòng viền sáng đặt trong một thẻ `position: relative` (thẻ cha trực tiếp). Không chiếm chỗ, không bắt chuột. */
export function Sig602GlowRing({ className, intensity = 1, thickness }: Sig602Props) {
  const ring = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ring.current;
      const card = el?.parentElement;
      if (!el || !card) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
          const duration = (desktop ? 3.5 : 2.4) / FACTOR[intensity];
          const spread = desktop ? 65 : 52;
          const proxy = { angle: 0 };
          el.style.background = buildConic(0, spread);

          // Tạo ở trạng thái dừng; chỉ chạy khi thẻ nằm trong viewport và tab đang hiện.
          const tween = gsap.to(proxy, {
            angle: 360,
            duration,
            repeat: -1,
            ease: "none",
            paused: true,
            onUpdate() {
              el.style.background = buildConic(proxy.angle, spread);
            },
          });
          const st = ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive && !document.hidden ? tween.play() : tween.pause()),
          });
          if (st.isActive && !document.hidden) tween.play();

          const onVis = () => (document.hidden || !st.isActive ? tween.pause() : tween.play());
          document.addEventListener("visibilitychange", onVis);

          return () => {
            document.removeEventListener("visibilitychange", onVis);
            st.kill();
            tween.kill();
            el.style.background = "";
          };
        },
      );
      // Reduced motion: không nhánh nào khớp, vòng giữ viền vàng tĩnh từ CSS.
      return () => mm.revert();
    },
    { scope: ring, dependencies: [intensity] },
  );

  return (
    <span
      ref={ring}
      aria-hidden="true"
      data-sig="602"
      data-sig602-glow=""
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        borderRadius: "inherit",
        padding: thickness ?? "var(--sig602-thickness, 3px)",
        background: "var(--sig602-static, rgba(216,192,138,0.5))",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}

export default Sig602GlowRing;
