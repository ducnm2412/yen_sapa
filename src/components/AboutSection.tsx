import { ArrowRight, Leaf, MapPin, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { RollText } from "@/components/motion/RollText";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";
import { SIG220 } from "@/components/signature/SIG-220/SIG-220";

const statIcons = [Sparkles, MapPin, Leaf];

/** Bố cục theo mẫu: chữ trái (eyebrow, tiêu đề, đoạn, nút, 3 chỉ số), ảnh khách dạng polaroid ở bên phải (SIG-220) trên nền số "01" mờ. */
export function AboutSection() {
  const stats = [
    { value: site.since, from: 2010, suffix: "", label: "Năm thành lập" },
    { value: 2, from: 0, suffix: "", label: "Chi nhánh" },
    { value: 4, from: 0, suffix: "", label: "Mảng chăm sóc" },
  ];
  return (
    <section id="gioi-thieu" className="relative bg-beige-50 px-4 pt-14 pb-40 sm:px-6 sm:pt-20 sm:pb-52">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1fr_1.05fr] md:gap-10">
        <div className="md:pr-6">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-moss-700 uppercase">
            <span data-reveal="chars">
              <SplitChars text="Về Yên Spa" />
            </span>
            <span data-reveal="line" className="h-px w-10 origin-left bg-moss-700/50" aria-hidden="true" />
          </p>
          <h2 data-reveal="words" className="mt-5 font-sans text-3xl leading-tight font-semibold tracking-tight text-moss-900 sm:text-4xl">
            <SplitWords text="Dưỡng sinh toàn diện," />
            <br />
            <SplitWords text="chăm da khoa học" />
          </h2>
          <p data-reveal="fade-up" className="mt-5 max-w-md text-[17px] leading-relaxed text-ink">
            {site.about.lead}
          </p>
          <a
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
                <div key={s.label} className="flex flex-col-reverse items-center justify-end text-center">
                  <dt className="mt-1 text-[13px] leading-snug whitespace-nowrap text-muted sm:text-sm">{s.label}</dt>
                  <dd className="font-sans text-2xl font-semibold text-moss-900 tabular-nums lining-nums">
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

        <div className="relative min-w-0">
          {/* Số "01" viền mảnh phía sau */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-2 font-sans text-[9rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgba(54,66,44,0.18)] sm:text-[11rem]"
          >
            01
          </span>
          <SIG220
            items={site.aboutPolaroids}
            labels={{ group: "Ảnh khách hàng tại Yên Spa", dragHint: "Kéo ảnh để xếp lại", swipeHint: "Vuốt ngang để xem thêm ảnh" }}
          />
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
