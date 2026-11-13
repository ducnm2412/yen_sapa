"use client";
// DUDI Signature SIG-505 v1.0.0 — Grid Zoom-in to Center Tile
// Ported to Next.js for Yên Spa — see README Port notes
import { useRef, type CSSProperties, type ElementType } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Sig505Image {
  src: string;
  alt: string;
  /** Real result photo: it is only ever scaled uniformly and rests undistorted */
  isResultPhoto?: boolean;
}

export interface Sig505Props {
  id?: string;
  className?: string;
  /** Root tag. Dùng "div" khi nhúng vào section khác. */
  as?: "section" | "div";
  /** 1 calm · 2 default · 3 bold — pinned scroll length (≤ 150vh × 0.7/1/1.4) and parallax amplitude */
  intensity?: 1 | 2 | 3;
  /** Ghi đè độ dài pin (đơn vị vh) thay cho giá trị suy ra từ intensity */
  pinVh?: number;
  /** Small label above the heading (visible at the start, fades as the zoom begins) */
  eyebrow?: string;
  /** Heading shown over the grid at the start */
  heading?: string;
  /** The hero tile in the top-middle. It ends full-bleed. */
  center: Sig505Image;
  /** The surrounding tiles. Tối đa 5, không lặp lại; ít hơn thì chỉ hiện đúng số ảnh được truyền. */
  around: Sig505Image[];
  /** Caption that rises in over a scrim once the center image is full-bleed */
  caption?: { title: string; text?: string; cta?: { label: string; href: string } };
}

const FACTOR = { 1: 0.7, 2: 1, 3: 1.4 } as const;
const BASE_PIN_VH = 130; // ≤ 150vh × factor
const SCALE = 0.3; // kích thước ô so với stage (rộng và cao) lúc bắt đầu ghim: cùng tỉ lệ với stage nên zoom đều, không méo

/** Lưới 3x2: ô giữa ở (cột 2, hàng 1); 5 ô quanh theo thứ tự đọc kèm hướng trôi ra ngoài. */
const SLOTS = [
  { c: 1, r: 1, dx: -1, dy: 0 },
  { c: 3, r: 1, dx: 1, dy: 0 },
  { c: 1, r: 2, dx: -1, dy: 1 },
  { c: 2, r: 2, dx: 0, dy: 1 },
  { c: 3, r: 2, dx: 1, dy: 1 },
] as const;
/** Extra outward speed per tile so the zoom has depth. */
const SPEEDS = [1, 1.15, 0.85, 0.75, 1.1] as const;

