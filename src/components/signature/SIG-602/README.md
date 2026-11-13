# SIG-602 — Viền sáng chạy quanh gói nổi bật · Glowing Border Runner

- **Status:** draft · **Version:** 1.0.0
- **Trông như thế nào:** Bảng giá ba cột; gói được đề xuất có một vệt sáng màu vàng đồng chạy liên tục theo chiều kim đồng hồ quanh viền card, tạo cảm giác "được chiếu sáng" và nổi bật so với các gói còn lại.
- **Min Motion level:** 2
- **Pin/scrub:** Không — đây là vùng đọc/chuyển đổi, tuyệt đối không pin.
- **Kỹ thuật:** `conic-gradient` mask — một `<div>` tuyệt đối phủ toàn bộ wrapper có `padding: 2px`; GSAP animates một proxy `{ angle }` từ 0→360 lặp vô hạn, mỗi frame ghi `el.style.background = conic-gradient(from ${angle}deg, ...)` với dải sáng ~65° ở cuối gradient; card nội dung (`z-index: 1`) phủ trung tâm, chỉ để lộ 2px viền bên ngoài.
- **Deps:** `gsap`, `gsap/ScrollTrigger`, `@gsap/react`
- **Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `id` | `string?` | — | HTML id của `<section>` |
| `className` | `string?` | — | CSS class bổ sung |
| `intensity` | `1\|2\|3` | `2` | Tốc độ vệt sáng: 0.7× / 1× / 1.4× |
| `heading` | `string?` | `'Chọn gói phù hợp'` | Tiêu đề bảng giá |
| `subheading` | `string?` | — | Mô tả ngắn bên dưới tiêu đề |
| `plans` | `Plan[]` | — | Danh sách gói; `highlighted: true` kích hoạt glow |
| `labels.recommended` | `string?` | `'Được đề xuất'` | Nhãn badge |

- **Mobile version:** Grid `auto-fit` tự stack dọc; vệt sáng thu hẹp spread xuống 52° và chạy nhanh hơn (÷ 2.4s thay vì 3.5s) để vẫn rõ ràng trên màn nhỏ.
- **Reduced motion:** Cả hai điều kiện `matchMedia` đều yêu cầu `prefers-reduced-motion: no-preference`; khi người dùng bật reduced-motion, không có nhánh nào khớp → animation không chạy, chỉ hiển thị viền tĩnh màu vàng nhạt `rgba(224,162,91,0.18)`.
- **Ảnh kết quả thật:** Không sử dụng ảnh.
- **Hợp với ẩn dụ:** Spotlight/ánh sáng quét — gói nổi bật như đang được chiếu đèn trên sân khấu; phù hợp với ngữ cảnh pricing cao cấp, SaaS, dịch vụ sáng tạo.
- **Changelog:** v1.0.0 — first cast

## Port notes (Yên Spa, Next.js)
- Chỉ tách phần viền sáng chạy (`Sig602GlowRing`): không bảng giá, không badge "Được đề xuất" (đó sẽ là một tuyên bố biên tập mới). Dùng cho đúng một thẻ dịch vụ "Triệt lông OPT".
- Vòng viền dạng mặt nạ nằm trong thẻ (`position: absolute; inset: 0; border-radius: inherit; padding: 2px`, mask `content-box` xor `border-box`), không phải wrapper có padding như bản gốc. Nó đi theo hiệu ứng nhấc thẻ khi hover của `.service-card`, không đổi kích thước thẻ hay lưới.
- Đổi màu theo token vàng: nền mờ `rgba(184,151,90,0.28)` (gold-500; bản gốc 0.12-0.18 quá mờ trên ảnh tối ở 1x), viền dày 3px (bản gốc 2px), đuôi `rgba(184,151,90,0.75)`, đầu sáng `rgba(216,192,138,1)` (gold-300). Hình dạng `buildConic(angle, spread)` giữ nguyên.
- Sửa lỗi: tween tạo với `paused: true` và chỉ chạy khi thẻ cha nằm trong viewport (một ScrollTrigger `onToggle`), vì bản gốc chạy cả khi ở ngoài màn hình. `visibilitychange` chỉ chạy lại khi trigger đang active.
- Reduced motion: không nhánh matchMedia nào khớp, vòng hiển thị viền vàng tĩnh `rgba(216,192,138,0.5)` (cũng là hình SSR/không JS). Cường độ mặc định 1 (êm, khoảng 5 giây một vòng trên desktop).
