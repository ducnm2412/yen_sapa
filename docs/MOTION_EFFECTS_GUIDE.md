# Hướng dẫn cho AI: áp dụng hiệu ứng chuyển động vào website Yên Spa & Beaute

> Tài liệu này dành cho AI/dev sẽ code tiếp. Đọc hết trước khi sửa bất kỳ file nào.
> Nguồn: các prompt landing page mẫu (portfolio tối, agency "liquid glass", brand wellness "TerraElix") đã được
> lọc lại — **chỉ lấy kỹ thuật chuyển động**, không lấy nội dung, thương hiệu, màu, font hay asset của các mẫu đó.

---

## 0. Luật bắt buộc (đọc trước)

1. **Không thiết kế lại.** Giữ nguyên bố cục, bảng màu xanh rêu + be, font (Be Vietnam Pro + Cormorant Garamond),
   ảnh và nội dung hiện có. Không chuyển sang nền đen/dark theme, không đổi font sang Inter/Instrument Serif/Kanit/DM Sans.
2. **Không copy nội dung mẫu**: không dùng tên "Michael Smith", "TerraElix", "Aeon/Vela/Apex…", câu chữ tiếng Anh,
   số liệu ("20+ Years", "+14K", "140+ brands"), URL video/ảnh bên ngoài (mux.com, cloudfront, figma.site, higgs.ai…).
   Chỉ dùng ảnh/video trong `public/` và thông tin trong `src/content/site.ts`.
3. **Không bịa số liệu.** Hiệu ứng đếm số (counter) chỉ dùng khi khách cung cấp số thật.
4. **Stack cố định:** Next.js 16 App Router + TypeScript + Tailwind v4 (token trong `src/app/globals.css`, `@theme inline`)
   + **GSAP 3.15 + ScrollTrigger + `@gsap/react`**.
   - **Không cài** `framer-motion`/`motion`, `hls.js`, `react-router-dom`, `tailwindcss-animate`, Vite, Lenis/smooth-scroll.
   - Hiệu ứng nhỏ (hover, chuyển trạng thái) → CSS transition; hiệu ứng theo scroll/timeline → GSAP.
   - Đọc `node_modules/next/dist/docs/` trước khi viết code Next (xem `AGENTS.md`).
5. **Tiếng Việt có dấu:** mọi hiệu ứng tách chữ phải dùng mặt nạ có padding đủ cho dấu (ệ, ẫ, ử). Dùng component
   có sẵn `SplitWords` / `SplitChars` trong `src/components/motion/Split.tsx`. Không dùng `overflow:hidden` sát dòng.
6. **Mobile-first, khách đến từ Facebook in-app browser:** ảnh hero (LCP) không bao giờ bắt đầu ở `opacity:0`;
   mọi link liên hệ (`tel:`, Zalo, Messenger) phải hoạt động khi chưa có JS.
7. **Không loading screen chặn trang** (kiểu đếm 000→100 trong 2,7 giây). Khách cần thấy spa và bấm gọi ngay.
8. **Hỗ trợ `prefers-reduced-motion`:** khi bật thì nội dung hiện ngay, không chuyển động.
9. Sau khi sửa: `npx tsc --noEmit`, `npm run lint`, `npm run build` phải sạch; kiểm tra 360px không cuộn ngang.

---

## 1. Hệ thống có sẵn — dùng lại, đừng viết song song

File trung tâm: `src/components/motion/MotionSystem.tsx` (một `gsap.matchMedia`, tự cleanup, tự tắt khi reduced-motion).
Component server chỉ cần gắn **data-attribute**:

| Attribute | Tác dụng |
|---|---|
| `data-hero="logo|nav|eyebrow|heading|tagline|fade|cta|content"` | Trình tự mở màn hero |
| `data-hero-image`, `data-hero-parallax`, `data-hero-glow` | Ảnh hero mở mặt nạ + parallax + đốm sáng vàng |
| `data-reveal="fade-up"` | Mờ → rõ + trượt lên |
| `data-reveal="blur"` | Blur 12px → nét (BlurText) |
| `data-reveal="words"` | Từng từ trồi lên từ mặt nạ (con là `SplitWords`) |
| `data-reveal="chars"` | Từng ký tự (con là `SplitChars`) |
| `data-reveal="line"` | Đường kẻ chạy ra (scaleX) |
| `data-reveal="clip-up"` / `"clip-center"` | Ảnh mở từ dưới lên / từ giữa ra |
| `data-reveal="stagger"` | Các con hiện lần lượt |
| `data-delay="0.2"` | Trễ thêm (giây) |
| `data-parallax="40"` + con `data-parallax-inner` | Ảnh trôi chậm hơn scroll (mobile tự giảm 60%) |
| `data-bg-from="#f8f3ea"` | Section đổi màu nền khi cuộn vào |
| `data-draw` (trên `<path>`) | SVG tự vẽ nét theo scroll |
| `data-marquee` | Dải chữ chạy vô hạn, dừng khi khuất |
| `data-magnetic` | Nút hút theo chuột (chỉ desktop) |
| `data-scroll-progress` | Thanh tiến trình cuộn |

