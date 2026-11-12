# Domain Pitfalls

**Domain:** Vietnamese spa / skincare one-page landing page (Next.js 16.4.6 App Router, Tailwind 4, Vercel), mobile-first, traffic mostly from the Facebook in-app browser, no backend
**Project:** Yên Spa & Beaute
**Researched:** 2026-11-12
**Overall confidence:** MEDIUM-HIGH. Items marked (V) were verified against the bundled Next 16.4.6 docs, current Vercel docs, or measured on the repo's files. Items marked (E) come from established web-platform behavior or experience and should be re-tested on real devices.

## How to read the phase mapping

No roadmap exists yet, so pitfalls map to these provisional phases. The roadmapper should rename them but keep the dependencies.

| Tag | Provisional phase |
|-----|-------------------|
| P1 | Foundation: scaffold cleanup, fonts, design tokens, media pipeline (compress, poster, naming) |
| P2 | Content sections: hero, brand, services, USP, gallery, team |
| P3 | Conversion layer: booking form, floating contact bar, deep links, maps, contact section |
| P4 | Hardening: SEO/JSON-LD, analytics, accessibility, performance audit |
| P5 | Deploy and launch: Vercel plan, domain, OG cache, real-device QA |

---

## Critical Pitfalls

Mistakes that cause rewrites, lost customers, or legal/commercial exposure.

### Pitfall 1: The "success" message after a form that sends nothing (the form is a lie)
**What goes wrong:** The visitor types name, phone, service, branch and time, presses submit, and sees "Đặt lịch thành công". No one at the spa receives anything. The customer waits for a confirmation call that never comes, then blames the spa. The spa believes the website produces no leads because it never sees any. PROJECT.md's own success metric ("số lượt đặt lịch / liên hệ đến từ website") cannot be measured by a form that discards data.
**Why it happens:** The requirement says "chỉ hiển thị thông báo thành công, không lưu/gửi dữ liệu", and it was taken literally. The spa currently takes bookings by hotline and Fanpage messages, so the owner may not realize a silent form is worse than no form. This is a Key Decision still marked "Pending", and the project is explicitly "bản chính thức", not a demo.
**Consequences:** Lost bookings, reputation damage, and a deceptive-UX liability for the developer. Collecting a phone number with no data-handling notice also touches Vietnam's personal-data decree (Decree 13/2023/NĐ-CP, E). The client may drop the site after the first angry customer.
**Prevention:**
1. Escalate this as a decision to the client before P3. Cheapest honest fixes, none of which needs a custom backend:
   - Form hand-off. On submit, build a summary ("Họ tên, SĐT, dịch vụ, chi nhánh, giờ mong muốn"), copy it to the clipboard, and show "Bước cuối: gửi thông tin cho Yên qua Zalo / Messenger / gọi" with big buttons. Copy must say the booking is not yet sent.
   - Or a no-server form service (Formspree, Web3Forms, or a Google Apps Script posting to a Sheet) plus an owner notification. This contradicts the current Out of Scope line, so it needs explicit client sign-off.
2. If the client insists on the no-send form, the success copy must be truthful. Do not write "đã đặt lịch thành công" or "chúng tôi sẽ liên hệ lại". Use something like "Thông tin đã được ghi nhận trên thiết bị của bạn. Vui lòng gọi hoặc nhắn Zalo để Yên xác nhận lịch." followed by the call and Zalo buttons.
3. Record the decision in PROJECT.md Key Decisions, including who accepted the risk.
**Detection:** Read the success-state string in the code. If it promises a callback or confirmation, the pitfall is present. Ask the owner "how will you find out someone booked?" If the answer is "I won't", stop.
**Phase:** P3, with the client decision gate in P1.

### Pitfall 2: Raw 186 MB of video committed to git and shipped to phones
**What goes wrong:** `public/videos/` is 186 MB across 11 files. The largest is `facial-head-spa.mp4` at 66 MB, and four more are 17-23 MB (V: measured on disk). It is still untracked (`?? public/`). Three separate failures follow:
1. If committed as-is, the blobs stay in git history forever. Compressing later does not remove them, so every clone and Vercel build keeps downloading ~186 MB. GitHub warns above 50 MB per file.
2. Putting all videos in the page costs mobile users data and time. Vertical 1080×1920 video at roughly 8 Mbps (66 MB / 145 s) is far above what a 390 px wide phone needs.
3. Hobby-plan limits: static file uploads cap at 100 MB, and Fast Data Transfer allows 100 GB per month (V). A Facebook campaign with 3,000 visitors each pulling a 20 MB clip is 60 GB. Hobby projects get paused when over limit.
**Why it happens:** Media was dropped in as-is and compression is only a "should" in MEDIA.md.
**Consequences:** Slow LCP, burned mobile data (Vietnamese Facebook audiences are data-conscious), deployment friction, and possible pause during the spa's first promotion.
**Prevention:**
- Compress before the first git commit, so no raw video enters history. Keep the raw originals outside the repo (Drive, or a gitignored `_source/` folder).
- Budgets:
  - hero loop <= 1.5 MB (strip audio)
  - section clips <= 4-6 MB
  - nothing over ~8 MB self-hosted
