# Roadmap: Yên Spa & Beaute — Website

## Overview

Landing page một trang, tiếng Việt, mobile-first cho Yên Spa & Beaute (2 chi nhánh: Quận 3 và Phú Nhuận). Lộ trình đi theo hướng vertical MVP: mỗi phase đều có thể deploy, và đường chuyển đổi (gọi / Zalo / Messenger) hoạt động ngay từ Phase 1, trước khi thêm nội dung trang trí. Sau nền tảng là nội dung chính (thương hiệu, dịch vụ, không gian, liên hệ), form đặt lịch, rồi bảng giá và bằng chứng từ khách hàng (các mục cần khách xác nhận nội dung / đồng ý hình ảnh), video liệu trình (nén riêng một phase), và cuối cùng là SEO, hiệu năng và kiểm tra thiết bị thật trước khi ra mắt.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Live Conversion Path** - Dọn scaffold, nền tiếng Việt + màu xanh/be, nội dung khai báo một nơi, thanh điều hướng, nút nổi Gọi/Zalo/Messenger, hero, footer, deploy Vercel lần đầu
- [ ] **Phase 2: Brand, Services, Space & Locations** - Giới thiệu thương hiệu, 4 USP, 5 nhóm dịch vụ, thư viện không gian có phóng to ảnh, đội ngũ, liên hệ 2 chi nhánh
- [ ] **Phase 3: Booking Form** - Form đặt lịch có validate tiếng Việt, thông báo thành công trung thực, liên kết từ thẻ dịch vụ
- [ ] **Phase 4: Pricing & Customer Proof** - Bảng giá dạng chữ (dịch vụ, combo, thẻ thành viên) kèm ảnh gốc; kết quả trước – sau, ảnh khách hàng và review
- [ ] **Phase 5: Video Showcase** - Nén video, dải video dọc 9:16 chỉ tải khi bấm phát
- [ ] **Phase 6: SEO, Performance & Launch** - Chia sẻ link, metadata, dữ liệu LocalBusiness, Lighthouse ≥ 90, kiểm tra trên iPhone / Android / trình duyệt Facebook

## Phase Details

### Phase 1: Foundation & Live Conversion Path
**Goal**: Khách mở link công khai trên điện thoại thấy ngay một trang tiếng Việt chuyên nghiệp có hero không gian spa và liên hệ được spa bằng một chạm
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, NAV-01, NAV-02, NAV-03, NAV-04, HERO-01, SEO-05
**Success Criteria** (what must be TRUE):
  1. Người dùng mở URL Vercel công khai trên màn hình 360px và thấy hero với ảnh không gian spa, tên thương hiệu, câu giới thiệu ngắn, nút "Đặt lịch" và "Gọi ngay"; chữ tiếng Việt hiển thị đủ dấu ở mọi cỡ chữ/độ đậm, không cuộn ngang, không còn nội dung mặc định của create-next-app
  2. Chữ và nút chính dùng bảng màu xanh lá + be tự nhiên và đạt tương phản WCAG AA (≥ 4.5:1 cho chữ thường)
  3. Người dùng thấy thanh điều hướng cố định với logo và nút "Đặt lịch"; bấm mục menu thì cuộn mượt tới đúng mục; trên mobile mở/đóng được menu; nút "Đặt lịch" luôn dẫn tới một vùng liên hệ dùng được (gọi/Zalo) cho tới khi form ra mắt ở Phase 3
  4. Trên mobile, nút nổi Gọi / Zalo / Messenger luôn hiển thị và mở đúng ứng dụng chỉ với một chạm, kể cả khi JavaScript chưa tải
  5. Footer hiển thị địa chỉ 2 chi nhánh, hotline, giờ mở cửa và link Fanpage; các thông tin này lấy từ một nguồn khai báo duy nhất nên nút nổi, hero và footer luôn khớp nhau
**Plans**: TBD
**UI hint**: yes

