import type { Metadata } from "next";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { MotionSystem } from "@/components/motion/MotionSystem";

export const metadata: Metadata = {
  title: "Bản tin Yên Spa & Beaute — Chăm sóc da Quận 3 & Phú Nhuận",
  description:
    "Yên Spa & Beaute: liệu trình chăm sóc, phục hồi và trẻ hóa da được tư vấn theo tình trạng da tại Quận 3 và Phú Nhuận. Gọi hoặc nhắn Zalo để đặt lịch.",
};

export default function BanTinPage() {
  return (
    <>
      <Newsletter />
      <FloatingContactBar />
      <MotionSystem />
    </>
  );
}
