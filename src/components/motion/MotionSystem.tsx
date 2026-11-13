"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hệ thống chuyển động toàn trang (GSAP + ScrollTrigger).
 * Component server chỉ khai báo data-attribute; mọi animation được tạo ở đây trong một gsap.matchMedia
 * nên tự dọn dẹp khi unmount và tắt hẳn khi người dùng bật prefers-reduced-motion.
 *
 * data-hero="logo|nav|eyebrow|heading|tagline|fade|cta"  — trình tự mở màn
 * data-hero-image                                          — ảnh hero (không ẩn: là ảnh LCP)
 * data-hero-palm                                           — lớp bóng lá cọ trôi chậm theo cuộn
 * data-reveal="fade-up|blur|words|blur-words|chars|clip-up|clip-center|line|stagger|strips|slide-left|mask-right"
 * data-parallax="<số px>"                                  — phần tử con [data-parallax-inner] trôi chậm hơn scroll
 * data-bg-from="<màu>"                                     — section đổi màu nền khi cuộn vào
 * data-marquee                                             — dải chữ chạy vô hạn, dừng khi khuất màn hình
 * data-magnetic                                            — nút hút nhẹ theo con trỏ (desktop)
 * data-scroll-progress                                     — thanh tiến trình cuộn
 */

const EASE = "expo.out";

