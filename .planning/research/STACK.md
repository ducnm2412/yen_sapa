# Technology Stack

**Project:** Yên Spa & Beaute — Vietnamese one-page spa landing page with client-only booking form
**Researched:** 2026-11-12
**Overall confidence:** HIGH for framework/fonts/SEO/images (verified against the installed Next 16.4.6 docs in `node_modules/next/dist/docs` and the npm registry on 2026-11-12). MEDIUM for video encoding settings and third-party deep links (web sources, not yet tested against the real files).

## Guiding Principle

This is a static marketing page with one interactive form. Every dependency has to justify its JS cost on a mid-range Android phone loading over mobile data from a Facebook in-app browser. The recommended stack is therefore **the scaffold plus six small runtime libraries**. Everything else (carousel, lightbox, date picker, toast, maps SDK, video player, SEO plugin) is deliberately left out.

## Baseline already in the repo (keep, do not replace)

| Technology | Installed | Latest on npm (2026-11-12) | Action |
|------------|-----------|----------------------------|--------|
| next | 16.4.6 | 16.4.6 | Keep. Already latest. |
| react / react-dom | 19.3.0 | 19.3.1 | Bump patch: `npm i react@19.3.1 react-dom@19.3.1` |
| tailwindcss | 4.3.3 | 4.3.5 | Bump patch together with `@tailwindcss/turbopack` (versions must match) |
| @tailwindcss/turbopack | 4.3.3 | 4.3.5 | Keep. Scaffold wires it via `turbopack.rules` in `next.config.ts`; there is no `postcss.config`. Do not "fix" it to `@tailwindcss/postcss` unless builds break. |
| typescript | ^5 | — | Keep |
| eslint + eslint-config-next | ^9 / 16.4.6 | — | Keep |

**Scaffold facts the roadmap must know (HIGH, read from the repo):**
- `AGENTS.md` says this Next.js has breaking changes vs. training data. Read `node_modules/next/dist/docs/` before writing framework code. This research did so for fonts, images, videos, JSON-LD, metadata files and caching.
- `next.config.ts` has `cacheComponents: true` and `partialPrefetching: true`. For a single static page both are harmless, but Cache Components makes `new Date()`, `Date.now()`, `Math.random()`, and `crypto.randomUUID()` a **build error** during prerender (docs: `migrating-to-cache-components.md`). This directly affects the booking form's "minimum date" (see Form section). The roadmap should either keep them and follow the rules, or remove both flags if they cause friction. A one-pager gains nothing from either.
- `layout.tsx` still uses Geist/Geist Mono, `lang="en"`, and the placeholder title. All three must change in the first phase.
- `globals.css` still has the dark-mode media query and Arial body font. Remove the dark mode block (brand is green + beige, light only).

## Recommended Stack

### Core Framework (existing)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js (App Router) | 16.4.6 | Rendering, image/font optimization, metadata files | Already installed, fully static output for a one-pager, first-class Vercel deploy. |
| React | 19.3.1 | UI | Required by Next 16. React 19 `<form>`/`useActionState` available but not needed (see Form). |
| TypeScript | ^5 | Types | Already configured with `strict: true` and `@/*` alias. |
| Tailwind CSS | 4.3.5 | Styling, design tokens in `@theme` | Already installed. v4 is CSS-first: put brand colors (green, beige, burgundy accent) and fonts in `@theme inline` in `globals.css`, no `tailwind.config.js`. |

### Forms and Validation (client-only, no backend)

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| react-hook-form | 7.92.0 | Field state, touched/dirty, accessible error wiring | The de facto standard. Uncontrolled inputs keep re-renders near zero on a 6-field form. |
| zod | 4.6.7 | Schema and Vietnamese error messages | Zod 4 is current. Ships a `vi` locale (`zod/v4/locales/vi`, verified in the package). Schema is reusable verbatim if a Server Action/backend is added later. |
| @hookform/resolvers | 7.0.6 | Bridge RHF to zod | Peer deps verified: `react-hook-form ^7.55.0`, `zod ^3.25.0 \|\| ^4.0.0`. Use `zodResolver`. |

**Confidence: HIGH** (versions and peer ranges verified from npm 2026-11-12).

