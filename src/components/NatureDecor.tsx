import Image from "next/image";
import clsx from "clsx";

/** Cụm lá tách nền (PNG trong suốt) lấy từ ảnh nền khách gửi — public/images/nature. */
const LEAVES = {
  "palm-top-left": { w: 303, h: 384 },
  "monstera-bottom-right": { w: 332, h: 458 },
  "leaves-top-right": { w: 286, h: 245 },
  "fern-top-left": { w: 536, h: 494 },
  "fern-top-right": { w: 492, h: 794 },
  "fern-bottom-left": { w: 437, h: 772 },
  "fern-bottom-right": { w: 536, h: 481 },
} as const;

export type LeafName = keyof typeof LEAVES;

/**
 * Lá trang trí đặt tuyệt đối ở góc section (nằm dưới nội dung, không nhận click, ẩn với trình đọc màn hình).
 * `className` quyết định vị trí + kích thước theo breakpoint, ví dụ "left-0 top-0 w-40 lg:w-60".
 */
export function Leaf({ name, className }: { name: LeafName; className: string }) {
  const { w, h } = LEAVES[name];
  return (
    <Image
      src={`/images/nature/${name}.png`}
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      sizes="(min-width: 1024px) 320px, 180px"
      className={clsx("pointer-events-none absolute -z-10 h-auto select-none", className)}
    />
  );
}

/** Lớp texture bóng lá mờ phủ toàn section. */
export function LeafShadowTexture({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none absolute inset-0 -z-20 overflow-hidden", className)}>
      <Image src="/images/nature/palm-shadow-texture.jpg" alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}
