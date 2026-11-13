import { MotionSystem } from "@/components/motion/MotionSystem";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PricingSection } from "@/components/PricingSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SpaceSection } from "@/components/SpaceSection";
import { ContactSection } from "@/components/ContactSection";
import { BannerSection } from "@/components/BannerSection";
import { PromoSection } from "@/components/PromoSection";
import { ProductsSection } from "@/components/ProductsSection";
import { ResultsSection } from "@/components/ResultsSection";
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
        <ProductsSection />
        <SpaceSection />
        <ResultsSection />
        <ProcessSection />
        <PricingSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingContactBar />
      <MotionSystem />
    </>
  );
}
