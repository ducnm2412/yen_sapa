import Image from "next/image";
import { ArrowRight, Leaf, MapPin, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { RollText } from "@/components/motion/RollText";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";

const statIcons = [Sparkles, MapPin, Leaf];

/** Bố cục theo mẫu: chữ trái (eyebrow, tiêu đề, đoạn, nút, 3 chỉ số), ảnh phải + thẻ nổi + số "01" mờ. */
export function AboutSection() {
  const stats = [
    { value: site.since, from: 2010, suffix: "", label: "Năm thành lập" },
    { value: 2, from: 0, suffix: "", label: "Chi nhánh tại TP.HCM" },
    { value: 4, from: 0, suffix: "", label: "Mảng chăm sóc" },
  ];
  return (
    <section id="gioi-thieu" className="relative z-[3] rounded-t-[2.5rem] bg-beige-50 px-4 pt-14 pb-40 shadow-[0_-30px_60px_-30px_rgba(38,48,32,0.35)] sm:rounded-t-[3.5rem] sm:px-6 sm:pt-20 sm:pb-52">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1fr_1.05fr] md:gap-10">
        <div className="md:pr-6">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-moss-700 uppercase">
            <span data-reveal="chars">
              <SplitChars text="Về Yên Spa" />
            </span>
            <span data-reveal="line" className="h-px w-10 origin-left bg-moss-700/50" aria-hidden="true" />
          </p>
          <h2 data-reveal="words" className="mt-5 font-serif text-4xl leading-[1.12] font-medium text-moss-900 sm:text-5xl">
            <SplitWords text="Dưỡng sinh toàn diện," />
            <br />
            <SplitWords text="chăm da khoa học" />
          </h2>
          <p data-scrub-text className="mt-5 max-w-md leading-relaxed text-muted">
            <SplitWords text={site.about.paragraphs[0]} />
          </p>
          <a
            data-reveal="fade-up"
            href="#dich-vu"
            className="btn-shimmer mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-moss-800 px-6 text-sm font-semibold text-white transition-colors hover:bg-moss-900"
          >
            <RollText label="Tìm hiểu thêm" />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>

          <dl data-reveal="stagger" className="mt-12 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s, i) => {
              const Icon = statIcons[i];
              return (
                <div key={s.label} className="flex flex-col-reverse items-center text-center">
                  <dt className="mt-1 text-xs leading-snug text-muted">{s.label}</dt>
                  <dd className="font-serif text-2xl text-moss-900">
                    <Icon className="mx-auto mb-2 size-5 text-moss-600" strokeWidth={1.4} aria-hidden="true" />
                    <span data-counter={s.value} data-counter-from={s.from}>
                      {s.value}
                    </span>
                    {s.suffix}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="relative">
          {/* Số "01" viền mảnh phía sau */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-2 font-serif text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(54,66,44,0.18)] sm:text-[11rem]"
          >
            01
          </span>
          <div
            data-reveal="strips"
            data-parallax="24"
            className="relative mr-0 aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgba(38,48,32,0.45)] sm:mr-16 md:aspect-[5/5.6]"
          >
            <div data-parallax-inner className="absolute inset-x-0 -inset-y-8">
              <Image
                src="/images/space/lobby.jpg"
                alt="Sảnh chờ của Yên Spa với sofa da, ghế bọc vải và cây xanh"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="reveal-strip h-full flex-1 bg-beige-50" />
              ))}
            </div>
          </div>
          {/* Thẻ nổi */}
          <a
            href="#dich-vu"
            data-reveal="fade-up"
            data-delay="0.4"
            className="lift-card absolute right-0 bottom-16 flex items-center gap-6 rounded-2xl bg-beige-50/95 py-4 pr-4 pl-5 shadow-xl backdrop-blur"
          >
            <span>
              <span className="block font-serif text-lg text-moss-900">Chăm da khoa học</span>
              <span className="block text-xs text-muted">Trong từng bước chăm sóc</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-moss-700 text-white">
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      <Wave
        layers={[
          { fill: "#a9b28a", base: 34, amp: 26, phase: 0.4, opacity: 0.35 },
          { fill: "#56653f", base: 58, amp: 24, phase: 1.6, opacity: 0.6 },
          { fill: "#2f3a26", base: 80, amp: 22, phase: 2.6 },
        ]}
      />
    </section>
  );
}
