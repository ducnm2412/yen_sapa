import Image from "next/image";
import clsx from "clsx";
import { primaryBranch, site } from "@/content/site";
import { FacebookIcon, MessengerIcon, ZaloIcon } from "@/components/icons/BrandIcons";
import { SplitWords } from "@/components/motion/Split";
import { RotatingWord } from "@/components/motion/RotatingWord";
import { RollText } from "@/components/motion/RollText";

/* ---------- Icon SVG inline ---------- */
function Arrow({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Leaf({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
      <path d="M5 19 13 11" />
    </svg>
  );
}
function PhoneIcon({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
const featureIcons = [
  // Không gian
  <path key="a" d="M4 20V9l8-5 8 5v11M9 20v-6h6v6" />,
  // Tư vấn
  <path key="b" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12ZM9 11h6M9 14h4" />,
  // Chất lượng
  <path key="c" d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" />,
  // Đồng hành
  <path key="d" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
];

/* ---------- Component dùng chung ---------- */
function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="mb-6 flex items-start gap-5 last:mb-0">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-gold-500 font-serif text-[18px] text-moss-900">
        {n}
      </span>
      <div>
        <p className="font-serif text-[22px] leading-[1.2] text-moss-900">{title}</p>
        <p className="mt-1 text-[16px] leading-[1.6] text-[#58614F]">{text}</p>
      </div>
    </li>
  );
}

function ServiceRow({ title, text }: { title: string; text: string }) {
  return (
    <li className="mb-6 flex items-start gap-5 last:mb-0">
      <span className="mt-1.5 flex size-8 shrink-0 items-center justify-center text-gold-500">
        <Leaf />
      </span>
      <div>
        <p className="font-serif text-[22px] leading-[1.2] text-moss-900">{title}</p>
        <p className="mt-1 text-[16px] leading-[1.6] text-[#58614F]">{text}</p>
      </div>
    </li>
  );
}

function Divider({ quiet }: { quiet?: boolean }) {
  return (
    <div className="flex justify-center py-8" aria-hidden="true">
      <span data-reveal={quiet ? undefined : "line"} className="h-px w-24 origin-center bg-gold-500/60" />
    </div>
  );
}

function PrimaryButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      data-magnetic
      className="inline-flex min-h-12 items-center gap-3 rounded-full bg-moss-900 px-7 py-3 font-medium text-beige-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-moss-800"
    >
      <RollText label={label} />
      <Arrow />
    </a>
  );
}

function OutlineButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ring inline-flex min-h-12 items-center justify-center rounded-full border border-moss-900/20 px-8 py-3 font-medium text-moss-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent"
    >
      <RollText label={label} />
    </a>
  );
}

function Wordmark({ width, className }: { width: number; className?: string }) {
  return (
    <span className={clsx("inline-flex flex-col items-center leading-none", className)} style={{ width }}>
      <span className="font-serif tracking-[0.18em]" style={{ fontSize: width * 0.36 }}>
        YÊN
      </span>
      <span className="mt-1 tracking-[0.22em]" style={{ fontSize: Math.max(8, width * 0.09) }}>
        SPA + BEAUTE
      </span>
    </span>
  );
}

/** Ảnh dọc khung email, hover phóng nhẹ (chỉ thiết bị có chuột qua group-hover). */
function ImageCard({
  src,
  alt,
  arch,
  parallax,
}: {
  src: string;
  alt: string;
  arch?: boolean;
  parallax?: boolean;
}) {
  return (
    <div className="px-5 pb-10 sm:px-[42px]">
      <div
        data-reveal="clip-up"
        data-parallax={parallax ? "30" : undefined}
        className={clsx("group relative block h-[370px] overflow-hidden", arch ? "rounded-t-[999px] rounded-b-sm" : "rounded-sm")}
      >
        <div data-parallax-inner={parallax ? "" : undefined} className={clsx("absolute inset-x-0", parallax ? "-inset-y-8" : "inset-y-0")}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 556px, 100vw"
            className="object-cover transition-transform duration-700 [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </div>
  );
}

const sectionTitle = "font-serif text-center text-[2.4rem] leading-[1.1] text-moss-900 sm:text-[44px]";

