import { Leaf } from "lucide-react";
import { site } from "@/content/site";

/** Điểm mạnh thật của Yên (từ banner, bảng giá và phần giới thiệu) — không thêm thông tin mới. */
const items = [
  `Since ${site.since}`,
  "Quận 3 · Phú Nhuận",
  "Christina · Dermafirm · Image · Batious",
  "Ánh sáng sinh học LED",
  "Triệt lông công nghệ OPT",
  "Khăn, bông, kim mới cho mỗi khách",
  "Gội dưỡng sinh · Massage đá nóng",
  `Mở cửa ${site.hours.display} mỗi ngày`,
];

/**
 * Infinite slider (tham khảo 21st.dev): dải chữ chạy vô hạn, mờ dần ở hai mép.
 * Chuyển động do MotionSystem ([data-marquee], dừng khi khuất màn hình, tắt khi giảm chuyển động).
 */
export function FeatureMarquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 text-sm font-medium whitespace-nowrap text-beige-100 sm:text-base">
          <span>{t}</span>
          <Leaf className="size-4 text-gold-300" strokeWidth={1.5} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative bg-moss-900 py-4 sm:py-5">
      <p className="sr-only">{items.join(" · ")}</p>
      <div aria-hidden="true" className="edge-fade overflow-hidden">
        <div data-marquee className="flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
