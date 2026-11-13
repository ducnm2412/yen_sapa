import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { site } from "@/content/site";
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
      {/* Chỉ làm tối nhẹ mép trên để header/menu trắng vẫn đọc được */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-soft-light">
        <div data-hero-glow className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.75),transparent_65%)]" />
        <div data-hero-glow className="absolute right-[-6rem] bottom-10 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.6),transparent_65%)]" />
      </div>

      {/* Hero chỉ còn video; giữ h1 ẩn cho SEO và trình đọc màn hình */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

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
