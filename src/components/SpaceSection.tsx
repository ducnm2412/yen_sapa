"use client";

import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { RollText } from "@/components/motion/RollText";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { LightboxThumb, useLightbox, type LightboxImage } from "@/components/Lightbox";

/**
 * Bố cục "Dự án tiêu biểu" của mẫu: chữ bên trái, cụm ảnh ghép lệch (collage) bên phải
 * xen các mảng màu be trống. Desktop: lưới 12×8 đặt vị trí từng ảnh; mobile: lưới 2 cột.
 * [chỉ số ảnh trong site.gallery, vị trí desktop, tỉ lệ mobile]
 */
const tiles: [number, string, string][] = [
  [1, "lg:col-start-1 lg:col-end-6 lg:row-start-2 lg:row-end-6", "aspect-square"],
  [4, "lg:col-start-6 lg:col-end-9 lg:row-start-1 lg:row-end-4", "aspect-[4/5]"],
  [3, "lg:col-start-9 lg:col-end-11 lg:row-start-1 lg:row-end-4", "aspect-[4/5]"],
  [2, "lg:col-start-2 lg:col-end-6 lg:row-start-6 lg:row-end-9", "aspect-square"],
  [6, "lg:col-start-6 lg:col-end-9 lg:row-start-4 lg:row-end-9", "aspect-[4/5]"],
  [5, "lg:col-start-9 lg:col-end-13 lg:row-start-4 lg:row-end-8", "aspect-square"],
];
const blocks = [
  "lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-2",
  "lg:col-start-11 lg:col-end-13 lg:row-start-2 lg:row-end-4",
  "lg:col-start-9 lg:col-end-11 lg:row-start-8 lg:row-end-9",
];

export function SpaceSection() {
  const { open, dialog } = useLightbox(site.gallery);

  return (
    <section id="khong-gian" className="relative bg-[#f4ece0] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-moss-700 uppercase">
            <span data-reveal="chars">
              <SplitChars text="Không gian Yên" />
            </span>
            <span data-reveal="line" className="h-px w-10 origin-left bg-moss-700/50" aria-hidden="true" />
          </p>
          <h2 data-reveal="words" className="mt-4 font-serif text-4xl leading-[1.12] font-medium text-moss-900 sm:text-5xl">
            <SplitWords text="Một khoảng lặng" />
            <br />
            <span className="text-moss-700/80 italic">
              <SplitWords text="giữa thành phố" />
            </span>
          </h2>
          <p data-reveal="fade-up" className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Gỗ ấm, cây xanh và ánh sáng dịu ở hai chi nhánh Quận 3 và Phú Nhuận — mỗi góc nhỏ đều được chăm chút để bạn thật sự nghỉ ngơi.
          </p>
          <button
            type="button"
            data-reveal="fade-up"
            onClick={() => open(0)}
            className="btn-shimmer mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-moss-800 px-6 text-sm font-semibold text-white transition-colors hover:bg-moss-900"
          >
            <RollText label="Xem tất cả ảnh" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:h-[34rem] lg:grid-cols-12 lg:grid-rows-8">
          {blocks.map((b) => (
            <span key={b} aria-hidden="true" className={clsx("hidden rounded-xl bg-beige-200/70 lg:block", b)} />
          ))}
          {tiles.map(([gi, desktop, mobile]) => {
            const img: LightboxImage = site.gallery[gi];
            return (
              <div key={img.src} data-reveal="clip-up" className={clsx("min-h-0", desktop)}>
                <LightboxThumb
                  img={img}
                  onOpen={() => open(gi)}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className={clsx(mobile, "rounded-xl shadow-[0_20px_40px_-24px_rgba(38,48,32,0.5)] lg:aspect-auto lg:h-full")}
                />
              </div>
            );
          })}
        </div>
      </div>
      {dialog}
    </section>
  );
}
