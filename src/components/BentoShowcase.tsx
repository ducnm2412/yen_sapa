"use client";

import Image from "next/image";
import { ArrowRight, CreditCard, Gift, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { site } from "@/content/site";
import { products, results } from "@/content/promo";
import { useLightbox } from "@/components/Lightbox";
import { RollText } from "@/components/motion/RollText";
import { SplitWords } from "@/components/motion/Split";
import { noOrphan } from "@/lib/text";
import { Leaf as LeafDecor, LeafShadowTexture } from "@/components/NatureDecor";

/** 4 ô ảnh sạch (không có chữ in sẵn) cho lưới 2x2 bên phải. */
const tiles = [
  { src: "/images/services/products-christina.jpg", label: "Sản phẩm Christina", alt: "Bộ sản phẩm Christina dùng trong liệu trình" },
  { src: "/images/space/product-shelf.jpg", label: "Mỹ phẩm chuyên nghiệp", alt: "Kệ sản phẩm chăm sóc da tại Yên" },
  { src: "/images/services/led-red-therapy.jpg", label: "Ánh sáng sinh học LED", alt: "Máy trị liệu ánh sáng đỏ LED" },
  { src: "/images/services/blue-light-acne.jpg", label: "Ánh sáng xanh trị mụn", alt: "Kỹ thuật viên chiếu ánh sáng xanh hỗ trợ trị mụn" },
];

const trust = [
  { Icon: Leaf, text: "Christina · Dermafirm · Image" },
  { Icon: ShieldCheck, text: "Khăn, bông, kim mới cho mỗi khách" },
  { Icon: MapPin, text: `Since ${site.since} · 2 chi nhánh` },
];

/**
 * Bento Editorial: hero chia đôi (chữ + lưới 2x2) rồi một hàng bento gom combo nổi bật,
 * thẻ Member, ưu đãi triệt lông và cột Trước & Sau. Thay cho 2 section Sản phẩm + Kết quả cũ.
 */
export function BentoShowcase() {
  const productBox = useLightbox(products);
  const resultBox = useLightbox(results);
  const combo = site.pricing.combos.find((c) => "featured" in c && c.featured) ?? site.pricing.combos[0];
  const comboIndex = site.pricing.combos.indexOf(combo) + 1;

  return (
    <section id="san-pham" className="relative isolate overflow-hidden bg-[#f6efe6] px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      {/* Nền thiên nhiên: bóng lá cọ mờ + cụm lá ở góc */}
      <LeafShadowTexture className="opacity-45" />
      <LeafDecor name="palm-top-left" className="top-0 left-0 w-28 -translate-x-1/4 -translate-y-1/4 opacity-80 sm:w-40 xl:w-52 xl:-translate-x-[20%] xl:-translate-y-[15%]" />
      <LeafDecor name="monstera-bottom-right" className="right-0 bottom-0 w-36 translate-x-1/4 translate-y-[8%] sm:w-52 lg:w-64" />
      <div className="mx-auto max-w-6xl">
        {/* ---------- Hero chia đôi 45/55 ---------- */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1fr] lg:gap-12">
          <div>
            <p className="shiny-text text-xs font-semibold tracking-[0.3em] text-burgundy uppercase">Sản phẩm & công nghệ</p>
            <h2 data-reveal="words" className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-moss-900 sm:text-5xl">
              <SplitWords text="Sản~phẩm chuyên~nghiệp, máy~móc hiện~đại" />
            </h2>
            <p data-reveal="fade-up" className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/80">
              Sản phẩm Christina, ánh sáng LED và laser triệt lông được dùng <span className="mark-sweep">trực tiếp trong từng liệu{" "}trình</span>{" "}tại{" "}Yên.
            </p>
            <div data-reveal="fade-up" className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.bookingAnchor}
                data-magnetic
                className="btn-shimmer inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-6 text-sm font-semibold whitespace-nowrap text-white shadow-[0_14px_30px_-14px_rgba(122,46,46,0.7)] transition-colors hover:bg-[#662424]"
              >
                <RollText label="Đặt lịch ngay" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#dich-vu"
                className="inline-flex h-12 items-center rounded-full bg-moss-900 px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-moss-800"
              >
                Khám phá dịch vụ
              </a>
            </div>
            <ul data-reveal="stagger" className="mt-8 flex flex-wrap gap-2">
              {trust.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full bg-beige-50 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-moss-900 ring-1 ring-beige-200"
                >
                  <Icon className="size-3.5 text-moss-600" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <ul data-reveal="blur" className="grid grid-cols-2 gap-3 sm:gap-4">
            {tiles.map((t) => {
              const i = Math.max(0, products.findIndex((p) => p.src === t.src));
              return (
                <li key={t.src}>
                  <button
                    type="button"
                    onClick={() => productBox.open(i)}
                    className="lift-card group block w-full overflow-hidden rounded-2xl bg-beige-50 text-left shadow-[0_18px_40px_-28px_rgba(38,48,32,0.55)] ring-1 ring-beige-200"
                    aria-label={`Phóng to ảnh: ${t.alt}`}
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      <Image
                        src={t.src}
                        alt={t.alt}
                        fill
                        sizes="(min-width: 1024px) 26vw, 50vw"
                        className="object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105"
                      />
                    </span>
                    <span className="block px-3 py-3 text-center text-[13px] font-semibold whitespace-nowrap text-moss-900 sm:text-sm">
                      {t.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Hàng bento ---------- */}
        <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[1.5fr_0.85fr_0.85fr] lg:grid-rows-[auto_auto]">
          {/* Combo nổi bật */}
          <article
            data-reveal="fade-up"
            data-spotlight
            className="shine-border grid overflow-hidden rounded-3xl bg-beige-50 shadow-[0_24px_60px_-36px_rgba(38,48,32,0.6)] ring-1 ring-beige-200 sm:grid-cols-[1.1fr_1fr] lg:col-start-1 lg:row-span-2"
          >
            <div className="flex flex-col p-6 sm:p-8">
              <span className="self-start rounded-full bg-burgundy px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-white uppercase">
                <span className="shiny-text [--shine-base:#fff]">Combo bán chạy</span>
              </span>
              <h3 className="mt-4 text-2xl leading-tight font-semibold tracking-tight text-moss-900 sm:text-3xl">
                Combo {comboIndex} — {combo.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-moss-700">
                {combo.sub} · {combo.duration}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
                {combo.parts.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                    {noOrphan(p)}
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex items-baseline gap-3 pt-6">
                <span className="text-4xl font-semibold text-moss-900">{combo.price}</span>
                <span className="text-sm text-muted line-through">{combo.was}</span>
              </p>
              <a
                href="#bang-gia"
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-burgundy px-5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#662424]"
              >
                Xem các combo
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="relative min-h-64 sm:min-h-full">
              <Image
                src="/images/services/massage-da-nong.jpg"
                alt="Massage body với đá nóng tại Yên Spa"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover object-[center_35%]"
              />
            </div>
          </article>

          {/* Thẻ Member */}
          <article data-reveal="fade-up" data-spotlight className="flex flex-col rounded-3xl bg-beige-50 p-6 ring-1 ring-beige-200 lg:col-start-2 lg:row-start-1">
            <CreditCard className="size-6 text-moss-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-moss-900">Thẻ Member</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/80">{noOrphan("Nạp một lần — nhận thêm đến 40% giá~trị")}</p>
            <ul className="mt-auto space-y-1.5 pt-4 text-[13px]">
              {site.pricing.members.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between gap-2 border-t border-beige-200 pt-1.5">
                  <span className="font-semibold text-moss-900">{m.name}</span>
                  <span className="whitespace-nowrap text-muted">
                    {m.pay.replace(".000.000", "tr").replace(".500.000", ",5tr")} → <span className="font-semibold text-moss-900">{m.total.replace(".000.000", "tr").replace(".500.000", ",5tr")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* Ưu đãi */}
          <article data-reveal="fade-up" className="flex flex-col rounded-3xl bg-burgundy p-6 text-white shadow-[0_24px_50px_-30px_rgba(122,46,46,0.9)] lg:col-start-2 lg:row-start-2">
            <Gift className="size-6 text-gold-300" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold">{site.hairRemoval.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/85">{noOrphan(site.hairRemoval.offer)}</p>
            <p className="mt-1 text-xs text-white/65">{noOrphan(site.hairRemoval.note)}</p>
            <a href="#bang-gia" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold whitespace-nowrap text-gold-300 hover:text-white">
              Xem bảng giá
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </article>

          {/* Trước & Sau — cột dọc */}
          <article
            id="ket-qua"
            data-reveal="fade-up"
            data-spotlight
            className="flex scroll-mt-24 flex-col rounded-3xl bg-beige-50 p-5 ring-1 ring-beige-200 sm:p-6 lg:col-start-3 lg:row-span-2 lg:row-start-1"
          >
            <h3 className="text-center text-lg font-semibold text-moss-900">Trước & Sau</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
              {[0, 8].map((ri, k) => (
                <button
                  key={ri}
                  type="button"
                  onClick={() => resultBox.open(ri)}
                  className="group text-left"
                  aria-label={`Phóng to ảnh: ${results[ri].alt}`}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={results[ri].src}
                      alt={results[ri].alt}
                      fill
                      sizes="(min-width: 1024px) 20vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block text-xs font-medium text-moss-900">{k === 0 ? "Yên Glow-up" : "HIFU Lifting"}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">{noOrphan("Kết quả tùy thuộc vào tình trạng da của mỗi người.")}</p>
            <button
              type="button"
              onClick={() => resultBox.open(0)}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap text-moss-900 ring-1 ring-moss-900/70 transition-colors hover:bg-moss-900 hover:text-white"
            >
              Xem {results.length} kết quả
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </article>
        </div>
      </div>
      {productBox.dialog}
      {resultBox.dialog}
    </section>
  );
}
