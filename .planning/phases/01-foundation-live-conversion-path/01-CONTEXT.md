# Phase 1: Foundation & Live Conversion Path - Context

**Gathered:** 2026-11-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Dọn scaffold create-next-app, dựng nền tiếng Việt + bảng màu xanh/be, file nội dung khai báo một nơi (FND-04), header cố định + menu mobile, thanh nút nổi Gọi/Zalo/Messenger, hero, khối liên hệ tạm `#dat-lich`, footer, deploy Vercel lần đầu. Requirements: FND-01..05, NAV-01..04, HERO-01, SEO-05.
</domain>

<decisions>
## Implementation Decisions

### Hero
- **D-01:** Nền hero là **ảnh tĩnh** (không video). Video để Phase 5.
- **D-02:** Bố cục mobile: **ảnh tràn màn hình, chữ + nút đè lên** với lớp phủ tối/gradient đủ tương phản AA cho chữ trắng.
- **D-03:** Claude chọn ảnh hero từ `public/images/space/` (lobby, treatment-room, staircase...) hoặc `brand/banner-storefront.jpg` — ưu tiên ảnh có vùng trống cho chữ, không có chữ "Yên Skinlab" lẫn lộn. Ảnh hero dùng `preload`, không bắt đầu ở opacity 0.
- **D-04:** Claude viết nháp câu giới thiệu dựa trên `docs/YEU_CAU.md` — giọng nhẹ nhàng, tinh tế; không hứa hẹn kết quả điều trị. Đánh dấu chờ khách duyệt.
- Nút: "Đặt lịch" (→ `#dat-lich`) và "Gọi ngay".

### Màu & chữ
- **D-05:** Xanh chủ đạo: **xanh rêu/olive trầm**; nền be ấm. Phải đạt WCAG AA.
- **D-06:** Đỏ đô của logo chỉ là **màu nhấn nhỏ** (đường kẻ, badge), không dùng cho CTA chính.
- **D-07:** Tiêu đề: **Cormorant Garamond** (≥28px, line-height ≥1.2); nội dung: **Be Vietnam Pro** 400/500/600; cả hai `subsets: ["latin","vietnamese"]`.
- Không dark mode.

### Logo & header
- **D-08:** Logo header dùng **ảnh JPG** (`public/images/brand/logo-green.jpg` hoặc logo-red tùy nền) đặt trong khung tròn/vuông nhỏ. Ghi chú: vẫn xin khách SVG/PNG để thay sau.
- **D-09:** Header **trong suốt trên hero, chuyển nền be khi cuộn** (cần JS nhỏ / IntersectionObserver; trạng thái mặc định khi chưa có JS vẫn phải đọc được).
- **D-10:** Menu Phase 1 **chỉ gồm mục đã có** (vd. Trang chủ, Liên hệ). Menu khai báo dạng dữ liệu để phase sau thêm mục.

### Nút nổi & CTA
- **D-11:** Mobile: **thanh cố định đáy màn hình** 3 nút Gọi / Zalo / Messenger; chừa padding-bottom cho nội dung/footer để không che.
- **D-12:** Nút **Gọi** cho **chọn chi nhánh** (Q3 0899 607 279 / Phú Nhuận 0896 407 578). Phải hoạt động không cần JS → dùng `<details>`/`<summary>` hoặc popover thuần HTML, mỗi lựa chọn là `<a href="tel:+84...">`. Zalo: mặc định số Q3 0899 607 279 (chỉ số này đã xác nhận có Zalo) — nếu áp dụng chọn chi nhánh cho Zalo thì chỉ khi số 2 được xác nhận. Messenger: `https://m.me/SpabeauteYenhcm`.
- **D-13:** "Đặt lịch" trỏ tới **khối liên hệ `#dat-lich`** ngay trên footer (gọi 2 chi nhánh, Zalo, Messenger). Phase 3 đặt form vào đúng anchor này.

