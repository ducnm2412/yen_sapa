"use client";

import { useRef } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LightboxThumb, useLightbox, type LightboxImage } from "@/components/Lightbox";

/** Dải poster cuộn ngang (scroll-snap, không cần JS để vuốt); bấm ảnh để phóng to. */
export function PosterRail({
  images,
  label,
  itemClassName = "w-[78%] sm:w-[42%] lg:w-[30%]",
  aspect = "aspect-square",
}: {
  images: readonly LightboxImage[];
  label: string;
  itemClassName?: string;
  aspect?: string;
}) {
  const { open, dialog } = useLightbox(images);
  const track = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={track}
        aria-label={label}
        data-reveal="stagger"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <li key={img.src} className={clsx("shrink-0 snap-start", itemClassName)}>
            <LightboxThumb
              img={img}
              onOpen={() => open(i)}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 78vw"
              className={clsx(aspect, "shadow-[0_24px_50px_-28px_rgba(38,48,32,0.55)]")}
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => scroll(d)}
            aria-label={d < 0 ? "Xem ảnh trước" : "Xem ảnh tiếp"}
            className="grid size-11 place-items-center rounded-full border border-moss-900/20 text-moss-900 transition-colors hover:border-moss-900 hover:bg-moss-900 hover:text-beige-50"
          >
            {d < 0 ? <ChevronLeft className="size-5" aria-hidden="true" /> : <ChevronRight className="size-5" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {dialog}
    </div>
  );
}