export function Sig505GridZoom({
  id,
  className,
  as = "section",
  intensity = 2,
  pinVh: pinVhProp,
  eyebrow,
  heading,
  center,
  around,
  caption,
}: Sig505Props) {
  const root = useRef<HTMLElement>(null);
  const Root = as as ElementType;
  const pinVh = pinVhProp ?? Math.round(BASE_PIN_VH * FACTOR[intensity]);
  const tiles = around.slice(0, SLOTS.length);
  const depKey = `${center.src}|${tiles.map((t) => t.src).join("|")}`;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce, mobile } = ctx.conditions as { reduce: boolean; mobile: boolean; desktop: boolean };
          // Reduced motion: static grid + caption, no pin, no scrub.
          if (reduce) return;

          const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel);
          const centerTile = q(".sig505-center");
          const centerImg = q(".sig505-center img");
          const capEl = q(".sig505-cap");
          const headEl = q(".sig505-head");
          const aroundEls = gsap.utils.toArray<HTMLElement>(".sig505-around", el);

          if (mobile) {
            // Mobile: không pin. Thẻ giữa mở ra full-bleed theo cuộn tự nhiên; các ô còn lại hiện lần lượt.
            if (centerTile) {
              gsap.fromTo(
                centerTile,
                { clipPath: "inset(7% 16px 7% 16px round 22px)" },
                {
                  clipPath: "inset(0% 0px 0% 0px round 0px)",
                  ease: "none",
                  scrollTrigger: { trigger: centerTile, start: "top 88%", end: "top 22%", scrub: 0.4, invalidateOnRefresh: true },
                },
              );
              if (centerImg) {
                gsap.fromTo(
                  centerImg,
                  { scale: 1.15 },
                  { scale: 1, ease: "none", scrollTrigger: { trigger: centerTile, start: "top 88%", end: "top 22%", scrub: 0.4, invalidateOnRefresh: true } },
                );
              }
            }
            aroundEls.forEach((tile, i) => {
              gsap.from(tile, {
                opacity: 0,
                y: 32,
                duration: 0.7,
                ease: "power2.out",
                delay: (i % 2) * 0.08,
                scrollTrigger: { trigger: tile, start: "top 92%", toggleActions: "play none none none" },
              });
            });
            if (capEl) {
              gsap.from(capEl, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: capEl, start: "top 92%", toggleActions: "play none none none" },
              });
            }
            return;
          }

          // Desktop: stage được ghim, cả lưới phóng to cho tới khi ô giữa phủ kín stage.
          const stage = q(".sig505-stage");
          const grid = q(".sig505-grid");
          if (!stage || !grid || !centerTile) return;

          const amp = intensity === 1 ? 0.7 : intensity === 3 ? 1.35 : 1;
          // scroll-margin-top của root là var(--header-h) đã được trình duyệt đổi sang px (đọc thẳng biến sẽ ra "5rem").
          const headerH = () => parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          // Scale cuối tính từ layout: stage ÷ ô giữa (đều hai chiều nên không méo).
          const finalScale = () =>
            Math.max(stage.clientWidth / centerTile.offsetWidth, stage.clientHeight / centerTile.offsetHeight) * 1.002;
          // Ô giữa không nằm đúng tâm lưới: dịch lưới để tâm ô giữa trùng tâm stage khi scale quanh tâm lưới.
          const tileCx = () => centerTile.offsetLeft + centerTile.offsetWidth / 2 - grid.offsetWidth / 2;
          const tileCy = () => centerTile.offsetTop + centerTile.offsetHeight / 2 - grid.offsetHeight / 2;
          const shiftX = () => stage.clientWidth / 2 - (grid.offsetLeft + grid.offsetWidth / 2) - finalScale() * tileCx();
          const shiftY = () => stage.clientHeight / 2 - (grid.offsetTop + grid.offsetHeight / 2) - finalScale() * tileCy();

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              start: () => `top top+=${headerH()}`,
              end: () => `+=${(window.innerHeight * pinVh) / 100}`,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          if (headEl) tl.fromTo(headEl, { opacity: 1, y: 0 }, { opacity: 0, y: -28, duration: 0.15, ease: "power1.out" }, 0.05);
          tl.fromTo(
            grid,
            { scale: 1, x: 0, y: 0 },
            { scale: finalScale, x: shiftX, y: shiftY, duration: 0.8, ease: "power2.inOut" },
            0.05,
          );
          // Parallax tạo chiều sâu: mỗi ô lân cận trôi ra ngoài với tốc độ riêng và phình nhẹ.
          aroundEls.forEach((tile, i) => {
            const slot = SLOTS[i % SLOTS.length];
            const sp = SPEEDS[i % SPEEDS.length] * amp;
            tl.fromTo(
              tile,
              { xPercent: 0, yPercent: 0, scale: 1 },
              { xPercent: slot.dx * sp * 55, yPercent: slot.dy * sp * 55, scale: 1 + 0.12 * sp, duration: 0.8, ease: "power2.inOut" },
              0.05,
            );
          });
          // Vuông góc cho ô giữa khi nó trở thành full-bleed.
          tl.fromTo(centerTile, { clipPath: "inset(0px round 8px)" }, { clipPath: "inset(0px round 0px)", duration: 0.3 }, 0.55);
          if (centerImg) tl.fromTo(centerImg, { scale: 1.1 }, { scale: 1, duration: 0.8, ease: "power2.inOut" }, 0.05);
          if (capEl) tl.fromTo(capEl, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0.85);
          // Giữ ngắn để khung cuối nghỉ trước khi nhả pin.
          tl.to({}, { duration: 0.15 });
        },
      );
    },
    { scope: root, dependencies: [intensity, pinVh, depKey] },
  );

  return (
    <Root
      id={id}
      ref={root}
      data-sig="505"
      className={["sig505", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        background: "var(--sig-bg, #0e0e0e)",
        color: "var(--sig-fg, #f4efe8)",
        fontFamily: "var(--sig-font-body, system-ui, sans-serif)",
        scrollMarginTop: "var(--header-h, 0px)",
      }}
    >
      <div className="sig505-stage">
        {(eyebrow || heading) && (
          <header className="sig505-head">
            {eyebrow && <p className="sig505-eyebrow">{eyebrow}</p>}
            {heading && <h2 className="sig505-h">{heading}</h2>}
          </header>
        )}

        <div className="sig505-grid">
          <figure className="sig505-tile sig505-center" style={{ "--c": 2, "--r": 1 } as CSSProperties}>
            <Image src={center.src} alt={center.alt} fill sizes="100vw" draggable={false} className="object-cover" />
          </figure>
          {tiles.map((t, i) => (
            <figure key={t.src} className="sig505-tile sig505-around" style={{ "--c": SLOTS[i].c, "--r": SLOTS[i].r } as CSSProperties}>
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes="(min-width: 768px) 28vw, 50vw"
                draggable={false}
                className="object-cover"
              />
            </figure>
          ))}
        </div>

        {caption && (
          <div className="sig505-cap">
            <div className="sig505-scrim" aria-hidden="true" />
            <div className="sig505-cap-in">
              <h3 className="sig505-cap-title">{caption.title}</h3>
              {caption.text && <p className="sig505-cap-text">{caption.text}</p>}
              {caption.cta && (
                <a className="sig505-cta" href={caption.cta.href}>
                  {caption.cta.label}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Mặc định = trạng thái cuối, tĩnh (không JS / reduced motion): tiêu đề, lưới, chú thích nằm trong luồng. */
        .sig505-stage { position: relative; padding: clamp(2.5rem, 8vh, 5rem) 5vw clamp(2.5rem, 8vh, 5rem); box-sizing: border-box; }
        .sig505-head { text-align: center; margin: 0 auto clamp(1.5rem, 4vh, 2.5rem); max-width: 48rem; }
        .sig505-eyebrow { margin: 0 0 0.6rem; font-size: 12px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
        .sig505-h { margin: 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(1.75rem, 4vw, 3rem); line-height: 1.2; letter-spacing: -0.015em; }
        .sig505-grid { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 1100px; margin: 0 auto; }
        .sig505-tile { position: relative; margin: 0; overflow: hidden; aspect-ratio: 4 / 3; grid-column: var(--c); grid-row: var(--r); clip-path: inset(0px round 8px); background: color-mix(in oklab, var(--sig-fg, #f4efe8) 8%, transparent); }
        .sig505-tile img { display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; }
        .sig505-cap { --_cf: var(--sig-fg, #f4efe8); position: relative; max-width: 40rem; margin: clamp(2rem, 5vh, 3rem) auto 0; text-align: center; }
        .sig505-scrim { display: none; }
        .sig505-cap-title { margin: 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(1.6rem, 3.2vw, 2.6rem); line-height: 1.2; }
        .sig505-cap-text { margin: 0.9rem 0 0; font-size: 1.05rem; line-height: 1.55; color: color-mix(in oklab, var(--_cf) 82%, transparent); }
        .sig505-cta { display: inline-block; margin-top: 1.4rem; padding: 0.8rem 1.6rem; border-radius: 999px; background: var(--sig-accent, #e0a25b); color: var(--sig-bg, #0e0e0e); font-weight: 600; text-decoration: none; }
        .sig505-cta:focus-visible { outline: 2px solid var(--sig-fg, #f4efe8); outline-offset: 3px; }

        /* Desktop có chuyển động: stage ghim. Áp bằng CSS ngay từ đầu để không bị nhảy bố cục khi hydrate. */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .sig505-stage { height: calc(100dvh - var(--header-h, 0px)); padding: 0; overflow: hidden; display: grid; place-items: center; }
          .sig505-grid { --s: ${SCALE}; max-width: none; margin: 0; gap: 1vmin; grid-template-columns: repeat(3, calc(var(--s) * 100vw)); grid-template-rows: repeat(2, calc(var(--s) * (100dvh - var(--header-h, 0px)))); will-change: transform; }
          .sig505-tile { aspect-ratio: auto; will-change: transform; }
          .sig505-center img { will-change: transform; }
          .sig505-head { position: absolute; top: 2.2vh; left: 0; right: 0; margin: 0 auto; z-index: 3; }
          .sig505-eyebrow { margin-bottom: 0.3rem; }
          .sig505-h { font-size: clamp(1.4rem, 3.6vh, 2.2rem); }
          .js .sig505-cap { opacity: 0; }
          .sig505-cap { --_cf: var(--sig-cap-fg, var(--sig-fg, #f4efe8)); position: absolute; left: 0; right: 0; bottom: 0; max-width: none; margin: 0; z-index: 3; text-align: left; color: var(--_cf); }
          .sig505-scrim { display: block; position: absolute; inset: -30vh 0 0 0; background: linear-gradient(to top, color-mix(in oklab, var(--sig-scrim, var(--sig-bg, #0e0e0e)) 88%, transparent) 15%, transparent); }
          .sig505-cap-in { position: relative; max-width: 44rem; padding: 0 6vw clamp(1.5rem, 7vh, 4rem); }
        }

        /* Mobile: lưới 2 cột (không pin). Ô giữa là thẻ rộng hết bề ngang, mở ra full-bleed theo cuộn. */
        @media (max-width: 767px) {
          .sig505-stage { padding: 3rem 16px 3rem; }
          .sig505-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .sig505-tile { grid-column: auto; grid-row: auto; aspect-ratio: 3 / 4; }
          .sig505-center { grid-column: 1 / -1; margin: 0 -16px; aspect-ratio: 4 / 5; clip-path: inset(0% 0px 0% 0px round 0px); }
          .sig505-around:nth-child(even):last-child { grid-column: 1 / -1; aspect-ratio: 16 / 10; }
          .sig505-cap { text-align: left; }
        }
      `}</style>
    </Root>
  );
}

export default Sig505GridZoom;
