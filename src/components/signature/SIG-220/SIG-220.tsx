"use client";
// DUDI Signature SIG-220 v1.0.0 — Polaroid Scatter Hero
// Ported to Next.js for Yên Spa — see README Port notes
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Sig220Item {
  src: string;
  alt: string;
  /** Kích thước thật của ảnh (next/image) */
  width: number;
  height: number;
  /** Chỉ hiển thị khi có dữ kiện thật */
  caption?: string;
  /** Ảnh thật: luôn object-contain, không bao giờ bị cắt hay méo lúc nghỉ */
  isResultPhoto?: boolean;
}

export interface Sig220Labels {
  /** aria-label của cả bàn ảnh */
  group: string;
  /** Gợi ý kéo thả, chỉ hiện khi kéo được (chuột, từ 768px) */
  dragHint?: string;
  /** Gợi ý vuốt ngang, chỉ hiện ở dưới 768px */
  swipeHint?: string;
}

export interface Sig220Props {
  className?: string;
  /** 1 calm · 2 default · 3 bold — hệ số cho độ nghiêng, thời lượng và khoảng rơi */
  intensity?: 1 | 2 | 3;
  /** Tối đa 7 ảnh */
  items: readonly Sig220Item[];
  labels: Sig220Labels;
}

/** Vị trí nghỉ trên bàn (desktop): fx/fy là tỉ lệ trong vùng còn lại của bàn, r là độ nghiêng (độ). Dữ liệu cố định, không ngẫu nhiên. */
const SCATTER7 = [
  { fx: 0.02, fy: 0.04, r: -8 },
  { fx: 0.5, fy: 0.0, r: 5 },
  { fx: 0.98, fy: 0.1, r: -4 },
  { fx: 0.14, fy: 0.52, r: 7 },
  { fx: 0.56, fy: 0.44, r: -6 },
  { fx: 0.96, fy: 0.62, r: 4 },
  { fx: 0.4, fy: 0.98, r: -3 },
] as const;

const FACTOR = { 1: 0.7, 2: 1, 3: 1.4 } as const;
const SPRING = 0.2;
const FRICTION = 0.84;
const INSET = 8;
const DROP_Y = 120;