### Animation (Motion — phong cách luxury)
- **D-14:** Dùng thư viện **`motion`** (`motion/react`, `LazyMotion` + `domAnimation` + `m.*`, `strict`) cho hiệu ứng chuyển động; bọc `MotionConfig reducedMotion="user"`. Áp dụng skill `.agents/skills/motion-design/SKILL.md`.
- **D-15:** Ngôn ngữ chuyển động "luxury": chậm, mềm, tiết chế — duration ~0.8–1.2s, easing kiểu expo-out (vd. `[0.16, 1, 0.3, 1]`), không bounce/spring nảy, không xoay/scale mạnh.
- **D-16:** Hero: ảnh nền zoom-out rất nhẹ (scale 1.08→1, ~1.6s) + chữ hiện lần lượt (stagger ~0.12s, fade + trượt lên 16–24px); có thể reveal tiêu đề theo dòng (mask). **Không** để ảnh LCP bắt đầu ở opacity 0. Parallax nhẹ cho ảnh hero khi cuộn (chỉ transform).
- **D-17:** Header: chuyển nền trong suốt → be mượt (~0.4s). Menu mobile: mở dạng overlay fade + các mục stagger.
- **D-18:** Thanh nút nổi: trượt lên nhẹ khi xuất hiện; nhưng **link phải có sẵn trong HTML** (hoạt động không JS), animation chỉ là trang trí.
- **D-19:** Component dùng lại: `MotionProvider`, `Reveal` (whileInView, `viewport={{ once: true, amount: 0.2 }}`) để các phase sau dùng cho section. Chỉ animate `transform`/`opacity`. Hover/press dùng Tailwind transition.

### Claude's Discretion
- Giữ hay bỏ `cacheComponents`/`partialPrefetching` trong `next.config.ts` (không dùng `new Date()` khi render).
- Mã màu cụ thể, spacing, icon (lucide-react + SVG Zalo/Messenger/Facebook tự viết), hiệu ứng (motion LazyMotion, tôn trọng reduced-motion).
- Hành vi nút nổi trên desktop.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/PROJECT.md` — thông tin chi nhánh, hotline, fanpage, ràng buộc
- `.planning/REQUIREMENTS.md` — FND/NAV/HERO/SEO-05
- `.planning/ROADMAP.md` — Phase 1 success criteria
- `docs/YEU_CAU.md` — yêu cầu gốc, nguồn cho câu chữ hero
- `docs/MEDIA.md` — phân loại ảnh/video
- `.claude/CLAUDE.md` — stack, font, ảnh, Next 16 lưu ý (`preload` thay `priority`, `images.qualities`, Cache Components)
- `AGENTS.md` + `node_modules/next/dist/docs/` — đọc trước khi viết code Next.js
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `public/images/space/*` (6 ảnh), `public/images/brand/{logo-green,logo-red,banner-storefront}.jpg`

### Established Patterns
- Scaffold thuần: `src/app/layout.tsx` (Geist, `lang="en"`, title mặc định), `globals.css` (dark mode, Arial) — cần thay toàn bộ.
- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, Tailwind qua `@tailwindcss/turbopack` (giữ nguyên).

### Integration Points
- File nội dung duy nhất (vd. `src/content/site.ts`) cấp dữ liệu cho header, hero, nút nổi, `#dat-lich`, footer.
</code_context>

<specifics>
## Specific Ideas

- Cảm giác: nhẹ nhàng, tinh tế, hiện đại, thư giãn; ảnh tông be/gỗ/cây xanh.
</specifics>

<deferred>
## Deferred Ideas

- Logo SVG/PNG từ khách (thay JPG khi có).
- Xác nhận số Phú Nhuận có Zalo.
- Hero video (có thể cân nhắc sau Phase 5).
</deferred>

---

*Phase: 01-foundation-live-conversion-path*
*Context gathered: 2026-11-12*
