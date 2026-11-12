# Project Research Summary

**Project:** Yên Spa & Beaute · **Domain:** Vietnamese spa one-page landing page (mobile-first, Facebook traffic, client-only form) · **Researched:** 2026-11-12 · **Confidence:** MEDIUM-HIGH

## Executive Summary

Static, server-rendered one-pager with small client islands for a 2-branch HCMC spa (official production site). Server Component page fed by a typed content layer (`src/content/*`); only BookingForm, MobileNav and LazyVideo are `'use client'`; the floating Gọi / Zalo / Messenger bar is plain `<a>` tags (no JS). Stack = existing scaffold (Next 16.4.6, React 19, Tailwind 4 `@theme`) plus minimal additions: Be Vietnam Pro + Cormorant Garamond with the `vietnamese` subset, `next/image`, native `<video>` (poster + tap-to-play), built-in Metadata and two-entity LocalBusiness JSON-LD.

Approach: vertical-MVP phases, each deployable, conversion path before decoration. Phones, addresses, hours and services are single-sourced in the content layer so Contact, floating bar, form options and JSON-LD cannot drift.

Key risks: 186 MB raw video; form sends nothing (honest success copy required); Vercel Hobby is non-commercial only; Vietnamese typography and contrast; iOS / Facebook in-app behaviour; `cacheComponents: true` makes `new Date()` in render a build error.

## Key Findings

### Stack
- Keep scaffold; bump react/react-dom → 19.3.1, tailwindcss + @tailwindcss/turbopack → 4.3.5 (lockstep).
- Tailwind `@theme` tokens: deep green for text/buttons; sage and beige for backgrounds only; burgundy optional small accent.
- Fonts: `next/font/google`, `subsets: ["latin","vietnamese"]`, `lang="vi"`. Body Be Vietnam Pro (400/500/600); headings Cormorant Garamond ≥28px, line-height ≥1.2; fallback Lora. Avoid Bellefair, DM Serif Display, Marcellus, Gilda Display, Bodoni Moda (no Vietnamese subset).
- Images: `next/image`, `preload` on the single hero (`priority` deprecated in Next 16), always `sizes`; configure `images.qualities` if >75; long `minimumCacheTTL`.
- Video: native `<video>` + one `LazyVideo` client component. FFmpeg: H.264 main, ≤720px, CRF 27–28, `+faststart`, `-an` for muted clips. FFmpeg not installed system-wide (portable `ffmpeg-static` works).
- Cache: immutable headers for `/videos` and `/images` (public/ defaults to `max-age=0`); versioned filenames.
- SEO: Metadata API, `icon.jpg`, `apple-icon.jpg`, `opengraph-image.jpg` (1200×630), `sitemap.ts`, `robots.ts`, `schema-dts` (dev) for JSON-LD.
- Icons: `lucide-react` + 3 hand-written brand SVGs (Zalo, Messenger, Facebook).
- Analytics: `@next/third-parties` (GA4) and/or Meta Pixel — client decision.
- Maps: keyless lazy iframe per branch + "Chỉ đường" link.

**Resolved conflicts:** form validation hand-rolled in pure `src/lib/booking-schema.ts` (not react-hook-form/zod); animation via CSS transitions + small IntersectionObserver, honour `prefers-reduced-motion`, never start hero at `opacity: 0` (add `motion` only if design needs). Out: carousel, lightbox, date-picker, toast, player libraries — use CSS scroll-snap, native date input + time `<select>`, inline `role="status"` success panel.

### Features
- **Must have:** hero + CTA, sticky nav, floating contact buttons, brand intro, USP, services (5 groups, per-card CTA), booking form with validation + success state, contact for 2 branches (maps, directions, hours 09:00–21:00, Fanpage), gallery (6 space photos), generic team block, performance, Vietnamese typography, SEO/OG + two-branch JSON-LD.
- **Should have:** vertical video showcase curated to 4–6 clips (main differentiator and main risk), service-card deep link pre-selecting form service, branch picker, honest success state with hand-off (call / Zalo / Messenger, optional copy-summary), click-tracking events, open-now indicator (client-side, Asia/Ho_Chi_Minh), subtle scroll reveal.
- **Defer (v2+):** skin-concern mini-guide, real testimonials (only if supplied), wiring form to email/Sheet/Zalo OA, backend/admin, detail pages/blog, price list.
- **Never:** fake reviews/counts, live chat, Facebook feed embed, popups, geolocation prompt, fake urgency, splash screen, multi-language.

### Architecture
- `page.tsx` only composes sections; sections are Server Components reading `src/content/*`.
- One-way data flow: content → Server sections → serialisable props → client islands in `src/components/client/`.
- `FloatingContact` is Server (3 anchors, no JS). JSON-LD built from the same content as the visible page.
- Components: content layer (`src/content`, `src/types/content.ts`); section components + FloatingContact; client islands (BookingForm idle/success state machine with `{id,label}` props, MobileNav, LazyVideo); `lib/booking-schema.ts`, `lib/jsonld.ts` (`@graph`, one `DaySpa` per branch); `@theme` tokens.
- Scaffold cleanup first: remove dark mode block, Arial and Geist, set `lang="vi"`, replace placeholder metadata and favicon.

