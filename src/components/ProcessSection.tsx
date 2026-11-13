import { ArrowRight, ClipboardCheck, Droplets, MessageCircleHeart, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { SplitChars, SplitWords } from "@/components/motion/Split";

const icons = [MessageCircleHeart, Droplets, Sparkles, ClipboardCheck];

/** Quy trình 4 bước (lấy từ các bước in trên menu combo / Pro Acne của khách). */
export function ProcessSection() {
  return (
    <section id="quy-trinh" className="relative bg-[#f4ece0] px-4 pt-14 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-moss-700 uppercase">
            <span data-reveal="chars">
              <SplitChars text="Quy trình chăm sóc" />
            </span>
            <span data-reveal="line" className="h-px w-10 origin-left bg-moss-700/50" aria-hidden="true" />
          </p>
          <h2 data-reveal="words" className="mt-4 font-serif text-4xl leading-[1.12] font-medium text-moss-900 sm:text-5xl">
            <SplitWords text="Đồng hành cùng bạn" />
            <br />
            <span className="italic">
              <SplitWords text="từ tư vấn đến tại nhà" />
            </span>
          </h2>
          <p data-reveal="fade-up" className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Chuyên viên tư vấn và chọn gói theo đúng tình trạng da; mỗi khách dùng khăn lau, bông và kim mới.
          </p>
          <a
            href="#bang-gia"
            data-reveal="fade-up"
            className="btn-shimmer mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-moss-800 px-6 text-sm font-semibold text-white transition-colors hover:bg-moss-900"
          >
            Xem bảng giá
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <ol data-reveal="stagger" className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {/* Đường nối giữa các bước */}
          <span aria-hidden="true" className="absolute top-8 right-[12%] left-[12%] hidden border-t border-dashed border-moss-700/25 sm:block" />
          {site.process.map((p, i) => {
            const Icon = icons[i];
            return (
              <li key={p.title} className="relative flex flex-col items-center text-center sm:border-r sm:border-moss-700/10 sm:last:border-r-0">
                <span className="grid size-16 place-items-center rounded-full bg-beige-50 text-moss-800 shadow-[0_10px_30px_-12px_rgba(38,48,32,0.35)] ring-8 ring-beige-50/60">
                  <Icon className="size-6" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="mt-4 font-serif text-lg text-moss-900">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 text-sm font-semibold text-ink">{p.title}</span>
                <span className="text-xs text-muted">{p.sub}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
