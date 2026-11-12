# Architecture Patterns

**Domain:** One-page spa/beauty marketing landing page (Vietnamese, mobile-first) with a client-only booking form
**Project:** Yên Spa & Beaute
**Researched:** 2026-11-12
**Overall confidence:** HIGH for structure and the server/client boundary (verified against the Next.js 16.4.6 docs bundled in `node_modules/next/dist/docs/` and the real scaffold). MEDIUM for font choice and video hosting limits (not verified against live providers).

## Scaffold facts that drive the architecture

Read from the repo, not assumed. Each one changes a decision below.

| Fact (source) | Consequence |
|---|---|
| Next **16.4.6**, React 19.3, Tailwind **4.3.3** (`package.json`). `AGENTS.md` says this is not the Next.js of training data and tells you to read `node_modules/next/dist/docs/` first. | Treat the bundled docs as the authority. Use CSS-first Tailwind v4 (`@theme`), not `tailwind.config.js`. |
| `next.config.ts` already sets **`cacheComponents: true`** and `partialPrefetching: true`. | Prerendering is stricter. `new Date()`, `Date.now()`, `Math.random()` and `crypto.randomUUID()` during prerender are **build errors** (docs: `01-getting-started/08-caching.md`, `02-guides/migrating-to-cache-components.md`). A static landing page is fine, but the booking form's "min date = today" is a trap (see Pitfalls). `partialPrefetching` is irrelevant for a single-route site and can stay or go. |
| `src/app/layout.tsx` loads Geist with `subsets: ["latin"]`, sets `lang="en"`, and has placeholder metadata. | Must change: `lang="vi"`, a font with the **vietnamese** subset, real metadata. Geist has no Vietnamese-tuned usage here, so replace it. |
| `src/app/globals.css` has a `prefers-color-scheme: dark` block and `font-family: Arial`. | Delete the dark-mode block (the brand is light green + beige) and the Arial override, or the page flips dark on users' phones. |
| `src/app/page.tsx` is the stock create-next-app page. | Replace entirely. |
| Media: 19 images total 2.8 MB (already small, mostly 1080-1290 px). **11 videos total 186 MB** (`facial-head-spa.mp4` 64 MB, `body-massage-relax.mp4` 23 MB, `space-tour-1.mp4` 19 MB, etc.). `ffmpeg` is **not** installed on this machine. | Images are cheap; videos are the single biggest architecture/perf risk. Video needs a compression step and a lazy, click-to-play component. |

## Recommended Architecture

**Server-first static page with a few small client islands.** One route (`/`) is composed in `page.tsx` from section components. Every section is a Server Component that reads typed content from `src/content/*`. Only four things need the browser: the booking form, the mobile nav toggle, the video player(s), and (optionally) a hero-video enhancer or gallery lightbox. Everything else, including the floating contact buttons, is plain HTML anchors (`tel:`, `https://zalo.me/...`, `https://m.me/...`) and needs zero JavaScript.

```
                    ┌──────────────────────────── src/content/ (typed data, no React) ────────────────────────────┐
                    │ site.ts   branches.ts   services.ts   usp.ts   team.ts   gallery.ts   videos.ts   nav.ts   │
                    └───────────────┬───────────────────────────────┬──────────────────────────────┬─────────────┘
                                    │ import (build time)           │                              │
                                    ▼                               ▼                              ▼
   src/app/layout.tsx ──► fonts, <html lang="vi">,          src/app/page.tsx              src/lib/jsonld.ts
   (Server)               metadata, viewport, JSON-LD  ◄──── (Server, composes sections)    (builds LocalBusiness
                                    ▲                               │                        from site+branches)
                                    │                               ▼
                                    │       ┌────────────── Section components (Server) ───────────────┐
                                    │       │ Header  Hero  About  Services  Usp  Space  VideoShowcase  │
                                    │       │ Team  Booking  Contact  Footer  FloatingContact           │
                                    │       └───┬───────────┬───────────────┬───────────────┬───────────┘
                                    │           │ props     │ props         │ props         │ props
                                    │           ▼           ▼               ▼               ▼
                                    │     MobileNav     LazyVideo      BookingForm      (HeroVideo / Lightbox, optional)
                                    │     'use client'  'use client'   'use client'     'use client'
                                    │                                     │
                                    │                                     ▼
                                    │                          src/lib/booking-schema.ts (pure TS, shared validation)
                                    │                          result: local state only → success message, no network
                                    ▼
                         public/images/**  public/videos/**  (served statically; images via next/image)
```

