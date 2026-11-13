# SIG-01 — Chữ đứng yên, nền cuộn · Sticky Headline, Scrolling Scene
- **Status:** draft · **Version:** 1.0.0
- **Glossary term:** Scroll-driven animation + Parallax (headline held with `position: sticky`)
- **Trông như thế nào:** Một câu chữ lớn đứng yên giữa màn hình. Phía sau, các khung ảnh trôi lên với tốc độ khác nhau, tạo chiều sâu. Câu chữ "thở" nhẹ: rõ dần khi vào, mờ nhẹ khi rời.
- **Min Motion level:** 3 · **Pin/scrub:** yes. Counts as Signature 1 and scrub 1. Not a section transition.
- **Kỹ thuật:** CSS sticky for the headline (works without JS and with Lenis) + GSAP ScrollTrigger scrub for frame parallax.
- **Deps:** gsap, @gsap/react

## Props
| Prop | Type | Note |
|---|---|---|
| `headline` | string | Required. Keep ≤ ~10 words |
| `emphasis` | string? | Substring of `headline`, rendered in display font + `--sig-accent` |
| `eyebrow`, `caption` | string? | Small label and supporting line |
| `images` | `{src, alt, isResultPhoto?}[]` | 3–8 images, portrait 4:5 works best |
| `intensity` | 1 \| 2 \| 3 | Scroll length (≈ 100 + n×45×f vh) and parallax spread |
| `id`, `className` | string? | Root id gets `scroll-margin-top: var(--header-h)` |

## Mobile version
Frames become 44vw wide and alternate between the left and right edges. Parallax spread drops to about 40% of desktop. The headline stays sticky, with a soft backdrop gradient behind the text so it stays legible when a frame passes (the photos themselves are not dimmed).

## Reduced motion
No parallax and no headline breathing. The headline is still sticky (that is layout, not animation) and the frames scroll normally.

## Ảnh kết quả thật
An toàn. Ảnh chỉ được dịch chuyển, không bao giờ bị méo, cong hay lọc màu.

## Hợp với ẩn dụ
Câu tuyên bố thương hiệu đi qua "bộ sưu tập":
- **Spa:** "Mỗi khung hình là một nhịp thở".
- **Phun xăm:** câu triết lý đứng yên, ảnh tác phẩm trôi qua.
- **Du lịch:** câu slogan, cảnh điểm đến trôi qua.

## Changelog
- v1.0.0: first cast.

## Port notes (Yên Spa, Next.js)
- `"use client"`, `next/image` thay cho `<img>`, `h2` thay cho `h3`, root là `section` kèm `data-sig="01"` và `data-sig-sticky` trên khối sticky.
- `images` đổi thành danh sách cụm lá tách nền (`SigLeaf`: src, width, height, side, w, flush?, top?) vẽ trang trí (`alt=""`, `aria-hidden`); thêm prop `backdrop` (ảnh phủ kín, opacity 0.3, `mix-blend-mode: soft-light`). Chỉ dùng ảnh thiên nhiên; sáu ảnh không gian dành cho SIG-505.
- Bố cục CSS-first: mặc định (mobile, không JS, reduced motion) là khối tĩnh, câu chữ không sticky, lá đặt tuyệt đối ở mép trái/phải. Chỉ khi `min-width: 768px` và `prefers-reduced-motion: no-preference`: section cao `100dvh - var(--header-h) + 35vh`, câu chữ sticky dưới header, nên thời gian "đứng yên" thêm đúng 35vh (ngân sách ghim của trang).
- Danh sách khung flex-column cũ (cần ~250vh) thay bằng khung đặt tuyệt đối. PNG tách nền có mép bị cắt thẳng nên mỗi lá bám sát mép trái/phải của section (`side`), lá có mép cắt ở trên/dưới thì `flush` và chỉ trôi theo chiều đẩy mép cắt ra ngoài vùng nhìn thấy (lá bám mép trên chỉ trôi lên, bám mép dưới chỉ trôi xuống); lá chỉ cắt một bên trôi tự do theo chiều dọc. Bỏ `SLOTS` ngang, mobile nhân chiều rộng 1.6.
- Câu chữ "thở": 0.97 và 0.9 lên 1 rồi 1.02 và 0.88 (không bao giờ dưới 0.88); mobile không thở, độ trôi của lá chỉ còn 0.25. Reduced motion không có tween nào.
- Lớp cảnh nền (`.sig01-scene`) giữ `overflow: hidden`; section KHÔNG có overflow để `position: sticky` còn hoạt động.
- Màu qua biến `--sig-*` do server wrapper `BrandSentence.tsx` gán từ token theme; chữ lấy từ `site.ts`.