export function MotionSystem() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
        finePointer: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, desktop, finePointer } = ctx.conditions as Record<string, boolean>;
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

        /* ---------- Mục menu đang xem ---------- */
        q<HTMLAnchorElement>("[data-nav-link]").forEach((link) => {
          const section = document.querySelector(link.getAttribute("href") ?? "");
          if (!section) return;
          ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) =>
              self.isActive ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current"),
          });
        });

        // Chưa có motion: chỉ cần hiện lại những gì CSS đang ẩn chờ animation.
        if (!motion) {
          gsap.set("[data-hero], [data-reveal]", { clearProps: "all", visibility: "visible" });
          q(".mark-sweep").forEach((el) => el.classList.add("is-on"));
          return;
        }

        const parallaxScale = desktop ? 1 : 0.4;

        /* ---------- Thanh tiến trình cuộn ---------- */
        gsap.fromTo(
          "[data-scroll-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          },
        );

        /* ---------- HERO: mở màn cinematic ---------- */
        const heroImage = document.querySelector("[data-hero-image]");
        const tl = gsap.timeline({ defaults: { ease: EASE, duration: 1.2 } });
        if (heroImage) {
          tl.fromTo(
            heroImage,
            { clipPath: "inset(6% 6% 6% 6% round 28px)", scale: 1.12 },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, duration: 1.8, ease: "power3.out" },
            0,
          );
        }
        tl.fromTo("[data-hero='logo']", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 1 }, 0.2)
          .fromTo(
            "[data-hero='nav'] > *",
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
            0.3,
          )
          .set("[data-hero='nav'], [data-hero='eyebrow'], [data-hero='heading']", { visibility: "visible" }, 0)
          .fromTo(
            "[data-hero='eyebrow'] .split-char",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.025 },
            0.45,
          )
          .fromTo("[data-hero='eyebrow'] [data-line]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0.45)
          .fromTo(
            "[data-hero='heading'] .split-inner",
            { yPercent: 110 },
            { yPercent: 0, duration: 1.3, stagger: 0.1 },
            0.6,
          )
          .fromTo(
            "[data-hero='tagline']",
            { autoAlpha: 0, filter: "blur(10px)", y: 10 },
            { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.2 },
            1.0,
          )
          .fromTo("[data-hero='fade']", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 1.15)
          .fromTo("[data-hero='cta'] > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.12 }, 1.3);

        // Parallax nền hero
        const heroSection = document.querySelector("#trang-chu");
        if (heroSection) {
          gsap.to("[data-hero-parallax]", {
            yPercent: 12 * parallaxScale,
            ease: "none",
            scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-hero='content']", {
            y: -60 * parallaxScale,
            autoAlpha: 0.2,
            ease: "none",
            scrollTrigger: { trigger: heroSection, start: "center center", end: "bottom top", scrub: true },
          });

          // Bóng lá cọ trôi chậm theo cuộn (không đổi opacity; giảm biên độ trên mobile)
          gsap.fromTo(
            "[data-hero-palm]",
            { yPercent: -3, xPercent: 0, rotation: 0 },
            {
              yPercent: 7 * parallaxScale,
              xPercent: -2 * parallaxScale,
              rotation: 1.2,
              ease: "none",
              scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true },
            },
          );
        }

        /* ---------- Reveal khi cuộn (ScrollTrigger.batch để giữ ít trigger) ---------- */
        const reveal = (
          selector: string,
          from: gsap.TweenVars,
          to: gsap.TweenVars,
          target: (el: Element) => Element | Element[] = (el) => el,
        ) => {
          const els = q(selector);
          if (!els.length) return;
          els.forEach((el) => gsap.set(target(el), from));
          gsap.set(els, { visibility: "visible" });
          ScrollTrigger.batch(els, {
            start: "top 85%",
            once: true,
            onEnter: (batch) =>
              batch.forEach((el, i) =>
                gsap.to(target(el), { ...to, ease: EASE, delay: i * 0.12 + Number((el as HTMLElement).dataset.delay ?? 0) }),
              ),
          });
        };

        reveal("[data-reveal='fade-up']", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1.2 });
        reveal(
          "[data-reveal='blur']",
          { autoAlpha: 0, filter: "blur(12px)", y: 12 },
          { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.4 },
        );
        reveal(
          "[data-reveal='words']",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2, stagger: 0.08 },
          (el) => Array.from(el.querySelectorAll(".split-inner")),
        );
        reveal(
          "[data-reveal='blur-words']",
          { autoAlpha: 0, filter: "blur(10px)", yPercent: 60 },
          { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, duration: 0.9, stagger: 0.1 },
          (el) => Array.from(el.querySelectorAll(".split-inner")),
        );
        reveal(
          "[data-reveal='chars']",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.025 },
          (el) => Array.from(el.querySelectorAll(".split-char")),
        );
        reveal("[data-reveal='line']", { scaleX: 0 }, { scaleX: 1, duration: 1.2 });
        reveal(
          "[data-reveal='clip-up']",
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.4 },
        );
        reveal(
          "[data-reveal='clip-center']",
          { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 0.4 },
          { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1.3 },
        );
        reveal("[data-reveal='slide-left']", { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 1.1 });
        reveal(
          "[data-reveal='mask-right']",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 },
        );
        reveal(
          "[data-reveal='stagger']",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 },
          (el) => Array.from(el.children),
        );

        /* Ảnh lộ theo dải: các dải phủ màu nền co lại lần lượt (mặc định CSS scaleY(0) nên không JS vẫn thấy ảnh) */
        reveal(
          "[data-reveal='strips']",
          { scaleY: 1 },
          { scaleY: 0, duration: 1.1, stagger: { each: 0.09, from: "start" } },
          (el) => Array.from(el.querySelectorAll(".reveal-strip")),
        );

        /* ---------- Chữ sáng dần theo vị trí cuộn ---------- */
        q("[data-scrub-text]").forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll(".split-inner"),
            { opacity: 0.18 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            },
          );
        });

        /* ---------- SVG vẽ nét ---------- */
        q<SVGPathElement>("[data-draw]").forEach((path) => {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: path, start: "top 90%", end: "bottom 40%", scrub: 1 },
            },
          );
        });

        /* ---------- Parallax ảnh (biên độ giới hạn, giảm trên mobile) ---------- */
        q("[data-parallax]").forEach((wrap) => {
          const inner = wrap.querySelector("[data-parallax-inner]");
          if (!inner) return;
          const amt = Number(wrap.dataset.parallax || 40) * parallaxScale;
          gsap.fromTo(
            inner,
            { y: -amt },
            { y: amt, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        /* ---------- Chuyển màu nền giữa các section ---------- */
        q("[data-bg-from]").forEach((section) => {
          gsap.fromTo(
            section,
            { backgroundColor: section.dataset.bgFrom },
            {
              backgroundColor: getComputedStyle(section).backgroundColor,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 95%", end: "top 35%", scrub: true },
            },
          );
        });

        /* ---------- Marquee vô hạn ---------- */
        q("[data-marquee]").forEach((track) => {
          const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 40, repeat: -1, paused: true });
          ScrollTrigger.create({
            trigger: track,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
          });
        });

        /* ---------- Sóng hữu cơ: morph nhẹ theo scroll ---------- */
        q<SVGPathElement>("path[data-morph]").forEach((path) => {
          const svg = path.closest("svg");
          gsap.to(path, {
            attr: { d: path.dataset.morph! },
            ease: "none",
            scrollTrigger: { trigger: svg, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        });

        /* ---------- Hình trang trí trôi nhẹ xuyên ranh giới section ---------- */
        q("[data-float]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40 * parallaxScale },
            {
              y: -60 * parallaxScale,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        /* ---------- Counter: đếm từ 0 tới số thật ---------- */
        q("[data-counter]").forEach((el) => {
          const target = Number(el.dataset.counter);
          const from = Number(el.dataset.counterFrom ?? 0);
          const obj = { v: from };
          el.textContent = String(from);
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        /* ---------- Ảnh dịch vụ: thu nhỏ dần khi cuộn vào ---------- */
        q("[data-scale-in]").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.18 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: true } },
          );
        });

        /* ---------- Gallery cuộn ngang có ghim (chỉ desktop ≥ 1024px) ---------- */
        if (window.matchMedia("(min-width: 1024px)").matches) {
          q("[data-hscroll]").forEach((section) => {
            const viewport = section.querySelector<HTMLElement>("[data-hscroll-viewport]");
            const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
            if (!viewport || !track) return;
            gsap.set(viewport, { overflowX: "visible" });
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
            const tween = gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                refreshPriority: 1,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
            // Parallax ảnh bên trong theo chuyển động ngang
            q("[data-hparallax]").filter((p) => section.contains(p)).forEach((p) => {
              gsap.fromTo(
                p,
                { xPercent: -6 },
                {
                  xPercent: 6,
                  ease: "none",
                  scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
                },
              );
            });
          });
        }

        /* ---------- Text Highlighter: quét nét highlight khi cụm từ vào màn hình ---------- */
        q(".mark-sweep").forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => el.classList.add("is-on") });
        });

        /* ---------- Spotlight card: quầng sáng theo con trỏ (chỉ chuột) ---------- */
        if (finePointer) {
          q("[data-spotlight]").forEach((el) => {
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              el.style.setProperty("--mx", `${e.clientX - r.left}px`);
              el.style.setProperty("--my", `${e.clientY - r.top}px`);
            };
            el.addEventListener("pointermove", move);
            ctx.add(() => () => el.removeEventListener("pointermove", move));
          });
        }

        /* ---------- Nút từ tính (chỉ desktop, chuột) ---------- */
        if (finePointer) {
          q("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            ctx.add(() => () => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });
        }

        // Trigger ghim tính trước để các trigger bên dưới cộng đúng khoảng ghim
        ScrollTrigger.sort();

        // Font tải xong có thể đổi chiều cao chữ → tính lại vị trí trigger
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      },
    );

    return () => mm.revert();
  });

  return null;
}