Data flows one way: **content files → Server section components → props into client islands**. Client islands never import from `page.tsx` or from each other. The booking form's only inputs are the `services` and `branches` arrays passed as props (so the form and the Services/Contact sections can never drift apart), and its only output is a local "success" state.

### Directory layout

```
src/
├── app/
│   ├── layout.tsx            # fonts, lang="vi", metadata, viewport, JSON-LD <script>, body shell
│   ├── page.tsx              # composes sections in order; no logic
│   ├── globals.css           # @import "tailwindcss"; @theme tokens; base styles
│   ├── icon.jpg              # favicon from logo (500x500) - file convention, auto <link>
│   ├── apple-icon.jpg        # same logo, iOS home screen
│   ├── opengraph-image.jpg   # 1200x630 social card (static file convention)
│   ├── robots.ts             # optional, 5 lines
│   └── sitemap.ts            # optional, single URL
├── components/
│   ├── sections/             # one file per page section, all Server Components
│   │   ├── header.tsx  hero.tsx  about.tsx  services.tsx  usp.tsx
│   │   ├── space-gallery.tsx  video-showcase.tsx  team.tsx
│   │   ├── booking.tsx       # section shell (heading + copy), renders <BookingForm/>
│   │   ├── contact.tsx  footer.tsx
│   ├── ui/                   # presentational primitives, Server unless noted
│   │   ├── container.tsx  section.tsx  section-heading.tsx  button.tsx  icon-*.tsx
│   ├── client/               # every 'use client' file lives here - the boundary is visible in the tree
│   │   ├── booking-form.tsx  mobile-nav.tsx  lazy-video.tsx  (hero-video.tsx, lightbox.tsx optional)
│   └── floating-contact.tsx  # Server: fixed bottom bar of <a> links, CSS-only
├── content/                  # typed data, zero React, zero side effects
│   ├── site.ts  branches.ts  services.ts  usp.ts  team.ts  gallery.ts  videos.ts  nav.ts
├── lib/
│   ├── jsonld.ts             # buildLocalBusinessJsonLd(site, branches)
│   ├── booking-schema.ts     # field rules + validate(values) -> errors; pure, no React
│   └── cn.ts                 # tiny className joiner (or use clsx)
└── types/content.ts          # Service, Branch, Video, GalleryImage, TeamMember, SiteConfig
```

Rule of thumb: **`'use client'` appears only in `components/client/`.** Anyone scanning the tree can see the entire JS budget in one folder. Use the `@/` alias already configured in `tsconfig.json` (verify) for imports.

### Component Boundaries

| Component | Type | Responsibility | Receives (props) | Communicates With |
|---|---|---|---|---|
| `layout.tsx` | Server | `<html lang="vi">`, fonts, global metadata/viewport, JSON-LD script, `<body>` | `children` | `content/site`, `lib/jsonld` |
| `page.tsx` | Server | Order of sections; anchors (`id="dich-vu"` etc.) | none | all sections |
| `Header` | Server | Logo, desktop nav, "Đặt lịch" CTA; hosts `MobileNav` | `nav`, `site` | `MobileNav` |
| `MobileNav` | **Client** | Open/close drawer, close on link click, Esc, body scroll lock | `items` | none |
| `Hero` | Server | LCP image (`lobby.jpg`, `priority`), headline, 2 CTAs (Đặt lịch, Gọi ngay) | `site` | optional `HeroVideo` |
| `About` | Server | Brand story, commitments | `site.about` | none |
| `Services` | Server | 5 service-group cards | `services[]` | none (CTA anchors to `#dat-lich`) |
| `Usp` | Server | 4 differentiators | `usp[]` | none |
| `SpaceGallery` | Server | 6 space photos in a responsive grid (`next/image`) | `gallery[]` | optional `Lightbox` |
| `VideoShowcase` | Server | Section heading + grid/carousel of vertical video cards | `videos[]` | `LazyVideo` |
| `LazyVideo` | **Client** | Poster first; load `src` only on click or when in view; one-at-a-time playback | `video`, `aspect` | none |
| `Team` | Server | Team photo(s), values | `team[]` | none |
| `Booking` | Server | Section heading and reassurance copy | `services`, `branches` | `BookingForm` |
| `BookingForm` | **Client** | Controlled fields, validation, success state, reset | `services`, `branches` | `lib/booking-schema` only |
| `Contact` | Server | 2 branch cards (address, `tel:` hotline, Maps link/embed), hours, Fanpage | `branches[]`, `site` | none |
| `Footer` | Server | Logo, copyright, social links | `site`, `branches` | none |
| `FloatingContact` | Server | Fixed mobile bar: Gọi / Zalo / Messenger (anchors) | `site` | none |

