"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = { src: string; width: number; height: number; alt: string; wide?: boolean };

/**
 * Hook phóng to ảnh bản gốc (GAL-05) — dùng lại cho mọi bố cục ảnh (lưới, masonry, cuộn ngang, bảng giá…).
 * Dùng <dialog> gốc: bẫy focus, phím Esc và nền mờ có sẵn.
 */
export function useLightbox(images: readonly LightboxImage[]) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  }, []);
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("close", onClose);
    };
  }, [step]);

  useEffect(() => {
    if (index === null || !figureRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      figureRef.current,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  const current = index === null ? null : images[index];

  const dialog = (
    <dialog
      ref={dialogRef}
      aria-label="Xem ảnh phóng to"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {current && (
        <div
          className="relative flex h-full w-full items-center justify-center p-4 sm:p-12"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div ref={figureRef} className="flex max-h-full max-w-full items-center justify-center">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full rounded-lg object-contain"
            />
          </div>
          <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">
            {current.alt} · {index! + 1}/{images.length}
          </p>
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-6" />
          </button>
          {images.length > 1 &&
            [
              { d: -1, Icon: ChevronLeft, label: "Ảnh trước", pos: "left-2 sm:left-4" },
              { d: 1, Icon: ChevronRight, label: "Ảnh tiếp", pos: "right-2 sm:right-4" },
            ].map(({ d, Icon, label, pos }) => (
              <button
                key={label}
                type="button"
                onClick={() => step(d)}
                aria-label={label}
                className={clsx(
                  "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20",
                  pos,
                )}
              >
                <Icon className="size-6" />
              </button>
            ))}
        </div>
      )}
    </dialog>
  );

  return { open, dialog };
}

/** Nút ảnh thu nhỏ mở lightbox; ảnh bên trong có lớp parallax tùy chọn. */
export function LightboxThumb({
  img,
  onOpen,
  sizes,
  className,
  parallax,
}: {
  img: LightboxImage;
  onOpen: () => void;
  sizes: string;
  className?: string;
  parallax?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={clsx(
        "group relative block w-full overflow-hidden rounded-2xl bg-beige-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-700",
        className,
      )}
      aria-label={`Phóng to ảnh: ${img.alt}`}
    >
      <span data-hparallax={parallax ? "" : undefined} className="absolute -inset-x-[8%] inset-y-0 block">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105"
        />
      </span>
    </button>
  );
}
