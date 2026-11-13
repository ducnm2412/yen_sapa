"use client";

import clsx from "clsx";
import { SectionHeading } from "@/components/SectionHeading";
import { LightboxThumb, useLightbox } from "@/components/Lightbox";
import { products } from "@/content/promo";

/** Lưới bento: ảnh sản phẩm lớn bên trái, poster dịch vụ/công nghệ xung quanh. */
const layout = ["col-span-2 row-span-2 aspect-square"];

export function ProductsSection() {
  const { open, dialog } = useLightbox(products);
  return (
    <section id="san-pham" className="relative bg-[#f4ece0] px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Sản phẩm & công nghệ"
          title="Sản~phẩm chuyên~nghiệp, máy~móc hiện~đại"
          text="Sản phẩm Christina, ánh sáng LED, laser triệt lông và các liệu trình body, tóc được dùng trực tiếp tại Yên."
        />
        <ul data-reveal="stagger" className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.src} className={clsx("relative", layout[i] ?? "aspect-square")}>
              <LightboxThumb
                img={p}
                onOpen={() => open(i)}
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="h-full min-h-full"
              />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-beige-50/90 px-3 py-1 text-xs font-semibold text-moss-900 backdrop-blur">
                {p.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {dialog}
    </section>
  );
}
