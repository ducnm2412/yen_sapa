# SIG-403 — Danh sách rê hiện ảnh · Hover List Image Reveal

- **Status:** draft · **Version:** 1.0.0
- **Glossary:**
  - *Hover preview* — xem trước: rê chuột lên một dòng chữ thì ảnh tương ứng hiện ra ngay cạnh con trỏ.
  - *Cursor follow / lerp* — ảnh bám theo chuột với độ trễ nhỏ (nội suy mượt), không dính cứng vào con trỏ.
  - *Clip-path reveal* — ảnh mới "mở" từ dưới lên bằng `clip-path: inset(...)` khi đổi dòng, ảnh cũ nằm dưới.
- **Trông như thế nào:** Bốn dòng cách nhau bằng đường kẻ mảnh, mỗi dòng có số thứ tự nhỏ màu vàng (01-04), tên dịch vụ cỡ lớn bằng font display, dòng phụ bên dưới và mũi tên bên phải. Trên desktop có chuột, rê vào dòng nào thì ảnh 4:5 của dịch vụ đó hiện ngay cạnh con trỏ và trượt theo chuột; sang dòng khác ảnh mới mở từ dưới lên đè lên ảnh cũ; các dòng còn lại mờ đi, dòng đang chọn dịch sang phải. Điện thoại, màn cảm ứng, giảm chuyển động và khi chưa có JS: mỗi dòng có sẵn ảnh 4:5 rộng 160px.
- **Min Motion level:** M3
- **Pin/scrub:** Không (0 chiều dài cuộn)
- **Kỹ thuật:** `gsap.quickTo` (x, y, rotation) cho độ bám, `gsap.matchMedia` chọn chế độ, `gsap.delayedCall` đưa độ nghiêng về 0 khi chuột dừng, `clip-path` cho chuyển ảnh. Không ScrollTrigger, không ticker, không vòng RAF.
- **Deps:** `gsap`, `@gsap/react` (+ `next/image` trong bản port này)
- **Props:**

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `id` | `string` | — | HTML id của khối gốc |
| `className` | `string` | — | Class ngoài |
| `intensity` | `1\|2\|3` | `2` | Độ trễ bám chuột 0.65/0.5/0.4s, nghiêng tối đa 0/4/7 độ, hệ số cú hé ảnh 0.7/1/1.4 |
| `items` | `Sig403Item[]` | — | Danh sách dòng |
| `items[].id` | `string` | — | Khóa ổn định |
| `items[].title` | `string` | — | Tên dịch vụ, render ở `h3` |
| `items[].sub` | `string` | — | Dòng nhỏ dưới tên |
| `items[].href` | `string` | — | Đích của cả dòng |
| `items[].image` | `Sig403Image` | — | `{ src, alt, isResultPhoto? }` |
| `items[].focus` | `string` | `50% 50%` | `object-position` của khung 4:5, ví dụ `"30% 50%"` |
| `labels.list` | `string` | `'Danh sách dịch vụ'` | aria-label của danh sách |
| `listAttrs` | `Record<data-*, string>` | — | Thuộc tính `data-*` gắn lên `<ul>` (ví dụ `data-reveal`) |

- **Mobile version:** Danh sách thiết kế riêng, không phải "tắt hiệu ứng": mỗi dòng là lưới hai cột (cột chữ + ảnh 4:5 rộng 160px), tên `clamp(1.75rem, 7vw, 2.25rem)`, dòng phụ xuống dòng không cắt, cả dòng là vùng chạm (≥ 44px). Không có khung ảnh nổi.
- **Reduced motion:** Bố cục ảnh nằm sẵn trong hàng ở mọi bề rộng (cột ảnh 160px từ 768px); không bám chuột, không trễ, không clip hay scale, không dịch tên.
- **Ảnh kết quả thật:** `isResultPhoto: true` → `object-fit: contain`. Mặc định `object-fit: cover` trong khung 4:5 cố định với `object-position` riêng cho từng ảnh, không bao giờ kéo giãn.
- **Hợp với ẩn dụ:** Menu in có ảnh minh họa, spa, nhà hàng, phòng tranh, studio: bất kỳ nơi nào có vài hạng mục lớn muốn người xem "chỉ đâu thấy đó".
- **Changelog:** v1.0.0 — first build in project (chưa đúc vào thư viện DUDI)