- Targets with ffmpeg (E): H.264 High, 720x1280 max, CRF 26-28 or ~1.2-1.8 Mbps, `-movflags +faststart`, `-an` for muted clips, AAC 96 kbps only where sound matters. Optionally add a WebM/VP9 `<source>` for Chrome and Firefox.
- Do not self-host videos longer than ~30 s. The 2:25, 1:29, 1:30, 1:47 and 1:58 clips should be cut to 15-30 s highlights, or linked out to the Facebook Reel or YouTube.
- Drop `body-acupressure-lowres.mp4` or `body-acupressure.mp4` after confirming they are duplicates. Both have the same 1:47 duration, so compress one and discard the other.
- Generate a `poster` JPG/WebP for every video from a representative frame. Without one, `preload="none"` shows a black box.
- If the video set grows, move to Vercel Blob or Cloudflare R2 and keep only posters in the repo.
**Detection:** `du -sh public/videos` above ~25 MB total, any file over 8 MB, Lighthouse "Avoid enormous network payloads", or `git count-objects -vH` growing fast.
**Phase:** P1 (the pipeline and budget must exist before any section uses video). Revisit in P4.

### Pitfall 3: Hobby plan on a commercial client site
**What goes wrong:** The spa site is deployed under a Vercel Hobby account. Vercel's fair-use rules say Hobby is non-commercial personal use only, and that commercial usage includes "advertising the sale of a product or service" and "receiving payment to create, update, or host the site" (V). A spa landing page that advertises services, built for a paying client, falls inside that definition.
**Why it happens:** "Deploy Vercel" reads as "free tier".
**Consequences:** The deployment can be paused or removed at the worst moment (a campaign), and the client carries a hosting-terms violation.
**Prevention:** Decide in P5, preferably earlier, who owns the Vercel account. Options: the client's own Pro team, the agency's Pro team, or move to a host that permits commercial static hosting (Cloudflare Pages, Netlify). Budget Pro in the client's cost. If videos are on Pro, the 1 GB static upload limit and Flat Rate CDN remove most size anxiety, but the compression discipline in Pitfall 2 still applies for the visitor's sake.
**Detection:** The project sits in a personal Hobby scope, not a team.
**Phase:** P5 (ask in P1 so the client can budget).

### Pitfall 4: Vietnamese glyphs missing from the chosen fonts (and clipped by tight line-height)
**What goes wrong:** Words render with fallback glyphs for ê, ơ, ư, ệ, ấ and similar. Headings look broken, with mixed fonts inside a single word. Or the font looks right but stacked diacritics (ệ, ằ, ẫ, Ể) are clipped by `leading-none`/`leading-tight`, `overflow-hidden` reveal animations, or fixed-height line boxes.
**Why it happens:**
- The starter `layout.tsx` loads fonts with `subsets: ["latin"]` only (V: it is in the repo now). Without `"vietnamese"`, the Vietnamese unicode-range is never downloaded, even for fonts that cover it.
- Elegant spa serif/display faces often lack Vietnamese entirely. Per the font metadata shipped in Next 16.4.6 (V): **Bellefair, DM Serif Display, Marcellus and Gilda Display have no `vietnamese` subset**. Playfair Display, Cormorant Garamond, Lora, Fraunces, Be Vietnam Pro, Nunito, Quicksand, Montserrat, Manrope, Inter and Geist all do.
- Designers (and AI mockups) test headings with English placeholders.
**Consequences:** Brand-damaging typography on the hero headline, which is the first thing the customer reads.
**Prevention:**
- Choose fonts from the verified list. A strong pairing is Cormorant Garamond or Playfair Display (headings) with Be Vietnam Pro or Nunito Sans (body).
- Set `subsets: ["latin", "vietnamese"]` on every `next/font/google` call, and `lang="vi"` on `<html>`.
- Remove the unused Geist Mono (and Geist, if unused). Each extra family adds requests.
- Build a "Vietnamese stress string" test block and view it in every font and weight in use: `Ắ Ằ Ẳ Ẵ Ặ Ế Ề Ể Ễ Ệ Ố Ồ Ổ Ỗ Ộ Ớ Ờ Ở Ỡ Ợ Ứ Ừ Ử Ữ Ự Ỷ Ỹ Ỵ đ Đ`. Headings need `line-height` of about 1.2 or more. Keep reveal animations from using `overflow: hidden` with tight boxes.
- Confirm that the specific weights and italics used exist with Vietnamese in the chosen family.
- Normalize all copy to Unicode NFC. Text pasted from macOS or Facebook can be decomposed (NFD), which breaks some fonts' shaping and makes copied phone-book or search text mismatch.
**Detection:** Any word where one letter looks like a different typeface, or diacritics touching the line above, or `<html lang="en">`.
**Phase:** P1 (decide fonts and tokens first), re-verified in P2.