/* ---------- Trang ---------- */
export function Newsletter() {
  const q3 = site.branches[0];
  const pn = site.branches[1];
  const tel = `tel:${primaryBranch.hotlineE164}`;

  return (
    <div className="min-h-dvh bg-beige-200 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-[640px] overflow-hidden shadow-[0_30px_80px_-40px_rgb(38_48_31/0.45)] ring-1 ring-moss-900/10 sm:rounded-sm">
        <main className="bg-beige-50 text-moss-900">
          {/* ---------- Section 1: Hero ---------- */}
          <section
            id="trang-chu"
            className="relative isolate min-h-[100svh] w-full overflow-hidden bg-moss-950 sm:aspect-[640/820] sm:min-h-0"
          >
            <div data-hero-parallax className="absolute inset-0 -z-10">
              <div data-hero-image className="absolute inset-0">
                <Image
                  src="/images/space/treatment-room.jpg"
                  alt="Phòng chăm sóc da của Yên Spa đón ánh nắng tự nhiên"
                  fill
                  preload
                  sizes="(min-width: 640px) 640px, 100vw"
                  className="object-cover object-[60%_center]"
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(28,36,23,.35) 0%, rgba(28,36,23,0) 28%, rgba(28,36,23,.5) 62%, rgba(28,36,23,.9) 86%, #1C2417 100%)",
              }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-soft-light">
              <div data-hero-glow className="absolute -top-20 -right-20 size-80 rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.7),transparent_65%)]" />
              <div data-hero-glow className="absolute bottom-24 -left-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(216,192,138,0.5),transparent_65%)]" />
            </div>

            <div className="relative z-10 flex h-full min-h-[inherit] flex-col items-center px-6 pt-12 pb-24 text-center sm:pb-10">
              <a href="#trang-chu" data-hero="logo" aria-label={site.name} className="text-beige-50">
                <Wordmark width={88} />
              </a>
              <p data-hero="nav" className="glass mt-16 inline-flex sm:mt-32 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-beige-50">
                <span className="size-1.5 rounded-full bg-[#7fb069]" aria-hidden="true" />
                <span>Mở cửa {site.hours.display} mỗi ngày</span>
              </p>
              <div className="flex-1" />
              <h1 data-reveal="words" className="max-w-[520px] font-serif text-[2.5rem] leading-[1.1] text-beige-50 sm:text-[52px]">
                <SplitWords text="Làn da được lắng nghe" />
                <br />
                <SplitWords text="trước khi được chăm sóc" />
              </h1>
              <p className="mt-5 max-w-[34ch] text-[17px] leading-[1.55] text-beige-50/80">
                <span className="sr-only">Chăm sóc da chuyên sâu, phục hồi và trẻ hóa tại Quận 3 và Phú Nhuận.</span>
                <span aria-hidden="true">
                  Chăm sóc da{" "}
                  <span className="font-serif text-[1.2em] text-gold-300 italic">
                    <RotatingWord words={["chuyên sâu", "phục hồi", "trẻ hóa"]} />
                  </span>{" "}
                  tại Quận 3 và Phú Nhuận.
                </span>
              </p>
              <a
                href={site.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-beige-50 px-8 py-4 font-medium text-moss-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                Đặt lịch tư vấn
                <Arrow />
              </a>
              <a
                href="#gioi-thieu"
                className="mt-8 hidden flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-beige-100/70 uppercase sm:flex"
              >
                Cuộn
                <span className="relative h-8 w-px overflow-hidden bg-white/20" aria-hidden="true">
                  <span className="animate-scroll-down absolute inset-x-0 top-0 h-1/2 bg-gold-300" />
                </span>
              </a>
            </div>
          </section>

          {/* ---------- Section 2: Banner mặt tiền ---------- */}
          <section aria-label="Mặt tiền Yên Spa & Beaute" className="px-4 pt-8 sm:px-8">
            <div data-reveal="strips" className="relative overflow-hidden rounded-sm">
              <Image
                src="/images/brand/banner-storefront.jpg"
                alt="Mặt tiền Yên Spa & Beauté tại 160 Hoa Lan, kèm thông tin: chăm sóc body, mặt, tóc, triệt lông; since 2019, 2 chi nhánh — CN1 60A Cao Thắng, Quận 3, 0899 60 7279; CN2 160 Hoa Lan, Phú Nhuận, 0896 40 7578; giờ hoạt động 9:00–21:00"
                width={1942}
                height={809}
                sizes="(min-width: 640px) 576px, 100vw"
                className="h-auto w-full"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="reveal-strip h-full flex-1 bg-beige-50" />
                ))}
              </div>
            </div>
          </section>

          {/* ---------- Section 3: Giới thiệu + CTA ---------- */}
          <section id="gioi-thieu">
            <div className="px-6 pt-12 pb-8 sm:px-[78px]">
              <p data-scrub-text className="text-center text-[18px] leading-[1.6]">
                <SplitWords text="Yên Spa & Beaute tập trung vào chăm sóc, cải thiện và phục hồi làn da trong một không gian nhẹ nhàng, tinh tế. Mỗi liệu trình được tư vấn theo tình trạng da và nhu cầu riêng của bạn, cùng đội ngũ hỗ trợ tận tình trong suốt quá trình sử dụng dịch vụ." />
              </p>
            </div>
            <div className="flex justify-center pb-14">
              <PrimaryButton label={`Gọi ${primaryBranch.hotlineDisplay}`} href={tel} />
            </div>
          </section>
          <Divider />

          {/* ---------- Section 3: Dịch vụ ---------- */}
          <section id="dich-vu">
            <h2 data-reveal="words" className={clsx(sectionTitle, "px-9 pb-8")}>
              <SplitWords text="Liệu trình theo đúng nhu cầu của da" />
            </h2>
            <ImageCard src="/images/services/products-christina.jpg" alt="Bộ sản phẩm chăm sóc da chuyên nghiệp dùng trong liệu trình tại Yên Spa" />
            <div className="px-6 pb-10 sm:px-[76px]">
              <ul data-reveal="stagger" className="mx-auto max-w-[489px]">
                <ServiceRow title="Chăm sóc và phục hồi da chuyên sâu" text="Làm sạch, cấp ẩm và phục hồi làn da mệt mỏi, điều chỉnh theo tình trạng da sau khi tư vấn." />
                <ServiceRow title="Điều trị mụn, thâm và nám" text="Liệu trình cho da mụn, vết thâm và nám, theo dõi qua từng buổi." />
                <ServiceRow title="Trẻ hóa và tái tạo da" text="Giúp làn da săn chắc và tươi mới hơn." />
                <ServiceRow title="Chăm sóc da mặt và body" text="Chăm sóc trọn vẹn từ gương mặt đến cơ thể." />
                <ServiceRow title="Làm đẹp và thư giãn" text="Những liệu trình nhẹ nhàng để nghỉ ngơi sau một ngày dài." />
              </ul>
            </div>
            <div className="flex justify-center pb-14">
              <OutlineButton label="Nhắn Zalo tư vấn" href={site.zaloUrl} />
            </div>
          </section>
          <Divider />

          {/* ---------- Section 4: Không gian + điểm khác biệt ---------- */}
          <section id="khong-gian">
            <h2 data-reveal="blur-words" className={clsx(sectionTitle, "px-9 pb-7")}>
              <SplitWords text="Một khoảng lặng" />
              <br />
              <SplitWords text="giữa thành phố" />
            </h2>
            <ImageCard src="/images/space/lobby.jpg" alt="Sảnh chờ của Yên Spa với sofa da, ghế bọc vải và cây xanh" arch parallax />
            <ul data-reveal="stagger" className="grid gap-x-6 gap-y-7 px-6 pb-12 sm:grid-cols-2 sm:px-[60px]">
              {[
                ["Không gian chuyên nghiệp", "Không gian và trải nghiệm chăm sóc được chuẩn bị chỉn chu."],
                ["Tư vấn theo tình trạng da", "Liệu trình đề xuất theo tình trạng và nhu cầu của từng khách."],
                ["Chú trọng chất lượng", "Chất lượng dịch vụ và trải nghiệm của khách là ưu tiên."],
                ["Đồng hành tận tình", "Hỗ trợ khách trong suốt quá trình sử dụng dịch vụ."],
              ].map(([title, text], i) => (
                <li key={title}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[26px] text-gold-500">
                    {featureIcons[i]}
                  </svg>
                  <p className="mt-3 font-serif text-[21px] leading-[1.2]">{title}</p>
                  <p className="mt-1 text-[15px] leading-[1.6] text-[#58614F]">{text}</p>
                </li>
              ))}
            </ul>
          </section>
          <Divider quiet />

          {/* ---------- Section 5: Đặt lịch 3 bước ---------- */}
          <section id="dat-lich">
            <h2 data-reveal="blur-words" className={clsx(sectionTitle, "px-9 pb-8")}>
              <SplitWords text="Đặt lịch chỉ trong vài phút" />
            </h2>
            <div className="px-6 pb-12 sm:px-[76px]">
              <ol data-reveal="mask-right" className="mx-auto max-w-[489px]">
                <Step n={1} title="Chọn chi nhánh gần bạn" text="Quận 3 (60A Cao Thắng) hoặc Phú Nhuận (160 Hoa Lan)." />
                <Step n={2} title="Gọi hoặc nhắn tin" text="Cho Yên biết tình trạng da và khung giờ bạn muốn đến." />
                <Step n={3} title="Nhận tư vấn và giờ hẹn" text="Yên tư vấn liệu trình phù hợp và xác nhận lịch với bạn." />
              </ol>
            </div>
          </section>

          {/* ---------- Section 6: Thẻ CTA ---------- */}
          <section className="px-5 pb-12 sm:px-14">
            <div data-reveal="fade-up" className="relative overflow-hidden rounded-sm bg-moss-900 px-8 py-12 text-center text-beige-50">
              <span aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(216,192,138,1),transparent_65%)] opacity-20" />
              <h2 className="relative mb-3 font-serif text-[2.4rem] leading-[1.1] sm:text-[46px]">
                Sẵn sàng chăm sóc
                <br />
                làn da của bạn?
              </h2>
              <p className="relative mb-8 px-4 text-[17px] leading-[1.55] text-beige-50/80">
                Gọi hotline hoặc nhắn Fanpage để được tư vấn và giữ lịch trước khi đến.
              </p>
              <div className="relative flex flex-wrap justify-center gap-3">
                <a
                  href={tel}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-beige-50 px-7 py-3 font-medium text-moss-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                >
                  <PhoneIcon className="size-4" />
                  Gọi {primaryBranch.hotlineDisplay}
                </a>
                <a
                  href={site.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-beige-50/35 px-7 py-3 font-medium text-beige-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-beige-50/10"
                >
                  Nhắn Messenger
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* ---------- Footer ---------- */}
        <footer id="chi-nhanh" className="border-t border-beige-50/10 bg-moss-950 px-6 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom))] text-center text-beige-100 sm:px-10 sm:pb-10">
          <div className="flex justify-center pb-8">
            <a href="#trang-chu" aria-label="Về đầu trang" className="text-beige-50 transition-colors hover:text-gold-300">
              <Wordmark width={110} />
            </a>
          </div>
          <div className="grid gap-6 pb-8 text-[14px] leading-[1.6] sm:grid-cols-2">
            {[
              { b: q3, label: "Chi nhánh 1, Quận 3", addr: "60A Cao Thắng, Phường Bàn Cờ" },
              { b: pn, label: "Chi nhánh 2, Phú Nhuận", addr: "160 Hoa Lan, Phường Cầu Kiệu" },
            ].map(({ b, label, addr }) => (
              <address key={b.id} className="not-italic">
                <p className="font-serif text-[18px] text-gold-300">{label}</p>
                <p>{addr}</p>
                <p>
                  Hotline{" "}
                  <a href={`tel:${b.hotlineE164}`} className="transition-colors hover:text-white hover:underline">
                    {b.hotlineDisplay}
                  </a>
                </p>
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-beige-50 underline-offset-4 transition-colors hover:underline">
                  Chỉ đường
                </a>
              </address>
            ))}
          </div>
          <p className="pb-8 text-[13px] text-beige-100/70">Mở cửa 09:00–21:00, từ thứ Hai đến Chủ Nhật. Nên đặt lịch trước khi đến.</p>
          <div className="flex justify-center pb-8" aria-hidden="true">
            <span className="h-px w-24 bg-beige-50/20" />
          </div>
          <ul className="flex justify-center gap-4 pb-6">
            {[
              { href: site.fanpageUrl, label: "Fanpage Facebook", icon: <FacebookIcon className="size-[18px]" />, ext: true },
              { href: site.zaloUrl, label: "Nhắn Zalo", icon: <ZaloIcon className="size-6" />, ext: true },
              { href: site.messengerUrl, label: "Nhắn Messenger", icon: <MessengerIcon className="size-[18px]" />, ext: true },
              { href: tel, label: `Gọi ${primaryBranch.hotlineDisplay}`, icon: <PhoneIcon />, ext: false },
            ].map(({ href, label, icon, ext }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex size-11 items-center justify-center rounded-full border border-beige-50/20 transition-colors hover:border-beige-50 hover:bg-beige-50 hover:text-moss-900"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="space-x-2 pb-3 text-[12px]">
            <a href="#dich-vu" className="hover:underline">Dịch vụ</a>
            <span className="text-beige-50/30">|</span>
            <a href="#dat-lich" className="hover:underline">Đặt lịch</a>
            <span className="text-beige-50/30">|</span>
            <a href="#chi-nhanh" className="hover:underline">Chi nhánh</a>
          </p>
          <p className="text-[12px] text-beige-50/60">© 2026 {site.name}</p>
        </footer>
      </div>
    </div>
  );
}
