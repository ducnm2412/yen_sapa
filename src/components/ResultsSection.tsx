import { SectionHeading } from "@/components/SectionHeading";
import { PosterRail } from "@/components/PosterRail";
import { results } from "@/content/promo";

export function ResultsSection() {
  return (
    <section id="ket-qua" className="relative bg-[#f4ece0] px-4 pt-6 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Kết quả thực tế"
          title="Làn~da thay~đổi sau liệu~trình"
          text="Hình ảnh trước và sau của khách hàng tại Yên Spa & Skinlab. Kết quả tùy thuộc vào tình trạng da của mỗi người."
        />
        <div className="mt-10">
          <PosterRail images={results} label="Ảnh kết quả trước và sau" />
        </div>
      </div>
    </section>
  );
}
