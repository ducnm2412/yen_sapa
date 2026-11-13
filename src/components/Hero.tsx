import Image from "next/image";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { site } from "@/content/site";
import { RollText } from "@/components/motion/RollText";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";
import { HeroVideoReel } from "@/components/HeroVideoReel";

export function Hero() {
  return (
    <section id="trang-chu" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-moss-900">
      {/* Ảnh LCP: luôn hiển thị; chỉ mở mặt nạ clip-path + scale và parallax bằng transform */}
      <div data-hero-parallax className="absolute inset-0 -z-10">
        <div data-hero-image className="absolute inset-0 will-change-transform">
          <Image
            src="/images/space/treatment-room.jpg"
            alt="Phòng chăm sóc da của Yên Spa với hai giường trị liệu và ánh nắng tự nhiên"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[65%_center]"
          />
        </div>
      </div>
      {/* Nền 3 video chia 3 cột, phủ lên ảnh LCP khi đã phát */}
      <HeroVideoReel />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/30 via-transparent to-black/30" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-soft-light">
        <div data-hero-glow className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.75),transparent_65%)]" />
        <div data-hero-glow className="absolute right-[-6rem] bottom-10 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.6),transparent_65%)]" />
      </div>

      <div data-hero="content" className="mx-auto w-full max-w-6xl px-4 pt-28 pb-44 text-white sm:px-6 md:pb-48">
        <p data-hero="eyebrow" className="flex items-center gap-3 text-[11px] font-medium tracking-[0.25em] text-beige-100 uppercase">
          <SplitChars text={site.tagline} />
          <span data-line className="hidden h-px w-10 origin-left bg-beige-100/70 sm:block" aria-hidden="true" />
        </p>
        <h1 data-hero="heading" className="mt-6 max-w-2xl font-serif text-[2.9rem] leading-[1.08] font-medium sm:text-6xl md:text-7xl">
          <SplitWords text="Yêu mình một cách" />
          <br />
          <span className="italic">
            <SplitWords text="Yên lành" />
          </span>
          <span className="sr-only"> — {site.name}</span>
        </h1>
        <p data-hero="fade" className="mt-6 max-w-md text-base leading-relaxed text-white/90">
          {site.intro}
        </p>
        <div data-hero="cta" className="mt-9 flex flex-wrap items-center gap-6">
          <a
            href={site.bookingAnchor}
            data-magnetic
            className="btn-shimmer inline-flex h-12 items-center gap-2 rounded-full bg-beige-50 px-7 text-sm font-semibold text-moss-900 transition-colors hover:bg-white"
          >
            <RollText label="Đặt lịch ngay" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a href="#khong-gian" className="group inline-flex items-center gap-3 text-sm font-medium text-white">
            <span className="grid size-12 place-items-center rounded-full border border-white/70 transition-colors group-hover:border-gold-300 group-hover:bg-white/10">
              <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
            </span>
            Xem không gian
          </a>
        </div>
      </div>

      {/* Nút cuộn xuống ở giữa */}
      <a
        href="#gioi-thieu"
        data-hero="fade"
        aria-label="Cuộn xuống phần giới thiệu"
        className="absolute bottom-[clamp(84px,11vw,160px)] left-1/2 z-[2] hidden -translate-x-1/2 items-center gap-4 text-white md:flex"
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/60" aria-hidden="true" />
        <span className="grid size-12 place-items-center rounded-full border border-white/60 backdrop-blur-sm transition-colors hover:border-gold-300">
          <ArrowDown className="size-4" aria-hidden="true" />
        </span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/60" aria-hidden="true" />
      </a>

      <Wave
        layers={[
          { fill: "#d8c08a", base: 46, amp: 22, phase: 0.9, opacity: 0.3 },
          { fill: "#ece2d0", base: 66, amp: 20, phase: 2.1, opacity: 0.75 },
          { fill: "#f8f3ea", base: 86, amp: 18, phase: 1.2 },
        ]}
      />
    </section>
  );
}