**Prescriptions:**
- Use `mode: "onTouched"` (validate on blur, then on change) and `noValidate` on the `<form>` so we control Vietnamese messages instead of browser-localized ones.
- Phone regex for Vietnamese numbers: strip spaces/dots/dashes first, then accept `^(0|\+84)(3|5|7|8|9)\d{8}$` for mobiles (also optionally landline `02\d{9}`). Both branch hotlines (0899 607 279, 0896 407 578) match. **MEDIUM**: prefix list is from domain knowledge, validate against the current Vietnamese numbering plan during implementation.
- Date and time: use native `<input type="date">` and a `<select>` of 30-minute slots between 09:00 and 20:30 (spa is open 09:00-21:00 every day). Native mobile pickers are better UX and cost zero JS than any calendar library. Set the `min` date in a `useEffect` / client-only state, **not** during render (Cache Components rule above).
- Success state: replace the form with an inline success panel (`role="status"`, `aria-live="polite"`) rather than a toast. No toast library.
- Do not name the success "Đã đặt lịch" without qualification. Nothing is sent anywhere. Copy should say the request was received and offer one-tap Zalo/hotline as the real path (flag for roadmap, see Gaps).

### Animation

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| motion | 14.12.0 | Scroll-reveal, hero entrance, floating-button entrance | The successor package to framer-motion (it depends on `framer-motion@14.12.0`). Peer deps accept React 18/19. |