## Spec

### SIG-403 — Hover preview list, cursor-follow image (lerp via quickTo), clip-path reveal · Danh sách rê hiện ảnh

- Section / role: `#dich-vu` · show the 4 service groups as big, scannable names; on desktop the matching photo appears where the visitor points, so the list feels like a printed menu with pictures.
- Visitor sees (rest state): 4 rows separated by thin lines, each with a small gold index (01-04), the service name in large display type, the sub line under it, and an arrow on the right. Without JS, on phones, on touch tablets and with reduced motion every row also shows its photo as a 4:5 thumbnail (>= 160px wide). Everything is readable and complete with no motion at all.
- Motion, step by step (hover mode only: `(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`):
  1. Trigger: pointer enters a row link (pointerenter / pointermove over the list).
  2. Floating frame entrance on first row: position set instantly at the target (no fly-in from 0,0), autoAlpha 0 -> 1 and scale 0.85 -> 1, 350ms, ease power2.out; the active image is fully unclipped immediately.
  3. Follow: frame x/y via gsap.quickTo, duration 0.65s / 0.5s / 0.4s for intensity 1 / 2 / 3, ease power3.out. Target = cursor + 32px to the right, vertically centered on the cursor; flips to the left of the cursor when it would cross the wrap's right edge; clamped horizontally to [0, wrapWidth - frameWidth] and vertically to [-0.25 frameHeight, wrapHeight - 0.75 frameHeight]. While active, a passive scroll listener re-applies the last pointer position so the frame stays with the cursor during wheel scroll.
  4. Velocity rotation: rotation quickTo, clamp(dx * 0.35, -max, +max) with max 0 / 4 / 7 degrees for intensity 1 / 2 / 3; one reusable delayedCall (~120ms) returns it to 0 after movement stops.
  5. Row change: new image gets the highest z-index, clipPath inset(100% 0% 0% 0%) -> inset(0% 0% 0% 0%) and its inner wrapper scale (1 + 0.12 x factor) -> 1, 550ms, ease power3.out (factor 0.7 / 1 / 1.4). When that tween completes and the image is still active, the other images are reset to inset(100% 0% 0% 0%). Same row again: no tween.
  6. Leave list (pointerleave of the wrap and no keyboard focus inside): autoAlpha 1 -> 0, scale -> 0.9, 250ms, ease power2.in; active index -1; scroll listener removed; will-change cleared.
  7. Keyboard (focusin on a row link while in hover mode and the pointer is not inside the list): activate that row's image (step 5 swap) and move the frame (quickTo) to x = min(wrapWidth - frameWidth, max(titleRight + 24, wrapWidth - frameWidth - 64)), y = row center - frameHeight / 2 (same vertical clamp), rotation 0. focusout to an element outside the root hides the frame (step 6) unless the pointer is inside.
  8. Row text (CSS only, hover mode): while any row is hovered or focus-visible, the other rows dim to the muted color (`:has()`), the active row's title shifts right 0.75rem; 500ms, cubic-bezier(0.16, 1, 0.3, 1).
- Scroll length: 0 (no pin, no scrub; counts nothing toward the pinned budget).
- Content props: 4 items from `site.serviceGroups` (id, title, sub, image {src, alt}, focus), href `#bang-gia` for all.
- Images: square sources shown in a fixed 4:5 box with object-fit cover and a per-image object-position chosen by looking at the photo; never stretched. `isResultPhoto: true` would switch to object-fit contain (none of these 4 are result photos).
- Mobile (< 768px): designed inline list, not "disabled": each row is a two-column grid (text column + 160px 4:5 thumbnail), title clamp(1.75rem, 7vw, 2.25rem), sub wraps (no truncation), whole row is the touch target (>= 44px), no floating frame (display none, so its images never load).
- Reduced motion: inline layout at every width (thumbnail column 160px at >= 768px), no quickTo, no clip or scale tweens, no title shift.
- Deps: gsap (quickTo, matchMedia, delayedCall), @gsap/react (useGSAP), next/image (project port, documented). No ScrollTrigger needed.
- Reuse count on this page: 1.
- Done when: (a) hovering each of the 4 rows at 1280 shows the matching photo (src check) beside the cursor and it follows a 160px mouse move; (b) at 375 the 4 thumbnails are visible at >= 160px with 4:5 ratio and no floating frame; (c) 0px page overflow while hovering the last row at the wrap's right edge.

