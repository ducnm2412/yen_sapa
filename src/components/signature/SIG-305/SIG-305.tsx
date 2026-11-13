"use client";
// DUDI Signature SIG-305 v1.0.0 — Highlighter Line by Line
// Ported to Next.js for Yên Spa — see README Port notes
import { Fragment, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FACTOR: Record<1 | 2 | 3, number> = { 1: 0.7, 2: 1, 3: 1.4 };

export interface SIG305Labels {
  section?: string;
}

export interface SIG305Props {
  id?: string;
  className?: string;
  intensity?: 1 | 2 | 3;
  lines: string[];
  attribution?: string;
  labels?: SIG305Labels;
  /** "section" = khối toàn màn hình như bản gốc; "inline" = chỉ blockquote, kiểu chữ do className quyết định */
  variant?: "section" | "inline";
}

export function SIG305({ id, className, intensity = 2, lines, attribution, labels, variant = "section" }: SIG305Props) {
  const root = useRef<HTMLElement>(null);
  const factor = FACTOR[intensity];
  const inline = variant === "inline";

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
          const { desktop: isDesktop = false } = ctx.conditions as { desktop?: boolean };
          const els = gsap.utils.toArray<HTMLElement>(".sig305-line", el);
          if (!els.length) return;

          if (isDesktop) {
            // Một timeline qua các dòng, gắn vào vị trí cuộn, KHÔNG ghim (ngân sách pin của trang).
            const tl = gsap.timeline({ defaults: { ease: "none" } });
            els.forEach((line) => {
              tl.fromTo(line, { backgroundSize: "0% 55%" }, { backgroundSize: "100% 55%", duration: 1 });
            });
            ScrollTrigger.create({
              trigger: el,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
              animation: tl,
              invalidateOnRefresh: true,
            });
          } else {
            // Mobile: mỗi dòng một trigger riêng, không pin.
            els.forEach((line, i) => {
              gsap.fromTo(
                line,
                { backgroundSize: "0% 55%" },
                {
                  backgroundSize: "100% 55%",
                  ease: "power2.out",
                  duration: 0.65 * factor,
                  delay: i * 0.06,
                  scrollTrigger: {
                    trigger: line,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true,
                  },
                },
              );
            });
          }
        },
      );
    },
    { scope: root, dependencies: [intensity, lines.join("||")] },
  );

  const text = lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {" "}
          <br className="sig305-br" />
        </>
      )}
      <span className="sig305-line">{line}</span>
    </Fragment>
  ));

  const styles = (
    <style>{`
      /* Mặc định (không JS, reduced motion): highlight đã hiện đủ. Chỉ khi có chuyển động và có JS mới bắt đầu từ 0. */
      .sig305-line { background-image: linear-gradient(to right, var(--sig-hl, rgba(224,162,91,0.38)) 0%, var(--sig-hl, rgba(224,162,91,0.38)) 100%); background-repeat: no-repeat; background-position: 0 85%; background-size: 100% 55%; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding-bottom: 0.06em; }
      @media (prefers-reduced-motion: no-preference) {
        .js .sig305-line { background-size: 0% 55%; }
      }
      @media (max-width: 639px) {
        .sig305-br { display: none; }
      }
    `}</style>
  );

  if (inline) {
    return (
      <blockquote ref={root as RefObject<HTMLQuoteElement | null>} id={id} className={className} style={{ margin: 0, padding: 0, border: "none" }}>
        {text}
        {styles}
      </blockquote>
    );
  }

  return (
    <section
      ref={root}
      id={id}
      className={className}
      aria-label={labels?.section ?? "Trích dẫn nổi bật"}
      style={{
        scrollMarginTop: "var(--header-h, 0px)",
        backgroundColor: "var(--sig-bg, #0e0e0e)",
        color: "var(--sig-fg, #f4efe8)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(5rem, 12vw, 8rem) clamp(1.5rem, 8vw, 7rem)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dấu ngoặc kép trang trí */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(0.5rem, 4vw, 3rem)",
          left: "clamp(1rem, 5vw, 4rem)",
          fontFamily: "var(--sig-font-display, serif)",
          fontSize: "clamp(9rem, 22vw, 20rem)",
          lineHeight: 1,
          fontWeight: 900,
          color: "var(--sig-accent, #e0a25b)",
          opacity: 0.07,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        {"“"}
      </span>

      <blockquote style={{ margin: 0, padding: 0, border: "none", maxWidth: "min(840px, 100%)", width: "100%", position: "relative", zIndex: 1 }}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--sig-font-display, serif)",
            fontSize: "clamp(1.8rem, 4.2vw, 3.8rem)",
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: "-0.022em",
          }}
        >
          {text}
        </p>

        {attribution && (
          <footer
            style={{
              marginTop: "clamp(2rem, 5vw, 3.5rem)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontFamily: "var(--sig-font-body, system-ui, sans-serif)",
              fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)",
              color: "var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 35%, transparent))",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true" style={{ display: "block", width: "2rem", height: "1px", backgroundColor: "currentColor", flexShrink: 0 }} />
            {attribution}
          </footer>
        )}
      </blockquote>
      {styles}
    </section>
  );
}

export default SIG305;