### Phase 2: Brand, Services, Space & Locations
**Goal**: Khách cuộn trang và hiểu được Yên là ai, spa có dịch vụ gì, không gian ra sao, và tìm được đường tới đúng chi nhánh
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: HERO-02, HERO-03, SVC-01, GAL-01, GAL-04, GAL-05, LOC-01, LOC-02, LOC-03
**Success Criteria** (what must be TRUE):
  1. Người dùng đọc được phần giới thiệu thương hiệu (định hướng phong cách, cam kết dịch vụ) và thấy 4 điểm khác biệt (USP) của spa
  2. Người dùng xem được 5 nhóm dịch vụ (chăm sóc da mặt chuyên sâu; điều trị mụn, thâm, nám; phục hồi & tái tạo da; trẻ hóa da; liệu trình làm đẹp & thư giãn / body), mỗi nhóm có ảnh và mô tả ngắn
  3. Người dùng xem được thư viện ảnh không gian spa đúng tỉ lệ gốc (không cắt nội dung quan trọng) và bấm vào ảnh để xem phóng to bản gốc; cơ chế phóng to này dùng lại được cho các mục ảnh ở Phase 4
  4. Người dùng xem được mục đội ngũ
  5. Người dùng thấy 2 chi nhánh (Quận 3: 60A Cao Thắng; Phú Nhuận: 160 Hoa Lan) với hotline riêng, giờ mở cửa 09:00–21:00 tất cả các ngày, và bấm "Chỉ đường" thì mở Google Maps tới đúng chi nhánh
**Plans**: TBD
**UI hint**: yes

### Phase 3: Booking Form
**Goal**: Khách điền được form đặt lịch hợp lệ, nhận thông báo trung thực về việc form không gửi dữ liệu đi, và xác nhận lịch với spa chỉ bằng một chạm
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, SVC-02
**Success Criteria** (what must be TRUE):
  1. Người dùng điền được form với họ tên, số điện thoại, dịch vụ, chi nhánh, ngày, khung giờ và ghi chú
  2. Khi thiếu thông tin hoặc số điện thoại Việt Nam không hợp lệ, người dùng thấy lỗi tiếng Việt ngay tại ô tương ứng; không chọn được ngày đã qua
  3. Sau khi gửi hợp lệ, người dùng thấy thông báo thành công không hứa spa sẽ liên hệ lại (không dùng "Đặt lịch thành công" / "chúng tôi sẽ liên hệ"), kèm nút Gọi / Zalo để xác nhận lịch; không có dữ liệu nào được lưu hay gửi đi
  4. Người dùng bấm "Đặt lịch" trên một thẻ dịch vụ thì được cuộn tới form với dịch vụ đó đã chọn sẵn
  5. Người dùng dùng được form bằng bàn phím và trình đọc màn hình (label, lỗi có `aria`, focus rõ ràng) và thấy bàn phím số khi nhập SĐT
**Plans**: TBD
**UI hint**: yes

### Phase 4: Pricing & Customer Proof
**Goal**: Khách xem được giá dịch vụ, combo, thẻ thành viên bằng chữ dễ đọc trên điện thoại, và thấy bằng chứng thật từ khách hàng của spa
**Mode:** mvp
**Depends on**: Phase 2 (dùng lại cơ chế phóng to ảnh)
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, GAL-02, GAL-03
**Success Criteria** (what must be TRUE):
  1. Người dùng xem được bảng giá dạng chữ (không chỉ là ảnh) chia nhóm Facial / Treatment Level 1–3, Body Massage, Hair Spa, Triệt lông; trên mobile đọc được không cần phóng to và chuyển nhóm bằng tab hoặc accordion
  2. Người dùng xem được 3 combo (Relax 450K, Retreat An Yên 650K, Serenity 850K) kèm thời gian và các bước chính
  3. Người dùng xem được các gói thẻ thành viên Silver / Gold / Diamond và quyền lợi
  4. Người dùng mở được ảnh bảng giá gốc, không bị cắt, để xem chi tiết
  5. Người dùng xem được mục kết quả trước – sau (chỉ ảnh khách đã đồng ý), ảnh khách hàng tại spa và review của khách, bấm vào ảnh để phóng to