Two things worth being opinionated about:

1. **`FloatingContact` is not a client component.** It is three `<a>` tags with `position: fixed`. No state, no effects. Hide it on `lg:` with CSS if desired. This keeps the always-visible conversion path independent of hydration, which matters on a Facebook in-app browser over a slow connection.
2. **`BookingForm` receives data via props, it does not import `content/*` itself.** Importing the content arrays from a client file would work but couples the island to the data layer and would ship the whole arrays in the client bundle regardless of what the server section passes. Passing exactly `{ id, label }` pairs keeps the serialized props tiny and explicit.

### Data Flow

1. **Build time:** `content/*.ts` are plain exported `const` objects typed against `types/content.ts`. Server sections import them directly and render static HTML. No fetch, no API, no `await`. This makes the page fully prerenderable and compatible with `cacheComponents` with nothing to cache or suspend.
2. **Content to SEO:** `layout.tsx` calls `buildLocalBusinessJsonLd(site, branches)` and renders one `<script type="application/ld+json">`. Phone, address, hours and social links are therefore **single-sourced**: edit `branches.ts` once and the Contact section, footer, floating buttons and JSON-LD all update.
3. **Content to client islands:** a server section maps content to the minimal shape and passes it as props (`services.map(s => ({ id: s.id, label: s.name }))`). Props must be serializable: no functions, no JSX.
4. **Booking submit (client only):** `onSubmit` → `validate(values)` from `lib/booking-schema.ts` → if errors, set per-field error state and focus the first invalid field; if valid, set `status = "success"`, show the thank-you panel (with a fallback "or call hotline X" line, since nothing was actually sent), keep values until the user presses "Đặt lịch khác". **No `fetch`, no Server Action, no `localStorage`**, matching the "không lưu/gửi dữ liệu" requirement.
5. **Media:** images referenced by path strings inside content files, rendered with `next/image` (static assets from `public/`). Videos referenced by `{ src, poster, ... }`, rendered by `LazyVideo`, never through `next/image`.

## Patterns to Follow

### Pattern 1: Typed content layer (the "CMS in a file")

**What:** All copy, contact info, service lists and media references live in `src/content/*.ts`, typed by `src/types/content.ts`. Components contain layout and styling only, no Vietnamese strings except tiny UI labels (button text, aria-labels).
**When:** Always for this project. The client will ask to change a phone number, add a service, swap a photo; that edit should touch exactly one data file.
**Why not a headless CMS / MDX:** out of scope (no backend, one page, one editor). A typed TS file gives compile-time safety (missing `hotline` is a type error) at zero runtime cost.

```typescript
// src/types/content.ts
export type Branch = {
  id: "quan-3" | "phu-nhuan";
  name: string;            // "Chi nhánh Quận 3"
  address: string;         // "60A Cao Thắng, Phường Bàn Cờ, TP.HCM"
  hotline: string;         // display: "0899 607 279"
  tel: string;             // href:    "+84899607279"
  mapsUrl: string;
  hours: { opens: string; closes: string };   // "09:00", "21:00"
};

export type Service = {
  id: string;              // slug, also the <option value> in the booking form
  name: string;
  summary: string;
  image: { src: string; alt: string; width: number; height: number };
  video?: { src: string; poster: string };
};
```

```typescript
// src/content/branches.ts
import type { Branch } from "@/types/content";

export const branches = [
  {
    id: "quan-3",
    name: "Chi nhánh Quận 3",
    address: "60A Cao Thắng, Phường Bàn Cờ, TP.HCM",
    hotline: "0899 607 279",
    tel: "+84899607279",
    mapsUrl: "https://maps.app.goo.gl/81RXAydeguzGpkzF7",
    hours: { opens: "09:00", closes: "21:00" },
  },
  // phu-nhuan ...
] as const satisfies readonly Branch[];
```

Keep `width`/`height` in the content entries (they are in `docs/MEDIA.md`) so `next/image` reserves space and CLS stays at 0.

### Pattern 2: Server section, client island