interface Phys {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  bx: number;
  by: number;
  px: number;
  py: number;
  dragging: boolean;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const mkPhys = (): Phys => ({
  x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, bx: 0, by: 0, px: 0, py: 0,
  dragging: false, minX: 0, maxX: 0, minY: 0, maxY: 0,
});

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function SIG220({ className, intensity = 2, items, labels }: Sig220Props) {
  const table = useRef<HTMLUListElement>(null);
  const cardEls = useRef<(HTMLLIElement | null)[]>([]);
  const phys = useRef<Phys[]>([]);
  const zTop = useRef(10);
  const live = useRef(true);
  const interactiveRef = useRef(false);
  const [interactive, setInteractive] = useState(false);

  const factor = FACTOR[intensity];
  const count = Math.min(items.length, SCATTER7.length);

  /** Giới hạn dịch chuyển để hộp của thẻ luôn nằm trong bàn (cách mép 8px); tư thế nghỉ luôn hợp lệ. */
  const measure = (i: number) => {
    const el = cardEls.current[i];
    const t = table.current;
    const p = phys.current[i];
    if (!el || !t || !p) return;
    p.minX = Math.min(0, INSET - el.offsetLeft);
    p.maxX = Math.max(0, t.clientWidth - INSET - el.offsetLeft - el.offsetWidth);
    p.minY = Math.min(0, INSET - el.offsetTop);
    p.maxY = Math.max(0, t.clientHeight - INSET - el.offsetTop - el.offsetHeight);
  };

  const bringFront = (i: number) => {
    const el = cardEls.current[i];
    if (!el) return;
    zTop.current += 1;
    el.style.zIndex = String(zTop.current);
  };

  useGSAP(
    () => {
      const tableEl = table.current;
      if (!tableEl) return;
      phys.current = Array.from({ length: count }, (_, i) => phys.current[i] ?? mkPhys());

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { desktop, motion, fine } = ctx.conditions as { desktop: boolean; motion: boolean; fine: boolean };
          if (!desktop || !motion) return; // giảm chuyển động / mobile: bố cục CSS tĩnh, đủ ảnh

          const drops = Array.from(tableEl.querySelectorAll<HTMLElement>("[data-sig220-drop]"));

          /* ---- Rơi vào bàn khi cuộn tới ---- */
          gsap.set(drops, {
            autoAlpha: 0,
            y: -DROP_Y * factor,
            rotation: (i: number) => (i % 2 ? 8 : -8) * factor,
          });
          let played = false;
          const show = (immediate: boolean) => {
            if (played) return;
            played = true;
            const done = () => gsap.set(drops, { clearProps: "transform,opacity,visibility" });
            if (immediate) {
              done();
              return;
            }
            gsap.to(drops, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.78 * factor,
              stagger: 0.11 * factor,
              ease: "back.out(1.3)",
              onComplete: done,
            });
          };
          const st = ScrollTrigger.create({
            trigger: tableEl,
            start: "top 75%",
            once: true,
            onEnter: () => show(false),
          });
          // Vào trang khi đã ở dưới điểm bắt đầu (liên kết neo, tải lại giữa trang): hiện ngay, không để ẩn.
          if (st.scroll() > st.start) show(true);

          if (!fine) {
            return () => {
              played = true;
              gsap.set(drops, { clearProps: "transform,opacity,visibility" });
              st.kill();
            };
          }

          /* ---- Kéo thả (chỉ chuột/bút, từ 768px, có chuyển động) ---- */
          interactiveRef.current = true;
          setInteractive(true);

          const tick = () => {
            if (!live.current) return;
            for (let i = 0; i < count; i++) {
              const p = phys.current[i];
              const el = cardEls.current[i];
              if (!p || !el) continue;
              if (p.dragging) {
                p.vx += (p.tx - p.x) * SPRING;
                p.vy += (p.ty - p.y) * SPRING;
              }
              p.vx *= FRICTION;
              p.vy *= FRICTION;
              if (Math.abs(p.vx) < 0.01 && Math.abs(p.vy) < 0.01 && !p.dragging) {
                p.vx = 0;
                p.vy = 0;
                continue;
              }
              p.x += p.vx;
              p.y += p.vy;
              if (p.x < p.minX) {
                p.x = p.minX;
                p.vx = 0;
              } else if (p.x > p.maxX) {
                p.x = p.maxX;
                p.vx = 0;
              }
              if (p.y < p.minY) {
                p.y = p.minY;
                p.vy = 0;
              } else if (p.y > p.maxY) {
                p.y = p.maxY;
                p.vy = 0;
              }
              // CSS `translate` (áp trước `rotate`) nên độ dịch đúng theo trục màn hình dù thẻ đang nghiêng
              el.style.translate = `${p.x}px ${p.y}px`;
            }
          };
          gsap.ticker.add(tick);

          const onVis = () => {
            live.current = !document.hidden;
          };
          document.addEventListener("visibilitychange", onVis);
          const io = new IntersectionObserver(
            ([e]) => {
              live.current = e.isIntersecting && !document.hidden;
            },
            { threshold: 0.05 },
          );
          io.observe(tableEl);

          const onResize = () => {
            for (let i = 0; i < count; i++) {
              const p = phys.current[i];
              const el = cardEls.current[i];
              if (!p || !el) continue;
              measure(i);
              p.x = clamp(p.x, p.minX, p.maxX);
              p.y = clamp(p.y, p.minY, p.maxY);
              el.style.translate = p.x || p.y ? `${p.x}px ${p.y}px` : "";
            }
          };
          window.addEventListener("resize", onResize);

          return () => {
            played = true;
            interactiveRef.current = false;
            setInteractive(false);
            gsap.ticker.remove(tick);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("resize", onResize);
            io.disconnect();
            st.kill();
            gsap.set(drops, { clearProps: "transform,opacity,visibility" });
            for (let i = 0; i < count; i++) {
              const el = cardEls.current[i];
              const p = phys.current[i];
              if (el) {
                el.style.translate = "";
                el.style.zIndex = "";
              }
              if (p) Object.assign(p, mkPhys());
            }
          };
        },
      );
      return () => mm.revert();
    },
    { scope: table, dependencies: [count, factor] },
  );

  const onDown = (e: PointerEvent<HTMLLIElement>, i: number) => {
    if (!interactiveRef.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    const p = phys.current[i];
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    measure(i);
    p.dragging = true;
    p.px = e.clientX;
    p.py = e.clientY;
    p.bx = p.x;
    p.by = p.y;
    p.tx = p.x;
    p.ty = p.y;
    bringFront(i);
  };

  const onMove = (e: PointerEvent<HTMLLIElement>, i: number) => {
    const p = phys.current[i];
    if (!p?.dragging) return;
    p.tx = clamp(p.bx + (e.clientX - p.px), p.minX, p.maxX);
    p.ty = clamp(p.by + (e.clientY - p.py), p.minY, p.maxY);
  };

  const onUp = (i: number) => {
    const p = phys.current[i];
    if (p) p.dragging = false;
  };

  const onKey = (e: KeyboardEvent<HTMLLIElement>, i: number) => {
    if (!interactiveRef.current) return;
    const dirs: Partial<Record<string, [number, number]>> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const d = dirs[e.key];
    const p = phys.current[i];
    if (!d || !p) return;
    e.preventDefault();
    measure(i);
    p.vx += d[0] * 16;
    p.vy += d[1] * 16;
    bringFront(i);
  };

  return (
    <div data-sig="220" className={className}>
      <ul
        ref={table}
        data-sig220-table=""
        data-interactive={interactive ? "" : undefined}
        aria-label={labels.group}
        className="sig220-table"
      >
        {items.slice(0, count).map((it, i) => {
          const s = SCATTER7[i];
          const style = {
            "--fx": s.fx,
            "--fy": s.fy,
            "--r": `${s.r * factor}deg`,
            "--mr": i % 2 ? "2deg" : "-2deg",
          } as CSSProperties;
          return (
            <li
              key={it.src}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              data-sig220-card=""
              className="sig220-card"
              style={style}
              tabIndex={interactive ? 0 : undefined}
              onPointerDown={(e) => onDown(e, i)}
              onPointerMove={(e) => onMove(e, i)}
              onPointerUp={() => onUp(i)}
              onPointerCancel={() => onUp(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <div data-sig220-drop="" className="sig220-drop">
                <div className="sig220-photo">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    width={it.width}
                    height={it.height}
                    draggable={false}
                    sizes="(min-width: 1024px) 184px, (min-width: 768px) 160px, 62vw"
                    className="sig220-img"
                  />
                </div>
                {it.caption ? <span className="sig220-cap">{it.caption}</span> : null}
              </div>
            </li>
          );
        })}
      </ul>
      {interactive && labels.dragHint ? <p className="sig220-hint sig220-hint-drag">{labels.dragHint}</p> : null}
      {labels.swipeHint ? <p className="sig220-hint sig220-hint-swipe">{labels.swipeHint}</p> : null}

      <style>{`
        [data-sig="220"] { min-width: 0; max-width: 100%; }
        [data-sig="220"] .sig220-table {
          position: relative;
          isolation: isolate;
          list-style: none;
          margin: 0 -1rem;
          padding: 1.5rem 1rem;
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
        }
        [data-sig="220"] .sig220-table::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) {
          [data-sig="220"] .sig220-table { margin-inline: -1.5rem; padding-inline: 1.5rem; }
        }
        [data-sig="220"] .sig220-card {
          flex: none;
          width: min(62vw, 15rem);
          scroll-snap-align: center;
          rotate: var(--mr, 0deg);
          margin: 0;
          padding: 0;
        }
        [data-sig="220"] .sig220-drop {
          position: relative;
          box-sizing: border-box;
          background: #fff;
          border-radius: 2px;
          padding: 0.75rem 0.75rem 2.25rem;
          box-shadow: 0 14px 30px -14px rgba(38, 48, 32, 0.45), 0 2px 6px rgba(38, 48, 32, 0.16);
        }
        [data-sig="220"] .sig220-photo {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--color-beige-100, #f0e7d7);
        }
        [data-sig="220"] .sig220-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          max-width: none;
        }
        [data-sig="220"] .sig220-cap {
          position: absolute;
          inset: auto 0.5rem 0.45rem;
          text-align: center;
          font-size: 0.7rem;
          line-height: 1.2;
          color: var(--color-muted, #5f5a50);
        }
        [data-sig="220"] .sig220-hint {
          margin: 0.5rem 0 0;
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--color-muted, #5f5a50);
        }
        [data-sig="220"] .sig220-hint-swipe { text-align: center; }
        [data-sig="220"] .sig220-hint-drag { display: none; text-align: right; }
        [data-sig="220"] .sig220-card:focus-visible {
          outline: 2px solid var(--sig-accent, var(--color-gold-500, #b8975a));
          outline-offset: 4px;
        }

        @media (min-width: 768px) {
          [data-sig="220"] .sig220-table {
            display: block;
            height: 30rem;
            margin: 0;
            padding: 0;
            overflow: visible;
            scroll-snap-type: none;
            --cw: 10rem;
            --ch: calc(var(--cw) + 1.5rem);
          }
          [data-sig="220"] .sig220-card {
            position: absolute;
            width: var(--cw);
            left: calc((100% - var(--cw)) * var(--fx));
            top: calc((100% - var(--ch)) * var(--fy));
            rotate: var(--r, 0deg);
            scroll-snap-align: none;
          }
          [data-sig="220"] .sig220-hint-swipe { display: none; }
          [data-sig="220"] .sig220-hint-drag { display: block; }
          [data-sig="220"] .sig220-table[data-interactive] .sig220-card {
            cursor: grab;
            touch-action: none;
            user-select: none;
          }
          [data-sig="220"] .sig220-table[data-interactive] .sig220-card:active { cursor: grabbing; }
        }
        @media (min-width: 1024px) {
          [data-sig="220"] .sig220-table { height: 34rem; --cw: 11.5rem; }
        }
      `}</style>
    </div>
  );
}

export default SIG220;
