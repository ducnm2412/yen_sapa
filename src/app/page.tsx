import { MotionSystem } from "@/components/motion/MotionSystem";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PricingSection } from "@/components/PricingSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SpaceSection } from "@/components/SpaceSection";
import { BannerSection } from "@/components/BannerSection";
import { PromoSection } from "@/components/PromoSection";
import { BentoShowcase } from "@/components/BentoShowcase";
import { FeatureMarquee } from "@/components/FeatureMarquee";
import { Footer } from "@/components/Footer";
import { FloatingContactBar } from "@/components/FloatingContactBar";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Overlapping scroll: banner ghim lại, "Về Yên Spa" trượt lên đè */}
        <div className="relative">
          <BannerSection />
          <AboutSection />
        </div>
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