**What:** The section is a Server Component that owns layout and copy. Interactive leaf is a small `'use client'` component imported into it. Never mark a whole section `'use client'` just because one button inside it needs state.
**Example:**

```tsx
// src/components/sections/booking.tsx  (Server)
import { BookingForm } from "@/components/client/booking-form";
import { services } from "@/content/services";
import { branches } from "@/content/branches";

export function Booking() {
  return (
    <section id="dat-lich" className="bg-sand-100 py-16">
      <Container>
        <SectionHeading title="Đặt lịch trải nghiệm" />
        <BookingForm
          services={services.map(({ id, name }) => ({ id, label: name }))}
          branches={branches.map(({ id, name }) => ({ id, label: name }))}
        />
      </Container>
    </section>
  );
}
```

### Pattern 3: Booking form as controlled state machine

**What:** `status: "idle" | "success"`, `values`, `errors`. Validation lives in `lib/booking-schema.ts` as a pure function so it can be unit-tested without React. Use `noValidate` on the `<form>` and your own messages (Vietnamese, specific), `inputMode="tel"`, `autoComplete="name"/"tel"`, and `aria-invalid` + `aria-describedby` per field.
**Validation rules to encode:** name required (min 2 chars); phone matches Vietnamese mobile (`/^(0|\+84)(3|5|7|8|9)\d{8}$/` after stripping spaces/dots; MEDIUM confidence on prefix list, confirm during the phase); service and branch required; preferred date required and not in the past; time within 09:00-21:00; note optional, max ~500 chars.
**Library?** Not needed. Five fields and one submit. `react-hook-form` + `zod` would be defensible but adds ~30 KB+ to a page whose competitive advantage is mobile speed. Hand-rolled is the better default; add a schema library only if validation grows.
**Do not use** a Server Action or route handler "just to return success". That reintroduces a server round trip and a potential data-handling question the client explicitly excluded.

### Pattern 4: Design tokens in Tailwind v4 `@theme`

**What:** All brand values are CSS variables declared in `globals.css` inside `@theme`; Tailwind v4 generates utilities (`bg-moss-600`, `text-ink`, `font-display`) from them. No `tailwind.config.js`. Components use **semantic** names, not raw hex.
**Why:** Matches how the installed Tailwind 4.3.3 works and keeps the green + beige palette tweakable in one block once the client reacts to the first review.

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Primitive scales (tune against logo-green.jpg and lobby.jpg) */
  --color-moss-50:  #f1f5ee;
  --color-moss-200: #cddcc4;
  --color-moss-500: #5f7f57;
  --color-moss-600: #4a6b44;   /* primary: buttons, headings accents */
  --color-moss-800: #2f4a2c;   /* deep green: footer, text on beige */
  --color-sand-50:  #fbf8f2;   /* page background (warm off-white) */
  --color-sand-100: #f4ecdd;   /* alt section background (beige) */
  --color-sand-300: #e3d3b8;
  --color-ink:      #2b2a26;   /* body text, warm near-black */
  --color-accent:   #8a2b3a;   /* OPTIONAL burgundy from the logo: use sparingly for CTA/hotline only */

  /* Fonts: mapped from next/font CSS variables set in layout.tsx */
  --font-sans:    var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-heading), ui-serif, Georgia, serif;

  /* Layout */
  --container-page: 72rem;
  --radius-card: 1.25rem;
  --shadow-soft: 0 10px 30px -12px rgb(47 74 44 / 0.25);
}

