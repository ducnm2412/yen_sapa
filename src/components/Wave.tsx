import clsx from "clsx";

/**
 * Sóng hữu cơ nối hai section (thay cho đường phân cách thẳng).
 * Mỗi lớp có 2 hình dạng cùng cấu trúc lệnh SVG → GSAP morph thuộc tính `d` theo scroll (data-morph).
 * Lớp cuối cùng phải là màu nền của section kế tiếp (đục hoàn toàn).
 */

const W = 1440;
const H = 140;
const SEGMENTS = 6;

function wavePath(base: number, amp: number, phase: number, freq: number) {
  const y = (x: number) => base + amp * Math.sin((x / W) * Math.PI * 2 * freq + phase);
  const dx = W / SEGMENTS;
  let d = `M0 ${y(0).toFixed(1)}`;
  for (let i = 0; i < SEGMENTS; i++) {
    const x0 = i * dx;
    const x1 = x0 + dx;
    const c1 = x0 + dx / 3;
    const c2 = x1 - dx / 3;
    d += ` C${c1.toFixed(1)} ${y(c1).toFixed(1)} ${c2.toFixed(1)} ${y(c2).toFixed(1)} ${x1.toFixed(1)} ${y(x1).toFixed(1)}`;
  }
  return `${d} L${W} ${H} L0 ${H} Z`;
}

export type WaveLayer = { fill: string; base: number; amp: number; phase: number; freq?: number; opacity?: number };

export function Wave({
  layers,
  className,
  flip,
}: {
  layers: WaveLayer[];
  className?: string;
  /** lật lên trên (sóng ở mép trên section) */
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-x-0 z-[1] h-[clamp(56px,9vw,140px)]",
        flip ? "top-[-1px] rotate-180" : "bottom-[-1px]",
        className,
      )}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        {layers.map((l, i) => {
          const f = l.freq ?? 1.2;
          return (
            <path
              key={i}
              fill={l.fill}
              fillOpacity={l.opacity ?? 1}
              d={wavePath(l.base, l.amp, l.phase, f)}
              data-morph={wavePath(l.base + 6, l.amp * 0.6, l.phase + 1.1, f)}
            />
          );
        })}
      </svg>
    </div>
  );
}
