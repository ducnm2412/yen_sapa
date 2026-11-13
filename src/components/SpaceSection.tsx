"use client";

import Image from "next/image";
import clsx from "clsx";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { useLightbox } from "@/components/Lightbox";
import { noOrphan } from "@/lib/text";

const body = site.services.find((s) => s.id === "body-thu-gian")!;

/** 2 câu chuyện trải nghiệm theo kiểu zigzag: ảnh – chữ – ảnh, câu sau đảo nhịp. */
const stories = [
  {
    tag: "Trải nghiệm 01",
    title: "Một khoảng lặng giữa thành phố",
    text: "Gỗ ấm, cây xanh và ánh sáng dịu ở hai chi nhánh Quận 3 và Phú Nhuận — mỗi góc nhỏ đều được chăm chút để bạn thật sự nghỉ ngơi.",
    meta: [
      { Icon: MapPin, text: "Quận 3 · Phú Nhuận" },
      { Icon: Clock, text: `Mở cửa ${site.hours.display}` },
    ],
    images: [
      { src: "/images/space/lobby.jpg", alt: "Sảnh chờ với sofa da và cây xanh", pos: "center" },
      { src: "/images/space/treatment-room.jpg", alt: "Phòng chăm sóc da đón ánh nắng tự nhiên", pos: "center 60%" },
    ],
    gallery: true,
  },
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
    gallery: false,
  },
];

export function SpaceSection() {
  const { open, dialog } = useLightbox(site.gallery);

  return (
    <section id="khong-gian" className="relative bg-[#f4ece0] px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        {stories.map((s, si) => (
          <article
            key={s.tag}
            data-reveal="fade-up"
            data-spotlight
            className="grid gap-3 rounded-[2rem] bg-beige-50 p-3 shadow-[0_24px_60px_-40px_rgba(38,48,32,0.6)] ring-1 ring-beige-200 sm:gap-4 sm:p-4 md:grid-cols-[1fr_1.15fr_1fr]"
          >
            {s.images.map((img, ii) => (
              <div
                key={img.src}
                className={clsx(
                  "relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:min-h-80",
                  // 01: ảnh – chữ – ảnh · 02 đảo nhịp: chữ – ảnh – ảnh
                  ii === 1 ? "md:order-3" : si === 0 ? "md:order-1" : "md:order-2",
                )}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" style={{ objectPosition: img.pos }} />
              </div>
            ))}
            <div className={clsx("flex flex-col justify-center px-3 py-6 text-center sm:px-6", si === 1 ? "md:order-1" : "md:order-2")}>
              <span className="mx-auto rounded-full bg-burgundy px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-white uppercase">
                {s.tag}
              </span>
              <h3 className="mt-4 text-2xl leading-tight font-semibold tracking-tight text-moss-900 sm:text-[1.7rem]">{noOrphan(s.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{noOrphan(s.text)}</p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {s.meta.map(({ Icon, text }) => (
                  <li key={text} className="inline-flex items-center gap-1.5 rounded-full bg-[#f4ece0] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-moss-900">
                    <Icon className="size-3.5 text-moss-600" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
              {s.gallery ? (
                <button
                  type="button"
                  onClick={() => open(0)}
                  className="mx-auto mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap text-moss-900 ring-1 ring-moss-900/70 transition-colors hover:bg-moss-900 hover:text-white"
                >
                  Xem tất cả ảnh không gian
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <a
                  href="#bang-gia"
                  className="mx-auto mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap text-moss-900 ring-1 ring-moss-900/70 transition-colors hover:bg-moss-900 hover:text-white"
                >
                  Xem bảng giá body & tóc
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {dialog}
    </section>
  );
}
