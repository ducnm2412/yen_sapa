# SIG-220 — Ảnh polaroid rải bàn · Polaroid Scatter Hero

- **Status:** draft · **Version:** 1.0.0
- **Trông như thế nào:** Trang hero tối với tối đa 6 ảnh polaroid rơi xuống và rải ngẫu nhiên trên mặt bàn, nghiêng các góc khác nhau. Người xem kéo thả từng tấm; khi thả ra ảnh trượt tiếp có quán tính rồi dần dừng lại. Physics tự viết bằng GSAP ticker — không dùng Draggable/InertiaPlugin.
- **Min Motion level:** M4
- **Pin/scrub:** Không
- **Kỹ thuật:** `gsap.matchMedia` cho drop-in staggered `back.out(1.3)`. Vòng lặp physics trên `gsap.ticker`: spring (`k = 0.2`) kéo card về con trỏ khi drag, friction (`0.84`) làm tắt dần khi thả. Pointer Capture API (touch & mouse nhất quán). Z-index nổi lên khi focus/grab. IntersectionObserver + visibilitychange tạm dừng ticker khi ngoài màn hình hoặc tab ẩn.
- **Deps:** `gsap`, `@gsap/react`
- **Props:**

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `id` | `string` | — | HTML id của `<section>` |
| `className` | `string` | — | Class ngoài |
| `intensity` | `1\|2\|3` | `2` | Hệ số 0.7/1/1.4 cho duration & khoảng rơi |
| `heading` | `string` | `'Khoảnh khắc của bạn'` | Tiêu đề h1 |
| `subheading` | `string` | `'Kéo thả để xê dịch'` | Dòng mô tả dưới tiêu đề |
| `items` | `SIG220Item[]` | — | Danh sách ảnh (tối đa 6) |
| `items[].image` | `SIG220Image` | — | `{ src, alt, isResultPhoto? }` |
| `items[].caption` | `string` | — | Chú thích dưới ảnh polaroid |
| `labels.heading` | `string` | — | aria-label cho section |
| `labels.dragHint` | `string` | — | Ghi đè subheading trong aria |

- **Mobile version:** Drop-in ngắn hơn (160 px thay 240 px), cùng vật lý kéo thả — touch hoạt động qua Pointer Events API.
- **Reduced motion:** Fade-in 150 ms, không có chuyển động rơi; vật lý vẫn hoạt động cho drag.
- **Ảnh kết quả thật:** `isResultPhoto: true` → `object-fit: contain`, không bao giờ bị cắt hay biến dạng lúc nghỉ.
- **Hợp với ẩn dụ:** Studio ảnh, wedding, travel blog, portfolio sáng tạo — bất kỳ thương hiệu nào muốn cảm giác thủ công, hoài niệm.
- **Changelog:** v1.0.0 — first cast

## Port notes (Yên Spa, Next.js)
- `"use client"`, `next/image` thay cho `img`, ảnh luôn `object-contain` trong khung vuông (nguồn vuông nên không cắt, không méo; quan trọng nhất với các bài đăng yen-capture có chữ in sẵn).
- Nhúng trong section About như một `div` (`data-sig="220"`), không phải hero: không có h1/heading/subheading, About giữ h2. Props: `items`, `intensity`, `className`, `labels` `{ group, dragHint, swipeHint }`.
- 7 ô thay vì 6 của bản gốc (danh sách `SCATTER7` cố định, không ngẫu nhiên: Cache Components cấm số ngẫu nhiên khi render).
- Bố cục CSS-first: từ 768px thẻ đặt `position: absolute` theo phần trăm (`left: calc((100% - cw) * fx)`, `top: calc((100% - ch) * fy)`, `rotate` từ CSS), nên SSR, không JS và reduced motion đều thấy bố cục hoàn chỉnh, và mọi vị trí nghỉ luôn nằm trong bàn ở mọi bề rộng. Dưới 768px là dải ngang `scroll-snap-type: x mandatory` (cuộn gốc, không JS), tràn mép bằng margin âm.
- Kéo thả chỉ bật khi chuột/bút (`(hover: hover) and (pointer: fine)`), từ 768px và có chuyển động. Màn hình cảm ứng từ 768px thấy bố cục rải tĩnh, ngón tay bắt đầu trên ảnh vẫn cuộn được trang (`touch-action: none` chỉ áp dụng khi kéo được).
- Giới hạn: mỗi thẻ bị chặn để hộp của nó nằm trong bàn, cách mép 8px (tính từ clientWidth/clientHeight của bàn và offsetLeft/Top/Width/Height của thẻ, tính lại khi pointerdown và resize); chạm giới hạn thì triệt tiêu thành phần vận tốc đó (không nảy). Bàn có `isolation: isolate` nên z-index tăng khi kéo không bao giờ đè lên header cố định.
- Độ dịch khi kéo ghi vào thuộc tính CSS `translate` (áp trước `rotate`) nên đi đúng theo trục màn hình dù thẻ đang nghiêng; GSAP không chạm vào phần tử có `rotate` CSS (GSAP sẽ gộp `rotate` vào `transform`).
- Hiệu ứng rơi áp lên lớp con `[data-sig220-drop]`, chạy khi bàn cuộn tới (`top 75%`, một lần), rơi 120px thay vì chạy lúc tải trang. Nếu vào trang khi bàn đã quá điểm bắt đầu (liên kết neo, tải lại giữa trang) thì hiện ngay.
- Reduced motion: không rơi, không kéo (bản gốc vẫn cho kéo). Ảnh hiện đủ ở vị trí nghỉ.
- Không có chú thích (không có dữ kiện thật); `caption` chỉ render khi được truyền vào.