### Critical Pitfalls
1. **Form sends nothing.** Decision stands (client-only, success message only). Copy constraint: never "Đặt lịch thành công" or "chúng tôi sẽ liên hệ"; use e.g. "Thông tin đã được ghi nhận trên thiết bị của bạn. Vui lòng gọi hoặc nhắn Zalo để Yên xác nhận lịch" + call/Zalo/Messenger buttons. Success metric measurable only via click events.
2. **186 MB raw video.** Compress before first commit of `public/videos` (keep originals outside repo). Budgets: hero ≤1.5 MB, clips 4–6 MB, nothing >~8 MB. Trim long clips to 15–30 s, curate 4–6, drop `body-acupressure` duplicate after check, poster for every clip.
3. **Vercel Hobby = non-commercial only** (also 100 GB/month transfer). Decision to use Vercel stands; plan/account is a client open question.
4. **Vietnamese typography & contrast.** `vietnamese` subset always; test diacritic stress string in every weight; no `overflow:hidden`/tight leading on headings; NFC copy. White on sage fails (2.42:1) — use deep green (`#2F4A3A`–`#4A7358`) or burgundy for text and primary buttons.
5. **Facebook in-app / iOS / deep links.** Poster is the hero, autoplay is enhancement; set `muted` via ref; `svh`/`dvh`; safe-area padding on floating bar; E.164 `tel:`; Zalo number must be Zalo-registered; real-device tests.
6. **`cacheComponents: true` already on.** `new Date()` in render fails build; Vercel is UTC. Compute form `min` date and open-now client-side after mount. Decide in Phase 1 whether to remove `cacheComponents`/`partialPrefetching` (removing is the low-friction default).

Also: Maps short link cannot be an iframe `src`; JSON-LD real data only; medical wording and customer faces need client sign-off; `*.vercel.app` needs canonical to the custom domain.

## Implications for Roadmap (vertical MVP, 5 phases, standard granularity)

Start the video compression chore in Phase 1 as a background task.

1. **Foundation & first deployable slice** — scaffold cleanup, `lang="vi"`, fonts, `@theme` tokens with contrast rule, typed content layer, shell (Header + MobileNav, Footer, FloatingContact), poster Hero with CTA, minimal Contact, `SITE_URL` env, cache headers, first Vercel deploy.
2. **Content sections (page visually complete)** — About, Services (5 groups, per-card CTA anchors), USP, SpaceGallery, generic Team, full Contact (both branches, lazy map/facade, directions, hours, Fanpage), CSS reveal.
3. **Booking form & conversion layer** — `booking-schema.ts` + tests, BookingForm (native selects, native date + time-slot select, `inputMode="tel"`, 16px inputs, Vietnamese errors with `aria-*`), honest success panel with channel buttons and optional copy-summary, service deep link, branch picker, tracking hooks.
4. **Video showcase** — 4–6 compressed 9:16 clips + posters, LazyVideo (src on tap/near viewport, one at a time, `preload="none"`, reduced-motion / save-data aware), scroll-snap strip, optional muted hero loop over poster.
5. **SEO, analytics, hardening & launch** — metadata, `metadataBase`, canonical, OG 1200×630, icons, robots, sitemap, validated two-branch `DaySpa` JSON-LD, GA4/Pixel events, a11y + Lighthouse pass, domain/DNS, Vercel plan resolved, Sharing Debugger re-scrape, real-device matrix.

**Research flags:** deeper verification for Phase 3 (copy, VN phone prefixes, Zalo/m.me device test), Phase 4 (encoder tuning, iOS/Facebook autoplay), Phase 5 (Vercel plan, domain, analytics consent, device QA). Phases 1–2 use standard patterns.

## Confidence

| Area | Confidence | Notes |
|---|---|---|
| Stack | HIGH | npm + bundled Next 16.4.6 docs; FFmpeg settings and deep links MEDIUM |
| Features | MEDIUM | Brief + conventions; no competitor teardown |
| Architecture | HIGH | Verified against docs and scaffold; video hosting limits MEDIUM |
| Pitfalls | MEDIUM-HIGH | Vercel/Next/fonts/WCAG verified; iOS, deep links, Decree 13/38 from experience/press |

## Gaps & Client Open Questions (risks, not changed decisions)

- **Success-state honesty:** client acknowledges submissions do not reach the spa; agree copy.
- **Vercel Hobby vs commercial:** whose Pro team, or accept risk.
- **Hotline/Zalo:** only 0899 607 279 (branch 1) is known Zalo; branch 2 (0896 407 578) unconfirmed.
- **Maps:** only one share link; need embed URL per branch.
- **Domain:** none yet; single `SITE_URL`.
- **Tracking:** GA4 / Meta Pixel / Vercel Analytics, consent notice.
- **Brand names & logo:** Yên Spa & Beaute vs Yên Skinlab vs Usha.beauté; burgundy accent only; SVG/transparent logo.
- **Medical wording & consent:** soften "điều trị"/"chữa"; consent for faces in `treatment-area.jpg` and acne video.
- **Real coordinates** for `geo`; **team names/roles** not provided (generic block).

## Sources

- **Primary (HIGH):** bundled Next 16.4.6 docs and `font-data.json`; npm registry (2026-11-12); Vercel limits & fair-use pages; Google LocalBusiness structured-data docs; repo inspection; computed WCAG ratios.
- **Secondary (MEDIUM):** Motion docs, FFmpeg web-encode guidance, Vietnamese channel domain knowledge.
- **Tertiary (LOW):** Decree 38/2021 press reports; iOS autoplay / Low Power Mode, Zalo / m.me behaviour, Maps short-link restriction, Decree 13/2023 — verify on devices.