### Pitfall 5: Hero and floating CTAs that fail on the Facebook in-app browser and iOS
**What goes wrong:** Most visitors arrive from Facebook, inside its in-app browser, on iPhone or mid-range Android. The page is built and tested only on desktop Chrome. Then the video hero is a black rectangle on iOS, taps on `zalo.me` or `tel:` do nothing or open a confusing sheet, and the sticky bar hides behind the iOS toolbar.
**Why it happens:** Real-device and in-app-browser testing is skipped. Autoplay rules differ by platform.
**Specific failure modes (E, verify on devices):**
- iOS Safari only autoplays video that is `muted` and `playsInline`. React does not reliably emit the `muted` attribute in server-rendered HTML (long-standing React issue). Set `video.muted = true` through a ref or `useEffect` before calling `play()`, and call `play()` and handle the rejected promise.
- iOS Low Power Mode and Data Saver block autoplay even when everything is correct. Always ship a poster and a visible play control. Never leave a blank frame.
- Many videos on one page: iOS decodes only a few at once and `preload="auto"` on 11 files will stall. Use `preload="none"` (or `metadata`), attach `src` when the clip nears the viewport, and pause the others when one plays.
- A fully autoplaying video for more than 5 s needs a pause control (WCAG 2.2.2) and must honor `prefers-reduced-motion` by showing the poster only.
- `100vh` heroes jump when the iOS toolbar collapses. Use `svh`/`dvh`.
- Fixed bottom bars need `padding-bottom: env(safe-area-inset-bottom)` and `viewport-fit=cover`, otherwise they collide with the iOS home indicator. While the on-screen keyboard is open in the form, a fixed bar can cover the focused input.
**Consequences:** The hero looks broken on most of the audience's phones, and the core value ("đặt lịch được ngay bằng một chạm") fails at the one-tap moment.
**Prevention:** The default hero is a poster image (lobby) with the 9 s `facial-mask-short` loop layered on top only when autoplay succeeds. A real-device checklist in P5: iPhone Safari, iPhone Facebook in-app, iPhone Low Power Mode, Android Chrome, Android Facebook in-app, Zalo in-app browser.
**Detection:** The video element's `play()` promise rejects, or the page looks different when opened from a Facebook link versus typed into Safari.
**Phase:** P2 (hero), P3 (floating bar), P5 (device matrix).

### Pitfall 6: Wrong or untested contact deep links (Zalo, tel, Messenger)
**What goes wrong:** The "Zalo" button opens a dead page or shows a QR code on desktop, the call button does nothing on desktop, and the Messenger link 404s. Worse, one button points to the wrong branch's number.
**Why it happens:**
- There are two branches with two hotlines (0899 607 279 and 0896 407 578). `YEU_CAU.md` lists the Zalo number as 089 960 72 79, which matches only branch 1. Nothing says branch 2 has Zalo. A single floating "Gọi / Zalo" button therefore has an unresolved target.
- Zalo links require the number to be registered on Zalo and discoverable by phone search. A privacy setting on the owner's account can break `https://zalo.me/<number>` for strangers.
- `tel:` should use E.164 (`tel:+84899607279`) for consistency. Desktop browsers often have no handler.
**Consequences:** The one-tap conversion path, the project's Core Value, silently fails for part of the audience.
**Prevention:**
- Ask the client to confirm in P1: which number is primary, which numbers are on Zalo, and the Messenger handle. Use `https://m.me/SpabeauteYenhcm` (derived from the Fanpage URL) and test it.
- With two branches, the floating bar uses one primary action ("Gọi ngay") and, on tap, either calls the primary hotline or opens a tiny two-branch chooser. Per-branch call and Zalo buttons live in the contact section.
- Always render the number as visible text next to the icon, so desktop users can read and copy it. Do not rely on `tel:` for desktop. Use `target="_blank" rel="noopener"` for Zalo and Messenger.
- Test every link from the Facebook in-app browser, not just Safari.
- Add `<meta name="format-detection" content="telephone=no">` and link numbers explicitly, to stop iOS auto-linking addresses and numbers in odd places.
**Detection:** Tapping each button on a real phone and desktop. Any button that is a no-op on desktop without visible fallback text.
**Phase:** P1 (client confirmation), P3 (build and test).

