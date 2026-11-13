import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/content/site";
import { RollText } from "@/components/motion/RollText";
import { ZaloIcon } from "@/components/icons/BrandIcons";
import { SplitWords } from "@/components/motion/Split";

/**
 * Banner CTA cuối trang theo mẫu: chữ bên trái, ảnh không gian mờ dần ở bên phải.
 * Giữ anchor #lien-he / #dat-lich (Phase 3 sẽ đặt form đặt lịch tại đây).
 */
export function ContactSection() {
  return (
    <section id="lien-he" className="relative isolate overflow-hidden bg-[#f4ece0]">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%]">
        <div data-parallax="30" className="absolute inset-0 overflow-hidden">
          <div data-parallax-inner className="absolute inset-x-0 -inset-y-10">
            <Image src="/images/space/lobby.jpg" alt="" fill sizes="(min-width: 768px) 62vw, 100vw" className="object-cover object-[30%_60%]" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4ece0] via-[#f4ece0]/85 to-[#f4ece0]/0 md:via-[#f4ece0]/40" />
      </div>

      <div id="dat-lich" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
        <h2 data-reveal="words" className="max-w-md font-sans text-3xl leading-tight font-semibold tracking-tight text-moss-900 sm:text-4xl">
          <SplitWords text="Sẵn sàng cho một khoảng an~yên?" dim={[4, 5]} />
        </h2>
        <p data-reveal="fade-up" className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Gọi hoặc nhắn Zalo cho chi nhánh gần bạn để được tư vấn và giữ lịch — mở cửa {site.hours.display}{" "}mỗi{" "}ngày.
        </p>
        <div data-reveal="stagger" className="mt-8 flex flex-wrap gap-3">
          {site.branches.map((b) => (
            <a
              key={b.id}
              href={`tel:${b.hotlineE164}`}
              data-magnetic
              className="btn-shimmer inline-flex h-12 items-center gap-2 rounded-full bg-beige-50 px-6 text-sm font-semibold text-moss-900 shadow-[0_10px_30px_-14px_rgba(38,48,32,0.4)] transition-colors hover:bg-white"
            >
              <Phone className="size-4" aria-hidden="true" />
              <RollText label={`${b.shortName} · ${b.hotlineDisplay}`} />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          ))}
          <a
            href={site.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-moss-800 px-6 text-sm font-semibold text-white transition-colors hover:bg-moss-900"
          >
            <ZaloIcon className="size-6" />
            <RollText label="Nhắn Zalo" />
          </a>
        </div>
      </div>
    </section>
  );
}
