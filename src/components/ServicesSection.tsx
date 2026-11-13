import Image from "next/image";
import { ArrowRight, Flower2, Scissors, Sparkles, Sun } from "lucide-react";
import { site } from "@/content/site";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";

const icons = [Sparkles, Flower2, Scissors, Sun];

/** Dải xanh rêu: eyebrow + tiêu đề 2 dòng, link phải, chấm dọc bên trái, 4 thẻ ảnh có thanh kính mờ ở đáy. */
export function ServicesSection() {
  return (
    <section id="dich-vu" className="relative overflow-hidden bg-moss-900 pt-12 pb-40 text-white sm:pt-16 sm:pb-48">
      {/* Chấm dọc trang trí */}
      <div aria-hidden="true" className="absolute top-24 left-6 hidden flex-col items-center gap-6 lg:flex xl:left-12">
        <span className="h-16 w-px bg-white/20" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={i === 3 ? "size-2.5 rounded-full bg-white" : "size-1 rounded-full bg-white/50"} />
        ))}
        <span className="h-16 w-px bg-white/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-beige-200 uppercase">
              <span data-reveal="chars">
                <SplitChars text="Dịch vụ của Yên" />
              </span>
              <span data-reveal="line" className="h-px w-10 origin-left bg-beige-200/50" aria-hidden="true" />
            </p>
            <h2 data-reveal="blur-words" className="mt-4 font-sans text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              <SplitWords text="Dưỡng sinh toàn diện" />
              <br />
              <SplitWords text="cho" />{" "}
              <span className="italic">
                <SplitWords text="da, tóc và body" />
              </span>
            </h2>
          </div>
          <a href="#bang-gia" className="arrow-link inline-flex items-center gap-2 self-start text-sm font-medium text-beige-50 md:self-auto">
            Xem bảng giá tất cả dịch vụ
            <ArrowRight className="arrow size-4" aria-hidden="true" />
          </a>
        </div>

        <ul data-reveal="stagger" className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {site.serviceGroups.map((g, i) => {
            const Icon = icons[i];
            return (
              <li key={g.id}>
                <a
                  href="#bang-gia"
                  className="service-card group relative block aspect-[4/5] overflow-hidden rounded-sm border border-white/15 sm:aspect-[5/6]"
                >
                  <div data-scale-in className="absolute inset-0">
                    <Image
                      src={g.image}
                      alt={g.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0">
                  <div className="glass flex items-center gap-3 rounded-none bg-moss-900/55 px-3 py-3 sm:px-4 sm:py-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/40 sm:size-9">
                      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{g.title}</span>
                      <span className="block truncate text-[11px] text-beige-100/80">{g.sub}</span>
                    </span>
                  </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <Wave
        layers={[
          { fill: "#56653f", base: 36, amp: 26, phase: 2.2, opacity: 0.45 },
          { fill: "#d8c08a", base: 58, amp: 22, phase: 0.8, opacity: 0.25 },
          { fill: "#f4ece0", base: 80, amp: 20, phase: 1.9 },
        ]}
      />
    </section>
  );
}
