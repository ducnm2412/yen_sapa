"use client";
// DUDI Signature SIG-403 v1.0.0 — Hover List Image Reveal
// Built in-project for Yên Spa (not yet cast in the DUDI library) — see README Port notes
import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface Sig403Image {
  src: string;
  alt: string;
  /** Ảnh kết quả thật: object-fit contain thay vì cover */
  isResultPhoto?: boolean;
}

export interface Sig403Item {
  id: string;
  /** Hiển thị ở h3 */
  title: string;
  /** Dòng nhỏ dưới tên */
  sub?: string;
  /** Đích của cả hàng */
  href: string;
  image: Sig403Image;
  /** object-position của khung 4:5, ví dụ "50% 40%" */
  focus?: string;
}

export interface Sig403Labels {
  /** aria-label của danh sách */
  list: string;
}

export interface Sig403Props {
  id?: string;
  className?: string;
  /** 1 calm · 2 default · 3 bold — hệ số cho độ trễ bám chuột, nghiêng theo vận tốc và cú hé ảnh */
  intensity?: 1 | 2 | 3;
  items: readonly Sig403Item[];
  labels?: Partial<Sig403Labels>;
  /** Thuộc tính data-* gắn lên <ul> (ví dụ data-reveal của hệ thống chuyển động của trang) */
  listAttrs?: Record<`data-${string}`, string>;
}

const DEFAULT_LABELS: Sig403Labels = { list: "Danh sách dịch vụ" };

/** Chỉ ở chế độ này ảnh mới bay theo chuột; còn lại (điện thoại, cảm ứng, giảm chuyển động, không JS) là ảnh nằm sẵn trong hàng. */
const HOVER_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const FOLLOW = { 1: 0.65, 2: 0.5, 3: 0.4 } as const;
const TILT = { 1: 0, 2: 4, 3: 7 } as const;
const REVEAL = { 1: 0.7, 2: 1, 3: 1.4 } as const;

const CLOSED = "inset(100% 0% 0% 0%)";
const OPEN = "inset(0% 0% 0% 0%)";
const CURSOR_GAP = 32;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pad2 = (n: number) => String(n).padStart(2, "0");

