import type { LightboxImage } from "@/components/Lightbox";

/** Ảnh quảng cáo / poster do khách cung cấp (public/images). Giá & thông tin nằm trong chính ảnh. */
const sq = (src: string, alt: string, size = 1080): LightboxImage => ({ src, width: size, height: size, alt });

export const promos: LightboxImage[] = [
  sq("/images/pricing/combo-1-relax.jpg", "Combo 1 Relax thư giãn: body, gội sạch sấy tóc, chăm sóc da mặt — 2 tiếng"),
  sq("/images/pricing/combo-2-retreat-an-yen.jpg", "Combo 2 Retreat An Yên: body, tóc và chăm sóc da chuyên sâu"),
  sq("/images/pricing/combo-3-serenity.jpg", "Combo 3 Serenity nghỉ dưỡng: body, tóc và chăm sóc da chuyên nghiệp"),
  sq("/images/pricing/triet-long-opt-49k.jpg", "Triệt lông hiệu quả công nghệ OPT — bảng giá và ưu đãi trải nghiệm"),
  sq("/images/services/pro-acne.jpg", "Pro Acne — liệu trình 10 bước thanh lọc mụn", 1280),
  sq("/images/pricing/the-gold.jpg", "Thẻ Gold — tùy chọn dịch vụ và quyền lợi thành viên"),
  { src: "/images/pricing/the-silver.jpg", width: 960, height: 960, alt: "Thẻ Silver — tùy chọn dịch vụ và quyền lợi thành viên" },
];

export const products: (LightboxImage & { label: string })[] = [
  { ...sq("/images/services/products-christina.jpg", "Bộ sản phẩm Christina dùng trong liệu trình chăm sóc da", 1290), label: "Sản phẩm Christina" },
  { ...sq("/images/services/skincare-led.jpg", "Skincare cực chuẩn khoa học với máy ánh sáng LED"), label: "Skincare & LED" },
  { ...sq("/images/services/laser-hair-removal.jpg", "Laser hair removal — kết quả sau 4–6 và 8–10 buổi", 1047), label: "Laser triệt lông" },
  { ...sq("/images/services/hair-care-massage.jpg", "Hair care + massage đầu"), label: "Gội & massage đầu" },
  { ...sq("/images/services/body-care-hot-stone.jpg", "Body care + massage body với đá nóng"), label: "Body đá nóng" },
  { src: "/images/services/poster-skin-hair-body.jpg", width: 1080, height: 1350, alt: "Yếu tố nuôi dưỡng tinh thần: da, tóc, body", label: "Da · Tóc · Body" },
  { ...sq("/images/space/product-shelf.jpg", "Kệ sản phẩm chăm sóc da tại spa"), label: "Kệ sản phẩm" },
  { src: "/images/services/led-red-therapy.jpg", width: 928, height: 927, alt: "Máy trị liệu ánh sáng đỏ LED", label: "Ánh sáng đỏ LED" },
  { src: "/images/services/treatment-area.jpg", width: 1029, height: 1028, alt: "Khu vực thực hiện liệu trình tại Yên Spa & Skinlab", label: "Khu trị liệu" },
];

export const results: LightboxImage[] = [
  { src: "/images/results/glow-up.jpg", width: 1280, height: 1280, alt: "Yên Glow-up: da trước và sau liệu trình" },
  ...[1, 2, 3, 4, 5, 6, 7].map((n) =>
    ({ src: `/images/results/personal-packet-${n}.jpg`, width: 2048, height: 2048, alt: `Personal Packet: kết quả sau liệu trình phác đồ cá nhân (${n})` }),
  ),
  ...[1, 2, 3, 4].map((n) => sq(`/images/results/hifu-${n}.jpg`, `HIFU lifting & rejuvenation: trước và sau (${n})`)),
  sq("/images/results/retinol-acneskin.jpg", "Retinol Acneskin: kết quả trị mụn chuyên sâu"),
];

export const menus: LightboxImage[] = [
  sq("/images/pricing/menu-01-facial-hair-body.jpg", "Menu 01: Facial, Hair spa, Body và Combo"),
  sq("/images/pricing/menu-02-triet-long-opt.jpg", "Menu 02: Triệt lông OPT"),
  sq("/images/pricing/menu-03-treatment.jpg", "Menu 03: Treatment điều trị da"),
  sq("/images/pricing/menu-04-the-member.jpg", "Menu 04: Thẻ ưu đãi Member"),
  sq("/images/pricing/facial-treatment.jpg", "Bảng giá Facial Treatment"),
  sq("/images/pricing/body-massage-care.jpg", "Bảng giá Body Massage & Care"),
  sq("/images/pricing/hair-spa-massage.jpg", "Bảng giá Hair Spa"),
  sq("/images/pricing/bang-gia-triet-long.jpg", "Bảng giá triệt lông"),
];
