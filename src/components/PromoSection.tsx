import { SectionHeading } from "@/components/SectionHeading";
import { PosterRail } from "@/components/PosterRail";
import { promos } from "@/content/promo";

export function PromoSection() {
  return (
    <section id="uu-dai" className="relative bg-[#f4ece0] px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Ưu đãi đang áp dụng"
          title="Combo & thẻ thành viên"
          text="Các gói kết hợp body, tóc và da mặt, cùng ưu đãi triệt lông và thẻ thành viên. Bấm vào ảnh để xem đầy đủ chi tiết."
        />
        <div className="mt-10">
          <PosterRail images={promos} label="Poster ưu đãi" />
        </div>
      </div>
    </section>
  );
}