export function Sig403HoverList({ id, className, intensity = 2, items, labels, listAttrs }: Sig403Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const label = { ...DEFAULT_LABELS, ...labels };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(HOVER_QUERY, () => {
        const wrap = root.querySelector<HTMLElement>("[data-sig403-wrap]");
        const frame = root.querySelector<HTMLElement>("[data-sig403-float]");
        if (!wrap || !frame) return;
        const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-sig403-row]"));
        const imgs = Array.from(frame.querySelectorAll<HTMLElement>("[data-sig403-img]"));
        const inners = imgs.map((el) => el.firstElementChild as HTMLElement);
        const everything = [frame, ...imgs, ...inners];

        root.setAttribute("data-sig403-mode", "hover");
        root.setAttribute("data-sig403-active", "-1");
        // Ảnh trong khung nổi đã sẵn sàng trước khi chuột tới, để lần rê đầu không bị khung trống
        frame.querySelectorAll("img").forEach((img) => img.setAttribute("loading", "eager"));

        gsap.set(frame, { autoAlpha: 0, scale: 0.85, x: 0, y: 0, rotation: 0 });
        gsap.set(imgs, { clipPath: CLOSED, zIndex: 0 });
        gsap.set(inners, { scale: 1 });

        const xTo = gsap.quickTo(frame, "x", { duration: FOLLOW[intensity], ease: "power3.out" });
        const yTo = gsap.quickTo(frame, "y", { duration: FOLLOW[intensity], ease: "power3.out" });
        const rotTo = gsap.quickTo(frame, "rotation", { duration: 0.4, ease: "power3.out" });
        const rotReset = gsap.delayedCall(0.12, () => rotTo(0));
        rotReset.pause();

        let fw = 0;
        let fh = 0;
        let visible = false;
        let pointerInside = false;
        let active = -1;
        let zTop = 0;
        let lastX = 0;
        let lastY = 0;
        let prevX: number | null = null;
        let scrollOn = false;

        const measure = () => {
          fw = frame.offsetWidth;
          fh = frame.offsetHeight;
        };

        const clampY = (y: number, wrapH: number) => clamp(y, -0.25 * fh, wrapH - 0.75 * fh);

        /** Vị trí khung (theo tọa độ của wrap) cho một điểm con trỏ. */
        const aim = (clientX: number, clientY: number) => {
          const wr = wrap.getBoundingClientRect();
          const cx = clientX - wr.left;
          const cy = clientY - wr.top;
          let tx = cx + CURSOR_GAP;
          if (tx + fw > wr.width) tx = cx - CURSOR_GAP - fw;
          return { x: clamp(tx, 0, Math.max(0, wr.width - fw)), y: clampY(cy - fh / 2, wr.height) };
        };

        /** Vị trí khung khi dùng bàn phím: cạnh hàng, không đè lên tên dịch vụ. */
        const aimRow = (i: number) => {
          const wr = wrap.getBoundingClientRect();
          const rr = rows[i].getBoundingClientRect();
          const textEl = rows[i].querySelector<HTMLElement>("[data-sig403-title-text]");
          const titleRight = (textEl ? textEl.getBoundingClientRect().right : rr.left) - wr.left;
          const x = Math.min(wr.width - fw, Math.max(titleRight + 24, wr.width - fw - 64));
          const rowMid = rr.top - wr.top + rr.height / 2;
          return { x: Math.max(0, x), y: clampY(rowMid - fh / 2, wr.height) };
        };

        const activate = (i: number) => {
          if (i < 0 || i === active) return;
          active = i;
          root.setAttribute("data-sig403-active", String(i));
          const img = imgs[i];
          const inner = inners[i];
          zTop += 1;
          gsap.killTweensOf([img, inner]);
          gsap.set(img, { zIndex: zTop });
          if (!visible) {
            // Khung đang ẩn: ảnh mở sẵn, không chạy chuyển cảnh
            gsap.set(imgs, { clipPath: CLOSED });
            gsap.set(img, { clipPath: OPEN });
            gsap.set(inner, { scale: 1 });
            return;
          }
          gsap.fromTo(img, { clipPath: CLOSED }, {
            clipPath: OPEN,
            duration: 0.55,
            ease: "power3.out",
            onComplete: () => {
              if (active !== i) return;
              imgs.forEach((other, j) => {
                if (j !== i) gsap.set(other, { clipPath: CLOSED });
              });
            },
          });
          gsap.fromTo(inner, { scale: 1 + 0.12 * REVEAL[intensity] }, { scale: 1, duration: 0.55, ease: "power3.out" });
        };

        const onScroll = () => {
          if (!visible || !pointerInside) return;
          const hit = document.elementFromPoint(lastX, lastY)?.closest<HTMLElement>("[data-sig403-row]");
          if (hit) activate(rows.indexOf(hit));
          const p = aim(lastX, lastY);
          xTo(p.x);
          yTo(p.y);
        };

        const show = (x: number, y: number) => {
          measure();
          visible = true;
          frame.style.willChange = "transform, opacity";
          gsap.killTweensOf(frame, "autoAlpha,scale");
          gsap.set(frame, { x, y, rotation: 0 });
          gsap.fromTo(frame, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" });
          if (!scrollOn) {
            scrollOn = true;
            window.addEventListener("scroll", onScroll, { passive: true });
          }
        };

        const hide = () => {
          if (!visible) return;
          visible = false;
          active = -1;
          root.setAttribute("data-sig403-active", "-1");
          rotReset.pause();
          rotTo(0);
          if (scrollOn) {
            scrollOn = false;
            window.removeEventListener("scroll", onScroll);
          }
          gsap.killTweensOf(frame, "autoAlpha,scale");
          gsap.to(frame, {
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              if (!visible) frame.style.willChange = "";
            },
          });
        };

        const anchorRow = (i: number) => {
          if (i < 0) return;
          measure();
          const p = aimRow(i);
          if (!visible) {
            activate(i);
            show(p.x, p.y);
          } else {
            activate(i);
            xTo(p.x);
            yTo(p.y);
            rotTo(0);
          }
        };

        const rowOf = (target: EventTarget | null) => {
          const el = target instanceof Element ? target.closest<HTMLElement>("[data-sig403-row]") : null;
          return el ? rows.indexOf(el) : -1;
        };

        const onEnter = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          pointerInside = true;
          prevX = e.clientX;
        };

        const onMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          pointerInside = true;
          lastX = e.clientX;
          lastY = e.clientY;
          const idx = rowOf(e.target);
          if (!visible) {
            measure();
            const p = aim(e.clientX, e.clientY);
            activate(idx >= 0 ? idx : Math.max(active, 0));
            show(p.x, p.y);
            prevX = e.clientX;
            return;
          }
          if (idx >= 0) activate(idx);
          const p = aim(e.clientX, e.clientY);
          xTo(p.x);
          yTo(p.y);
          const max = TILT[intensity];
          if (max > 0) {
            const dx = prevX === null ? 0 : e.clientX - prevX;
            rotTo(clamp(dx * 0.35, -max, max));
            rotReset.restart(true);
          }
          prevX = e.clientX;
        };

        const onLeave = () => {
          pointerInside = false;
          prevX = null;
          const focused = document.activeElement;
          if (focused instanceof HTMLElement && root.contains(focused) && focused.matches(":focus-visible")) {
            anchorRow(rowOf(focused));
            return;
          }
          hide();
        };

        const onFocusIn = (e: FocusEvent) => {
          if (pointerInside) return;
          anchorRow(rowOf(e.target));
        };

        const onFocusOut = (e: FocusEvent) => {
          const next = e.relatedTarget;
          if (next instanceof Node && root.contains(next)) return;
          if (!pointerInside) hide();
        };

        const onResize = () => {
          measure();
        };

        wrap.addEventListener("pointerenter", onEnter);
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
        root.addEventListener("focusin", onFocusIn);
        root.addEventListener("focusout", onFocusOut);
        window.addEventListener("resize", onResize);

        return () => {
          wrap.removeEventListener("pointerenter", onEnter);
          wrap.removeEventListener("pointermove", onMove);
          wrap.removeEventListener("pointerleave", onLeave);
          root.removeEventListener("focusin", onFocusIn);
          root.removeEventListener("focusout", onFocusOut);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("scroll", onScroll);
          rotReset.kill();
          gsap.killTweensOf(everything);
          gsap.set(everything, { clearProps: "all" });
          root.removeAttribute("data-sig403-mode");
          root.removeAttribute("data-sig403-active");
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [intensity] },
  );

  return (
    <div ref={rootRef} id={id} data-sig="403" data-sig403="" className={className}>
      <div data-sig403-wrap="">
        <ul data-sig403-list="" aria-label={label.list} {...listAttrs}>
          {items.map((it, i) => {
            const fit: CSSProperties = {
              objectFit: it.image.isResultPhoto ? "contain" : "cover",
              objectPosition: it.focus,
            };
            return (
              <li key={it.id} data-sig403-row="" data-index={i}>
                <a href={it.href} data-sig403-link="">
                  <span data-sig403-index="" aria-hidden="true">
                    {pad2(i + 1)}
                  </span>
                  <h3 data-sig403-title="">
                    <span data-sig403-title-text="">{it.title}</span>
                  </h3>
                  {it.sub ? <p data-sig403-sub="">{it.sub}</p> : null}
                  <figure data-sig403-inline="">
                    <Image src={it.image.src} alt={it.image.alt} fill sizes="160px" style={fit} />
                  </figure>
                  <svg data-sig403-arrow="" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
        <div data-sig403-float="" aria-hidden="true">
          {items.map((it, i) => (
            <div key={it.id} data-sig403-img={i}>
              <div data-sig403-img-inner="">
                <Image
                  src={it.image.src}
                  alt=""
                  fill
                  sizes="340px"
                  style={{ objectFit: it.image.isResultPhoto ? "contain" : "cover", objectPosition: it.focus }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        [data-sig="403"] {
          scroll-margin-top: var(--header-h, 0px);
          color: var(--sig-fg, #f8f3ea);
          font-family: var(--sig-font-body, inherit);
        }
        [data-sig403-wrap] { position: relative; }
        [data-sig403-list] { list-style: none; margin: 0; padding: 0; }
        [data-sig403-row] {
          margin: 0;
          padding: 0;
          border-top: 1px solid color-mix(in oklab, var(--sig-fg, #f8f3ea) 15%, transparent);
        }
        [data-sig403-row]:last-child {
          border-bottom: 1px solid color-mix(in oklab, var(--sig-fg, #f8f3ea) 15%, transparent);
        }
        [data-sig403-link] {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 10rem;
          grid-template-areas: "idx fig" "title fig" "sub fig" "arrow fig";
          align-content: center;
          column-gap: 1.25rem;
          min-height: 44px;
          padding: 1.5rem 0;
          color: var(--sig-fg, #f8f3ea);
          text-decoration: none;
          transition: color 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-sig403-link]:focus-visible {
          outline: 2px solid var(--sig-accent, #d8c08a);
          outline-offset: 4px;
        }
        [data-sig403-index] {
          grid-area: idx;
          font-family: var(--sig-font-body, inherit);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--sig-accent, #d8c08a);
        }
        [data-sig403-title] {
          grid-area: title;
          margin: 0.35rem 0 0;
          font-family: var(--sig-font-display, serif);
          font-weight: 500;
          font-size: clamp(1.75rem, 7vw, 2.25rem);
          line-height: 1.2;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-sig403-sub] {
          grid-area: sub;
          margin: 0.4rem 0 0;
          font-family: var(--sig-font-body, inherit);
          font-size: 0.9rem;
          line-height: 1.5;
          opacity: 0.75;
        }
        [data-sig403-arrow] {
          grid-area: arrow;
          justify-self: start;
          margin-top: 0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          color: var(--sig-accent, #d8c08a);
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-sig403-inline] {
          grid-area: fig;
          position: relative;
          margin: 0;
          width: 10rem;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 2px;
          background: color-mix(in oklab, var(--sig-fg, #f8f3ea) 10%, transparent);
        }
        [data-sig403-float] {
          display: none;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 5;
          width: var(--sig403-frame-w, clamp(240px, 26vw, 340px));
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 4px;
          pointer-events: none;
          visibility: hidden;
          opacity: 0;
          box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.55);
          background: color-mix(in oklab, var(--sig-fg, #f8f3ea) 10%, transparent);
        }
        [data-sig403-img] { position: absolute; inset: 0; clip-path: ${CLOSED}; }
        [data-sig403-img-inner] { position: absolute; inset: 0; }

        @media (min-width: 768px) {
          [data-sig403-link] {
            grid-template-columns: 4rem minmax(0, 1fr) 10rem 2.5rem;
            grid-template-areas: "idx title fig arrow" "idx sub fig arrow";
            align-items: center;
            padding: 1.75rem 0;
          }
          [data-sig403-index] { align-self: start; padding-top: 1rem; }
          [data-sig403-title] { margin: 0; font-size: clamp(2.5rem, 5vw, 4.25rem); }
          [data-sig403-sub] { align-self: start; font-size: 1rem; }
          [data-sig403-arrow] { align-self: center; justify-self: end; margin-top: 0; }
        }

        [data-sig403-mode="hover"] [data-sig403-float] { display: block; }
        [data-sig403-mode="hover"] [data-sig403-link] {
          grid-template-columns: 4rem minmax(0, 1fr) 2.5rem;
          grid-template-areas: "idx title arrow" "idx sub arrow";
        }
        [data-sig403-mode="hover"] [data-sig403-inline] {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          aspect-ratio: auto;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        [data-sig403-mode="hover"] [data-sig403-list]:has([data-sig403-link]:hover, [data-sig403-link]:focus-visible) [data-sig403-link]:not(:hover):not(:focus-visible) {
          color: var(--sig-muted, rgba(248, 243, 234, 0.45));
        }
        [data-sig403-mode="hover"] [data-sig403-link]:hover [data-sig403-title],
        [data-sig403-mode="hover"] [data-sig403-link]:focus-visible [data-sig403-title] {
          transform: translateX(0.75rem);
        }
        [data-sig403-mode="hover"] [data-sig403-link]:hover [data-sig403-arrow],
        [data-sig403-mode="hover"] [data-sig403-link]:focus-visible [data-sig403-arrow] {
          transform: translateX(0.25rem);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-sig403-link], [data-sig403-title], [data-sig403-arrow] { transition: none; }
          [data-sig403-link]:hover [data-sig403-title],
          [data-sig403-link]:focus-visible [data-sig403-title],
          [data-sig403-link]:hover [data-sig403-arrow],
          [data-sig403-link]:focus-visible [data-sig403-arrow] { transform: none; }
        }
      `}</style>
    </div>
  );
}

export default Sig403HoverList;
