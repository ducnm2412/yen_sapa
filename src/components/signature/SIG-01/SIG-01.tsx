"use client";
// DUDI Signature SIG-01 v1.0.0 — Sticky Headline, Scrolling Scene
// Ported to Next.js for Yên Spa — see README Port notes
import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Một cụm lá tách nền trôi phía sau câu chữ (trang trí, không có alt).
 * PNG tách nền có mép bị cắt thẳng, nên lá luôn bám sát mép trái/phải của section
 * (và mép trên/dưới nếu `flush`), chỉ trôi theo chiều đẩy mép cắt ra ngoài vùng nhìn thấy.
 */
export interface SigLeaf {
  src: string;
  width: number;
  height: number;
  /** Mép section mà lá bám vào */
  side: "left" | "right";
  /** Chiều rộng trên desktop (vw); mobile tự nhân 1.6 */
  w: number;
  /** Lá cũng bám sát mép trên/dưới của section (khi PNG bị cắt ở mép đó) */
  flush?: "top" | "bottom";
  /** Vị trí dọc (% chiều cao section) tính từ mép trên; bỏ qua nếu có flush */
  top?: number;
}

export interface Sig01Props {
  id?: string;
  className?: string;
  /** 1 calm · 2 default · 3 bold — biên độ trôi của lá */
  intensity?: 1 | 2 | 3;
  /** Small label above the headline */
  eyebrow?: string;
  /** The sentence that stays fixed while the scene scrolls behind it */
  headline: string;
  /** Optional part of the headline rendered in the display font + accent color (must be a substring of headline) */
  emphasis?: string;
  /** Small line under the headline */
  caption?: string;
  /** Cụm lá tách nền trôi qua phía sau câu chữ (tối đa 8) */
  images: SigLeaf[];
  /** Ảnh nền phủ kín, trôi rất nhẹ */
  backdrop?: string;
}

const FACTOR = { 1: 0.7, 2: 1, 3: 1.4 } as const;
// Per-frame drift speed pattern (1 = normal scroll speed). Varied speeds create depth.
const SPEEDS = [0.75, 1.3, 0.95, 1.45, 0.85, 1.2, 1.05, 1.35];

function renderHeadline(text: string, emphasis?: string) {
  if (!emphasis || !text.includes(emphasis)) return text;
  const [before, after] = text.split(emphasis);
  return (
    <>
      {before}
      <em className="sig01-em" style={{ fontFamily: "var(--sig-font-display, serif)", color: "var(--sig-accent, #e0a25b)" }}>
        {emphasis}
      </em>
      {after}
    </>
  );
}

