"use client";
// DUDI Signature SIG-1211 v1.0.0 — Card-over Section Transition
// Ported to Next.js for Yên Spa — see README Port notes
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Sig1211Props {
  id?: string;
  className?: string;
  /** Biến CSS `--sig-*` do wrapper server truyền xuống (đồng bộ theme tokens) */
  style?: CSSProperties;
  /** 1 calm · 2 default · 3 bold — scale-down amount, corner radius, overlay strength */
  intensity?: 1 | 2 | 3;
  /** The section that stays put and gets covered. Any height. */
  outgoing: ReactNode;
  /** The section that slides over it like a card. Needs no background of its own (it gets `--sig-bg`), but may set one. */
  incoming: ReactNode;
  /** id placed on the incoming wrapper so nav anchors can target it (gets scroll-margin-top: var(--header-h)) */
  incomingId?: string;
  /** Top corner radius of the incoming card at the start, any CSS length (e.g. "2rem"). Default comes from `intensity`. */
  radius?: string;
  /** Color of the dark overlay that fades in over the outgoing section. Default `var(--sig-bg)`. */
  overlayColor?: string;
}

const SCALE = { 1: 0.95, 2: 0.92, 3: 0.88 } as const;
const RADIUS_PX = { 1: 20, 2: 32, 3: 48 } as const;
const OVERLAY = { 1: 0.35, 2: 0.5, 3: 0.65 } as const;

/** Resolve any CSS length to pixels by letting the browser compute it on a real element. */
function resolveRadius(el: HTMLElement, css: string | undefined, fallbackPx: number) {
  if (!css) return fallbackPx;
  const prev = el.style.borderTopLeftRadius;
  el.style.borderTopLeftRadius = css;
  const px = parseFloat(getComputedStyle(el).borderTopLeftRadius);
  el.style.borderTopLeftRadius = prev;
  return Number.isFinite(px) ? px : fallbackPx;
}

export function Sig1211CardOver({
  id,
  className,
  style,
  intensity = 2,
  outgoing,
  incoming,
  incomingId,
  radius,
  overlayColor,
}: Sig1211Props) {
  const root = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stickEl = stick.current;
      const innerEl = inner.current;
      const overlayEl = overlay.current;
      const cardEl = card.current;
      if (!rootEl || !stickEl || !innerEl || !overlayEl || !cardEl) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean };
          let skipScale = false;

          // Hold: CSS sticky. top = viewportHeight − sectionHeight, so the section sticks exactly when its bottom
          // edge reaches the viewport bottom (negative for tall sections, positive for short ones).
          const setTop = () => {
            const vh = window.innerHeight;
            const h = stickEl.offsetHeight;
            stickEl.style.top = `${vh - h}px`;
            skipScale = mobile && h > vh * 1.5;
          };
          stickEl.style.position = "sticky";
          stickEl.style.zIndex = "0";
          innerEl.style.transformOrigin = "50% 100%";
          innerEl.style.overflow = "clip";
          cardEl.style.overflow = "clip";
          cardEl.style.setProperty("overflow-clip-margin", "12px");
          setTop();

          const baseScale = SCALE[intensity];
          const scaleTo = () => (skipScale ? 1 : mobile ? 1 - (1 - baseScale) / 2 : baseScale);
          const radiusPx = () => {
            const r = resolveRadius(cardEl, radius, RADIUS_PX[intensity]);
            return mobile ? r * 0.6 : r;
          };
          const overlayTo = OVERLAY[intensity] * (mobile ? 0.6 : 1);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: cardEl,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(innerEl, { scale: 1 }, { scale: scaleTo, duration: 1 }, 0);
          tl.fromTo(innerEl, { borderRadius: 0 }, { borderRadius: () => radiusPx() * 0.75, duration: 1 }, 0);
          tl.fromTo(overlayEl, { opacity: 0 }, { opacity: overlayTo, duration: 1 }, 0);
          tl.fromTo(
            cardEl,
            { borderTopLeftRadius: radiusPx, borderTopRightRadius: radiusPx },
            { borderTopLeftRadius: 0, borderTopRightRadius: 0, duration: 0.6, ease: "power1.out" },
            0.4,
          );

          // Slot heights are unknown and can change (fonts, images, accordions): re-measure, then refresh.
          const onRefreshInit = () => setTop();
          ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
          let raf = 0;
          const ro = new ResizeObserver(() => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
              setTop();
              ScrollTrigger.refresh();
            });
          });
          ro.observe(innerEl);
          ro.observe(cardEl);

          let alive = true;
          const refresh = () => alive && ScrollTrigger.refresh();
          rootEl.querySelectorAll("img").forEach((img) => {
            if (img.complete) return;
            img.decode().then(refresh, refresh);
          });
          document.fonts?.ready.then(refresh);

          return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
            stickEl.style.position = "";
            stickEl.style.top = "";
            stickEl.style.zIndex = "";
            innerEl.style.transformOrigin = "";
            innerEl.style.overflow = "";
            cardEl.style.overflow = "";
            cardEl.style.removeProperty("overflow-clip-margin");
          };
        },
      );
      // Reduced motion: no branch registered. Two sections stay in normal flow, nothing sticks, nothing scales.
      return () => mm.revert();
    },
    { scope: root, dependencies: [intensity, radius] },
  );

  return (
    <div
      id={id}
      ref={root}
      className={className}
      data-sig="1211"
      style={{
        position: "relative",
        overflowX: "clip",
        scrollMarginTop: "var(--header-h, 0px)",
        ...style,
      }}
    >
      <div ref={stick} data-sig1211-stick="" style={{ position: "relative" }}>
        <div ref={inner} data-sig1211-inner="" style={{ position: "relative", background: "var(--sig-bg, #0e0e0e)" }}>
          {outgoing}
          <div
            ref={overlay}
            data-sig1211-overlay=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              pointerEvents: "none",
              background: overlayColor ?? "var(--sig-bg, #0e0e0e)",
            }}
          />
        </div>
      </div>
      <div
        ref={card}
        id={incomingId}
        data-sig1211-card=""
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--sig-bg, #0e0e0e)",
          boxShadow: "var(--sig-card-shadow, 0 -18px 50px -10px rgba(0, 0, 0, 0.35))",
          scrollMarginTop: "var(--header-h, 0px)",
        }}
      >
        {incoming}
      </div>
    </div>
  );
}

export default Sig1211CardOver;