## Port notes (Yên Spa, Next.js)

- **Dựng trong dự án, chưa đúc vào thư viện DUDI.** SIG-403 chưa có trong thư viện nên được viết thẳng ở `src/components/signature/SIG-403/`. Thư viện (`.agents/skills`) không bị sửa. Chủ dự án xem lại bằng `/phoi-duc` trước khi đúc chính thức.
- `next/image` thay cho `img` (lệch khỏi quy tắc "tự chứa" của thư viện, giống SIG-220/505). Trong bản gốc thư viện sẽ là `img` thuần.
- **Chế độ hover do JS bật.** Server render và khi chưa có JS luôn là bố cục ảnh nằm sẵn trong hàng, nên ảnh luôn thấy được ở mọi nơi. Chỉ nhánh hover của `gsap.matchMedia` mới gắn `data-sig403-mode="hover"` (và `data-sig403-active`) lên khối gốc bằng DOM, không dùng React state, để không lệch hydration và không render lại. Khi điều kiện đổi (đổi cỡ cửa sổ, bật giảm chuyển động), cleanup gỡ thuộc tính và mọi style inline.
- **Ảnh nằm sẵn bị ẩn bằng visually-hidden, không `display: none`** trong chế độ hover (1px, `clip-path: inset(50%)`), để `alt` thật vẫn ở trong cây truy cập. Khung ảnh nổi là bản lặp, `aria-hidden="true"`, `alt=""`.
- **Khung ảnh nổi `display: none` ngoài chế độ hover**, nên điện thoại không bao giờ tải 4 ảnh của nó. Trong chế độ hover, các ảnh đó được đặt `loading="eager"` để lần rê đầu tiên không bị khung trống.
- **`listAttrs`** dùng để gắn `data-reveal="stagger"` của hệ thống chuyển động trang lên `<ul>` (hiệu ứng vào section thay cho stagger của lưới thẻ cũ, nên số lượng `stagger` trên trang vẫn là 2). Khung nổi là anh em của `<ul>` (không phải con), nên stagger chỉ hiện các dòng `li`, không bao giờ chạm vào khung.
- **Bàn phím:** khi focus vào một dòng (và chuột không ở trong danh sách), khung đặt tại `x = min(wrapW - frameW, max(titleRight + 24, wrapW - frameW - 64))` với `titleRight` đo từ `span` quanh chữ tên, nên ảnh nằm cạnh dòng và không đè lên tên; `y` căn giữa theo dòng. Tab ra khỏi danh sách thì khung ẩn.
- **Theme** (do `ServicesSection` đặt trên div bao): `--sig-fg: var(--color-beige-50)`, `--sig-muted: color-mix(in oklab, var(--color-beige-50) 45%, transparent)`, `--sig-accent: var(--color-gold-300)`, `--sig-font-display: var(--font-display)` (Cormorant Garamond), `--sig-font-body: var(--font-body)`. Tên dịch vụ weight 500, cỡ tối thiểu 28px, line-height 1.2 (quy tắc dấu tiếng Việt).
- Cache Components bật: không `Math.random`, `Date.now`, `new Date(` khi render.
- **Focus (object-position) từng ảnh trong `site.serviceGroups`** (nguồn vuông, khung 4:5 cắt khoảng 10% mỗi bên, chọn sau khi xem từng ảnh):
  - `skincare-led.jpg` — `30% 50%`: giữ máy ánh sáng LED, gương mặt đắp mặt nạ và khối chữ in sẵn ở bên trái.
  - `body-massage.jpg` — `70% 50%`: giữ kỹ thuật viên đang massage ở giữa-phải, bỏ phần rèm trống bên trái.
  - `hair-care-massage.jpg` — `65% 50%`: giữ gương mặt khách và hai bàn tay đang gội đầu.
  - `hair-removal-session.jpg` — `65% 50%`: giữ máy OPT cầm trên tay, cánh tay và gương mặt đeo kính bảo hộ.
