# Requirements: Yên Spa & Beaute — Website

**Defined:** 2026-11-12
**Core Value:** Khách truy cập (chủ yếu trên điện thoại) thấy được không gian và dịch vụ chuyên nghiệp của spa và **đặt lịch được ngay** — qua form đặt lịch hoặc gọi hotline/Zalo/Fanpage chỉ với một chạm.

## v1 Requirements

### Foundation (FND)

- [ ] **FND-01**: Trang hiển thị tiếng Việt đầy đủ dấu ở mọi cỡ chữ và độ đậm (font có subset `vietnamese`, `lang="vi"`)
- [ ] **FND-02**: Giao diện dùng bộ màu xanh lá + be tự nhiên; chữ và nút chính đạt tương phản WCAG AA (≥4.5:1 cho chữ thường)
- [ ] **FND-03**: Bố cục mobile-first, dùng tốt từ 360px đến desktop, không cuộn ngang
- [ ] **FND-04**: Thông tin liên hệ (tên, 2 chi nhánh, hotline, giờ mở cửa, link Fanpage/Maps), dịch vụ và bảng giá được khai báo một nơi duy nhất và dùng lại ở mọi mục
- [ ] **FND-05**: Đã gỡ toàn bộ nội dung mặc định của create-next-app (tiêu đề, favicon, dark mode, font Geist/Arial)

### Navigation & Contact Actions (NAV)

- [ ] **NAV-01**: Người dùng thấy thanh điều hướng cố định với logo và nút "Đặt lịch"; bấm mục menu thì cuộn mượt tới mục tương ứng
- [ ] **NAV-02**: Trên mobile, người dùng mở/đóng được menu điều hướng
- [ ] **NAV-03**: Trên mobile, người dùng luôn thấy nút nổi Gọi / Zalo / Messenger và mở đúng ứng dụng chỉ với một chạm (hoạt động cả khi JavaScript chưa tải)
- [ ] **NAV-04**: Footer hiển thị địa chỉ 2 chi nhánh, hotline, giờ mở cửa và link Fanpage

### Hero & Brand (HERO)

- [ ] **HERO-01**: Người dùng thấy ngay phần đầu trang với ảnh không gian spa, tên thương hiệu, câu giới thiệu ngắn và nút "Đặt lịch" + "Gọi ngay"
- [ ] **HERO-02**: Người dùng đọc được phần giới thiệu thương hiệu (định hướng phong cách, cam kết dịch vụ)
- [ ] **HERO-03**: Người dùng thấy 4 điểm khác biệt (USP) của spa

### Services (SVC)

- [ ] **SVC-01**: Người dùng xem được 5 nhóm dịch vụ (chăm sóc da mặt chuyên sâu; điều trị mụn, thâm, nám; phục hồi & tái tạo da; trẻ hóa da; liệu trình làm đẹp & thư giãn / body), mỗi nhóm có ảnh và mô tả ngắn
- [ ] **SVC-02**: Người dùng bấm "Đặt lịch" trên một dịch vụ thì được đưa tới form với dịch vụ đó đã được chọn sẵn

### Pricing (PRICE)

- [ ] **PRICE-01**: Người dùng xem được bảng giá dịch vụ dạng chữ (không chỉ là ảnh), chia nhóm: Facial / Treatment Level 1–3, Body Massage, Hair Spa, Triệt lông
- [ ] **PRICE-02**: Người dùng xem được 3 combo (Relax 450K, Retreat An Yên 650K, Serenity 850K) kèm thời gian và các bước chính
- [ ] **PRICE-03**: Người dùng xem được các gói thẻ thành viên (Silver / Gold / Diamond) và quyền lợi
- [ ] **PRICE-04**: Người dùng mở được ảnh bảng giá gốc (không cắt) để xem chi tiết
- [ ] **PRICE-05**: Bảng giá trên mobile đọc được không cần phóng to, chuyển nhóm bằng tab hoặc accordion

### Gallery & Proof (GAL)

- [ ] **GAL-01**: Người dùng xem được thư viện ảnh không gian spa, ảnh hiển thị đúng tỉ lệ gốc (không cắt nội dung quan trọng)
- [ ] **GAL-02**: Người dùng xem được mục kết quả trước – sau (chỉ ảnh khách đã đồng ý)
- [ ] **GAL-03**: Người dùng xem được ảnh khách hàng tại spa và review của khách
- [ ] **GAL-04**: Người dùng xem được mục đội ngũ
- [ ] **GAL-05**: Người dùng bấm vào ảnh để xem phóng to bản gốc

### Video (VID)

- [ ] **VID-01**: Người dùng xem được 4–6 video liệu trình khổ dọc 9:16 dạng dải cuộn ngang
- [ ] **VID-02**: Video chỉ tải khi người dùng bấm phát (có ảnh poster), chỉ một video phát cùng lúc
- [ ] **VID-03**: Mỗi video đã nén ≤ 8 MB (ưu tiên 4–6 MB), tổng dung lượng video giảm mạnh so với 186 MB gốc

### Booking Form (BOOK)

