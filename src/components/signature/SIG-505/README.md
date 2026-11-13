# SIG-505 — Lưới zoom vào ô giữa · Grid Zoom-in to Center Tile
- **Status:** draft · **Version:** 1.0.0
- **Glossary term:** Zoom-in transition / Scale from center, Pinning, Scrub, Parallax
- **Trông như thế nào:** Một màn hình được ghim, hiện lưới ảnh 3×3 với khe nhỏ; ô giữa là ảnh chủ đạo. Cuộn xuống, cả lưới phóng to từ tâm, ô giữa lớn dần tới khi phủ kín màn hình, tám ô xung quanh trượt ra ngoài với tốc độ hơi khác nhau nên có chiều sâu. Khi ảnh giữa đã full-bleed, khối chú thích (tiêu đề, đoạn chữ, nút) hiện lên trên lớp phủ tối ở đáy. Cuộn ngược thì mọi thứ quay lại đúng như cũ. Sau đó pin được nhả.
- **Min Motion level:** 4 · **Pin/scrub:** yes (counts toward floors: Signature 1, pin 1 on desktop, transition 0)
- **Kỹ thuật:** GSAP ScrollTrigger (pin + scrub timeline: scale lưới từ tâm, xPercent/yPercent/scale từng ô, clip-path ô giữa). Scale cuối tính từ layout (kích thước stage ÷ kích thước ô giữa), `invalidateOnRefresh: true`.
- **Deps:** gsap, @gsap/react

## Props
| Prop | Type | Note |
|---|---|---|
| `center` | `{src, alt, isResultPhoto?}` | Bắt buộc. Ô giữa, kết thúc ở trạng thái full-bleed |
| `around` | `{src, alt, isResultPhoto?}[]` | Bắt buộc. Dùng đúng 8 ảnh; ít hơn thì lặp lại, rỗng thì dùng ảnh giữa |
| `eyebrow` | string? | Nhãn nhỏ phía trên tiêu đề, mờ đi khi bắt đầu zoom |
| `heading` | string? | Tiêu đề hiện trên lưới lúc đầu, mờ đi khi zoom bắt đầu |
| `caption` | `{title, text?, cta?: {label, href}}`? | Khối chú thích hiện lên trên lớp phủ khi ảnh giữa đã full-bleed |
| `intensity` | 1 \| 2 \| 3 | Độ dài pin = 130vh × 0.7 / 1 / 1.4 (trong giới hạn 150vh × hệ số) và biên độ parallax |
| `id`, `className` | string? | Root (`section`) có `scroll-margin-top: var(--header-h)` |

Biến CSS: `--sig-bg`, `--sig-fg`, `--sig-accent`, `--sig-font-display`, `--sig-font-body`, `--header-h` (đều có fallback).

## Mobile version
Không pin, không lưới 3×3. Lưới 2 cột; ô giữa là thẻ rộng hết bề ngang, `clip-path` mở từ thẻ bo góc (inset 16px, bo 22px) ra full-bleed theo cuộn tự nhiên (scrub, không pin) cùng ảnh thu nhẹ từ 1.15 về 1. Tám ô còn lại hiện lần lượt nhẹ nhàng (fade + trượt lên). Khối chú thích nằm ngay dưới trong luồng bình thường. Lý do: pin 3×3 trên màn hẹp làm mỗi ô quá nhỏ và tốn chiều cuộn.

## Reduced motion
Lưới tĩnh (3×3 trên desktop, 2 cột trên mobile) và khối chú thích nằm trong luồng bình thường; không pin, không scrub.

## Ảnh kết quả thật
An toàn. Ảnh chỉ được scale đồng đều (tile tỉ lệ cố định, `object-fit: cover`), không bao giờ bị kéo méo hay skew. Ô giữa kết thúc ở trạng thái nghỉ full-bleed và không méo (scale ảnh trong ô về đúng 1, tile có cùng tỉ lệ với stage nên chỉ crop đều hai bên). Lưu ý: `cover` có thể cắt mép ảnh; ảnh kết quả quan trọng nên chọn bố cục chừa lề.

## Hợp với ẩn dụ
- **Phun xăm / spa:** lưới các tác phẩm, zoom vào một ca tiêu biểu rồi mời đặt lịch.
- **Du lịch / khách sạn:** lưới điểm đến, zoom vào ảnh chủ đạo kèm lời mời.
- **Studio / portfolio:** lưới dự án, zoom vào dự án nổi bật.

## Accessibility
Mọi ảnh nằm trong DOM với `alt`; ảnh giữa đứng đầu thứ tự đọc. Chữ thật nằm trong DOM (heading, caption). CTA có focus ring nhìn thấy. Không thông tin nào chỉ có qua chuyển động.

## Changelog
- v1.0.0 — first cast

## Port notes (Yên Spa, Next.js)
- `"use client"`, `next/image` (fill) cho mọi ô; ô giữa `sizes="100vw"`, ô quanh `(min-width: 768px) 28vw, 50vw`; bỏ effect decode/refresh ảnh (kích thước ô đến từ CSS).
- Lưới 3x2 thay vì 3x3: ô giữa ở (cột 2, hàng 1), tối đa 5 ô quanh, KHÔNG lặp ảnh (ít hơn 5 thì chỉ hiện đúng số truyền vào). Thêm prop `pinVh` (ghi đè độ dài pin) và `as` ("section" | "div").
- Ô giữa không nằm đúng tâm lưới nên phép zoom tính từ layout: scale = max(stageW / tileW, stageH / tileH) x 1.002, cộng x/y dịch lưới để tâm ô giữa trùng tâm stage (scale quanh tâm lưới, x/y = tâm stage - tâm lưới - scale x vị trí ô so với tâm lưới). Cả ba giá trị là hàm nên `invalidateOnRefresh` tính lại khi resize.
- Lưới ghim: cột `repeat(3, calc(var(--s) * 100vw))`, hàng `repeat(2, calc(var(--s) * (100dvh - var(--header-h))))`, `--s: 0.3`, nên mỗi ô cùng tỉ lệ stage và zoom cuối là scale đều, không méo.
- Kiểu ghim áp bằng CSS ngay từ đầu (media query desktop + no-preference), không đợi JS thêm class, để không nhảy bố cục khi hydrate. Chú thích ẩn bằng `.js .sig505-cap` đến khi timeline hiện ra.
- Chú thích dùng lớp phủ tối (`--sig-scrim`) và chữ sáng (`--sig-cap-fg`) khi nằm trên ảnh full-bleed; ngoài chế độ ghim vẫn dùng `--sig-fg`.
- Mobile: ô cuối của hàng lẻ tự trải 2 cột (aspect 16/10) nên không có ô trống; bỏ `reverse` ở entrance để ô không biến mất khi cuộn ngược.
