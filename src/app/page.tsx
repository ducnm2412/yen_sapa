import { MotionSystem } from "@/components/motion/MotionSystem";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BannerAboutStack } from "@/components/BannerAboutStack";
import { ServicesSection } from "@/components/ServicesSection";
import { PricingSection } from "@/components/PricingSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SpaceSection } from "@/components/SpaceSection";
import { PromoSection } from "@/components/PromoSection";
import { BentoShowcase } from "@/components/BentoShowcase";
import { BrandSentence } from "@/components/BrandSentence";
import { FeatureMarquee } from "@/components/FeatureMarquee";
import { Footer } from "@/components/Footer";
import { FloatingContactBar } from "@/components/FloatingContactBar";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Banner giữ lại, "Về Yên Spa" trượt lên đè như tấm thẻ (SIG-1211) */}
        <BannerAboutStack />
        {/* Câu thương hiệu đứng yên, lá trôi phía sau (SIG-01) */}
        <BrandSentence />
        <ServicesSection />
        <PromoSection />
        {/* Bento Editorial: sản phẩm + combo + member + ưu đãi + trước/sau, rồi trải nghiệm zigzag */}
        <FeatureMarquee />
        <BentoShowcase />
        <SpaceSection />
        <PricingSection />
        {/* Khối xanh bo cong (đánh giá + đặt lịch); nền phía sau trùng màu section trên để góc cong liền mạch */}
        <div className="bg-[#f4ece0]">
          <ReviewsSection />
        </div>
      </main>
      <Footer />
      <FloatingContactBar />
      <MotionSystem />
    </>
  );
}
