"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Phone, Star } from "lucide-react";
import { site } from "@/content/site";
import { ZaloIcon } from "@/components/icons/BrandIcons";
import { RollText } from "@/components/motion/RollText";
import { SIG305 } from "@/components/signature/SIG-305/SIG-305";
import { noOrphan } from "@/lib/text";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

/**
 * Khối xanh rêu bo cong 2 góc trên: một câu lớn trích từ review Google thật,
 * thẻ review trượt bên phải, và lời mời đặt lịch (#lien-he / #dat-lich) ở cuối.
 */
export function ReviewsSection() {
  const [i, setI] = useState(0);
  const reviews = site.reviews;
  const r = reviews[i];
  const go = (d: number) => setI((v) => (v + d + reviews.length) % reviews.length);

  return (
    <section
      id="danh-gia"
      className="relative isolate z-[2] overflow-hidden rounded-t-[3rem] bg-moss-900 px-4 pt-16 pb-36 text-white sm:rounded-t-[6rem] sm:px-6 sm:pt-24 sm:pb-44 lg:rounded-t-[10rem]"
    >
      {/* Aurora: quầng sáng xanh lá / vàng trôi chậm */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="aurora-blob top-[-10%] left-[-5%] size-[28rem] bg-[#6f9a4a]" />
        <span className="aurora-blob top-[20%] right-[-8%] size-[24rem] bg-[#b8975a]" />
        <span className="aurora-blob bottom-[5%] left-[30%] size-[26rem] bg-[#3f6b3a]" />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.25em] text-beige-100 uppercase ring-1 ring-beige-100/60">
              <span className="shiny-text">Khách hàng nói gì</span>
            </span>
            {/* Câu trích thật từ review Google của Trang Minh, tô từng dòng khi cuộn (SIG-305, không ghim) */}
            <SIG305
              variant="inline"
              intensity={1}
              lines={["“Chắc chắn phải gặp Yên", "mỗi cuối tuần để", "chữa lành thôi ạ.”"]}
              className="mt-6 text-3xl leading-snug font-semibold tracking-tight text-beige-50 [--sig-hl:rgb(216_192_138/0.45)] sm:text-[2.6rem] sm:leading-[1.2]"
            />
            <p className="mt-4 text-sm text-beige-200">
              {reviews[0].author} · {reviews[0].meta}
            </p>
          </div>

          {/* Thẻ review trượt */}
          <figure className="relative overflow-hidden rounded-sm bg-beige-50 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:grid sm:grid-cols-[0.8fr_1.2fr]">
            <div className="relative hidden sm:block">
              <Image src="/images/services/massage-mat.jpg" alt="" fill sizes="20vw" className="object-cover object-[center_45%]" />
            </div>
            <div className="flex min-h-72 flex-col p-6 sm:p-8" aria-live="polite">
              <span className="flex gap-0.5 text-gold-500" aria-label="5 trên 5 sao">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </span>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/85">“{noOrphan(r.text)}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-moss-900 text-sm font-semibold text-white">
                  {initials(r.author)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-moss-900">{r.author}</span>
                  <span className="block text-xs text-muted">{r.meta}</span>
                </span>
              </figcaption>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex gap-2">
                  {reviews.map((rv, k) => (
                    <button
                      key={rv.author}
                      type="button"
                      onClick={() => setI(k)}
                      aria-label={`Xem đánh giá ${k + 1}`}
                      aria-current={k === i}
                      className={clsx("size-2.5 rounded-full transition-colors", k === i ? "bg-burgundy" : "bg-beige-300")}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {[
                    { d: -1, Icon: ArrowLeft, label: "Đánh giá trước" },
                    { d: 1, Icon: ArrowRight, label: "Đánh giá sau" },
                  ].map(({ d, Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => go(d)}
                      aria-label={label}
                      className="grid size-9 place-items-center rounded-full ring-1 ring-moss-900/30 transition-colors hover:bg-moss-900 hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </figure>
        </div>

        {/* Lời mời đặt lịch */}
        <div id="lien-he" className="mt-16 scroll-mt-24 border-t border-white/10 pt-12 text-center sm:mt-20">
          <div id="dat-lich" className="scroll-mt-24">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{noOrphan("Sẵn sàng cho một khoảng an~yên?")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-beige-200">
              {noOrphan(`Gọi hoặc nhắn Zalo cho chi nhánh gần bạn để được tư vấn và giữ lịch — mở cửa ${site.hours.display} mỗi~ngày.`)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {site.branches.map((b) => (
                <a
                  key={b.id}
                  href={`tel:${b.hotlineE164}`}
                  data-magnetic
                  className="btn-shimmer inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#662424]"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  <RollText label={`${b.shortName} · ${b.hotlineDisplay}`} />
                </a>
              ))}
              <a
                href={site.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-beige-50 px-6 text-sm font-semibold whitespace-nowrap text-moss-900 transition-colors hover:bg-white"
              >
                <ZaloIcon className="size-6" />
                <RollText label="Nhắn Zalo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
