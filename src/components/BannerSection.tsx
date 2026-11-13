import Image from "next/image";

/** Banner mặt tiền ngay dưới hero — ảnh lộ theo dải. */
export function BannerSection() {
  return (
    <section aria-label="Mặt tiền Yên Spa & Beaute" className="relative z-[2] bg-beige-50 px-4 pt-10 sm:px-6 sm:pt-14">
      <div data-reveal="strips" className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_-40px_rgba(38,48,32,0.45)]">
        <Image
          src="/images/brand/banner-storefront.jpg"
          alt="Mặt tiền Yên Spa & Beauté tại 160 Hoa Lan, kèm thông tin: chăm sóc body, mặt, tóc, triệt lông; since 2019, 2 chi nhánh — CN1 60A Cao Thắng, Quận 3, 0899 60 7279; CN2 160 Hoa Lan, Phú Nhuận, 0896 40 7578; giờ hoạt động 9:00–21:00"
          width={1942}
          height={809}
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="h-auto w-full"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="reveal-strip h-full flex-1 bg-beige-50" />
          ))}
        </div>
      </div>
    </section>
  );
}
