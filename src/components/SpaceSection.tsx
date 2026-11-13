"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { useLightbox } from "@/components/Lightbox";
import { Sig505GridZoom, type Sig505Image } from "@/components/signature/SIG-505/SIG-505";
import { noOrphan } from "@/lib/text";

const body = site.services.find((s) => s.id === "body-thu-gian")!;

/** Sáu ảnh không gian của spa (lấy từ site.gallery, mỗi ảnh đúng một lần) cho lưới zoom SIG-505. */
const spacePhotos: Sig505Image[] = site.gallery
  .filter((g) => g.src.startsWith("/images/space/"))
  .map(({ src, alt }) => ({ src, alt }));
// Ô giữa: phòng chăm sóc da đón ánh nắng tự nhiên (hợp ẩn dụ "nắng xuyên lá")
const centerPhoto = spacePhotos.find((p) => p.src.includes("treatment-room"))!;
const aroundPhotos = spacePhotos.filter((p) => p !== centerPhoto);

const sigVars = {
  "--sig-bg": "#f4ece0",
  "--sig-fg": "var(--color-moss-900)",
  "--sig-accent": "var(--color-burgundy)",
  "--sig-scrim": "var(--color-moss-950)",
  "--sig-cap-fg": "var(--color-beige-50)",
  "--sig-font-display": "var(--font-body)",
  "--sig-font-body": "var(--font-body)",
} as CSSProperties;

const spaceMeta = [
  { Icon: MapPin, text: "Quận 3 · Phú Nhuận" },
  { Icon: Clock, text: `Mở cửa ${site.hours.display}` },
];

/** Câu chuyện trải nghiệm 02: chữ – ảnh – ảnh (câu chuyện 01 giờ nằm trong lưới zoom SIG-505). */
const stories = [
  {
    tag: "Trải nghiệm 02",
    title: body.title,
    text: body.text,
    meta: [
      { Icon: Sparkles, text: body.items.slice(0, 2).join(" · ") },
      { Icon: Clock, text: `Từ ${body.from}` },
    ],
    images: [
      { src: "/images/services/massage-da-nong.jpg", alt: "Massage body với đá nóng", pos: "center 35%" },
      { src: "/images/services/goi-duong-sinh.jpg", alt: "Gội đầu dưỡng sinh tại Yên Spa", pos: "center 55%" },
    ],
  },
];

export function SpaceSection() {
  const { open, dialog } = useLightbox(site.gallery);

  return (
    <section id="khong-gian" className="relative bg-[#f4ece0] pb-20 sm:pb-28">
      {/* Trải nghiệm 01: lưới 3x2 sáu ảnh không gian, zoom vào phòng chăm sóc da (SIG-505) */}
      <div style={sigVars}>
        <Sig505GridZoom
          as="div"
          intensity={1}
          pinVh={55}
          eyebrow="Trải nghiệm 01 · Không gian"
          heading="Một khoảng lặng giữa thành phố"
          center={centerPhoto}
          around={aroundPhotos}
          caption={{
            title: centerPhoto.alt,
            text: "Gỗ ấm, cây xanh và ánh sáng dịu ở hai chi nhánh Quận 3 và Phú Nhuận — mỗi góc nhỏ đều được chăm chút để bạn thật sự nghỉ ngơi.",
          }}
        />
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 sm:space-y-8 sm:px-6 sm:pt-10">
        {/* Thông tin chi nhánh, giờ mở cửa và nút xem toàn bộ ảnh không gian */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {spaceMeta.map(({ Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-1.5 rounded-full bg-beige-50 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-moss-900 ring-1 ring-beige-200">
              <Icon className="size-3.5 text-moss-600" aria-hidden="true" />
              {text}
            </span>
          ))}
          <button
            type="button"
            onClick={() => open(0)}
            className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap text-moss-900 ring-1 ring-moss-900/70 transition-colors hover:bg-moss-900 hover:text-white"
          >
            Xem tất cả ảnh không gian
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        {stories.map((s) => (
          <article
            key={s.tag}
            data-reveal="fade-up"
            data-spotlight
            className="grid gap-3 rounded-sm bg-beige-50 p-3 shadow-[0_24px_60px_-40px_rgba(38,48,32,0.6)] ring-1 ring-beige-200 sm:gap-4 sm:p-4 md:grid-cols-[1fr_1.15fr_1fr]"
          >
            {s.images.map((img, ii) => (
              <div
                key={img.src}
                className={clsx(
                  "relative aspect-[4/3] overflow-hidden rounded-sm md:aspect-auto md:min-h-80",
                  // chữ – ảnh – ảnh
                  ii === 1 ? "md:order-3" : "md:order-2",
                )}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" style={{ objectPosition: img.pos }} />
              </div>
            ))}
            <div className="flex flex-col justify-center px-2 pt-3 pb-4 text-center sm:px-6 sm:py-6 md:order-1">
              <span className="mx-auto rounded-full bg-burgundy px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-white uppercase">
                {s.tag}
              </span>
              <h3 className="mt-3 text-xl leading-tight sm:mt-4 sm:text-2xl font-semibold tracking-tight text-moss-900 sm:text-[1.7rem]">{noOrphan(s.title)}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/80 sm:mt-3 sm:text-sm">{noOrphan(s.text)}</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:mt-5 sm:gap-2">
                {s.meta.map(({ Icon, text }) => (
                  <li key={text} className="inline-flex items-center gap-1.5 text-xs sm:rounded-full sm:bg-[#f4ece0] sm:px-3 sm:py-1.5 font-medium whitespace-nowrap text-moss-900">
                    <Icon className="size-3.5 text-moss-600" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
              <a
                href="#bang-gia"
                className="mx-auto mt-4 inline-flex h-10 sm:mt-6 items-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap text-moss-900 ring-1 ring-moss-900/70 transition-colors hover:bg-moss-900 hover:text-white"
              >
                Xem bảng giá body & tóc
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
      {dialog}
    </section>
  );
}
