import { ArrowUp } from "lucide-react";
import { site } from "@/content/site";
import { FacebookIcon, MessengerIcon, ZaloIcon } from "@/components/icons/BrandIcons";

const socials = [
  { href: site.fanpageUrl, label: "Facebook", Icon: FacebookIcon },
  { href: site.messengerUrl, label: "Messenger", Icon: MessengerIcon },
  { href: site.zaloUrl, label: "Zalo", Icon: ZaloIcon },
];

/** Footer kiểu typography lớn: tên thương hiệu cỡ lớn chiếm 1/3, 3 cột Liên hệ / Giờ mở cửa / Theo dõi. */
export function Footer() {
  return (
    <footer className="relative z-[3] -mt-24 rounded-t-[3rem] bg-beige-50 px-4 pt-14 pb-28 text-moss-900 sm:-mt-28 sm:rounded-t-[6rem] sm:px-6 sm:pt-20 md:pb-8 lg:rounded-t-[10rem]">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_1fr_0.8fr_1fr] lg:gap-8">
        <div>
          <p className="text-[3.4rem] leading-[0.95] font-semibold tracking-tighter sm:text-7xl">
            Yên Spa
            <span className="block text-[0.5em] font-medium tracking-tight text-moss-700">& Beaute</span>
          </p>
          <p className="mt-4 text-sm text-muted">{site.tagline}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Liên hệ</p>
          <ul className="mt-4 space-y-4 text-sm">
            {site.branches.map((b) => (
              <li key={b.id}>
                <a href={`tel:${b.hotlineE164}`} className="block text-lg font-semibold whitespace-nowrap hover:text-burgundy">
                  {b.hotlineDisplay}
                </a>
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-muted hover:text-moss-900">
                  {b.address.replace(", TP.HCM", "")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Giờ mở cửa</p>
          <p className="mt-4 text-lg font-semibold">Thứ 2 – Chủ nhật</p>
          <p className="text-lg font-semibold whitespace-nowrap">{site.hours.display}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Theo dõi</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-burgundy px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#662424]"
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between gap-4 border-t border-moss-900/10 pt-5 text-xs text-muted">
        <p>
          © 2026 {site.name} · Since{" "}{site.since}
        </p>
        <a href="#trang-chu" className="group inline-flex items-center gap-1.5 whitespace-nowrap hover:text-moss-900">
          Lên đầu trang
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