export function Sig01StickyHeadline({ id, className, intensity = 2, eyebrow, headline, emphasis, caption, images, backdrop }: Sig01Props) {
  const root = useRef<HTMLElement>(null);
  const f = FACTOR[intensity];
  const frames = images.slice(0, 8);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
          const spread = (desktop ? 0.6 : 0.25) * f;
          gsap.utils.toArray<HTMLElement>(".sig01-frame", el).forEach((frame, i) => {
            const speed = SPEEDS[i % SPEEDS.length];
            const flush = frames[i]?.flush;
            // Biên độ trôi; lá bám mép trên chỉ trôi lên, bám mép dưới chỉ trôi xuống để không lộ mép cắt.
            const amp = () => Math.max(Math.abs(speed - 1), 0.2) * window.innerHeight * spread;
            const from = flush === "top" ? () => 0 : flush === "bottom" ? () => amp() : () => (speed - 1) * window.innerHeight * spread;
            const to = flush === "top" ? () => -amp() : flush === "bottom" ? () => 0 : () => (1 - speed) * window.innerHeight * spread;
            gsap.fromTo(
              frame,
              { y: from },
              {
                y: to,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
              },
            );
          });

          const bd = el.querySelector<HTMLElement>(".sig01-bd");
          if (bd) {
            gsap.fromTo(
              bd,
              { yPercent: -6 },
              { yPercent: 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
            );
          }

          // Câu chữ "thở" nhẹ nhưng luôn đọc được ngay từ khung đầu (không bao giờ dưới 0.88).
          if (desktop) {
            const head = el.querySelector<HTMLElement>(".sig01-head");
            if (head) {
              gsap.fromTo(
                head,
                { scale: 0.97, opacity: 0.9 },
                {
                  keyframes: [
                    { scale: 1, opacity: 1, duration: 0.3 },
                    { scale: 1, opacity: 1, duration: 0.4 },
                    { scale: 1.02, opacity: 0.88, duration: 0.3 },
                  ],
                  ease: "none",
                  scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 40%", scrub: true },
                },
              );
            }
          }
        },
      );
    },
    { scope: root, dependencies: [intensity, frames.length] },
  );

  return (
    <section
      id={id}
      ref={root}
      data-sig="01"
      className={["sig01", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        background: "var(--sig-bg, #0e0e0e)",
        color: "var(--sig-fg, #f4efe8)",
        scrollMarginTop: "var(--header-h, 0px)",
      }}
    >
      {/* Cảnh nền: ảnh phủ + lá trôi. Nằm riêng trong lớp overflow-hidden để không phá sticky của câu chữ. */}
      <div className="sig01-scene" aria-hidden="true">
        {backdrop && (
          <div className="sig01-bd">
            <Image src={backdrop} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        )}
        {frames.map((leaf) => {
          const pos: Record<string, string> = { "--w": `${leaf.w}vw` };
          if (leaf.flush === "bottom") pos["--b"] = "0px";
          else pos["--t"] = leaf.flush === "top" ? "0px" : `${leaf.top ?? 0}%`;
          return (
            <div key={leaf.src} className="sig01-frame" data-side={leaf.side} style={pos as CSSProperties}>
              <Image
                src={leaf.src}
                alt=""
                width={leaf.width}
                height={leaf.height}
                sizes="(min-width: 768px) 24vw, 40vw"
                className="sig01-leaf"
              />
            </div>
          );
        })}
      </div>

      {/* Câu chữ: sticky bằng CSS chỉ trên desktop có chuyển động; mobile và reduced motion là khối tĩnh. */}
      <div className="sig01-sticky" data-sig-sticky>
        <div className="sig01-head">
          {/* Quầng nền mềm giữ chữ dễ đọc khi lá trôi qua, không làm tối ảnh. */}
          <span aria-hidden="true" className="sig01-halo" />
          {eyebrow && <p className="sig01-eyebrow">{eyebrow}</p>}
          <h2 className="sig01-h">{renderHeadline(headline, emphasis)}</h2>
          {caption && <p className="sig01-cap">{caption}</p>}
        </div>
      </div>

      <style>{`
        .sig01 { min-height: 34rem; padding: 6rem 0; overflow-x: clip; }
        .sig01-scene { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .sig01-bd { position: absolute; inset: -8% 0; opacity: 0.3; mix-blend-mode: soft-light; will-change: transform; }
        .sig01-frame { position: absolute; top: var(--t, auto); bottom: var(--b, auto); width: calc(var(--w) * 1.6); will-change: transform; }
        .sig01-frame[data-side="left"] { left: 0; }
        .sig01-frame[data-side="right"] { right: 0; }
        .sig01-leaf { display: block; width: 100%; height: auto; max-width: none; object-fit: contain; }
        .sig01-sticky { position: relative; z-index: 1; display: grid; place-items: center; padding: 0 6vw; pointer-events: none; }
        .sig01-head { position: relative; max-width: min(92vw, 1100px); text-align: center; text-shadow: 0 2px 28px rgba(0,0,0,0.45); }
        .sig01-halo { position: absolute; inset: -18% -6%; z-index: -1; background: radial-gradient(closest-side, color-mix(in oklab, var(--sig-bg, #0e0e0e) 78%, transparent), transparent); }
        .sig01-eyebrow { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
        .sig01-h { margin: 0.35em auto 0; max-width: 14ch; font-family: var(--sig-font-body, system-ui, sans-serif); font-weight: 500; font-size: clamp(2.4rem, 6vw, 5.5rem); line-height: 1.08; letter-spacing: -0.03em; text-wrap: balance; }
        .sig01-em { font-style: normal; font-weight: 500; }
        .sig01-cap { margin: 1.2em auto 0; max-width: 36ch; font-size: 15px; line-height: 1.5; opacity: 0.9; }
        @media (min-width: 768px) {
          .sig01-frame { width: var(--w); }
        }
        /* Chỉ desktop + có chuyển động: câu chữ đứng yên đúng 35vh (ngân sách ghim) trong khi lá trôi. */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .sig01 { min-height: 0; padding: 0; height: calc(100dvh - var(--header-h, 0px) + 35vh); }
          .sig01-sticky { position: sticky; top: var(--header-h, 0px); height: calc(100dvh - var(--header-h, 0px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sig01-frame, .sig01-bd { will-change: auto; }
        }
      `}</style>
    </section>
  );
}

export default Sig01StickyHeadline;
