# Yên Spa & Beaute — Website

## What This Is

Website chính thức dạng landing page một trang cho Yên Spa & Beaute — spa chăm sóc, điều trị và phục hồi da tại TP.HCM (2 chi nhánh: Quận 3 và Phú Nhuận). Website giới thiệu thương hiệu, dịch vụ, không gian và đội ngũ, đồng thời thu hút khách hàng nữ 20–45 tuổi để lại thông tin đặt lịch / nhận tư vấn.

## Core Value

Khách truy cập (chủ yếu trên điện thoại) thấy được không gian và dịch vụ chuyên nghiệp của spa và **đặt lịch được ngay** — qua form đặt lịch hoặc gọi hotline/Zalo/Fanpage chỉ với một chạm.

## Business Context

- **Customer**: Yên Spa & Beaute (mã DN010 trong file sale); người dùng cuối là nữ 20–45 tuổi, thu nhập trung bình khá trở lên, khu vực Quận 3, Phú Nhuận và lân cận.
- **Revenue model**: Website là kênh marketing — tăng số lượt đặt lịch / tư vấn cho spa.
- **Success metric**: Số lượt đặt lịch / liên hệ đến từ website.
- **Strategy notes**: Yêu cầu gốc: `docs/YEU_CAU.md`; phân loại media: `docs/MEDIA.md`.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page một trang, tiếng Việt, responsive ưu tiên mobile
- [ ] Hero ấn tượng với ảnh/video không gian spa và lời kêu gọi đặt lịch
- [ ] Giới thiệu thương hiệu: phong cách nhẹ nhàng, tinh tế, hiện đại, thư giãn; cam kết dịch vụ
- [ ] Mục dịch vụ: 5 nhóm (chăm sóc da mặt chuyên sâu; điều trị mụn, thâm, nám; phục hồi & tái tạo da; trẻ hóa da; liệu trình làm đẹp & thư giãn / body)
- [ ] Mục điểm khác biệt (USP): không gian chuyên nghiệp, liệu trình theo tình trạng da, chú trọng chất lượng, tư vấn tận tình
- [ ] Thư viện không gian spa (ảnh) và video liệu trình (video dọc 9:16)
- [ ] Mục đội ngũ
- [ ] Form đặt lịch (họ tên, SĐT, dịch vụ, chi nhánh, ngày/giờ mong muốn, ghi chú) — có validate, gửi xong chỉ hiển thị thông báo thành công, không lưu/gửi dữ liệu
- [ ] Mục liên hệ: 2 chi nhánh (địa chỉ, hotline, bản đồ Google Maps), giờ mở cửa 09:00–21:00 tất cả các ngày, link Fanpage
- [ ] Nút liên hệ nổi (gọi hotline / Zalo / Messenger) luôn hiển thị trên mobile
- [ ] SEO cơ bản: metadata, Open Graph, favicon từ logo, thông tin LocalBusiness
- [ ] Hiệu năng tốt: ảnh tối ưu qua `next/image`, video nén và lazy-load
- [ ] Deploy lên Vercel

### Out of Scope

- Backend lưu lịch hẹn / trang admin — khách chỉ cần form điền, có thể nối sau
- Gửi email / Google Sheet / Zalo tự động từ form — đã chọn "chỉ báo thành công"
- Nhiều trang, trang chi tiết dịch vụ, blog — đã chọn landing page một trang
- Đa ngôn ngữ — chỉ tiếng Việt
- Bảng giá, thanh toán online, giỏ hàng — khách không yêu cầu
- Tài khoản khách hàng / đăng nhập — không cần cho mục tiêu đặt lịch

## Context

- Dự án Next.js (App Router, TypeScript, Tailwind CSS, `src/`) vừa được tạo bằng create-next-app; chưa có code riêng.
- Media đã có sẵn và đã phân loại trong `public/images/{brand,space,services,team}` và `public/videos/` (19 ảnh, 11 video, xem `docs/MEDIA.md`).
- Logo: chữ "YÊN – SPA + BEAUTE" (bản nền đỏ đô và bản nền cây xanh). Thương hiệu còn xuất hiện tên "Yên Skinlab" trên ảnh/video.
- Ảnh có tông be, gỗ ấm, nhiều cây xanh — hợp với hướng thiết kế xanh lá + be.
- Toàn bộ video là khổ dọc 9:16, một số file lớn (đến 66 MB) cần nén; `body-acupressure-lowres.mp4` có thể trùng với `body-acupressure.mp4`.
- 3 ảnh đội ngũ có khung Tết — không hợp làm ảnh chính.
- Chi nhánh 1 – Quận 3: 60A Cao Thắng, Phường Bàn Cờ, TP.HCM — Hotline 0899 607 279.
- Chi nhánh 2 – Phú Nhuận: 160 Hoa Lan, Phường Cầu Kiệu, TP.HCM — Hotline 0896 407 578.
- Fanpage: https://www.facebook.com/SpabeauteYenhcm/ — Google Maps: https://maps.app.goo.gl/81RXAydeguzGpkzF7
- Hiện spa nhận đặt lịch qua hotline và tin nhắn Fanpage.

## Constraints

- **Tech stack**: Next.js App Router + TypeScript + Tailwind CSS — đã khởi tạo sẵn
- **Hosting**: Vercel — giới hạn kích thước asset, nên nén video trước khi deploy
- **Ngôn ngữ**: Tiếng Việt, đầy đủ dấu
- **Thiết bị**: Mobile-first — phần lớn khách đến từ Facebook trên điện thoại
- **Không backend**: Form đặt lịch chỉ ở phía client
- **Nội dung**: Chỉ dùng ảnh/video và thông tin do khách cung cấp

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bản chính thức (không phải demo) | Khách sẽ dùng thật, cần hoàn chỉnh | — Pending |
| Landing page một trang | Mục tiêu đơn giản: giới thiệu + đặt lịch | — Pending |
| Form đặt lịch chỉ báo thành công, không lưu dữ liệu | Theo yêu cầu, chưa cần backend | — Pending |
| Thiết kế xanh lá + be, tự nhiên | Hợp với tông cây xanh trong ảnh không gian, cảm giác thư giãn | — Pending |
| Deploy Vercel | Chuẩn cho Next.js | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-12 after initialization*
