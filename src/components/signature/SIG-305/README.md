# SIG-305 — Bút dạ tô từng dòng · Highlighter Line by Line

- **Status:** draft · **Version:** 1.0.0
- **Trông như thế nào:** Câu trích dẫn lớn, chữ kiểu serif, được tô sáng từng dòng lần lượt bằng vệt màu bán trong suốt giống bút dạ quang quét từ trái sang phải theo chiều cuộn trang.
- **Min Motion level:** 3
- **Pin/scrub:** Desktop — pin section + scrub timeline qua lần lượt từng dòng; Mobile — ScrollTrigger riêng mỗi dòng, không pin.
- **Kỹ thuật:** `background-size` scrub — mỗi dòng được bọc trong `<span style="background-image: linear-gradient(...)">` với `background-size: 0% 55%` → `100% 55%`, GSAP fromTo điều khiển giá trị qua ScrollTrigger. Desktop dùng một `gsap.timeline()` scrub duy nhất; mobile dùng `toggleActions`.
- **Deps:** `gsap`, `gsap/ScrollTrigger`, `@gsap/react`
- **Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `id` | `string` | — | HTML id |
| `className` | `string` | — | Class ngoài |
| `intensity` | `1 \| 2 \| 3` | `2` | Mức chuyển động (factor 0.7 / 1 / 1.4) |
| `lines` | `string[]` | — | **Bắt buộc.** Mảng chuỗi, mỗi phần tử = một dòng được tô riêng |
| `attribution` | `string` | — | Tên tác giả / nguồn trích dẫn |
| `labels.section` | `string` | `'Trích dẫn nổi bật'` | `aria-label` cho section |

- **Mobile version:** Mỗi dòng có ScrollTrigger riêng (`start: 'top 88%'`, `toggleActions: play none none reverse`), không pin, có delay nhẹ theo thứ tự dòng. Vẫn tạo cảm giác tuần tự nhưng phù hợp scroll nhanh trên điện thoại.
- **Reduced motion:** Không có nhánh matchMedia khớp → GSAP không chạy → `background-size: 0% 55%` giữ nguyên (highlight không hiện). Text vẫn đọc được hoàn toàn vì highlight chỉ là lớp trang trí phía sau chữ.
- **Ảnh kết quả thật:** Không dùng ảnh.
- **Hợp với ẩn dụ:** About, Manifesto, Statement thương hiệu, trang Quote, giới thiệu triết lý studio.
- **Changelog:** v1.0.0 — first cast

## Port notes (Yên Spa, Next.js)
- `"use client"`, thêm prop `variant` ("section" mặc định | "inline"). Inline = chỉ `blockquote`, không padding/min-height/dấu ngoặc trang trí, kiểu chữ do `className` quyết định.
- Mỗi dòng là `span` inline (`sig305-line`, `box-decoration-break: clone`), cách nhau bằng khoảng trắng và `br` ẩn dưới 640px để màn hẹp tự ngắt dòng. Chuỗi nối các dòng chính là đoạn trích gốc, không đổi chữ.
- Highlight CSS-first: mặc định `background-size: 100% 55%` (không JS và reduced motion thấy highlight đủ); chỉ khi `prefers-reduced-motion: no-preference` và `html.js` mới bắt đầu từ `0% 55%` trước khi GSAP chạy.
- Desktop: một timeline scrub gắn `ScrollTrigger` (start `top 80%`, end `bottom 45%`), KHÔNG pin (ngân sách ghim của trang). Mobile giữ bản từng dòng với `toggleActions`.
- Đã bỏ effect `visibilitychange` (nó disable mọi ScrollTrigger của trang, kể cả pin của SIG-505) và `ScrollTrigger.refresh()` trong matchMedia (MotionSystem đã refresh sau khi font tải xong).
