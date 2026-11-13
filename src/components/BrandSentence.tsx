import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { Sig01StickyHeadline, type SigLeaf } from "@/components/signature/SIG-01/SIG-01";

/** Cụm lá tách nền (public/images/nature) với kích thước thật của từng PNG. */
const leaves: SigLeaf[] = [
  // Mép cắt của từng PNG: palm = trên + trái, leaves = trên + phải, monstera = dưới + phải, fern = một mép bên.
  { src: "/images/nature/palm-top-left.png", width: 303, height: 384, side: "left", w: 17, flush: "top" },
  { src: "/images/nature/leaves-top-right.png", width: 286, height: 245, side: "right", w: 22, flush: "top" },
  { src: "/images/nature/fern-top-left.png", width: 536, height: 494, side: "left", w: 22, top: 50 },
  { src: "/images/nature/monstera-bottom-right.png", width: 332, height: 458, side: "right", w: 24, flush: "bottom" },
  { src: "/images/nature/fern-bottom-right.png", width: 536, height: 481, side: "right", w: 17, top: 30 },
];

const vars = {
  "--sig-bg": "var(--color-moss-900)",
  "--sig-fg": "var(--color-beige-50)",
  "--sig-accent": "var(--color-gold-300)",
  "--sig-font-display": "var(--font-display)",
  "--sig-font-body": "var(--font-body)",
} as CSSProperties;

/** Câu thương hiệu đứng yên, lá trôi phía sau (SIG-01). Mọi chữ lấy từ site.ts. */
export function BrandSentence() {
  const slogan = site.slogans[2];
  return (
    <div style={vars}>
      <Sig01StickyHeadline
        intensity={1}
        eyebrow={`${site.name} · từ ${site.since}`}
        headline={slogan}
        emphasis="Yên lành"
        caption={site.tagline}
        backdrop="/images/nature/light-leaves-bg.jpg"
        images={leaves}
      />
    </div>
  );
}