CSS liên quan trong `globals.css`: `.split-word`, `.split-inner`, `.split-char`, `.btn-shimmer`, `.nav-link`,
`.arrow-link`, `.service-card`, `.lift-card`, `.usp-card`, quy tắc ẩn trước `.js [data-reveal]`.

**Thông số chuẩn:** duration 0.6–1.4s · stagger 0.08–0.15s · ease `expo.out` / `power3.out`
(CSS: `var(--ease-luxe)` = `cubic-bezier(0.16,1,0.3,1)`) · reveal `start: "top 85%"`, `once: true`.
Không bounce, không elastic.

Thêm hiệu ứng mới = thêm một nhánh trong `MotionSystem` + một giá trị `data-*` mới, ghi vào bảng trên.

---

## 2. Danh mục hiệu ứng lấy từ các mẫu — đã chuyển đổi cho Yên

Mỗi mục: **Nguồn → Cách làm trong dự án này → Dùng ở đâu**. Trạng thái: ✅ nên làm · ⚠️ làm có điều kiện · ❌ không dùng.

### 2.1 Chữ

**✅ BlurText — từng từ blur → nét** (mẫu agency)
- Mẫu: mỗi từ `blur(10px)→0`, `opacity 0→1`, `y 50→0`, 0.7s, trễ 0.1s/từ, kích hoạt bằng IntersectionObserver.
- Làm: thêm biến thể `data-reveal="blur-words"` trong `MotionSystem`, target `.split-inner` của `SplitWords`,
  `{ autoAlpha:0, filter:"blur(10px)", yPercent:60 } → { autoAlpha:1, filter:"blur(0px)", yPercent:0, stagger:0.1, duration:0.9 }`.
- Dùng: tiêu đề phụ hoặc một câu trích dẫn thương hiệu. Không dùng cho mọi heading (đã có `words`).

**✅ Word reveal có từ “mờ” xen kẽ** (mẫu TerraElix: "The Power **of** / **Nature in** Every")
- Làm: trong `SplitWords`, cho phép truyền danh sách từ nhấn/nhạt; từ nhạt dùng `text-white/45` (trên nền tối) hoặc
  `text-moss-900/40` (nền be). Animation giữ `words`.
- Dùng: có thể áp cho tagline hero, ví dụ nhạt các từ "trong không gian". Kiểm tra tương phản phần chữ chính ≥ 4.5:1.

**✅ Chữ xoay vòng trong câu** (mẫu portfolio: "A {Creative/Fullstack…} lives in Chicago")
- Làm: client component nhỏ `RotatingWord` — `setInterval` 2–2.5s, mỗi lần đổi `key` để chạy CSS keyframe
  `role-fade-in` (opacity 0 + translateY(8px) → 1 + 0, 0.5s, `var(--ease-luxe)`). Dừng khi reduced-motion; có
  `aria-live="off"` và chữ đầy đủ cho screen reader (`sr-only`).
- Dùng: dòng phụ hero, ví dụ "Chăm sóc da **chuyên sâu / dịu nhẹ / đúng tình trạng**". Từ phải lấy từ nội dung thật.

**⚠️ Text fill theo scroll** (mẫu thứ 2, bị cắt: từng ký tự đổi từ mờ sang rõ theo `useScroll` offset `['start 0.8','end 0.2']`)
- Làm bằng GSAP: `SplitChars` + `gsap.fromTo(chars, {opacity:0.15}, {opacity:1, stagger:0.02, scrollTrigger:{start:"top 80%", end:"bottom 20%", scrub:true}})`.
- Dùng: tối đa **một** đoạn tuyên ngôn ngắn (mục Giới thiệu). Không dùng cho đoạn dài (mỗi ký tự là một span).

### 2.2 Nút & điều hướng

