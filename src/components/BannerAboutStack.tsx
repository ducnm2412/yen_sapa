import type { CSSProperties } from "react";
import { Sig1211CardOver } from "@/components/signature/SIG-1211/SIG-1211";
import { BannerSection } from "@/components/BannerSection";
import { AboutSection } from "@/components/AboutSection";

const vars = {
  "--sig-bg": "var(--color-beige-50)",
  "--sig-card-shadow": "0 -30px 60px -30px rgba(38,48,32,0.35)",
} as CSSProperties;

/** Banner giữ lại, "Về Yên Spa" trượt lên đè như tấm thẻ bo góc (SIG-1211). Banner lùi nhỏ và tối dần, không thêm chiều cuộn. */
export function BannerAboutStack() {
  return (
    <Sig1211CardOver
      intensity={2}
      radius="3rem"
      overlayColor="var(--color-moss-950)"
      style={vars}
      outgoing={<BannerSection />}
      incoming={<AboutSection />}
    />
  );
}
