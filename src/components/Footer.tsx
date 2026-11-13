import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { noOrphan } from "@/lib/text";
import { FacebookIcon, MessengerIcon, ZaloIcon } from "@/components/icons/BrandIcons";

/** Footer tối 4 cột theo mẫu + thanh bản quyền và "Lên đầu trang". */
export function Footer() {
  return (
    <footer className="bg-moss-900 px-4 pt-14 pb-28 text-beige-100 sm:px-6 md:pb-8">
      <div data-reveal="stagger" className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1.1fr] lg:divide-x lg:divide-white/10">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/brand/logo-green.jpg" alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
            <p className="font-logo text-2xl text-white">{site.name}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-beige-200">{site.tagline} · Since{" "}{site.since}</p>
        </div>

        <nav aria-label="Liên kết nhanh" className="lg:pl-8">
          <p className="text-sm font-semibold text-white">Liên kết nhanh</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link text-beige-200 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:pl-8">
          <p className="text-sm font-semibold text-white">Chi nhánh</p>
          <ul className="mt-4 space-y-4 text-sm">
            {site.branches.map((b) => (
              <li key={b.id}>
                <address className="not-italic">
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-beige-200 hover:text-white">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {noOrphan(b.address)}
                  </a>
                </address>
              </li>
            ))}
            <li className="text-beige-200">Mở cửa {site.hours.display} · mỗi ngày</li>
          </ul>
        </div>

        <div className="lg:pl-8">
          <p className="text-sm font-semibold text-white">Liên hệ với Yên</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.branches.map((b) => (
              <li key={b.id}>
                <a href={`tel:${b.hotlineE164}`} className="flex items-center gap-2 text-beige-200 hover:text-white">
                  <Phone className="size-4" aria-hidden="true" />
                  {b.hotlineDisplay} · {b.shortName}
                </a>
              </li>
            ))}
            <li>
              <a href={site.messengerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-beige-200 hover:text-white">
                <Mail className="size-4" aria-hidden="true" />
                Nhắn tin qua Fanpage
              </a>
            </li>
          </ul>
          <ul className="mt-5 flex gap-2" aria-label="Mạng xã hội và nhắn tin">
            {[
              { href: site.fanpageUrl, label: "Fanpage Facebook", Icon: FacebookIcon },
              { href: site.messengerUrl, label: "Messenger", Icon: MessengerIcon },
              { href: site.zaloUrl, label: "Zalo", Icon: ZaloIcon },
            ].map(({ href, label, Icon }) => (
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
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-white/10 pt-6 text-xs text-beige-300">
        <p>© 2026 {site.name}. Bảo lưu mọi quyền.</p>
        <a href="#trang-chu" className="group inline-flex items-center gap-1.5 whitespace-nowrap hover:text-white">
          Lên đầu trang
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