html { scroll-behavior: smooth; scroll-padding-top: 4.5rem; }  /* offset for sticky header */
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body { background: var(--color-sand-50); color: var(--color-ink); font-family: var(--font-sans); }
```

Notes:
- **Remove** the scaffold's `@media (prefers-color-scheme: dark)` block and the `Arial` body rule.
- Define `--font-sans`/`--font-display` inside `@theme` (not `@theme inline`) only if the referenced variables resolve at the same level; the scaffold uses `@theme inline` for font vars pointing at `next/font` variables, and that form is the safer one for `var(--font-…)` indirection. Keep `inline` for the font entries, normal `@theme` for literal colors.
- Contrast: green-on-beige and white-on-moss-600 must hit WCAG AA (4.5:1) for body text. Check `moss-600` on `sand-50` and white on `moss-600` when finalizing hex values; this is cheap to fix at token level and expensive to fix after 12 components use it.
- The logo is **burgundy**; the chosen direction is green + beige. Decide explicitly whether burgundy appears at all (recommended: only as a small accent for the hotline/CTA so the page still feels like the same brand as the logo/favicon). Flag this for the client.

### Pattern 5: Fonts with Vietnamese subset

**What:** Use `next/font/google` and request `subsets: ["latin", "vietnamese"]`; a latin-only subset renders Vietnamese diacritics from a fallback font and visibly breaks the design. Pair a calm serif display face with a clean sans body (candidates that ship a Vietnamese subset on Google Fonts: **Be Vietnam Pro** for body, **Cormorant Garamond** or **Playfair Display** for headings; MEDIUM confidence, verify the `vietnamese` subset exists for the chosen pair at implementation time and eyeball real headings such as "Điều trị mụn, thâm, nám" and "Phục hồi & tái tạo da").
Limit to 2 families and 2-3 weights total; set `display: "swap"` and expose as CSS variables (`--font-body`, `--font-heading`) that `@theme` consumes.

### Pattern 6: Media handling

**Images (`next/image`)**
- Reference files by `/images/...` path; give explicit `width`/`height` from `docs/MEDIA.md`.
- **Hero image is the LCP**: `priority` (or `preload`; confirm the prop name in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`), `sizes="100vw"`, no lazy.
- Everything below the fold: default lazy loading; always pass `sizes` (e.g. `sizes="(min-width: 1024px) 33vw, 100vw"`) so mobile does not download desktop widths.
- Alt text in Vietnamese, written for each image, stored in content files.
- Square 1080-1290 px photos crop well to `aspect-[4/5]` (mobile cards) and `aspect-square` (gallery). Use `object-cover` + `object-position` per image if faces/subjects get cut.
- **Do not use** `tet-team-*.jpg` as primary team imagery (Tết frame); use `team-selfie.jpg`. `consultation-small.jpg` (206x206) only as a thumbnail, never full width.
- Favicon/OG: `app/icon.jpg` and `app/apple-icon.jpg` copied from `public/images/brand/logo-red.jpg` (supported file conventions: `.ico/.jpg/.png/.svg` for `icon`, `.jpg/.png` for `apple-icon`). Keep the existing `favicon.ico` or replace it with one derived from the logo; the scaffold's default Vercel/Next `favicon.ico` must not ship.

**Video (`<video>`, not `next/image`)**
- Total video is **186 MB**; that cannot be on the critical path and should not ship uncompressed. Required pipeline step (its own task early in the roadmap): re-encode every kept video to H.264 + AAC, max 720 px wide for vertical, CRF ~26-28, `-movflags +faststart`, strip audio for decorative loops. Target roughly 1-3 MB for clips under 30 s and under ~10 MB for the 1-2 minute ones. Generate a **poster JPG** for each (first useful frame) into `public/images/video-posters/`. `ffmpeg` is not installed locally, so the task must include installing it (or doing it on another machine / CI).
- Drop or confirm `body-acupressure-lowres.mp4` (probable duplicate of `body-acupressure.mp4`); at 7 MB it may in fact be the better web file. Decide by viewing both.
- Curate: 11 videos on one landing page is too many for mobile. Recommend **4-6**: one hero loop (`facial-mask-short.mp4`, 1.8 MB, already fine), 1-2 space tours, and 3 service reels (head-spa, LED/lifting, body). The rest can be dropped from the page or linked later.
- `LazyVideo` (client): render `<video poster=… preload="none" playsInline controls>` with **no `src` until the user taps play** (or until it intersects the viewport, for muted loops). Set `width/height` or `aspect-ratio: 9/16` so there is no layout shift. Pause other videos when one starts (module-level ref or a tiny context). Respect `prefers-reduced-motion` (no autoplay) and `navigator.connection.saveData`.
- Hero video enhancer (optional client component): the static LCP image renders first; after hydration/idle, if motion is allowed and the connection is not save-data, mount a muted, looping `facial-mask-short.mp4` over it. This keeps LCP deterministic and first paint free of video bytes.
- **Hosting caveat (LOW confidence, verify before committing):** Vercel has deployment and per-file size limits and bandwidth metering, and the official Next.js videos guide recommends external/object storage (e.g. Vercel Blob) for larger self-hosted video. After compression the set will probably fit in `public/`, but if the compressed total stays above a few tens of MB, move video to Vercel Blob/R2 and keep only `src` URLs in `content/videos.ts`. Because paths live in the content layer, this swap touches one file.

