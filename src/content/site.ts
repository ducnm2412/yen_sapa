// Nguồn dữ liệu duy nhất cho toàn trang (FND-04).
// Mọi thông tin liên hệ hiển thị ở header, hero, thanh nút nổi, mục liên hệ và footer đều lấy từ đây.

export type Branch = {
  id: "quan-3" | "phu-nhuan";
  name: string;
  shortName: string;
  address: string;
  hotlineDisplay: string;
  /** Số điện thoại dạng +84 dùng cho tel: */
  hotlineE164: string;
  mapsUrl: string;
};

export const site = {
  name: "Yên Spa & Beaute",
  shortName: "Yên",
  tagline: "Chăm sóc sức khỏe và làm đẹp khoa học",
  intro:
    "Liệu trình chăm sóc da, body và tóc được chuyên viên tư vấn theo tình trạng của bạn — dưỡng sinh toàn diện, chăm da khoa học.",
  hours: {
    display: "09:00 – 21:00",
    days: "Tất cả các ngày trong tuần",
  },
  fanpageUrl: "https://www.facebook.com/SpabeauteYenhcm/",
  messengerUrl: "https://m.me/SpabeauteYenhcm",
  // Chỉ số Quận 3 đã xác nhận có Zalo.
  zaloUrl: "https://zalo.me/0899607279",
  branches: [
    {
      id: "quan-3",
      name: "Chi nhánh Quận 3",
      shortName: "Quận 3",
      address: "60A Cao Thắng, Phường Bàn Cờ, TP.HCM",
      hotlineDisplay: "0899 607 279",
      hotlineE164: "+84899607279",
      mapsUrl: "https://maps.app.goo.gl/81RXAydeguzGpkzF7",
    },
    {
      id: "phu-nhuan",
      name: "Chi nhánh Phú Nhuận",
      shortName: "Phú Nhuận",
      address: "160 Hoa Lan, Phường Cầu Kiệu, TP.HCM",
      hotlineDisplay: "0896 407 578",
      hotlineE164: "+84896407578",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=160+Hoa+Lan+Ph%C3%BA+Nhu%E1%BA%ADn+TP.HCM",
    },
  ] satisfies Branch[],
  /** Menu khai báo bằng dữ liệu: phase sau chỉ cần thêm mục (D-10). */
  nav: [
    { label: "Trang chủ", href: "#trang-chu" },
    { label: "Giới thiệu", href: "#gioi-thieu" },
    { label: "Dịch vụ", href: "#dich-vu" },
    { label: "Bảng giá", href: "#bang-gia" },
    { label: "Không gian", href: "#khong-gian" },
    { label: "Liên hệ", href: "#lien-he" },
  ],
  // Nội dung dưới đây lấy từ chữ in trên ảnh của khách — xem docs/CONTENT_FROM_IMAGES.md (cần khách xác nhận).
  since: 2019,
  slogans: ["Dưỡng sinh toàn diện", "Chăm da khoa học", "Yêu mình một cách Yên lành"],
  about: {
    heading: "Dưỡng sinh toàn diện, chăm da khoa học",
    /** Bản rút gọn hiển thị ở section Về Yên Spa */
    lead: "Từ năm 2019, Yên Spa & Beaute chăm sóc da, tóc và cơ thể theo hướng khoa học — để mỗi người được yêu mình một cách Yên lành.",
    paragraphs: [
      "Từ năm 2019, Yên Spa & Beaute chăm sóc sức khỏe và làm đẹp theo hướng khoa học, với hai chi nhánh tại Quận 3 và Phú Nhuận. Yên tin rằng làn da, mái tóc và cơ thể là những yếu tố nuôi dưỡng tính nữ — và mỗi người xứng đáng được yêu mình một cách Yên lành.",
      "Các gói treatment được chuyên viên tư vấn và chọn theo đúng tình trạng da của bạn, thay vì tự chọn, để tránh kích ứng. Mỗi khách dùng khăn lau, bông và kim mới; sản phẩm đến từ các dòng chuyên nghiệp như Christina, Dermafirm, Image và Batious.",
    ],
  },
  /** Chỉ số thật, lấy từ banner và bảng giá của khách — không bịa số liệu. */
  stats: [
    { value: 2019, from: 2010, suffix: "", label: "Năm Yên bắt đầu hành trình" },
    { value: 2, from: 0, suffix: "", label: "Chi nhánh: Quận 3 & Phú Nhuận" },
    { value: 4, from: 0, suffix: "", label: "Mảng chăm sóc: Mặt · Body · Tóc · Triệt lông" },
    { value: 7, from: 0, suffix: "/7", label: "Mở cửa 09:00 – 21:00 mỗi ngày" },
  ],
  usps: [
    {
      title: "Chăm da khoa học",
      text: "Quy trình nhiều bước rõ ràng: thanh lọc, lấy nhân mụn chuẩn khoa học, ánh sáng sinh học, điện di tinh chất.",
    },
    {
      title: "Tư vấn theo tình trạng da",
      text: "Chuyên viên chọn gói treatment phù hợp với làn da của bạn để tránh kích ứng.",
    },
    {
      title: "Vô khuẩn cho từng khách",
      text: "Khăn lau, bông và kim mới cho mỗi khách; sản phẩm chuyên nghiệp Christina, Dermafirm, Image.",
    },
    {
      title: "Dưỡng sinh toàn diện",
      text: "Chăm sóc trọn vẹn da mặt, body và mái tóc — thư giãn sâu, ngủ ngon hơn sau mỗi buổi.",
    },
  ],
  services: [
    {
      id: "cham-soc-da-mat",
      title: "Chăm sóc da mặt chuyên sâu",
      text: "Thanh lọc sạch sâu, cấp dưỡng Peptide giúp da ngậm nước, căng bóng và sáng mịn sau mỗi buổi.",
      items: ["Detox & Cấp ẩm", "Glowy Face Sáng da", "Aquamarine Face Tinh khiết", "Diamond Face Lấp lánh"],
      from: "250.000đ",
      image: "/images/services/skincare-led.jpg",
      alt: "Khách được chăm sóc da mặt dưới đèn LED tại Yên Spa",
    },
    {
      id: "dieu-tri-mun-tham-nam",
      title: "Điều trị mụn, thâm, nám",
      text: "Thanh lọc mụn chuẩn khoa học, kháng viêm, điều tiết bã nhờn và giảm thâm sau mụn.",
      items: ["Basic Acneskin", "Retinol Acneskin", "CO2 Anti Acne", "Acne Lift – Chemical Peel"],
      from: "350.000đ",
      image: "/images/services/blue-light-acne.jpg",
      alt: "Kỹ thuật viên chiếu ánh sáng xanh hỗ trợ điều trị mụn",
    },
    {
      id: "phuc-hoi-tai-tao",
      title: "Phục hồi & tái tạo da",
      text: "Phục hồi da với tinh chất vàng Peptide, Cica Exosome và liệu pháp CO2 giúp da căng mượt, đàn hồi.",
      items: ["Crystal Therapy", "CO2 Carboxy Therapy", "Ánh sáng sinh học"],
      from: "590.000đ",
      image: "/images/services/products-christina.jpg",
      alt: "Bộ sản phẩm chuyên nghiệp Christina dùng trong liệu trình phục hồi da",
    },
    {
      id: "tre-hoa-da",
      title: "Trẻ hóa & thay da toàn diện",
      text: "Điều trị da đa tầng cho mụn, thâm, lão hóa nhẹ, nếp nhăn, tàn nhang — da mịn, lỗ chân lông thu nhỏ.",
      items: ["Perfection Peel", "Phytopeeling", "Collagen Induction"],
      from: "1.500.000đ",
      image: "/images/services/led-red-therapy.jpg",
      alt: "Phòng trị liệu với máy ánh sáng sinh học đỏ",
    },
    {
      id: "body-thu-gian",
      title: "Body massage & gội dưỡng sinh",
      text: "Massage tinh dầu, đá nóng, trị liệu vai cổ gáy và gội thảo dược — thư giãn sâu, máu huyết lưu thông.",
      items: ["Massage Aroma", "Đá nóng Thụy Điển", "Trị liệu YHCT Vai Cổ Gáy", "Gội Dưỡng Sinh"],
      from: "220.000đ",
      image: "/images/services/body-care-hot-stone.jpg",
      alt: "Massage body với đá nóng tại Yên Spa",
    },
  ],
  /** 4 mảng dịch vụ in trên banner mặt tiền: Body · Mặt · Tóc · Triệt lông. */
  serviceGroups: [
    {
      id: "mat",
      title: "Chăm sóc da mặt",
      sub: "Facial & Treatment Level 1–3",
      image: "/images/services/skincare-led.jpg",
      alt: "Chăm sóc da mặt dưới máy ánh sáng sinh học tại Yên Spa",
    },
    {
      id: "body",
      title: "Chăm sóc Body",
      sub: "Massage Aroma · Đá nóng · Healing",
      image: "/images/services/body-massage.jpg",
      alt: "Kỹ thuật viên massage body cho khách",
    },
    {
      id: "toc",
      title: "Chăm sóc Tóc",
      sub: "Gội dưỡng sinh · Detox · Muse Care",
      image: "/images/services/hair-care-massage.jpg",
      alt: "Gội đầu dưỡng sinh và massage đầu",
    },
    {
      id: "triet-long",
      title: "Triệt lông OPT",
      sub: "Trải nghiệm vùng nách 49K",
      image: "/images/services/hair-removal-session.jpg",
      alt: "Buổi triệt lông OPT tại Yên Spa",
    },
  ],
  process: [
    { title: "Tư vấn", sub: "theo tình trạng da" },
    { title: "Thanh lọc", sub: "làm sạch sâu" },
    { title: "Treatment", sub: "chuyên sâu, vô khuẩn" },
    { title: "Hướng dẫn", sub: "chăm sóc tại nhà" },
  ],
  hairRemoval: {
    title: "Triệt lông OPT",
    text: "Công nghệ Optimal Pulse Tech · 10–15 buổi, cách 1–3 tuần · Hỗ trợ giảm thâm, sáng và mềm da.",
    offer: "Trải nghiệm vùng nách chỉ 49K",
    note: "Giá trải nghiệm áp dụng cho lần đầu tiên.",
  },
  pricing: {
    note: "Theo menu áp dụng từ 15/05/2025. Giá có thể thay đổi — vui lòng liên hệ spa để được tư vấn.",
    combos: [
      {
        name: "Relax",
        sub: "Thư giãn",
        price: "450K",
        was: "690K",
        duration: "120 phút",
        parts: ["Body 60′ — Aroma / Đá nóng / Healing (+50K)", "Tóc 30′ — Gội sạch, sấy tóc", "Mặt 30′ — Chăm sóc da cơ bản Detox / Glowy"],
      },
      {
        name: "Retreat An Yên",
        sub: "Chăm sóc chuyên sâu",
        price: "650K",
        was: "880K",
        duration: "150 phút",
        parts: ["Body 60′ — Aroma / Đá nóng / Healing (+50K)", "Tóc 30′ — Gội sạch, sấy tóc", "Mặt 60′ — Chuyên sâu Diamond / Aquamarine"],
        featured: true,
      },
      {
        name: "Serenity",
        sub: "Nghỉ dưỡng",
        price: "850K",
        was: "1.030K",
        duration: "165 phút",
        parts: ["Body 60′ — Aroma / Đá nóng / Healing (+50K)", "Tóc 30′ — Gội sạch, sấy tóc", "Mặt 75′ — Chuyên nghiệp Crystal / CO2 Therapy"],
      },
    ],
    comboNote: "Combo dành cho khách có massage body. Không làm mặt hoặc gội đầu được đổi sang 15′ massage body.",
    menus: [
      {
        title: "Chăm sóc da hàng tuần",
        rows: [
          ["Detox & Cấp ẩm", "45′", "250.000"],
          ["Glowy Face Sáng da", "45′", "250.000"],
          ["Aquamarine Face Tinh khiết", "75′", "440.000"],
          ["Diamond Face Lấp lánh", "75′", "440.000"],
        ],
      },
      {
        title: "Treatment Level 1 — Dưỡng da trẻ khỏe",
        rows: [
          ["Basic Acneskin — Mụn cơ bản", "60′", "350.000"],
          ["Crystal Therapy", "75′", "590.000"],
          ["CO2 Carboxy Therapy", "75′", "590.000"],
        ],
      },
      {
        title: "Treatment Level 2 — Cải thiện da mụn",
        rows: [
          ["Retinol Acneskin — Mụn chuyên sâu", "", "590.000"],
          ["CO2 Anti Acne — Thải độc", "", "690.000"],
          ["Acne Lift — Chemical Peel Image", "", "1.200.000"],
        ],
      },
      {
        title: "Treatment Level 3 — Thay da toàn diện",
        rows: [
          ["Perfection Peel Image", "", "1.500.000"],
          ["Phytopeeling — Tái tạo đa tầng", "", "2.000.000"],
          ["Collagen Induction", "", "2.500.000"],
        ],
      },
      {
        title: "Body Massage & Care",
        rows: [
          ["Massage Aroma Thư giãn", "60′ / 90′", "300.000 / 420.000"],
          ["Massage Đá nóng Thụy Điển", "60′ / 90′", "350.000 / 450.000"],
          ["Trị liệu YHCT Vai Cổ Gáy", "30′", "250.000"],
          ["Massage Healing", "60′ / 90′", "400.000 / 550.000"],
        ],
      },
      {
        title: "Hair Spa",
        rows: [
          ["Gội Detox & Phục hồi", "40′", "220.000"],
          ["Gội Dưỡng Sinh", "60′", "220.000"],
          ["Gội Muse Care", "60′", "320.000"],
        ],
      },
      {
        title: "Triệt lông OPT (lần lẻ)",
        rows: [
          ["Mép", "Trải nghiệm 49K", "100.000"],
          ["Nách / Râu mép", "Trải nghiệm 49K", "200.000"],
          ["Mặt / Nửa tay / Ngực / Bụng", "Trải nghiệm 99K", "300.000"],
          ["Full tay / Nửa chân / Bikini / Nửa lưng", "Trải nghiệm 149K", "450.000"],
          ["Full chân / Full lưng", "Trải nghiệm 169K", "500.000"],
        ],
      },
    ],
    members: [
      { name: "Silver", pay: "2.500.000", gift: "500.000", total: "3.000.000" },
      { name: "Gold", pay: "5.000.000", gift: "1.500.000", total: "6.500.000" },
      { name: "Diamond", pay: "10.000.000", gift: "4.000.000", total: "14.000.000" },
    ],
    memberPerks: [
      "Áp dụng cho mọi dịch vụ spa, treatment, combo và Giờ vàng",
      "Dùng bảng giá dành riêng cho Member",
      "Không giới hạn thời gian, dùng chung được cho nhiều người",
    ],
  },
  reviews: [
    {
      author: "Trang Minh",
      meta: "Local Guide · Google",
      text: "Mình vào làm 3 dịch vụ: massage body, chăm sóc da mặt và gội đầu. Chị chủ nhiệt tình, chị kỹ thuật viên cực kỳ chu đáo… massage đã, mình đỡ nhức người hẳn, chăm sóc da mặt cũng rất kỹ. Chắc chắn phải gặp Yên mỗi cuối tuần để chữa lành thôi ạ.",
    },
    {
      author: "Exzer Geas",
      meta: "Local Guide · Google",
      text: "Massage cơ thể rất tốt, nhân viên được đào tạo bài bản và lịch sự.",
    },
  ],
  gallery: [
    { src: "/images/brand/banner-storefront.jpg", width: 1942, height: 809, alt: "Mặt tiền Yên Spa & Beaute", wide: true },
    { src: "/images/space/lobby.jpg", width: 1080, height: 1081, alt: "Sảnh chờ với sofa da và cây xanh" },
    { src: "/images/space/treatment-room.jpg", width: 1290, height: 1290, alt: "Phòng chăm sóc da đón ánh nắng tự nhiên" },
    { src: "/images/space/mirror-console.jpg", width: 1290, height: 1290, alt: "Góc gương trang điểm" },
    { src: "/images/space/staircase.jpg", width: 1080, height: 1080, alt: "Cầu thang dẫn lên tầng trị liệu" },
    { src: "/images/space/product-shelf.jpg", width: 1080, height: 1080, alt: "Kệ sản phẩm chăm sóc da" },
    { src: "/images/space/hallway-equipment.jpg", width: 1290, height: 1266, alt: "Hành lang và thiết bị chăm sóc da" },
  ],
  bookingAnchor: "#dat-lich",
} as const;

export const primaryBranch = site.branches[0];