- [ ] **BOOK-01**: Người dùng điền form đặt lịch: họ tên, số điện thoại, dịch vụ, chi nhánh, ngày, khung giờ, ghi chú
- [ ] **BOOK-02**: Form báo lỗi bằng tiếng Việt ngay tại ô khi thiếu thông tin hoặc số điện thoại Việt Nam không hợp lệ; không chọn được ngày đã qua
- [ ] **BOOK-03**: Sau khi gửi hợp lệ, người dùng thấy thông báo thành công (không lưu, không gửi dữ liệu đi đâu)
- [ ] **BOOK-04**: Thông báo thành công không hứa hẹn spa sẽ liên hệ lại, và kèm nút Gọi / Zalo để xác nhận lịch
- [ ] **BOOK-05**: Form dùng được bằng bàn phím và trình đọc màn hình (label, `aria` lỗi, focus rõ ràng); bàn phím số khi nhập SĐT

### Location (LOC)

- [ ] **LOC-01**: Người dùng thấy thông tin 2 chi nhánh (Quận 3: 60A Cao Thắng; Phú Nhuận: 160 Hoa Lan) với hotline riêng của từng chi nhánh
- [ ] **LOC-02**: Người dùng bấm "Chỉ đường" để mở Google Maps tới đúng chi nhánh
- [ ] **LOC-03**: Người dùng thấy giờ mở cửa 09:00–21:00, tất cả các ngày trong tuần

### SEO & Launch (SEO)

- [ ] **SEO-01**: Khi chia sẻ link lên Facebook/Zalo, hiển thị đúng tiêu đề, mô tả và ảnh xem trước 1200×630
- [ ] **SEO-02**: Trang có metadata tiếng Việt, favicon từ logo, `sitemap.xml`, `robots.txt`
- [ ] **SEO-03**: Trang có dữ liệu cấu trúc LocalBusiness cho từng chi nhánh, chỉ dùng thông tin thật
- [ ] **SEO-04**: Trang đạt Lighthouse mobile ≥ 90 cho Performance, Accessibility, SEO
- [ ] **SEO-05**: Website được deploy lên Vercel và truy cập được qua URL công khai
- [ ] **SEO-06**: Đã kiểm tra các nút Gọi / Zalo / Messenger và video trên iPhone Safari, Android Chrome và trình duyệt trong app Facebook

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Booking Backend

- **BOOK-V2-01**: Form gửi thông tin đặt lịch tới spa (email / Google Sheet / Zalo OA)
- **BOOK-V2-02**: Spa xem và quản lý lịch hẹn trên trang admin

### Engagement

- **ENG-01**: Theo dõi lượt bấm Gọi / Zalo / Messenger / gửi form (GA4 hoặc Meta Pixel)
- **ENG-02**: Hiển thị trạng thái "Đang mở cửa" theo giờ Việt Nam
- **ENG-03**: Mini-guide chọn liệu trình theo tình trạng da

### Content

- **CONT-01**: Trang chi tiết riêng cho từng dịch vụ
- **CONT-02**: Blog / kiến thức chăm sóc da

## Out of Scope

| Feature | Reason |
|---------|--------|
| Lưu / gửi dữ liệu form | Khách chọn "chỉ báo thành công" — nối backend ở v2 |
| Thanh toán online, giỏ hàng | Khách không yêu cầu |
| Tài khoản khách hàng / đăng nhập | Không cần cho mục tiêu đặt lịch |
| Đa ngôn ngữ | Chỉ tiếng Việt |
| Nhiều trang, blog | Landing page một trang |
| Đánh giá / số liệu giả, đếm ngược khẩn cấp, popup | Làm mất uy tín thương hiệu |
| Live chat / chatbot, nhúng feed Facebook | Nặng trang; nút Messenger đã đủ |
| Ảnh trong `images/other/` (bài đăng trang khác, ảnh stock) | Không phải nội dung của Yên |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Pending |
| FND-02 | Phase 1 | Pending |
| FND-03 | Phase 1 | Pending |
| FND-04 | Phase 1 | Pending |
| FND-05 | Phase 1 | Pending |
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| NAV-04 | Phase 1 | Pending |
| HERO-01 | Phase 1 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| SVC-01 | Phase 2 | Pending |
| SVC-02 | Phase 3 | Pending |
| PRICE-01 | Phase 4 | Pending |
| PRICE-02 | Phase 4 | Pending |
| PRICE-03 | Phase 4 | Pending |
| PRICE-04 | Phase 4 | Pending |
| PRICE-05 | Phase 4 | Pending |
| GAL-01 | Phase 2 | Pending |
| GAL-02 | Phase 4 | Pending |
| GAL-03 | Phase 4 | Pending |
| GAL-04 | Phase 2 | Pending |
| GAL-05 | Phase 2 | Pending |
| VID-01 | Phase 5 | Pending |
| VID-02 | Phase 5 | Pending |
| VID-03 | Phase 5 | Pending |
| BOOK-01 | Phase 3 | Pending |
| BOOK-02 | Phase 3 | Pending |
| BOOK-03 | Phase 3 | Pending |
| BOOK-04 | Phase 3 | Pending |
| BOOK-05 | Phase 3 | Pending |
| LOC-01 | Phase 2 | Pending |
| LOC-02 | Phase 2 | Pending |
| LOC-03 | Phase 2 | Pending |
| SEO-01 | Phase 6 | Pending |
| SEO-02 | Phase 6 | Pending |
| SEO-03 | Phase 6 | Pending |
| SEO-04 | Phase 6 | Pending |
| SEO-05 | Phase 1 | Pending |
| SEO-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-12*
*Last updated: 2026-11-12 after roadmap creation*