### Pattern 7: Metadata, SEO and structured data placement

| Concern | Where | How |
|---|---|---|
| Title, description, keywords, canonical, `lang` | `app/layout.tsx` | `export const metadata: Metadata = { metadataBase: new URL(site.url), title: { default, template }, description, alternates: { canonical: "/" }, openGraph: { type: "website", locale: "vi_VN", siteName, images }, … }`. Single route, so layout vs page is equivalent; layout keeps `page.tsx` logic-free. |
| Viewport / theme color | `app/layout.tsx` | separate `export const viewport: Viewport = { themeColor: "#4a6b44" }` (Next separates `viewport` from `metadata`; both exports are Server Component only). |
| Open Graph image | `app/opengraph-image.jpg` | File convention, Next generates the `og:image` tags with size/type automatically. Make a 1200x630 composite (logo + lobby photo); the 500x500 logo alone crops badly in link previews. Facebook is the main traffic source, so verify the preview with Facebook's Sharing Debugger after first deploy. |
| Icons | `app/icon.jpg`, `app/apple-icon.jpg`, `app/favicon.ico` | File conventions, no manual `<link>`. |
| LocalBusiness JSON-LD | `app/layout.tsx` `<script type="application/ld+json">` | Built by `lib/jsonld.ts` from `content/site` + `content/branches`. **Use `HealthAndBeautyBusiness` (or `DaySpa`, a `schema.org` subtype of `HealthAndBeautyBusiness`) with one entry per branch** (`@graph` array, or `department` / `branchOf`) because the two branches have different addresses and phones. Include `openingHoursSpecification` (09:00-21:00, all seven days), `telephone`, `address` (`PostalAddress`, `addressCountry: "VN"`, `addressLocality: "Hồ Chí Minh"`), `image`, `url`, `sameAs: [fanpage]`. Escape `<` as `\u003c` when stringifying (the bundled docs recommend this). Do **not** invent `priceRange`, ratings or geo coordinates; only use client-provided facts. |
| robots / sitemap | `app/robots.ts`, `app/sitemap.ts` | Optional but 10 lines each; needed so Search Console accepts the site. |
| Heading structure | sections | Exactly one `<h1>` (in Hero); `<h2>` per section; the page is still crawled as a document, so keep all copy in Server Components rendered to HTML. |

Keep all section copy server-rendered. The Next docs state crawlers that don't run JS only see the first HTML response; nothing important (services, addresses, hours) may be gated behind a client-only render.

### Pattern 8: One-page navigation

Sections get stable Vietnamese-free ASCII anchor ids (`#gioi-thieu`, `#dich-vu`, `#khong-gian`, `#doi-ngu`, `#dat-lich`, `#lien-he`). Header links and CTAs are plain `<a href="#...">` (or `next/link` with hash) with CSS `scroll-behavior: smooth` and `scroll-padding-top` for the sticky header. No scroll-spy library or JS scroll handling needed. If an active-link highlight is wanted later, add a small IntersectionObserver in `MobileNav`/`Header` as an enhancement, not as v1.

## Anti-Patterns to Avoid

### Anti-Pattern 1: `'use client'` on `page.tsx` or on whole sections
**What:** Marking the page or a section as client because one child needs `useState`.
**Why bad:** Ships all section JS and image components' client wrappers, hydrates the entire page, hurts LCP/INP on low-end Android, which is the primary audience.
**Instead:** Server sections, client leaves in `components/client/`.

### Anti-Pattern 2: Hard-coding copy, phone numbers and addresses inside JSX
**What:** Hotline typed in Hero, Contact, Footer, FloatingContact and JSON-LD separately.
**Why bad:** Five places to forget when the number changes; JSON-LD silently drifts from what users see (hurts local SEO trust).
**Instead:** `content/site.ts` and `content/branches.ts`, derived `tel:` hrefs.

### Anti-Pattern 3: Autoplaying many videos / shipping `public/videos` as-is
**What:** 11 `<video autoplay>` tags pointing at 186 MB of source files.
**Why bad:** Burns the visitor's mobile data on a Facebook in-app browser, destroys LCP and Lighthouse, and risks Vercel deploy/bandwidth limits.
**Instead:** Compress, curate 4-6, poster-first `LazyVideo`, `preload="none"`.