### Pitfall 7: No analytics, so the success metric is unmeasurable
**What goes wrong:** The spa asks "does the website bring customers?" and there is no answer. The form discards data, and `tel:`, Zalo and Messenger taps leave no trace.
**Why it happens:** Analytics is not in PROJECT.md's Active list, and "no backend" gets mistaken for "no tracking".
**Consequences:** The stated success metric is impossible to report, the Facebook ad spend can't be optimized, and the project looks like a failure by default.
**Prevention:** Add analytics in P4: click events on every CTA (call, Zalo, Messenger, directions, form submit and hand-off click), per-branch labeling, and UTM capture from Facebook ads. Options are Vercel Web Analytics, GA4, or the Meta Pixel (the traffic is Facebook, so Pixel is usually what the owner wants). Check plan limits for custom events before relying on any one tool (E). Add a short cookie/privacy line if a pixel is used.
**Detection:** Look at what the client will see one month after launch. If there is no number, the metric is unmeasurable.
**Phase:** P4 (design the event names in P3 so the buttons are instrumented as they are built).

---

## Moderate Pitfalls

### Pitfall 8: `cacheComponents` is already on, and `new Date()` breaks the prerender
**What goes wrong:** The scaffolded `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. In Next 16 with cache components, synchronous IO such as `new Date()`, `Math.random()` and `crypto.randomUUID()` fails the prerender, and `instant = false` does not clear it (V: the migration guide). A booking form that sets `min={today}` on the date input, an "Đang mở cửa" badge, or a shuffled testimonial list will fail `next build` or cause a hydration mismatch.
**Prevention:**
- Make an explicit decision in P1: for a fully static landing page, remove `cacheComponents` and `partialPrefetching` unless something needs them. They add rules without benefit here.
- If kept, compute time only on the client after mount (`useEffect`), or inside a `<Suspense>` boundary around a leaf client component.
- Never compute "today" or "open now" at build or render time on the server. Vercel servers run in UTC, 7 hours behind Vietnam, and ISR or static output would freeze the value. Use `Intl.DateTimeFormat` with `timeZone: "Asia/Ho_Chi_Minh"` on the client.
**Detection:** `next build` errors mentioning the current time, or a React hydration warning about text content.
**Phase:** P1 (config decision), P3 (form date and time).

### Pitfall 9: Hydration mismatches and a bloated client bundle
**What goes wrong:** Console warnings about hydration, content flashing, or `"use client"` placed at the top of the whole page because one section uses an animation library.
**Causes (E):** `window` or `matchMedia` checks used to render mobile versus desktop markup, time and random values, invalid HTML nesting (`<a>` inside `<a>`, `<div>` inside `<p>`), browser extensions, and the `muted` attribute quirk from Pitfall 5.
**Prevention:**
- Keep section components as Server Components. Push `"use client"` to leaves: the video player, the form, the floating bar, the gallery lightbox.
- Switch layouts with CSS (Tailwind breakpoints), not JavaScript.
- Avoid scroll-reveal that starts at `opacity: 0` on above-the-fold content. It delays LCP, and the text is invisible until hydration. Use CSS animations, apply `whileInView` only below the fold, and respect `prefers-reduced-motion`.
- Treat any hydration warning in dev as a bug to fix, not noise.
**Phase:** P2, audited in P4.

### Pitfall 10: Booking form UX bugs that cost real conversions on mobile
**What goes wrong:** iOS zooms into inputs, phone numbers are rejected, dates are in the past or outside opening hours, and labels disappear.
**Prevention (E):**
- Inputs must be `font-size: 16px` or more to stop iOS auto-zoom.
- Phone field: `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`. Validate Vietnamese mobile numbers permissively: strip spaces, dots and dashes, accept `0` or `+84` or `84` prefixes, then `^0(3|5|7|8|9)\d{8}$` after normalization. Overly strict regexes reject real customers.
- Date and time: opening hours are 09:00-21:00 every day. Enforce the time window, reject past times (client-side, Asia/Ho_Chi_Minh), and remember `type="date"` and `type="time"` look and behave differently on iOS versus Android. A select of time slots (09:00, 09:30 ...) is more predictable.
- Visible labels, not placeholder-only. Errors in Vietnamese, tied to fields with `aria-describedby` and `aria-invalid`. The success message uses `role="status"`.
- Make Branch and Service selects use native `<select>` for mobile pickers.
- Keep required fields to the minimum: name, phone, branch. Service and time optional. Every extra field loses conversions.
**Phase:** P3.

### Pitfall 11: Google Maps embeds that are heavy, broken, or point at the wrong place
**What goes wrong:**
1. The provided link `https://maps.app.goo.gl/81RXAydeguzGpkzF7` is a short share link. Short links cannot be used as an iframe `src`. You need the "Embed a map" `google.com/maps/embed?pb=...` URL from Google Maps share, and only one branch's link has been provided.
2. Two always-loaded iframes add heavy third-party JavaScript and cookies, hurt Lighthouse and mobile data, and stall low-end phones.
3. A broken map shows an empty grey box.
**Prevention:**
- Get both branches' embed URLs (or place IDs) from the client in P1.
- Load maps lazily: `loading="lazy"` with a fixed `aspect-ratio`, or better, a facade (a static preview image plus a "Xem bản đồ" button that swaps in the iframe).
- Always provide a "Chỉ đường" button using a plain directions link (`https://www.google.com/maps/dir/?api=1&destination=<address or place_id>`), which works in any browser and opens the Maps app. On mobile this is more useful than the embed anyway.
- Give each iframe a `title` attribute.
**Detection:** Lighthouse flags third-party code in the contact section, or the map area is blank.
**Phase:** P3.