**✅ Viền gradient khi hover** (mẫu portfolio: `.accent-gradient` ring, `inset:-2px`)
- Làm: class `.btn-ring` — `::before` `inset:-1.5px; border-radius:inherit; background:linear-gradient(90deg,var(--color-gold-500),var(--color-gold-300)); opacity:0; transition:opacity .5s`, `z-index:-1`; hover → `opacity:1`.
  Màu **vàng champagne**, không dùng xanh dương `#89AACC/#4E85BF` của mẫu.
- Dùng: nút viền ("Gọi ngay", "Chỉ đường").

**✅ Viền gradient chuyển động** (`@keyframes gradient-shift` 6s, background-position 0%→100%→0%)
- Làm: chỉ trên hover hoặc một badge duy nhất; `background-size:200% 100%`. Dừng khi reduced-motion.

**✅ Hover scale nhẹ cho nút** (`hover:scale-105`) — hiện dùng hút chuột; có thể cộng `hover:scale-[1.03]` cho nút chính.

**✅ Navbar dạng “viên thuốc” nổi + đổ bóng khi cuộn** (`shadow-md` khi `scrollY > 100`)
- Header hiện đã trong suốt → nền be khi cuộn. Không đổi sang pill (đổi bố cục). Chỉ có thể thêm bóng mềm khi cuộn.

**✅ Mục menu đang xem (active)** (mẫu: active = nền `bg-stroke/50`)
- Làm: `ScrollTrigger` cho mỗi section → set `aria-current="true"` cho link tương ứng; CSS `.nav-link[aria-current]::after{transform:scaleX(1)}`.

**❌ Page transition / react-router:** trang chỉ có một route.

### 2.3 Hero

**⚠️ Video nền mờ dần vào/ra (FadingVideo)** (mẫu agency)
- Mẫu: video bắt đầu `opacity:0`, `loadeddata` → fade-in 500ms; còn ≤0.55s thì fade-out; hết thì replay.
- Làm: client component `FadingVideo` dùng **file MP4 đã nén trong `public/videos/`** (≤ 4–6 MB, 720p, `+faststart`),
  `autoPlay muted loop playsInline preload="metadata"` + `poster`. **Ảnh hero tĩnh vẫn nằm dưới** làm LCP; video fade
  đè lên khi sẵn sàng. Không autoplay khi reduced-motion hoặc `navigator.connection.saveData`.
- Chỉ làm sau khi nén video (roadmap Phase 5). Không dùng HLS/mux.

**✅ Chỉ báo “Cuộn xuống”** (mẫu portfolio: chữ "SCROLL" + vạch 1px có điểm sáng chạy `scroll-down` 1.5s)
- Làm: ở đáy hero, chữ "Cuộn" `text-xs tracking-[0.3em] uppercase text-beige-100`, vạch `w-px h-10 bg-white/20`
  với span con chạy `translateY(-100%)→translateY(200%)` vô hạn. Ẩn trên mobile nếu đè thanh liên hệ đáy.

**✅ Thẻ/nhãn kính mờ “liquid glass”** (mẫu agency)
- Làm: class `.glass` trong `globals.css`: `background:rgb(255 255 255/0.06); backdrop-filter:blur(12px)`;
  `::before` viền gradient bằng mask `content-box` + `mask-composite:exclude` (đúng như mẫu).
- Dùng: **chỉ trên nền ảnh tối của hero**, ví dụ một nhãn "Mở cửa 09:00–21:00 mỗi ngày". Không phủ khắp trang.
  Có fallback nền đặc khi trình duyệt không hỗ trợ `backdrop-filter`.

**❌ Loading screen đếm 000→100:** vi phạm luật 7.

### 2.4 Thẻ & lưới ảnh

**✅ Overlay khi hover thẻ** (mẫu bento: `bg/70 + backdrop-blur-lg` mờ dần, nhãn "View — Title")
- Làm: trong thẻ dịch vụ, lớp `absolute inset-0 bg-moss-900/55 backdrop-blur-sm opacity-0 group-hover:opacity-100`
  + nhãn pill "Xem liệu trình" trượt lên. Chỉ khi `@media (hover:hover)`; trên mobile luôn hiện nút như hiện tại.

**⚠️ Halftone overlay** (`radial-gradient(circle,#000 1px,transparent 1px)` 4×4px, `mix-blend-multiply`, opacity .2)
- Dễ làm ảnh spa trông bẩn; chỉ thử trên ảnh không gian ở trạng thái hover, opacity ≤ 0.1. Mặc định không dùng.

**✅ Lưới bento xen kẽ 7/5/5/7** — chỉ nếu một section mới cần (ví dụ ảnh khách hàng Phase 4). Không đổi lưới hiện tại.

