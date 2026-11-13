import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { site } from "@/content/site";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";

/** Dải tối "Khách hàng nói gì": review Google thật, không ảnh mặt người (dùng chữ cái đầu). */
export function ReviewsSection() {
  return (
    <section id="danh-gia" className="relative overflow-hidden bg-moss-900 px-4 pt-32 pb-40 text-white sm:px-6 sm:pt-40 sm:pb-48">
      <Wave
        flip
        layers={[
          { fill: "#56653f", base: 36, amp: 24, phase: 1.1, opacity: 0.45 },
          { fill: "#f4ece0", base: 70, amp: 20, phase: 0.3 },
        ]}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-beige-200 uppercase">
              <span data-reveal="chars">
                <SplitChars text="Khách hàng nói về Yên" />
              </span>
              <span data-reveal="line" className="h-px w-10 origin-left bg-beige-200/50" aria-hidden="true" />
            </p>
            <h2 data-reveal="words" className="mt-4 font-serif text-4xl leading-[1.12] font-medium sm:text-5xl">
              <SplitWords text="Sự hài lòng" />
              <br />
              <span className="italic">
                <SplitWords text="là động lực của Yên" />
              </span>
            </h2>
          </div>
          <div aria-hidden="true" className="hidden gap-3 sm:flex">
            {[ArrowLeft, ArrowRight].map((Icon, i) => (
              <span key={i} className="grid size-11 place-items-center rounded-full border border-white/30">
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <ul data-reveal="stagger" className="mt-10 grid gap-5 md:grid-cols-2">
          {site.reviews.map((r) => (
            <li key={r.author}>
              <figure className="flex h-full gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7">
                <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-beige-100 font-serif text-xl text-moss-900">
                  {r.author
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <div className="flex flex-col">
                  <blockquote className="text-sm leading-relaxed text-beige-100">“{r.text}”</blockquote>
                  <figcaption className="mt-4">
                    <span className="block text-sm font-semibold text-white">{r.author}</span>
                    <span className="block text-xs text-beige-200">{r.meta}</span>
                    <span className="mt-2 flex gap-0.5 text-gold-300" aria-label="5 trên 5 sao">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
                      ))}
                    </span>
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <Wave
        layers={[
          { fill: "#56653f", base: 40, amp: 22, phase: 2.0, opacity: 0.45 },
          { fill: "#f4ece0", base: 76, amp: 20, phase: 0.9 },
        ]}
      />
    </section>
  );
}
