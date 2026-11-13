import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { PosterRail } from "@/components/PosterRail";
import { menus } from "@/content/promo";

/** Bảng giá dạng chữ (PRICE-01..03, 05). Nguồn: menu áp dụng từ 15/05/2025 trên ảnh của khách. */
export function PricingSection() {
  const p = site.pricing;
  return (
    <section id="bang-gia" className="relative bg-[#f4ece0] px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Bảng giá"
          title="Combo best seller — tiết kiệm đến 30%"
          dim={[3, 4, 5, 6]}
          text="Trọn vẹn body, tóc và da mặt trong một lần ghé Yên."
        />

        {/* Combo */}
        <ul data-reveal="stagger" className="mt-12 grid gap-6 md:grid-cols-3">
          {p.combos.map((c, i) => (
            <li
              key={c.name}
              className={clsx(
                "lift-card relative flex flex-col rounded-[2rem] p-7 sm:p-8",
                "featured" in c && c.featured ? "bg-moss-900 text-beige-100 md:-mt-6 md:mb-6" : "bg-beige-50 text-ink",
              )}
            >
              <p className={clsx("font-serif text-sm tracking-[0.2em]", "featured" in c ? "text-gold-300" : "text-gold-500")}>
                COMBO {i + 1} · {c.duration}
              </p>
              <h3 className={clsx("mt-3 font-serif text-3xl leading-tight", "featured" in c ? "text-white" : "text-moss-900")}>
                {c.name} <span className="italic opacity-70">{c.sub}</span>
              </h3>
              <p className="mt-5 flex items-baseline gap-3">
                <span className={clsx("font-serif text-5xl", "featured" in c ? "text-gold-300" : "text-moss-800")}>{c.price}</span>
                <span className="text-sm line-through opacity-60">{c.was}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed">
                {c.parts.map((part) => (
                  <li key={part} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden="true" />
                    {part}
                  </li>
                ))}
              </ul>
              <a
                href={site.bookingAnchor}
                className={clsx(
                  "btn-shimmer mt-8 inline-flex h-12 items-center justify-center rounded-full font-semibold transition-colors",
                  "featured" in c ? "bg-beige-50 text-moss-900 hover:bg-white" : "bg-moss-700 text-white hover:bg-moss-800",
                )}
              >
                Đặt combo {c.name}
              </a>
            </li>
          ))}
        </ul>
        <p data-reveal="fade-up" className="mt-5 text-sm text-muted">{p.comboNote}</p>

        {/* Bảng giá lẻ: accordion thuần HTML, đọc được trên mobile không cần phóng to */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 data-reveal="words" className="font-serif text-4xl leading-tight text-moss-900">
              Bảng giá dịch vụ lẻ
            </h3>
            <p data-reveal="fade-up" className="mt-3 text-sm leading-relaxed text-muted">{p.note}</p>

            {/* Thẻ thành viên */}
            <div data-reveal="fade-up" className="mt-10 rounded-[2rem] bg-moss-900 p-7 text-beige-100 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.3em] text-gold-300 uppercase">Thẻ ưu đãi Member</p>
              <p className="mt-2 font-serif text-2xl text-white">Nạp một lần — nhận thêm đến 40% giá trị</p>
              <ul className="mt-6 divide-y divide-white/10">
                {p.members.map((m) => (
                  <li key={m.name} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="font-serif text-xl text-gold-300">{m.name}</span>
                    <span className="text-right text-sm">
                      Nạp {m.pay} · tặng {m.gift}
                      <span className="block text-xs text-beige-200">Tài khoản {m.total}đ</span>
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2 text-sm text-beige-200">
                {p.memberPerks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-reveal="stagger" className="space-y-3">
            {p.menus.map((m, i) => (
              <details key={m.title} open={i === 0} className="group rounded-2xl bg-beige-50 ring-1 ring-beige-200 open:ring-gold-500/40">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-serif text-xl text-moss-900 sm:px-6">
                  {m.title}
                  <ChevronDown
                    className="size-5 shrink-0 text-moss-600 transition-transform duration-500 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <table className="w-full text-sm">
                  <caption className="sr-only">{m.title} (đơn vị: đồng)</caption>
                  <tbody>
                    {m.rows.map(([name, time, price]) => (
                      <tr key={name} className="border-t border-beige-200">
                        <th scope="row" className="px-5 py-3 text-left font-medium text-ink sm:px-6">
                          {name}
                          {time && <span className="block text-xs font-normal text-muted">{time}</span>}
                        </th>
                        <td className="px-5 py-3 text-right whitespace-nowrap text-moss-800 sm:px-6">{price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-14">
          <h3 data-reveal="fade-up" className="font-serif text-3xl font-medium text-moss-900">Menu bảng giá chi tiết</h3>
          <div className="mt-6">
            <PosterRail images={menus} label="Ảnh menu bảng giá" itemClassName="w-[78%] sm:w-[42%] lg:w-[23%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
