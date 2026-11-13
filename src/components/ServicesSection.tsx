import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { SplitChars, SplitWords } from "@/components/motion/Split";
import { Wave } from "@/components/Wave";
import { Sig403HoverList } from "@/components/signature/SIG-403/SIG-403";

const themeVars = {
  "--sig-fg": "var(--color-beige-50)",
  "--sig-muted": "color-mix(in oklab, var(--color-beige-50) 45%, transparent)",
  "--sig-accent": "var(--color-gold-300)",
  "--sig-font-display": "var(--font-display)",
  "--sig-font-body": "var(--font-body)",
} as CSSProperties;

/** Dải xanh rêu: eyebrow + tiêu đề 2 dòng, link phải, chấm dọc bên trái, 4 mảng dịch vụ thành danh sách lớn; trên desktop ảnh hiện theo con trỏ (SIG-403), còn điện thoại và giảm chuyển động thì mỗi hàng có sẵn ảnh. */
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

        <div className="mt-10" style={themeVars}>
          <Sig403HoverList
            intensity={2}
            listAttrs={{ "data-reveal": "stagger" }}
            items={site.serviceGroups.map((g) => ({
              id: g.id,
              title: g.title,
              sub: g.sub,
              href: "#bang-gia",
              image: { src: g.image, alt: g.alt },
              focus: g.focus,
            }))}
          />
        </div>
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
