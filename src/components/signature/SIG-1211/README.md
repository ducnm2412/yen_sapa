# SIG-1211 — Section sau đè như tấm thẻ · Card-over Section Transition
- **Status:** draft · **Version:** 1.0.0
- **Glossary term:** Card-over / stacking sections, Sticky stack, Section transition
- **Trông như thế nào:** Section thứ nhất đứng yên khi đáy của nó chạm đáy màn hình. Section thứ hai trượt lên đè lên như một tấm thẻ lớn bo tròn hai góc trên, có bóng mờ phía trên. Trong lúc bị đè, section thứ nhất lùi nhỏ lại (khoảng 0.92), bo góc và tối dần. Khi tấm thẻ chạm đỉnh màn hình, góc bo mềm về 0 và nó thành một section tràn khổ bình thường. Cuộn ngược thì mọi thứ chạy ngược đúng như cũ.
- **Min Motion level:** 4 · **Pin/scrub:** yes (CSS sticky + scrub; không dùng pin-spacer). Counts toward floors: Signature 1, pin 0 (sticky, không phải ScrollTrigger pin), transition 1
- **Kỹ thuật:** CSS `position: sticky` giữ section ra; GSAP ScrollTrigger scrub chỉ cho scale / border-radius / opacity của lớp phủ. `top` của sticky = chiều cao viewport − chiều cao section, tính lại bằng ResizeObserver và mỗi lần ScrollTrigger refresh.
- **Deps:** gsap, @gsap/react

## Props
| Prop | Type | Note |
|---|---|---|
| `outgoing` | ReactNode | Bắt buộc. Section bị đè, cao bao nhiêu cũng được. Nếu cao hơn màn hình, nó cuộn bình thường hết nội dung rồi mới dính lại |
| `incoming` | ReactNode | Bắt buộc. Section trượt lên đè. Wrapper có nền `--sig-bg` đục; nội dung có thể tự đặt nền riêng |
| `incomingId` | string? | id đặt trên wrapper của incoming để menu neo tới; có `scroll-margin-top: var(--header-h)` |
| `intensity` | 1 \| 2 \| 3 | Scale-down 0.95 / 0.92 / 0.88, radius 20 / 32 / 48px, overlay 0.35 / 0.5 / 0.65 |
| `radius` | string? | Bán kính góc trên của thẻ lúc đầu, mọi đơn vị CSS (vd `"2rem"`). Mặc định theo `intensity` |
| `overlayColor` | string? | Màu lớp phủ tối trên section bị đè. Mặc định `var(--sig-bg)` |
| `id`, `className` | string? | Root; có `scroll-margin-top: var(--header-h)` |

## Nối nhiều section (chain)
Mỗi cặp là một wrapper. Hai cách:
- **Lồng:** `incoming` của cặp A chính là một `<Sig1211CardOver outgoing={B} incoming={C} />`. B được giữ, bị C đè.
- **Tuần tự:** render `<Sig1211CardOver outgoing={A} incoming={B}/>` rồi `<Sig1211CardOver outgoing={B'} incoming={C}/>` (B' là bản sao nội dung nếu cần). Cách lồng cho kết quả đúng hơn vì không lặp nội dung.

## Mobile version
Vẫn đè như thẻ nhưng nhẹ hơn: radius ×0.6, scale-down chỉ còn một nửa (≈0.96), overlay ×0.6. Nếu section bị đè cao hơn 1.5 lần màn hình thì bỏ hẳn scale (chỉ còn overlay và thẻ trượt) để tránh layer lớn gây giật.

## Reduced motion
Hai section nằm trong luồng bình thường, không sticky, không scale, không overlay, thẻ không bo góc.

## Lưu ý kỹ thuật
- Section bị đè vẫn nằm trong thứ tự đọc và vẫn bấm được cho tới khi bị thẻ phủ lên (thẻ có z-index cao hơn và nền đục). Overlay có `pointer-events: none` và `aria-hidden`.
- Thẻ dùng `overflow: clip` với `overflow-clip-margin: 12px` để góc bo cắt nội dung nhưng viền focus không bị cắt.
- Wrapper cần ở trong luồng cuộn của trang; không bọc nó trong phần tử có `overflow: hidden/auto` (sẽ phá sticky).
- Tương thích Lenis và cuộn gốc; không tạo smooth scroll riêng.

## Ảnh kết quả thật
Component không tự render ảnh; ảnh nằm trong slot của client và không bị biến dạng (chỉ section bị đè được scale đều, chỉ trong lúc bị che).

## Hợp với ẩn dụ
- **Phun xăm / spa:** từ phần giới thiệu sang phần dịch vụ như lật sang trang mới.
- **Nha khoa / y tế:** chuyển từ cam kết sang quy trình.
- **Du lịch / nhà hàng:** từ không gian sang thực đơn hoặc lịch tour.

## Changelog
- v1.0.0 — first cast

## Port notes (Yên Spa, Next.js)
- `"use client"`, import gsap như SIG-505; xuất `Sig1211CardOver` và default export.
- Thêm prop `style?: CSSProperties`, gộp vào style của root để wrapper server (`BannerAboutStack`) truyền biến `--sig-*` từ theme tokens (`--sig-bg`, `--sig-card-shadow`).
- Data hook: root `data-sig="1211"`, khối giữ `data-sig1211-stick`, lớp scale `data-sig1211-inner`, lớp phủ `data-sig1211-overlay`, thẻ `data-sig1211-card`. Không dùng tên attribute của SIG-01 (`data-sig-sticky`) để script kiểm tra tìm đúng từng signature.
- Bỏ `color` và `fontFamily` inline trên root: hai slot là các section của site, tự mang chữ và màu của chúng.
- Đổ bóng thẻ đọc `var(--sig-card-shadow, <bóng gốc>)`.
- `useGSAP` trả về `() => mm.revert()` để trạng thái được hoàn nguyên rõ ràng khi unmount.
- Min Motion level 4: owner-approved exception on this Motion-3 site (quick 261113-knm).
- Mobile: CSS sticky vẫn bật (phiên bản mobile nhẹ hơn của README). Đây không phải pin: nó thêm 0px chiều cuộn và không tạo pin-spacer (chiều cao root = chiều cao banner + chiều cao About), giống banner cũ vốn cũng sticky trên mobile. Script kiểm tra đo điều này.
- Dùng cho Banner (outgoing) → "Về Yên Spa" (incoming). Không truyền `incomingId`: id `gioi-thieu` nằm trên section của About nên không trùng id.