### Anti-Pattern 4: A fake backend for the form
**What:** Server Action / API route / `console.log` of data "to be wired up later" in production code.
**Why bad:** Contradicts the explicit requirement; invites accidental PII logging on Vercel; creates the false belief that bookings are being received (the business actually takes bookings via hotline/Fanpage).
**Instead:** Pure client success state, with copy that tells the user the spa will contact them is **risky** because nothing is sent. Use honest copy such as "Cảm ơn bạn! Để được xác nhận nhanh nhất, vui lòng gọi hotline..." with the hotline and Zalo buttons right in the success panel. Raise this with the client; it is a business-risk decision, not just a UI one.

### Anti-Pattern 5: Using `new Date()` for the date picker's `min` during render
**What:** `<input type="date" min={new Date().toISOString().slice(0,10)}>` evaluated in render.
**Why bad:** With `cacheComponents: true` this is a prerender error (blocking current time), and even without it, a statically built page would bake in the **build date** as the minimum.
**Instead:** Compute "today" in `useEffect` (store in state) or only inside the submit handler; render the input without `min` initially.

### Anti-Pattern 6: Dark-mode leftovers and default scaffold assets
**What:** Keeping the scaffold's dark `prefers-color-scheme` CSS, Geist fonts, `lang="en"`, `next.svg`/`vercel.svg` in `public/`.
**Why bad:** Beige/green brand turns black on dark-mode phones; wrong language hint hurts SEO and screen readers; default favicon/title ship to production.
**Instead:** Clean-up is the first task of the foundation phase.

### Anti-Pattern 7: Premature abstraction
**What:** Generic `<Section variant=… layout=…>` mega-component, i18n framework, CMS adapter.
**Why bad:** One page, one language, ~11 sections. Complexity cost with no payoff.
**Instead:** A thin `Section` + `Container` + `SectionHeading` trio, then bespoke markup per section.

## Suggested Build Order (dependencies)

```
1. Foundation ─────────► 2. Content layer ───► 3. Layout shell + primitives ─► 4. Static sections ──┐
 (cleanup, tokens,        (types + all data      (Header, Container, Section,   (Hero, About,          │
  fonts, lang, icons)      files, media paths)     Footer, FloatingContact)       Services, Usp,         ├─► 7. SEO + a11y + perf
                                                                                  Space, Team, Contact)  │      pass, deploy
 Parallel track A: Video pipeline (compress, posters, curate) ──► 5. LazyVideo + VideoShowcase ───────────┤
 Parallel track B: ─────────────────────────────────────────────► 6. BookingForm (schema → UI → success) ──┘
```

| Order | Component group | Depends on | Why this order |
|---|---|---|---|
| 1 | **Foundation**: delete scaffold page/CSS dark mode/default assets, `lang="vi"`, fonts (vietnamese subset), `@theme` tokens, icons from logo | none | Every later component consumes tokens and fonts; changing them late means touching every file. Also surfaces the `cacheComponents` constraints immediately. |
| 2 | **Content layer**: `types/content.ts`, `site`, `branches`, `services`, `usp`, `team`, `gallery`, `videos`, `nav` with real Vietnamese copy and image paths/alt text | 1 (for nothing but folder structure) | Sections, form, JSON-LD and floating buttons all read from here. Writing real content early also exposes missing facts (Zalo number, Messenger link, team names) while the client is still reachable. |
| 3 | **Shell and primitives**: `Container`, `Section`, `SectionHeading`, `Button`, `Header` + `MobileNav`, `Footer`, `FloatingContact` | 1, 2 | The conversion path (call / Zalo / Messenger / "Đặt lịch" anchor) is the Core Value; it should exist before any decorative section. |
| 4 | **Static sections**: Hero, About, Services, Usp, SpaceGallery, Team, Contact | 2, 3 | Pure Server Components, parallelizable, low risk. Hero is first (LCP). |
| 5 | **Video**: compression/curation/poster pipeline (can start at step 1 as a parallel task), then `LazyVideo` + `VideoShowcase` (+ optional hero video) | 2 (`videos.ts`), pipeline | Highest perf risk; isolating it means the rest of the site is shippable without it. |
| 6 | **BookingForm**: `booking-schema.ts` (+ tests), form UI, success state, mobile ergonomics | 2 (services/branches), 3 (Button/tokens) | Self-contained island; depends only on the data arrays and tokens, so it can be built in parallel with step 4/5. |
| 7 | **SEO/a11y/perf/deploy**: metadata, OG image, JSON-LD, robots/sitemap, Lighthouse mobile run, keyboard/screen-reader pass, Vercel deploy and preview check | all | Verification phase; JSON-LD needs final branch data, OG image needs final hero art. |