**✅ Carousel tự xoay trong ô nhỏ** (mẫu TerraElix: 4 thẻ đổi mỗi 3,5s, fade + translateY(16px), thanh chỉ báo mảnh)
- Làm: client component; dừng khi khuất màn hình (IntersectionObserver), khi hover/focus, và khi reduced-motion;
  có nút/thanh để chọn tay; `aria-live="polite"`.
- Dùng: 4 điểm khác biệt (USP) trên mobile **nếu** muốn gọn hơn; desktop giữ lưới 4 cột.

### 2.5 Cuộn

**⚠️ Gallery parallax có ghim (pinned center + 2 cột trôi)** (mẫu portfolio `min-h-[300vh]`, `pin`, `pinSpacing:false`)
- Đổi bố cục mục Không gian → chỉ làm khi khách đồng ý. Nếu làm: chỉ desktop (`gsap.matchMedia("(min-width:1024px)")`),
  mobile giữ lưới; chiều cao ≤ 200vh; `invalidateOnRefresh:true`; kiểm tra cuộn ngược và không có khoảng trống.

**✅ Marquee** — đã có (`data-marquee`, 40s, dừng khi khuất). Có thể thêm một marquee mảnh trên nền footer
  (ví dụ "An yên • Chăm sóc da • Quận 3 • Phú Nhuận •"), chữ Việt, `aria-hidden`.

**✅ Thanh tiến trình** — đã có, màu vàng champagne. Mẫu dùng thêm `box-shadow: 0 0 8px` glow → có thể thêm `0 0 8px rgb(216 192 138/.4)`.

**✅ Video nền lật ngược ở footer** (mẫu: cùng video hero, `scale-y-[-1]`, overlay `bg-black/60`)
- Chỉ sau Phase 5, dùng cùng file video đã nén, `preload="none"`, chỉ mount khi gần viewport.

### 2.6 Entrance kiểu CSS (mẫu TerraElix)

Các keyframe `fadeUp`, `fadeIn`, `slideInLeft/Right`, `scaleIn`, `wordReveal` + class delay `.delay-200…1100`.
Dự án này dùng **GSAP timeline** cho hero, nên **không** thêm bộ class này song song. Ngoại lệ hợp lệ: phần tử cần
chạy được **không cần JS** (như thanh liên hệ đáy đang dùng `.animate-rise-in`) — khi đó dùng CSS keyframe với
`var(--ease-luxe)` và `animation-fill-mode: both`, bọc trong `@media (prefers-reduced-motion: no-preference)`.

---

## 3. Không dùng (tóm tắt)

| Hiệu ứng mẫu | Lý do |
|---|---|
| Dark theme `#000/#0C0C0C`, font Inter/Kanit/Barlow/DM Sans/Instrument Serif | Đổi nhận diện thương hiệu |
| Loading screen đếm số | Chặn khách gọi/đặt lịch ngay |
| hls.js + video mux/cloudfront | Asset bên ngoài, không phải của khách |
| Stats giả (20+, 95+, 200%, +14K, 140+) | Không có số thật |
| Logo đối tác giả (Aeon, Vela…) | Bịa nội dung |
| framer-motion, react-router, tailwindcss-animate | Đã thống nhất GSAP, một trang |
| Smooth-scroll toàn trang | Xung đột scroll gốc, tệ trên in-app browser |
| Custom cursor | Không hợp cảm ứng; chỉ cân nhắc desktop nếu khách muốn |

---

## 4. Checklist khi thêm một hiệu ứng

- [ ] Có trong mục 2 với trạng thái ✅ (hoặc ⚠️ và điều kiện đã thỏa)
- [ ] Dùng token màu/font hiện có; vàng champagne chỉ cho ánh sáng/viền/hover
- [ ] Chỉ animate `transform`, `opacity`, `clip-path`, `filter` (blur nhỏ); không animate width/height/top/left
- [ ] Tạo trong `MotionSystem` (hoặc client component riêng có `useGSAP`) → tự cleanup
- [ ] Hiệu ứng lặp vô hạn dừng khi khuất màn hình
- [ ] Reduced-motion: nội dung hiện ngay; không JS: nội dung và link liên hệ vẫn dùng được
- [ ] Mobile: giảm biên độ, không hover-only cho thông tin quan trọng
- [ ] Chữ tiếng Việt không bị cắt dấu
- [ ] `tsc`, `lint`, `build` sạch; 360px không cuộn ngang; không lỗi console; cuộn ngược tự nhiên