**Confidence: HIGH** on version and the feature set, MEDIUM on the exact byte sizes (taken from Motion's docs, measured with Rollup).

**Prescriptions:**
- Use `LazyMotion` + `m` components + `domAnimation`. Per Motion's docs this is about 5 kB initial plus about 24 kB for `domAnimation`, versus about 43 kB for the full `motion` component. Verified in the package source that `domAnimation` includes the `inView` feature (so `whileInView` works), plus hover/tap/focus and exit animations. Imports: `LazyMotion`, `domAnimation` from `"motion/react"`; `import * as m from "motion/react-m"`.
- Set `strict` on `LazyMotion` so nobody accidentally imports the full `motion.div`.
- Wrap in `MotionConfig reducedMotion="user"` so `prefers-reduced-motion` is honored. (Prop name is from Motion's API; the docs page fetched did not cover it, so verify when implementing. **MEDIUM**.)
- Motion components need `"use client"`. Build one small `Reveal` client component and a `MotionProvider` and keep all sections as Server Components that compose them.
- Animate `transform`/`opacity` only; `viewport={{ once: true, amount: 0.2 }}`.
- Never start the hero LCP element at `opacity: 0`. Server-rendered content hidden until hydration hurts LCP and makes the page blank in slow Facebook in-app browsers.
- Hover states, button press, and accordion-like effects: plain Tailwind transitions, not Motion.

### Fonts (full Vietnamese diacritics)

| Font | Role | Source | Why |
|------|------|--------|-----|
| Be Vietnam Pro | Body/UI | `next/font/google` | Designed specifically for Vietnamese (diacritic stacking spacing is correct). Subsets include `vietnamese` (verified in Next's font-data). **Not a variable font**: Next requires explicit `weight`. Load only `["400","500","600"]` to cap files. |
| Cormorant Garamond | Display headings | `next/font/google` | Elegant, calm, spa-appropriate. Has `vietnamese` subset and a variable `wght` axis (verified). Use only at 28 px and up with `line-height >= 1.2` because its small x-height makes stacked diacritics (ệ, ẫ, ử) cramped at small sizes. |

**Confidence: HIGH** (subset support verified in `next/dist/compiled/@next/font/dist/google/font-data.json`). The aesthetic pairing is a design opinion: MEDIUM. Fallback heading font if Cormorant looks too thin on real screens: **Lora** (also has `vietnamese`, variable).

**Prescriptions:**
- `subsets: ["latin", "vietnamese"]` for both fonts. `latin` alone drops Vietnamese diacritics to the system fallback silently; this is the most common font bug on Vietnamese sites. Add `display: "swap"` and expose CSS variables (`--font-body`, `--font-display`) consumed in `@theme inline` as `--font-sans` / `--font-serif`.
- Remove Geist and Geist Mono from `layout.tsx`. Set `<html lang="vi">`.
- Do not use Google Fonts via `<link>` or `@import` (extra connection, render-blocking, and GDPR-style privacy noise). `next/font` self-hosts at build time.
- **Avoid** fonts missing Vietnamese: Bodoni Moda and Albert Sans have no `vietnamese` subset (verified). Script/handwriting fonts (Dancing Script, Pacifico) technically have the subset but diacritics on top of connected script are poor; use only for a logo-like flourish if at all.
- QA check: render the string "Chăm sóc da mặt chuyên sâu, điều trị mụn, thâm, nám – Phục hồi & tái tạo" in every weight/size used.

### Images

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next/image (built in) | 16.4.6 | Responsive, lazy, AVIF/WebP | Already required by PROJECT.md; Vercel optimizes at the edge. |

**Confidence: HIGH** (read from `image.md` in the installed docs).

**Next 16 specifics and prescriptions:**
- `priority` is deprecated in v16; use `preload` for the LCP hero image only (or `fetchPriority="high"`). Everything else stays lazy by default.
- `images.qualities` is now required and defaults to `[75]`. If any image needs `quality={85}`, add `qualities: [75, 85]` in `next.config.ts` or it is silently coerced.
- Add `images.formats: ["image/avif", "image/webp"]`. AVIF is about 20% smaller than WebP at the cost of slower first encode; with 19 source images that is a non-issue.
- Set `images.minimumCacheTTL` to a long value (for example `2678400`, 31 days). Default is 4 hours; these photos never change.
- Always pass a correct `sizes` (mobile-first, for example `"(min-width: 1024px) 33vw, 100vw"`). Without `sizes` on `fill` images Next generates a full-viewport `srcset` and wastes bandwidth.
- Images in `public/images/**` need explicit `width`/`height` (or `fill` in an aspect-ratio box). Static `import` from `src/` gives automatic `blurDataURL` and hashed immutable URLs, but that would mean moving the files; not worth it. Use a beige `bg-` placeholder instead of blur.
- Source sizes are fine (max 2048 px). 19 images are well below the Vercel Hobby/Pro source-image limits. The three `tet-team-*` photos are 2048 px with Tết frames and are excluded from main use per PROJECT.md. `consultation-small.jpg` is 206 px: never render above about 200 px wide.
- `logo-red.jpg` and `logo-green.jpg` are JPG with no transparency. Next's file convention accepts `.jpg` for `app/icon.jpg`, `app/apple-icon.jpg` and `app/opengraph-image.jpg` (verified in docs), so the favicon, Apple icon and OG image can be dropped in with zero code. Ask the client for an SVG/PNG logo for the header; a JPG square on a transparent-looking header will look wrong.

### Video (large vertical 9:16 MP4s)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Native `<video>` + one small `LazyVideo` client component | — | Hero loop and reels-style gallery | The Next docs' own guidance: `<video>` with `poster`, `preload="none"`, width/height or `aspect-ratio`. No player library needed for muted loops and tap-to-play. |
| FFmpeg (offline CLI, not a project dependency) | current | Compress before commit | Source total is about 190 MB (largest 66 MB). Must be compressed. FFmpeg is **not installed on this machine** (checked). Install with `winget install Gyan.FFmpeg` (**MEDIUM**, id not tested). |

**Confidence:** HIGH for the component approach (from Next's `videos.md`). MEDIUM for encoder settings (web sources; validate visually on real files).

**Recommended encode (H.264 MP4 only, no WebM/AV1 duplicates):**

```bash
# Hero loop and short clips: silent, 720 px wide, smallest possible
ffmpeg -i in.mp4 -vf "scale=720:-2" -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -preset slow -crf 28 -an -movflags +faststart out.mp4

# Longer treatment videos that keep audio
ffmpeg -i in.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -preset slow -crf 27 -c:a aac -b:a 96k -movflags +faststart out.mp4

# Poster (one per video), then keep as WebP/JPG about 40-60 kB
ffmpeg -ss 1 -i in.mp4 -frames:v 1 -vf "scale=720:-2" -q:v 3 poster.jpg
```

- Cap at 720x1280. A phone shows these at about 360-430 CSS px wide, so 720 is already 2x. The 1080x1920 sources (`facial-head-spa` 66 MB, `space-tour-*`, `body-massage-relax`) shrink roughly 5-10x.
- `-movflags +faststart` is mandatory so playback starts before the full download. H.264 `main` profile with `yuv420p` plays everywhere including old iPhones.
- Drop `body-acupressure-lowres.mp4` if it is confirmed a duplicate (PROJECT.md flags it).
- Consider trimming the 1:25-2:25 videos to a 20-45 s highlight. Landing-page viewers will not watch 2+ minutes, and bytes saved are bytes not served.

**Delivery rules:**
- Only the hero clip autoplays: `autoPlay muted loop playsInline preload="metadata"` plus `poster`. Honor `prefers-reduced-motion` by not autoplaying.
- All gallery videos: `preload="none"` plus `poster`, tap to play, `playsInline`, and pause the others when one starts (one global "currently playing" ref). Reserve the box with `aspect-[9/16]` to avoid layout shift.
- Mount video elements lazily with `IntersectionObserver` (set `src` only when near the viewport). Do not render 11 `<video>` tags with `src` eagerly.
- Self-host from `public/videos`; Vercel's CDN serves static files and handles range requests. **Default `Cache-Control` for `public/` is `public, max-age=0`** (verified in `public-folder.md`), so browsers revalidate every visit. Add a `headers()` rule in `next.config.ts` for `/videos/:path*` and `/images/:path*` with `public, max-age=31536000, immutable` and rename files (`-v2`) whenever a file changes.
- Alternatives (YouTube Shorts embed with a facade, Vercel Blob, Cloudinary, Mux) are only worth it if compressed total is still above about 80-100 MB or bandwidth costs matter. Not needed for 11 short clips.
- Repository hygiene: commit only the compressed outputs. Do not commit the 66 MB original (GitHub warns above 50 MB, and history stays forever).

### SEO and LocalBusiness Structured Data

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next Metadata API (built in) | 16.4.6 | title, description, canonical, Open Graph, Twitter, `metadataBase`, `viewport` | Official, zero dependency. |
| `app/sitemap.ts`, `app/robots.ts` (built in) | 16.4.6 | Sitemap and robots | File conventions verified in docs; replaces `next-sitemap`. |
| `app/icon.jpg`, `apple-icon.jpg`, `opengraph-image.jpg` (built in) | 16.4.6 | Favicon, Apple touch icon, OG | Generated from the logo with no code. OG image should be 1200x630; produce a dedicated branded image rather than the 500x500 logo. |
| schema-dts | 2.1.0 (devDependency, types only) | Type-checked JSON-LD | Recommended by Next's own JSON-LD guide. Zero runtime cost. |

**Confidence: HIGH** (Next docs `json-ld.md`, `app-icons.md`, `opengraph-image.md`; Google's LocalBusiness developer page).

**Prescriptions:**
- Render JSON-LD as a native `<script type="application/ld+json">` in `page.tsx` (not `next/script`), and escape with `.replace(/</g, "\\u003c")` as the Next guide requires. Content is static, so no XSS exposure in practice, but follow the pattern.
- **Two locations = two entities.** Google says to define each location as its own LocalBusiness. Emit a `@graph` with one `DaySpa` (Google's own doc names `DaySpa` as the spa subtype; `["DaySpa","HealthAndBeautyBusiness"]` is acceptable) per branch (Quận 3 and Phú Nhuận), each with its own `address` (`PostalAddress`, `addressCountry: "VN"`, `addressLocality: "Hồ Chí Minh"`), `telephone` in `+84` format (for example `+84899607279`), `openingHoursSpecification` (all 7 days, `opens: "09:00"`, `closes: "21:00"`), `url`, `image`, and a shared `sameAs` (the Facebook fanpage) and `parentOrganization`. Add one `Organization` or `WebSite` node for the brand.
- Required by Google: `name` and `address`. Recommended: `geo` (needs at least 5 decimal places; obtain real coordinates from Google Maps, do not guess), `openingHoursSpecification`, `telephone`, `url`, `priceRange` (omit; client does not publish prices; do not invent).
- Do not add `aggregateRating`/`review` markup unless real, client-provided reviews exist. Google only recommends it for sites reviewing other businesses, and fake review markup risks a manual action.
- Metadata: `metadataBase` from an env var (production domain, fallback `VERCEL_PROJECT_PRODUCTION_URL`), `lang="vi"`, `openGraph.locale: "vi_VN"`, a unique Vietnamese title (include "Spa", "chăm sóc da", "Quận 3", "Phú Nhuận") and a description of about 150 characters.
- Validate with Google's Rich Results Test and the Schema Markup Validator before launch.

### Icons

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| lucide-react | 1.72.0 | Phone, MapPin, Clock, Sparkles, Leaf, Calendar, ChevronDown, Menu, X, Play, Droplet, Flower, HeartHandshake | Tree-shaken per-icon imports, consistent thin stroke fits the soft spa aesthetic. Verified that all of those icons exist in 1.72.0. |
| Inline SVG components (hand-written) | — | Zalo, Messenger, Facebook marks | **lucide-react 1.x has no brand icons** (verified: no `facebook`/`instagram` in the 4,712 icons). Zalo was never in Lucide. Keep 3 small SVGs in `src/components/icons/`. |

**Confidence: HIGH** (version and icon set verified from the published tarball).

Import per icon (`import { Phone } from "lucide-react"`); Next's `optimizePackageImports` handles lucide by default. Avoid `react-icons` (huge surface area, easy to pull in a whole pack by accident) and icon fonts (Font Awesome: render-blocking CSS and unneeded weight).

### Contact buttons and Maps

| Item | Approach | Why |
|------|----------|-----|
| Floating contact buttons | Plain `<a>` tags: `tel:+84899607279`, `https://zalo.me/0899607279`, `https://m.me/SpabeauteYenhcm` | One tap on mobile with no JS. **MEDIUM**: the Zalo number must be a Zalo-registered phone and the `m.me` slug is derived from the fanpage URL. Confirm with the client. |
| Google Maps | Per-branch `<iframe loading="lazy" title="...">` from Maps "Share > Embed a map" in a fixed aspect-ratio box, plus an "Chỉ đường" link to the branch's Maps URL | Keyless, no billing, no JS SDK. The short link in PROJECT.md (`maps.app.goo.gl/...`) cannot be embedded; the embed HTML must be generated from Google Maps for each branch. |

Do not use `@react-google-maps/api` or the Maps JavaScript API. It needs an API key and a billing account, and adds heavy JS for a static pin.

### Analytics (recommended, because the form stores nothing)

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| @next/third-parties | 16.4.6 | GA4 via `<GoogleAnalytics gaId>` + `sendGAEvent` | The only way to measure the stated success metric (booking/contact actions) when the form has no backend. Track `click_call`, `click_zalo`, `click_messenger`, `form_submit_success`. |
| @vercel/analytics | 2.0.1 (optional) | Page views, Web Vitals | Zero-config on Vercel. Custom events are plan-gated (**verify** before relying). |

**Confidence: MEDIUM.** Versions are verified. The "which tool" choice is a product decision for the roadmap. Add Meta Pixel only if the client runs Facebook ads (the audience arrives from Facebook), loaded with `next/script` `strategy="afterInteractive"`.

### Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional class names | Always, 239 bytes. Only add `tailwind-merge` 3.7.0 if building a reusable `Button` with overridable classes. |
| prettier-plugin-tailwindcss | latest | Class sorting | Optional dev tooling. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Form | react-hook-form + zod | React 19 `useActionState` + native validation | Valid for 6 fields, but we need per-field Vietnamese messages, blur validation and a schema reusable on a future backend. RHF+zod is the standard and the cost is small. |
| Form | zod 4 | valibot / yup | Zod has the Vietnamese locale, the widest RHF resolver support and the most future-proof schema reuse. |
| Date/time input | Native `type="date"` + time `<select>` | react-day-picker 10.0.2 | Adds JS and styling work and is worse than native pickers on phones. |
| Toast | Inline success panel | sonner 2.0.8 | An extra dependency for one message, and a toast is easy to miss on a page whose whole point is the form. |
| Animation | motion (LazyMotion) | GSAP / AOS / CSS-only scroll-driven animations | GSAP is heavier and unnecessary here. AOS is stale. CSS `animation-timeline: view()` is attractive but cannot be assumed on the iOS/Facebook in-app browsers this audience uses. |
| Carousel / lightbox | CSS `scroll-snap` row, plain grid | embla-carousel-react 8.6.0, yet-another-react-lightbox 3.33.0 | A 9:16 "reels" strip is naturally a horizontally snapping row with no JS. Add embla/lightbox only if the client requests swipe-with-arrows or image zoom. |
| Video player | Native `<video>` | react-player, video.js | Overkill for muted loops and tap-to-play. Also adds third-party JS. |
| Video hosting | Compressed MP4 in `public/` | YouTube/Vimeo embeds, Mux, Cloudinary | Extra cost or third-party UI; unnecessary once files are about 1-8 MB each. Revisit only if compression cannot get under about 80 MB. |
| Fonts | next/font/google (self-hosted) | Google Fonts `<link>`, Fontsource | `next/font` is built in, preloads only the used subsets, zero layout shift. |
| Icons | lucide-react + 3 inline brand SVGs | react-icons, Font Awesome, Heroicons | Bundle risk, and Lucide's thin style suits the brand. |
| SEO | Built-in metadata, sitemap, robots files | next-seo, next-sitemap | Redundant with App Router file conventions. |
| JSON-LD | Hand-written script + schema-dts types | next-seo JSON-LD components | Next's own guide recommends this pattern. |
| Maps | Keyless iframe embed | Google Maps JS SDK / Mapbox | Needs key and billing; no interactivity required. |
| Styling | Tailwind v4 only | shadcn/ui, Radix, MUI | A landing page needs about 6 custom components. A component library brings dependencies and a generic look the client's "tinh tế" brand will fight. |

## What NOT to Use

- **framer-motion** (old package name). Use `motion`. Do not install both.
- **`next/font` with `subsets: ["latin"]` only.** Vietnamese diacritics fall back to the system font.
- **Full `motion.div` imports.** Use `m.*` inside `LazyMotion` and enable `strict`.
- **Autoplaying all videos, or `preload="auto"` on gallery videos.** It burns mobile data and kills LCP.
- **The 66 MB / 1080p originals in the deployed bundle.** Compress first.
- **`priority` prop on `next/image`.** Deprecated in Next 16; use `preload`.
- **`next-sitemap`, `next-seo`, `react-icons`, `react-player`, `@react-google-maps/api`.** All redundant or heavy here.
- **Fake `aggregateRating`/`review` JSON-LD or invented `priceRange`.** Real data only.
- **Dark mode.** The scaffold's `prefers-color-scheme` block would invert the brand palette.
- **A Server Action or API route "for the form".** Out of scope per PROJECT.md. Keep the schema in `src/lib/booking-schema.ts` so wiring a backend later is additive.

## Hosting note (Vercel)

Vercel's Hobby plan is restricted to **non-commercial personal use** under its fair-use guidelines (HIGH on the rule; MEDIUM on how strictly it is applied to a small static business site, since forum answers suggest a site promoting a business counts as commercial). PROJECT.md says this is a real client deliverable, so the roadmap should flag that the client's deployment likely needs a Pro team, or a deliberate choice of another static host. Also, CLI uploads on Hobby are limited to 100 MB of source files (verified on Vercel's limits page, last updated 2026-09-16; a changelog entry says "CLI deployment limits removed", so re-check), which is another reason to compress video before committing.

## Installation

```bash
# Patch bumps for the scaffold (keep versions in lockstep)
npm install react@19.3.1 react-dom@19.3.1
npm install -D tailwindcss@4.3.5 @tailwindcss/turbopack@4.3.5

# Runtime
npm install react-hook-form@^7.92.0 zod@^4.6.7 @hookform/resolvers@^7.0.6 \
  motion@^14.12.0 lucide-react@^1.72.0 clsx@^2.1.1 @next/third-parties@16.4.6

# Dev / types
npm install -D schema-dts@^2.1.0

# Optional
npm install @vercel/analytics@^2.0.1
npm install tailwind-merge@^3.7.0     # only if a reusable Button needs class overriding
```

```bash
# Offline, one-time (not a project dependency)
winget install Gyan.FFmpeg
```

## Sources

- Installed Next.js 16.4.6 docs, `node_modules/next/dist/docs/01-app/`: `01-getting-started/12-images.md`, `13-fonts.md`, `14-metadata-and-og-images.md`, `02-guides/videos.md`, `json-ld.md`, `production-checklist.md`, `migrating-to-cache-components.md`, `03-api-reference/02-components/image.md`, `font.md`, `03-file-conventions/public-folder.md`, `01-metadata/app-icons.md`, `opengraph-image.md`, `05-config/01-next-config-js/partialPrefetching.md` (HIGH, local and version-exact)
- `next/dist/compiled/@next/font/dist/google/font-data.json`, subset and axis data for Be Vietnam Pro, Cormorant Garamond, Lora and others (HIGH)
- npm registry (`npm view` and published tarballs for lucide-react, zod, motion/framer-motion, @hookform/resolvers), 2026-11-12 (HIGH)
- Motion docs, LazyMotion and Reduce bundle size: https://motion.dev/docs/react-lazy-motion , https://motion.dev/docs/react-reduce-bundle-size (MEDIUM, sizes measured by Motion with Rollup)
- Google Search Central, LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business (HIGH)
- Vercel limits: https://vercel.com/docs/limits (HIGH); Vercel fair-use guidelines: https://vercel.com/docs/limits/fair-use-guidelines (HIGH on rule text, MEDIUM on enforcement reading)
- FFmpeg web-encode guidance (CRF range, `+faststart`): https://transloadit.com/devtips/reducing-video-file-size-with-ffmpeg-for-web-optimization/ (MEDIUM, general web sources; validate on the real files)
