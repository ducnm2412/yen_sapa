import Image from "next/image";
import { ArrowUp, Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { noOrphan } from "@/lib/text";
import { FacebookIcon, MessengerIcon, ZaloIcon } from "@/components/icons/BrandIcons";

const socials = [
  { href: site.fanpageUrl, label: "Fanpage Facebook", Icon: FacebookIcon },
  { href: site.messengerUrl, label: "Messenger", Icon: MessengerIcon },
  { href: site.zaloUrl, label: "Zalo", Icon: ZaloIcon },
];

/** Footer gọn: thương hiệu + mạng xã hội, 2 thẻ chi nhánh (địa chỉ + hotline), menu một hàng, bản quyền. */
export function Footer() {
  return (
    <footer className="bg-moss-900 px-4 pt-10 pb-28 text-beige-100 sm:px-6 md:pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Thương hiệu + mạng xã hội */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/images/brand/logo-red-mark.png" alt="" width={44} height={44} className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0">
              <p className="text-base font-semibold whitespace-nowrap text-white">{site.name}</p>
              <p className="text-xs text-beige-200">Since{" "}{site.since}</p>
            </div>
          </div>
          <ul className="flex shrink-0 gap-2" aria-label="Mạng xã hội và nhắn tin">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="btn-ring grid size-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-transparent"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 chi nhánh */}
        <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
          {site.branches.map((b) => (
            <li key={b.id} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="font-semibold text-white">{b.name}</p>
              <address className="mt-2 space-y-1.5 not-italic">
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-beige-200 hover:text-white">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {noOrphan(b.address)}
                </a>
                <a href={`tel:${b.hotlineE164}`} className="flex items-center gap-2 text-beige-200 hover:text-white">
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  {b.hotlineDisplay}
                </a>
              </address>
            </li>
          ))}
        </ul>

        {/* Giờ mở cửa + menu một hàng */}
        <div className="mt-6 flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2 text-beige-200">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            Mở cửa {site.hours.display}{" "}·{" "}mỗi{" "}ngày
          </p>
          <nav aria-label="Liên kết nhanh" className="hidden md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="nav-link whitespace-nowrap text-beige-200 hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-beige-300">
          <p>© 2026 {site.name}</p>
          <a href="#trang-chu" className="group inline-flex items-center gap-1.5 whitespace-nowrap hover:text-white">
            Lên đầu trang
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