### Pitfall 12: Local SEO done as decoration, with wrong or fake structured data
**What goes wrong:** A single generic `LocalBusiness` block with placeholder data, the wrong type, one entity for two locations, an invented `aggregateRating`, a `localhost` Open Graph URL, or a Facebook share showing a tiny cropped red square.
**Specifics:**
- Use `HealthAndBeautyBusiness` (or its subtype `DaySpa` or `BeautySalon`). Model two branches as two entities, each with its own `address`, `telephone` (`+84...`), `geo`, `openingHoursSpecification` (09:00-21:00 all 7 days) and `url`, linked by `parentOrganization` or `branchOf`.
- Never mark up ratings or reviews you do not own or cannot display. Self-serving review markup violates Google's guidelines.
- Address wording: the post-2025 ward names ("Phường Bàn Cờ", "Phường Cầu Kiệu", TP.HCM) differ from what customers still say ("Quận 3", "Phú Nhuận") (E: confirm against the client's Google Business Profile). Use the exact address string as it appears on the Google Business Profile for NAP consistency, and include "Quận 3" and "Phú Nhuận" in visible copy so locals find it.
- Next's JSON-LD guidance is a plain `<script type="application/ld+json">`, and `JSON.stringify` output needs `<` replaced with `<` (V: the bundled Next docs). Validate with the Rich Results Test and the Schema Markup Validator.
- Set `metadataBase` in the root layout (V), otherwise OG URLs resolve wrongly. Add `app/robots.ts` and `app/sitemap.ts`. Set the canonical URL. Set `openGraph.locale: "vi_VN"`.
- The OG image must be 1200x630. The only logo files are 500x500 squares, so make a proper OG image from the lobby photo. Facebook caches the first scrape, so re-scrape in the Sharing Debugger after launch.
- A one-page site cannot rank separate services. Do not expect it to. The real local-SEO lever is the Google Business Profile, kept consistent with the site. Text baked into images (the banner and the poster) is not indexable, so repeat all addresses, hours and service names as real HTML.
- Keep exactly one `<h1>`, with a sensible heading outline.
- `*.vercel.app` stays indexable next to the custom domain unless canonical tags point to the custom domain.
**Phase:** P4. Gather NAP and domain data in P1.

### Pitfall 13: Low contrast on the soft green and beige palette
**What goes wrong:** The calm, airy aesthetic produces text and buttons that fail WCAG AA. Measured contrast ratios (V, computed):

| Combination | Ratio | Verdict |
|-------------|-------|---------|
| White on sage `#8FAF8A` | 2.42:1 | Fails (needs 4.5 for text) |
| White on `#7A9A7E` | 3.11:1 | Fails for body text, passes only for large text |
| White on `#5E8466` | 4.23:1 | Just fails |
| White on `#4A7358` | 5.41:1 | Passes |
| Sage `#8FAF8A` text on beige `#F5EFE6` | 2.12:1 | Fails |
| Mid-grey `#9A9A8A` text on beige | 2.50:1 | Fails |
| Deep green `#2F4A3A` on beige | 8.50:1 | Passes comfortably |
| White on burgundy `#6B1F2A` | 11.32:1 | Passes |

**Prevention:**
- Define the palette as tokens in P1 with a contrast rule: sage and light beige are for backgrounds and decoration only. Text, links and primary buttons use a deep green (about `#2F4A3A` to `#4A7358`) or the brand burgundy.
- The brand logo is burgundy. A burgundy "Đặt lịch" button on beige is both on-brand and high contrast.
- Text over photos and video needs a gradient scrim. Check it against the lightest region of the image, not the average.
- Placeholder text, disabled states and focus rings must meet 3:1. Do not remove `:focus-visible` outlines.
- Touch targets 44-48 px, with spacing between the floating buttons (WCAG 2.2 target size minimum is 24 px, so go well above it).
- Add `alt` text in Vietnamese for meaningful images, empty `alt` for decoration, `title` on iframes, and captions or a text alternative for videos that carry spoken or burned-in text.
**Detection:** Run an automated contrast check (axe, Lighthouse) and check by eye on a phone at low brightness outdoors.
**Phase:** P1 (tokens), P4 (audit).

### Pitfall 14: Images that are optimized by default but still wrong
**What goes wrong:** The 19 images total only 2.8 MB, so size is not the problem. The problems are cropping, sharpness and Next 16 behavior changes.
- Most photos are 1080x1080 square sources. Stretching one to a full-bleed 1440-1920 px desktop hero makes it soft. Design the hero so the photo is not upscaled past its natural width, for example a split layout, a framed image, or a blurred extension of the same photo.
- `consultation-small.jpg` is 206x206 and goes blurry above about 100 CSS px.
- `banner-storefront.jpg` (1942x809) has addresses and hours baked into pixels. Cropped on mobile they become unreadable, and screen readers and Google never see them.
- Next 16 changes (V from the bundled docs): `priority` is deprecated in favor of `preload`. `qualities` now defaults to `[75]`, so `quality={90}` is silently coerced to 75 unless you list it in `next.config`. Local images with query strings need `images.localPatterns`.
- Missing `sizes` on a `fill` image makes the browser assume 100vw and download the largest candidate on mobile.
- Logos are JPG squares on a solid colored background, not transparent. A red square dropped into a beige header looks like a pasted block. Ask the client for SVG or transparent PNG, or design the header to host the red tile deliberately. Also, the favicon: the starter `src/app/favicon.ico` is the Next.js default and a 500 px wordmark is unreadable at 16 px, so create a simplified mark. Provide `icon` and `apple-icon` (180 px).
**Prevention:** Put `preload` on exactly one LCP image (hero). Set `sizes` on every responsive image. Give every image fixed dimensions or an aspect ratio to avoid layout shift. Rebuild baked-in text as HTML.
**Phase:** P1 (assets, favicon), P2 (layout).

### Pitfall 15: Videos in `public/` get no long-term caching headers
**What goes wrong:** Next serves `public/` files with `Cache-Control: public, max-age=0` (V, bundled docs). Browsers revalidate every video on every visit, and range-request seeking can re-download. This wastes bandwidth precisely where the heaviest files live.
**Prevention:** Add `headers()` in `next.config.ts` for `/videos/:path*` and `/images/:path*` with `public, max-age=31536000, immutable`, and put a version or content hash in the filename (`facial-mask-v2.mp4`) whenever a file is replaced. Make sure `Accept-Ranges` works (it does on Vercel static), because iOS requires byte-range support to play video.
**Phase:** P1 (config), P5 (verify headers on the deployed URL).

### Pitfall 16: Customer faces and health-like claims published without confirmation
**What goes wrong:** Several assets show real customers: `treatment-area.jpg` (customers behind curtains) and the 1:25 `acne-treatment.mp4` with a male customer's extraction. Publishing identifiable customers in marketing without their consent is a privacy and image-rights risk (E). Separately, copy like "điều trị mụn, thâm, nám", "nâng cơ – chống chảy xệ" and "triệt tiêu cơn đau" reads as medical treatment or a guaranteed result. Vietnamese regulators have fined spas under Decree 38/2021/NĐ-CP for advertising medical services without a medical license (the bundled search found news reports of fines of tens of millions of VND; this is not legal advice, MEDIUM confidence, and the exact wording rules were not verified).
**Prevention:**
- Ask the client to confirm customer consent for faces in the media, or crop or blur, or skip those clips. Prefer the 9 s mask clip and the LED device clip over the extraction clip.
- Soften copy to "chăm sóc", "cải thiện", "hỗ trợ" rather than "điều trị" and "chữa", and avoid promising outcomes or before and after claims. The brand's own requirement lists "Điều trị mụn, thâm và nám" as a service, so raise this with the client and let them decide with their license in mind.
- Resolve the brand-name inconsistency: media shows "Yên Skinlab", "Usha.beauté" and "Yên Spa & Skinlab" alongside "Yên Spa & Beaute". Confirm which names the site should use before copywriting.
- Do not publish the three Tết-frame team photos as primary content (already noted in MEDIA.md). They date the site as seasonal.
**Phase:** P1 (client questions), P2 (copy and media selection).

---

## Minor Pitfalls

### Pitfall 17: Starter boilerplate left in place
**What goes wrong:** The scaffold still has `lang="en"`, the title "Create Next App", the default favicon, Geist Mono, and the Vercel/Next template page. Easy to ship by accident.
**Prevention:** First task in P1: set `lang="vi"`, real `metadata`, remove unused fonts and assets. Add a pre-launch grep for "Create Next App" and "next.svg".
**Phase:** P1.

### Pitfall 18: Custom domain, `.vn` timing and canonical URLs undecided
**What goes wrong:** The client has no existing website and no domain is mentioned. Canonical URLs, sitemap, OG URL, JSON-LD `url` and the Facebook share all depend on the final domain. A `.vn` domain can take days for registration and documents (E).
**Prevention:** Ask for the domain choice early, wire it through one `SITE_URL` env constant, and start the registration in P1.
**Phase:** P1 (decision), P5 (DNS).

### Pitfall 19: Fixed floating bar blocks content and the footer
**What goes wrong:** A bottom-fixed bar covers the last lines of the footer or the submit button, and stacks awkwardly with the map and cookie notices.
**Prevention:** Add bottom padding equal to the bar's height to the page body, hide the bar when the booking form is in view (IntersectionObserver), and make it mobile-only so it doesn't clutter desktop.
**Phase:** P3.

### Pitfall 20: Text-transform and font features that damage Vietnamese
**What goes wrong:** `text-transform: uppercase` plus wide `letter-spacing` on stacked diacritics looks cramped, and fancy script fonts (Great Vibes, Dancing Script) technically include Vietnamese but become illegible with diacritics.
**Prevention:** Reserve script fonts for the logo-like accent only, never for sentences. Keep uppercase labels short, and check them in the stress string.
**Phase:** P2.

### Pitfall 21: Social proof invented or copied
**What goes wrong:** Placeholder testimonials, fake "1000+ khách hàng", or Facebook reviews pasted without permission. PROJECT.md says to use only client-provided content.
**Prevention:** Include a testimonial or number only if the client supplies it in writing. Otherwise link to the Fanpage reviews.
**Phase:** P2.

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|----------------|------------|
| P1 | Media pipeline | 186 MB videos committed to git (2) | Compress before first commit, set size budgets, make posters, drop the duplicate |
| P1 | Fonts and tokens | Missing Vietnamese subset or glyphs, clipped diacritics (4); low-contrast palette (13) | Verified font list, `subsets` with `vietnamese`, `lang="vi"`, stress string, deep green for text |
| P1 | Config and boilerplate | `cacheComponents` and `new Date()` (8); starter leftovers (17) | Decide whether to keep cache components, clean the scaffold |
| P1 | Client questions | Form honesty (1), primary hotline and Zalo (6), both Maps embeds (11), domain (18), faces and claims (16), Vercel account (3) | One consolidated question list sent to the client at kickoff |
| P2 | Hero and video sections | iOS autoplay and Low Power Mode (5); upscaled 1080 px photos (14) | Poster-first hero, muted ref trick, split layout, `preload` on one LCP image |
| P2 | Animations and client code | Hydration and LCP delay (9) | Server Components by default, CSS animations, no opacity-0 hero |
| P3 | Booking form | Dishonest success message (1); mobile form bugs (10); Vietnam timezone (8) | Honest hand-off flow, 16 px inputs, E.164 and local phone normalization, Asia/Ho_Chi_Minh |
| P3 | Floating bar and links | Wrong or dead deep links (6); iOS safe-area and content overlap (5, 19) | Visible number text, two-branch chooser, real-device tests in the Facebook browser |
| P3 | Contact and maps | Short link in an iframe, heavy embeds (11) | Embed URLs for both branches, facade or lazy load, directions link |
| P4 | SEO | Fake or wrong JSON-LD, bad OG image, indexable `.vercel.app` (12) | Two branch entities, 1200x630 OG, `metadataBase`, canonical, sitemap and robots |
| P4 | Measurement | Unmeasurable success metric (7) | Event tracking on every CTA |
| P4 | Accessibility and performance | Contrast, target size, motion, payload (13, 14, 9) | axe and Lighthouse on mobile throttling, reduced-motion, alt text in Vietnamese |
| P5 | Deploy | Hobby plan on a commercial site (3); no cache headers on videos (15); `.vn` domain delay (18) | Pro or another host, immutable headers with versioned filenames, domain started early |
| P5 | Launch QA | Social share preview stale, desktop-only testing (5, 12) | Facebook Sharing Debugger re-scrape, full real-device matrix |

## Research flags for the roadmap

- **Needs a client decision before building:** Pitfall 1 (form behavior), Pitfall 3 (Vercel account and plan), Pitfall 6 (hotline and Zalo mapping), Pitfall 16 (consent and medical wording), Pitfall 18 (domain).
- **Needs hands-on verification, not more desk research:** iOS and Facebook in-app autoplay and deep link behavior (5, 6), Zalo link behavior for the specific numbers, Maps embed URLs.
- **Standard patterns, unlikely to need research:** fonts (4), image sizing (14), JSON-LD structure (12), contrast (13).

## Sources

- Bundled Next.js 16.4.6 docs, `node_modules/next/dist/docs/01-app/` (HIGH): videos guide (`02-guides/videos.md`: `muted`, `playsInline`, `preload`, poster, dimensions), JSON-LD guide (`02-guides/json-ld.md`: `<` escaping), cache components migration guide (`02-guides/migrating-to-cache-components.md`: sync IO such as `new Date()` fails prerender), Image component reference (`03-api-reference/02-components/image.md`: `priority` deprecated, `qualities` default `[75]`, `sizes`, `localPatterns`), `public` folder reference (`03-file-conventions/public-folder.md`: `Cache-Control: public, max-age=0`), `generate-metadata.md` (`metadataBase`).
- Next 16.4.6 `font-data.json` shipped in `node_modules/next/dist/compiled/@next/font/dist/google/` (HIGH): per-font subset lists, including the Vietnamese gaps for Bellefair, DM Serif Display, Marcellus, Gilda Display.
- Vercel Limits: https://vercel.com/docs/limits (HIGH: static file upload 100 MB Hobby / 1 GB Pro for CLI source uploads).
- Vercel Fair Use Guidelines: https://vercel.com/docs/limits/fair-use-guidelines (HIGH: Hobby is non-commercial only; commercial usage definition; Hobby allowances of 100 GB Fast Data Transfer and 5K image transformations per month).
- Project files: `.planning/PROJECT.md`, `docs/MEDIA.md`, `docs/YEU_CAU.md`, `public/videos` sizes measured on disk, `src/app/layout.tsx` and `next.config.ts` read from the repo (HIGH).
- WCAG contrast figures computed directly with the standard relative-luminance formula (HIGH).
- Vietnamese spa advertising enforcement, news roundup via web search (e.g. baomoi.com, thoibaotaichinhvietnam.vn, daibieunhandan.vn) (LOW-MEDIUM: press reports, not legal text; confirm Decree 38/2021/NĐ-CP wording with the client).
- iOS autoplay and Low Power Mode, React `muted` attribute quirk, Zalo and `tel:` link behavior, Maps short-link iframe restriction, schema.org types, Vietnam's post-2025 ward naming, Decree 13/2023 (E: established behavior, not re-verified in this session, MEDIUM; test on real devices).