**Plans**: TBD
**UI hint**: yes

### Phase 5: Video Showcase
**Goal**: Khách xem được video liệu trình khổ dọc ngay trên trang mà không làm trang nặng hay chậm
**Mode:** mvp
**Depends on**: Phase 1 (video nén có thể chuẩn bị từ sớm; mục video gắn vào các section của Phase 2)
**Requirements**: VID-01, VID-02, VID-03
**Success Criteria** (what must be TRUE):
  1. Người dùng xem được 4–6 video liệu trình khổ dọc 9:16 dạng dải cuộn ngang
  2. Mỗi video hiện ảnh poster và chỉ tải dữ liệu video khi người dùng bấm phát; chỉ một video phát cùng lúc
  3. Mỗi video đã nén ≤ 8 MB (ưu tiên 4–6 MB), tổng dung lượng video giảm mạnh so với 186 MB gốc, và trang vẫn tải nhanh khi chưa bấm phát video nào
**Plans**: TBD
**UI hint**: yes

### Phase 6: SEO, Performance & Launch
**Goal**: Link được chia sẻ đẹp trên Facebook/Zalo, trang đạt chuẩn hiệu năng và truy cập, và mọi đường liên hệ hoạt động trên thiết bị thật của khách
**Mode:** mvp
**Depends on**: Phase 5 (cần đủ nội dung để đo Lighthouse và kiểm tra thiết bị)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-06
**Success Criteria** (what must be TRUE):
  1. Khi chia sẻ link lên Facebook / Zalo, hiển thị đúng tiêu đề, mô tả và ảnh xem trước 1200×630
  2. Trang có metadata tiếng Việt, favicon từ logo, `sitemap.xml` và `robots.txt` truy cập được
  3. Trang có dữ liệu cấu trúc LocalBusiness riêng cho từng chi nhánh, chỉ dùng thông tin thật và hợp lệ khi kiểm tra
  4. Trang trên URL công khai đạt Lighthouse mobile ≥ 90 cho Performance, Accessibility và SEO
  5. Các nút Gọi / Zalo / Messenger và video đã được kiểm tra chạy đúng trên iPhone Safari, Android Chrome và trình duyệt trong app Facebook
**Plans**: TBD

## Roadmap Notes

- **SEO-05 (deploy Vercel)** được giao cho Phase 1 vì lát cắt triển khai đầu tiên cần có URL công khai; các phase sau triển khai lại trên cùng dự án. Phase 6 xử lý phần còn lại của việc ra mắt (tên miền, metadata, kiểm tra thiết bị).
- **Cơ chế phóng to ảnh (GAL-05)** được dựng ở Phase 2 và dùng lại cho PRICE-04 và GAL-02/03 ở Phase 4.
- **Phase 4 gom các mục cần khách xác nhận** (chép giá từ 20 ảnh bảng giá, đồng ý dùng hình mặt khách) để không chặn việc hoàn thiện trang ở Phase 2–3.
- **Nén video** nên bắt đầu như một việc nền từ Phase 1 (giữ bản gốc ngoài repo), nhưng chỉ nghiệm thu ở Phase 5 (VID-03).
- **Gợi ý nghiên cứu theo phase:** Phase 3 (câu chữ thông báo, đầu số VN, thử Zalo / m.me trên máy thật), Phase 5 (cấu hình encoder, autoplay trên iOS / Facebook), Phase 6 (gói Vercel, tên miền, analytics, ma trận thiết bị). Phase 1, 2, 4 dùng pattern chuẩn.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Live Conversion Path | 0/TBD | Not started | - |
| 2. Brand, Services, Space & Locations | 0/TBD | Not started | - |
| 3. Booking Form | 0/TBD | Not started | - |
| 4. Pricing & Customer Proof | 0/TBD | Not started | - |
| 5. Video Showcase | 0/TBD | Not started | - |
| 6. SEO, Performance & Launch | 0/TBD | Not started | - |