Suggested roadmap grouping (coarse): **Phase 1** = steps 1-3 (foundation + content + shell); **Phase 2** = step 4 (all static sections, page visually complete); **Phase 3** = step 6 (booking form); **Phase 4** = step 5 (video); **Phase 5** = step 7 (SEO, polish, deploy). Start the video compression task during Phase 1 as a background chore because it involves tooling setup and manual review of footage.

## Scalability Considerations

This is a static marketing page; "scale" means traffic spikes (a Facebook post going viral) and content growth, not data volume.

| Concern | At 100 users | At 10K users | At 1M users |
|---|---|---|---|
| Rendering | Prerendered static HTML on Vercel CDN | Same; no server work per request | Same; CDN-cached |
| Images | `next/image` optimization on demand (small source set, 2.8 MB) | Optimized variants cached at the edge after first hit | Same; consider limiting `qualities`/`deviceSizes` to reduce transformation counts on the Vercel plan |
| Video bandwidth | Negligible | Matters on the free plan; poster-first/lazy load avoids loading unwatched video | Move video to object storage/CDN with caching headers; only way this becomes a cost |
| Form | No backend; no load | No backend | No backend (if/when a backend is added, put it behind a Server Action or route handler with rate limiting + spam protection, e.g. honeypot/Turnstile) |
| Content changes | Edit `content/*.ts`, redeploy | Same | Consider a CMS only if non-developers must edit often |

## Open items to flag for the roadmap

- **Zalo and Messenger targets are unknown.** `PROJECT.md` has the Fanpage URL (`facebook.com/SpabeauteYenhcm`) but no Zalo number/OA link. Messenger can use `https://m.me/SpabeauteYenhcm` (derived from the page handle, verify it opens the right page). Zalo needs the client's number or OA id; until then, the floating bar may ship with Gọi + Messenger only.
- **Google Maps:** the provided link is a share link (`maps.app.goo.gl`), fine for an "Chỉ đường" button. An embedded `<iframe>` map needs an embed URL per branch (obtainable from Google Maps "Share > Embed a map", no API key). Embedding two iframes is heavy; lazy-load them (`loading="lazy"`, and give an `aspect-ratio`) or use a static image + button.
- **"Yên Skinlab" naming** appears on photos/videos, while the site brand is "Yên Spa & Beaute"; copy should consistently use the latter. Decide whether to mention Skinlab in About.
- **Burgundy vs green** brand color decision (see tokens).
- **Team names/roles** are not provided; use "Đội ngũ kỹ thuật viên" collective copy rather than inventing individuals.

## Sources

- Bundled Next.js 16.4.6 docs (HIGH confidence), under `D:/projects-cv/demo_9_11_2026/yen_sapa/node_modules/next/dist/docs/01-app/`:
  - `02-guides/server-and-client-boundary.md` (server/client boundary, crawler/SEO note)
  - `02-guides/videos.md` (`<video>` attributes, poster, dimensions, external hosting such as Vercel Blob)
  - `02-guides/json-ld.md` (JSON-LD in layout/page, `<` escaping)
  - `02-guides/lazy-loading.md` (`next/dynamic`, Client Component code splitting)
  - `02-guides/migrating-to-cache-components.md`, `01-getting-started/08-caching.md` (synchronous IO rules under `cacheComponents`)
  - `01-getting-started/13-fonts.md`, `01-getting-started/14-metadata-and-og-images.md`, `03-api-reference/03-file-conventions/01-metadata/` (`icon`, `apple-icon`, `opengraph-image`, `robots`, `sitemap`), `03-api-reference/04-functions/generate-viewport.md`
- Repo inspection (HIGH): `package.json`, `next.config.ts`, `src/app/{layout,page}.tsx`, `src/app/globals.css`, `AGENTS.md`, `.planning/PROJECT.md`, `docs/MEDIA.md`, `du` of `public/videos` and `public/images`.
- Not verified externally (MEDIUM/LOW, marked inline): Vietnamese-subset availability for specific Google Fonts, Vietnamese phone regex prefixes, `DaySpa` / `HealthAndBeautyBusiness` schema.org typing choices, Vercel deployment/bandwidth limits for large static video, `m.me/<handle>` link behavior.
