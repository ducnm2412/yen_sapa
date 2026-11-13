---
phase: quick-261113-knm
plan: 01
type: execute
wave: 1
depends_on: []
quick_id: 261113-knm
slug: sig-1211-220-602-banner-about-services
date: 2026-11-13
files_modified:
  - src/components/signature/SIG-1211/SIG-1211.tsx
  - src/components/signature/SIG-1211/README.md
  - src/components/signature/SIG-220/SIG-220.tsx
  - src/components/signature/SIG-220/README.md
  - src/components/signature/SIG-602/SIG-602.tsx
  - src/components/signature/SIG-602/README.md
  - src/components/BannerAboutStack.tsx
  - src/components/BannerSection.tsx
  - src/components/AboutSection.tsx
  - src/components/ServicesSection.tsx
  - src/components/motion/MotionSystem.tsx
  - src/content/site.ts
  - src/app/page.tsx
  - .planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs
autonomous: true
requirements: [QUICK-261113-knm]

must_haves:
  truths:
    - "Scrolling past the storefront banner, the 'Về Yên Spa' section slides up over it as a card with rounded top corners while the banner scales down slightly and dims; scrolling back reverses it exactly (D-01, SIG-1211)"
    - "The SIG-1211 overlap adds zero scroll length: its root height equals banner height + About height (within 2px), no pin-spacer is created, and desktop total pinned scroll stays <= 1 viewport (0.9 expected) (D-01, D-04)"
    - "The storefront image is shown complete (rendered ratio matches 1942x809, nothing cropped) with its original alt text unchanged (D-01)"
    - "About shows the 7 customer photos (photo-diary-1..4, yen-capture-1..3) as tilted polaroids: on desktop with a mouse they are scattered and draggable and can never leave their table; below 768px they are a horizontal swipe rail with scroll-snap; at rest no photo is distorted; each has an honest Vietnamese alt; the lobby photo is no longer in About; heading, lead text, CTA and the 3 stat counters are unchanged (D-02)"
    - "Only the 'Triệt lông OPT' services card has a gold light running around its border; the 4-card grid and all card content are unchanged; with reduced motion the border is a static gold line (D-03)"
    - "prefers-reduced-motion: banner is in normal flow (not sticky, not scaled, no overlay), polaroids are static and visible, glow is static; every element is visible (D-04)"
    - "npm run lint and npm run build pass; at 1280, 375 and reduced: 0 horizontal overflow, 0 hidden reveal elements, 0 console errors, every reveal variant <= 2, anchors #gioi-thieu and #dich-vu land under the header (D-05)"
  artifacts:
    - path: "src/components/signature/SIG-1211/SIG-1211.tsx"
      provides: "Card-over section transition (client), CSS sticky + scrub, no pin"
      contains: "DUDI Signature SIG-1211"
    - path: "src/components/signature/SIG-220/SIG-220.tsx"
      provides: "Polaroid table: desktop drag scatter, mobile snap rail (client)"
      contains: "DUDI Signature SIG-220"
    - path: "src/components/signature/SIG-602/SIG-602.tsx"
      provides: "Glowing border runner ring for one card (client)"
      contains: "DUDI Signature SIG-602"
    - path: "src/components/BannerAboutStack.tsx"
      provides: "Server wrapper: SIG-1211 with Banner (outgoing) and About (incoming) and theme vars"
      contains: "Sig1211CardOver"
    - path: ".planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs"
      provides: "Playwright metrics + screenshots for SIG-1211/220/602 and the page-wide budgets"
  key_links:
    - from: "src/app/page.tsx"
      to: "src/components/BannerAboutStack.tsx"
      via: "<BannerAboutStack /> replaces the old relative wrapper around Banner + About"
      pattern: "BannerAboutStack"
    - from: "src/components/BannerAboutStack.tsx"
      to: "src/components/signature/SIG-1211/SIG-1211.tsx"
      via: "outgoing={<BannerSection />} incoming={<AboutSection />}"
      pattern: "outgoing=\\{<BannerSection"
    - from: "src/components/AboutSection.tsx"
      to: "src/components/signature/SIG-220/SIG-220.tsx"
      via: "<SIG220 items={site.aboutPolaroids} ... /> in the right column"
      pattern: "aboutPolaroids"
    - from: "src/components/ServicesSection.tsx"
      to: "src/components/signature/SIG-602/SIG-602.tsx"
      via: "<Sig602GlowRing /> rendered inside the triet-long card only"
      pattern: "Sig602GlowRing"
---

<objective>
Port three DUDI Signatures into the live one-pager, following the conventions of quick task 261113-jgz:

1. **SIG-1211 "Section sau đè như tấm thẻ"** replaces the hand-written Banner→About overlap (D-01).
2. **SIG-220 "Ảnh polaroid rải bàn"** replaces the lobby photo in About with 7 real customer photos (D-02).
3. **SIG-602 "Viền sáng chạy quanh gói nổi bật"** highlights the single "Triệt lông OPT" services card (D-03).

Purpose: give Banner→About a real section transition and give About real customer proof without adding pinned scroll (Motion level 3 site, no WebGL; SIG-1211 is Motion 4, which the owner approved as an exception. Record it in the summary).
Output: three ported signatures with README port notes, a server wrapper, edited Banner/About/Services/MotionSystem/page/site, and an extended browser verification script with screenshots.

**Locked decisions (owner-approved, from the task description):**
- D-01: SIG-1211 replaces the old overlap (Banner's own sticky classes and overlap hook attributes, About's rounded top + shadow, and MotionSystem's "Overlapping scroll sections" block). About slides over Banner as a rounded card; Banner scales down and dims. CSS sticky + scrub only, no pin-spacer, no extra scroll. Storefront image stays complete with its alt text. Dead overlap code removed.
- D-02: SIG-220 inside AboutSection using photo-diary-1..4 and yen-capture-1..3 (not the 206px thumbnail). Desktop: scattered, tilted, draggable. Mobile: horizontal swipe rail with scroll-snap. Never distorted at rest. Heading, text and stat counters kept. Captions only if facts exist (none exist, so none). Honest Vietnamese alt text.
- D-03: SIG-602 on the "Triệt lông OPT" card only (`site.serviceGroups` id `triet-long`), gold #b8975a (gold-500) / gold-300 (#d8c08a). 4-card grid and content kept. Reduced motion shows a static border.
- D-04: Motion level 3, no WebGL, no new pinned scroll (desktop total <= 1 viewport, currently 0.9). Below 768px no pins. prefers-reduced-motion: static and fully visible. Reveal effects at most 2 per variant on the home page.
- D-05: Verify with `npm run lint`, `npm run build`, and the browser script at 1280 / 375 / reduced (pins, hidden reveals, overflow, console errors, anchors); screenshots of Banner/About/Services into this quick dir's `shots/` (gitignored).
- D-06: **Do not commit.** Leave all changes in the working tree; the orchestrator commits and pushes.

**Planner discretion choices (record them in the summary):**
- SIG-1211 at intensity 2 (scale 0.92, overlay 0.5) with `radius="3rem"` and a moss-950 overlay, close to the old feel (scale 0.9, brightness 0.55). Overlay colour is moss, not the default beige, so the banner darkens rather than washing out.
- SIG-1211's CSS sticky stays active on mobile (README mobile version, lighter values). It is not a pin: it adds 0px of scroll and creates no pin-spacer, the same as the old banner, which was sticky on mobile too. The verify script measures this.
- SIG-220 replaces the lobby photo (removes the lobby duplication with the SIG-505 space grid). The floating "Chăm da khoa học" card that sat on the lobby photo is removed as well: its link goes to the same `#dich-vu` as the "Tìm hiểu thêm" button, its text repeats the h2, and it would sit on top of draggable photos. The outline "01" numeral stays as the backdrop.
- SIG-220 dragging only for fine pointers (mouse/pen) at >= 768px. Touch tablets at >= 768px get the static scatter, so a finger starting on a polaroid still scrolls the page.
- SIG-602 is ported as a masked ring that sits inside the card (not the source's padded pricing-table wrapper). It moves with the card's hover lift and leaves card size and grid untouched. No "Được đề xuất" badge: that would be a new editorial claim, and the card's own sub-line "Trải nghiệm vùng nách 49K" already explains the highlight. Intensity 1 (calm, about 5s per loop on desktop).
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.claude/CLAUDE.md
@.planning/STATE.md
@.planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/261113-jgz-SUMMARY.md
@.planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs
@.agents/skills/phoi/assets/signature/SIG-1211/README.md
@.agents/skills/phoi/assets/signature/SIG-1211/SIG-1211.tsx
@.agents/skills/phoi/assets/signature/SIG-220/README.md
@.agents/skills/phoi/assets/signature/SIG-220/SIG-220.tsx
@.agents/skills/phoi/assets/signature/SIG-602/README.md
@.agents/skills/phoi/assets/signature/SIG-602/SIG-602.tsx
@src/components/BannerSection.tsx
@src/components/AboutSection.tsx
@src/components/ServicesSection.tsx
@src/components/motion/MotionSystem.tsx
@src/app/page.tsx
@src/components/BrandSentence.tsx
@src/components/signature/SIG-505/SIG-505.tsx

Facts gathered during planning (do not re-derive):
- Customer photos are all square: photo-diary-1 is 936x936; photo-diary-2..4 and yen-capture-1..3 are 1080x1080. yen-capture-* are designed posts with printed text ("YÊN CAPTURE / Yêu mình một cách Yên lành", Yên logo, camera-viewfinder frame) and must never be cropped. photo-diary-1 shows a group of eight people on the lobby sofa holding "YÊN SPA" / "YÊN BEAUTE" signs. yen-capture-1 shows customers seated at round tables in the lobby, inside the Yên Capture frame.
- Theme tokens (globals.css `@theme inline`): beige-50 #f8f3ea, beige-100, moss-900 #263020, moss-950 #1c2417, gold-300 #d8c08a, gold-500 #b8975a; `--header-h` 4rem (5rem from 640px); html `scroll-padding-top: 5rem`. Tailwind v4 `rounded-sm` maps to `--radius-sm`.
- Header is `fixed ... z-40`. Any z-index stack inside About must be isolated so it can never paint over the header.
- `.service-card:hover` lifts the card with `translateY(-6px)` (globals.css), and the card `<a>` has `overflow-hidden`.
- Signature ports keep their CSS in a component-scoped `<style>` element inside the signature file (SIG-01/505/305 do this). The `--sig-*` variables are set by a server wrapper from theme tokens (BrandSentence.tsx pattern).
- `eslint.config.mjs` already ignores `.agents/**`, so `npm run lint` is expected to pass.
- Cache Components is on: random numbers or current-time calls during render are a build error. Use fixed data only.
- Old jgz verify script: SIG-01 is located with the first `[data-sig-sticky]` match, so no new component may use that attribute. It also recorded an informational banner-position metric that queried the removed overlap attribute; that metric is replaced here.
- Home reveal tally before this task: strips 2, chars 2, line 2, words 2, fade-up 2, stagger 2, blur 2, blur-words 2, mask-right 1, slide-left 1, clip-center 1. Expected after: strips 1 and blur 1 (the About photo strips and the floating card are gone); everything else unchanged.
</context>

<tasks>

<task type="tracer">
  <name>Task 1 (tracer): SIG-1211 card-over wired end-to-end for Banner → About, old overlap removed</name>
  <files>src/components/signature/SIG-1211/SIG-1211.tsx, src/components/signature/SIG-1211/README.md, src/components/BannerAboutStack.tsx, src/components/BannerSection.tsx, src/components/AboutSection.tsx, src/components/motion/MotionSystem.tsx, src/app/page.tsx</files>
  <action>
Implements D-01 and D-04. Port convention as in jgz: client component, version header, README with a "Port notes (Yên Spa, Next.js)" section.

1. Create `src/components/signature/SIG-1211/SIG-1211.tsx` by porting `.agents/skills/phoi/assets/signature/SIG-1211/SIG-1211.tsx`. Keep the source logic: `gsap.matchMedia` with desktop `(min-width: 768px) and (prefers-reduced-motion: no-preference)` and mobile `(max-width: 767px) and (prefers-reduced-motion: no-preference)` and no reduced branch. Keep `setTop` (sticky top = innerHeight minus the stick wrapper's offsetHeight), the mobile skipScale rule, the scrub timeline (trigger card, start "top bottom", end "top top", `scrub: true`, `invalidateOnRefresh: true`) for inner scale, inner radius, overlay opacity and card top-corner radius, the ResizeObserver plus `refreshInit` re-measure, the image-decode and `document.fonts.ready` refresh, and the full cleanup. Port changes:
   - First line `"use client";`, then `// DUDI Signature SIG-1211 v1.0.0 — Card-over Section Transition` and `// Ported to Next.js for Yên Spa — see README Port notes`. Import gsap the same way SIG-505 does. Export `Sig1211CardOver` plus a default export. Keep the `Sig1211Props` names and add `style?: CSSProperties`, merged into the root style so the wrapper can pass `--sig-*` variables.
   - Data hooks: root `data-sig="1211"`, stick wrapper `data-sig1211-stick`, inner `data-sig1211-inner`, overlay `data-sig1211-overlay`, card `data-sig1211-card`. Do NOT use the attribute name SIG-01 uses for its sticky block (the verify script finds SIG-01 by its first match).
   - Drop the root's inline `color` and `fontFamily`, because both slots are site sections that bring their own type and colours. Keep `position: relative`, `overflowX: clip` and `scrollMarginTop`.
   - Card shadow reads `var(--sig-card-shadow, <source shadow>)`.
   - Return `() => mm.revert()` from the useGSAP callback, so the reverted state is explicit.
2. Create `src/components/signature/SIG-1211/README.md`: the source README verbatim plus a "## Port notes (Yên Spa, Next.js)" section. List the changes above, the data hooks, the `style` prop, and the note "Min Motion level 4: owner-approved exception on this Motion-3 site (quick 261113-knm)". Explain that mobile CSS sticky adds 0px of scroll and no pin-spacer.
3. Create the server component `src/components/BannerAboutStack.tsx` (no "use client"; same role as BrandSentence.tsx). It renders `Sig1211CardOver` with `intensity={2}`, `radius="3rem"`, `overlayColor="var(--color-moss-950)"`, `outgoing={<BannerSection />}` and `incoming={<AboutSection />}`. Pass `style` with `--sig-bg: var(--color-beige-50)` and `--sig-card-shadow: 0 -30px 60px -30px rgba(38,48,32,0.35)` (the shadow About used to carry). Do NOT pass `incomingId`: the id `gioi-thieu` stays on About's own section, so there is no duplicate id. Add a short Vietnamese doc comment: banner giữ lại, "Về Yên Spa" trượt lên đè như tấm thẻ (SIG-1211).
4. `src/components/BannerSection.tsx`: from the `<section>`, remove the overlap hook attribute and the sticky positioning classes (the sticky class, its top offsets at both breakpoints, and the z-index class). Keep `aria-label`, `bg-beige-50` and all padding classes. Remove the inner wrapper div that carried the second overlap hook attribute (with its origin and will-change classes) and promote its child, the strips-reveal frame, to be the direct child. Keep the image `src`, the full `alt` text verbatim, `width={1942}`, `height={809}`, `sizes`, `h-auto w-full`, and the strips overlay unchanged. Update the doc comment: SIG-1211 now holds the banner, which has no sticky of its own.
5. `src/components/AboutSection.tsx` (section element only in this task): remove the z-index class, both top-rounding classes and the drop-shadow class from the `<section id="gioi-thieu">` className; SIG-1211's card now provides the rounded corners and shadow. Keep `id`, `relative`, `bg-beige-50` and all padding classes. Change nothing else in this task.
6. `src/components/motion/MotionSystem.tsx`: delete the whole "Overlapping scroll sections" block (its comment and the forEach that scaled and darkened the inner banner layer). Leave every other block untouched, including the strips reveal that follows it.
7. `src/app/page.tsx`: replace the comment plus the `<div className="relative">` that wrapped BannerSection and AboutSection with `<BannerAboutStack />` and a one-line comment. Import BannerAboutStack and remove the now-unused BannerSection and AboutSection imports.
  </action>
  <verify>
    <automated>cd D:/projects-cv/demo_9_11_2026/yen_sapa && npx tsc --noEmit && npm run lint && ! grep -rn "data-stack" src && ! grep -q "top-16" src/components/BannerSection.tsx && ! grep -q "rounded-t-" src/components/AboutSection.tsx && grep -q "DUDI Signature SIG-1211" src/components/signature/SIG-1211/SIG-1211.tsx && grep -q "Port notes" src/components/signature/SIG-1211/README.md && grep -q "Sig1211CardOver" src/components/BannerAboutStack.tsx && grep -q "BannerAboutStack" src/app/page.tsx && npm run build</automated>
  </verify>
  <done>Build, type-check and lint pass. The page renders Banner (outgoing) and About (incoming) through SIG-1211. No source file references the old overlap hooks. Banner has no sticky classes of its own and About has no rounded top or shadow classes of its own. The storefront image and its alt text are byte-identical to before.</done>
</task>

<task type="auto">
  <name>Task 2: SIG-220 polaroid table in About + SIG-602 glow ring on the "Triệt lông OPT" card</name>
  <files>src/components/signature/SIG-220/SIG-220.tsx, src/components/signature/SIG-220/README.md, src/components/signature/SIG-602/SIG-602.tsx, src/components/signature/SIG-602/README.md, src/content/site.ts, src/components/AboutSection.tsx, src/components/ServicesSection.tsx</files>
  <action>
Implements D-02, D-03 and D-04. No new npm packages. Use next/image only, never a raw img element. No random numbers or current-time calls (Cache Components build rule).

**A. Content (D-02).** Use the Read tool to look at each of the 7 photos in `public/images/customers/` (photo-diary-1..4, yen-capture-1..3) before writing alt text. In `src/content/site.ts` add `aboutPolaroids`: an array of 7 entries `{ src, alt, width, height }`. Interleave the order: photo-diary-1, yen-capture-1, photo-diary-2, yen-capture-2, photo-diary-3, yen-capture-3, photo-diary-4. Width and height are 936 for photo-diary-1 and 1080 for the rest. Each alt starts with "Khách hàng tại Yên Spa", followed by a short, literal description of what is visible: no names, no treatment-result claims, no invented facts, full Vietnamese diacritics. Example for photo-diary-1: "Khách hàng tại Yên Spa: nhóm bạn cầm bảng chữ Yên Spa chụp ảnh ở sảnh chờ". No captions (no facts exist for them). Do not use the 206px thumbnail.

**B. SIG-220 port** `src/components/signature/SIG-220/SIG-220.tsx` from `.agents/skills/phoi/assets/signature/SIG-220/SIG-220.tsx`. Header as in Task 1 (`"use client";`, `// DUDI Signature SIG-220 v1.0.0 — Polaroid Scatter Hero`, ported line). Export `SIG220` plus default. It is embedded, not a hero:
   - Root is a `div` with `data-sig="220"`. No h1 or heading props (About owns the h2). Props: `items` (src, alt, width, height, optional caption, optional isResultPhoto), `intensity`, `className`, and `labels` `{ group, dragHint, swipeHint }`.
   - Markup: a `ul` with `data-sig220-table`, `aria-label={labels.group}` and `position: relative; isolation: isolate`, so z-index raised by dragging can never paint over the fixed header. Each `li` has `data-sig220-card` and is a polaroid: white frame, 0.75rem padding top and sides, 2.25rem blank bottom strip (render a caption only if one is provided), and a square photo box with `overflow: hidden` and a beige-100 background holding `next/image` with `fill`, `object-contain` (square source in a square box, so nothing is cropped or distorted, which matters most for the yen-capture posts), `draggable={false}`, `pointer-events: none`, and `sizes="(min-width: 1024px) 184px, (min-width: 768px) 160px, 62vw"`. Soft shadow in moss tone.
   - CSS-first layout in a component-scoped `<style>` element (SIG-01/505 convention), so SSR, no-JS and reduced motion all show a finished layout. Below 768px the `ul` is a horizontal rail: flex, gap 1rem, `overflow-x: auto`, `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, hidden scrollbar, `padding-block: 1.5rem` so tilted corners are not clipped, and negative inline margin plus matching inline padding equal to About's side padding (1rem, 1.5rem from 640px), so the rail bleeds to the card edges without page overflow. Cards are `flex: none; width: min(62vw, 15rem); scroll-snap-align: center` with an alternating tilt of plus or minus 2deg from a per-card CSS variable. At 768px and up the `ul` is a block of fixed height (30rem; 34rem from 1024px) with `--cw` 10rem (11.5rem from 1024px) and `--ch: calc(var(--cw) + 1.5rem)`. Each card is `position: absolute; width: var(--cw)` with `left: calc((100% - var(--cw)) * var(--fx))`, `top: calc((100% - var(--ch)) * var(--fy))` and the CSS `rotate` property from `--r`, so every rest position is inside the table at every width. Per-card inline variables come from a fixed SCATTER7 list (fx, fy, rot in deg): (0.02, 0.04, -8), (0.50, 0.00, 5), (0.98, 0.10, -4), (0.14, 0.52, 7), (0.56, 0.44, -6), (0.96, 0.62, 4), (0.40, 0.98, -3). Tune the values only if the screenshots show a photo fully hidden.
   - Motion with GSAP (transform x/y offsets from the CSS rest position; rest tilt stays in CSS `rotate`). Use `gsap.matchMedia` with conditions desktop `(min-width: 768px)`, motion `(prefers-reduced-motion: no-preference)` and fine `(hover: hover) and (pointer: fine)`.
     - When desktop and motion are both true: drop-in. On setup, set the cards to autoAlpha 0, y -120*factor and an extra rotation of plus or minus 8*factor. A ScrollTrigger on the table (start "top 75%", once) then tweens them to autoAlpha 1, y 0, rotation 0 (duration 0.78*factor, stagger 0.11*factor, ease back.out(1.3)). If the table is already past the start when the trigger is created (deep link or reload mid-page), show the cards immediately at rest so nothing can stay hidden.
     - When desktop, motion and fine are all true: interactive mode. Set a client state flag, which adds `cursor: grab`, `touch-action: none`, `user-select: none`, `tabIndex=0` and a visible gold focus ring. Run the source physics on `gsap.ticker` (SPRING 0.2, FRICTION 0.84, pointer capture, bring-to-front through z state, arrow-key nudge of 16), plus the source IntersectionObserver and visibilitychange guard. Port addition: clamp each card's offset so its box stays inside the table with an 8px inset. Bounds come from the table's clientWidth/clientHeight and the card's offsetLeft/offsetTop/offsetWidth/offsetHeight; recompute on pointerdown and on resize. When clamped, zero that velocity component (no bounce). Pointer handlers and key handlers do nothing unless interactive.
     - Reduced motion or touch-only: no tweens, not interactive, cards fully visible at their CSS rest positions (scatter at 768px and up, rail below).
   - Hints: when interactive, render `labels.dragHint` under the table (small, muted, right-aligned). It is client state only, so SSR outputs nothing and there is no hydration mismatch. Always render `labels.swipeHint` under the rail, hidden from 768px.
   - README `src/components/signature/SIG-220/README.md`: the source README plus "## Port notes (Yên Spa, Next.js)". Cover: embedded div instead of a hero section; 7 slots (the source allows 6); CSS-first percentage scatter plus the mobile snap rail instead of JS-only absolute placement; drag only for fine pointers at 768px and up; clamping; drop-in on scroll (120px) instead of on load; no drag and no drop-in with reduced motion (the source kept drag); next/image with object-contain; no captions; isolation.

**C. About integration (D-02).** In `src/components/AboutSection.tsx` right column, keep the wrapper `div.relative` and the outline "01" numeral (it stays the backdrop). Replace the lobby photo frame (the strips-reveal wrapper with parallax, its parallax inner, its image and its strips overlay) and the floating "Chăm da khoa học" link card after it with `<SIG220 items={site.aboutPolaroids} labels={{ group: "Ảnh khách hàng tại Yên Spa", dragHint: "Kéo ảnh để xếp lại", swipeHint: "Vuốt ngang để xem thêm ảnh" }} />`. Remove the `next/image` import if it is now unused. The left column (eyebrow, h2, lead, "Tìm hiểu thêm" button, stats dl with counters) and the Wave stay byte-identical.

**D. SIG-602 port (D-03)** `src/components/signature/SIG-602/SIG-602.tsx` from `.agents/skills/phoi/assets/signature/SIG-602/SIG-602.tsx`. Header as above (`// DUDI Signature SIG-602 v1.0.0 — Glowing Border Runner`). Export `Sig602GlowRing` plus default. Keep only the border runner:
   - Render one `span` with `aria-hidden`, `data-sig="602"` and `data-sig602-glow`: `position: absolute; inset: 0; z-index: 2; pointer-events: none; border-radius: inherit; padding: var(--sig602-thickness, 2px)`, masked to a ring with the content-box versus border-box mask composite (standard `mask-composite: exclude` plus the `-webkit-` xor form). Static background `var(--sig602-static, rgba(216,192,138,0.5))`, a visible gold line for SSR, no-JS and reduced motion.
   - Keep the source `buildConic(angle, spread)` shape, recoloured: dim base rgba(184,151,90,0.18) (gold-500), tail rgba(184,151,90,0.75), head rgba(216,192,138,1) (gold-300). Keep the matchMedia desktop/mobile branches with no-preference, the durations (3.5s desktop, 2.4s mobile, divided by the factor), the spreads (65 and 52) and the proxy-angle tween (repeat -1, ease none). Port fixes: create the tween `paused: true` and drive it with one ScrollTrigger on the ring's parent card (start "top bottom", end "bottom top", onToggle play/pause), because the source started playing while off-screen. The visibilitychange handler resumes only if that trigger is active.
   - Props: `intensity` (default 1 here), `className`, `thickness`.
   - README `src/components/signature/SIG-602/README.md`: the source README plus Port notes. Cover: ring-only extraction (no pricing table, no badge), masked ring inside the card so it follows the `.service-card` hover lift and is not clipped by `overflow-hidden`, gold token recolour, paused-until-visible fix.

**E. Services integration (D-03).** In `src/components/ServicesSection.tsx` (stays a server component), add a module constant for the highlighted id `"triet-long"`. In the map, render `<Sig602GlowRing />` as the last child inside the card `<a>` only when `g.id` matches. Change nothing else: grid, aspect ratios, image, glass bar, title and sub stay as they are. The `ul` stagger reveal still animates the `li` elements, and the ring moves with them.
  </action>
  <verify>
    <automated>cd D:/projects-cv/demo_9_11_2026/yen_sapa && npx tsc --noEmit && npm run lint && grep -q "DUDI Signature SIG-220" src/components/signature/SIG-220/SIG-220.tsx && grep -q "DUDI Signature SIG-602" src/components/signature/SIG-602/SIG-602.tsx && grep -q "Port notes" src/components/signature/SIG-220/README.md && grep -q "Port notes" src/components/signature/SIG-602/README.md && grep -q "aboutPolaroids" src/components/AboutSection.tsx && ! grep -q "space/lobby" src/components/AboutSection.tsx && [ "$(grep -cE 'customers/(photo-diary|yen-capture)-[0-9]' src/content/site.ts)" -ge 7 ] && ! grep -rq "customers-8" src && grep -q "Sig602GlowRing" src/components/ServicesSection.tsx && grep -q "data-counter" src/components/AboutSection.tsx && ! grep -rqE "Math\.random|Date\.now|new Date\(" src/components/signature/SIG-220 src/components/signature/SIG-602 src/components/signature/SIG-1211 && npm run build</automated>
  </verify>
  <done>Build, type-check and lint pass. About renders 7 customer polaroids with Vietnamese alt text (CSS scatter at 768px and up, snap rail below) and no lobby photo or floating card. Heading, lead, CTA and counters are unchanged. Only the triet-long services card contains the glow ring. No new dependencies.</done>
</task>

<task type="auto">
  <name>Task 3: Extend the browser verify script, run it at 1280 / 375 / reduced, review screenshots, fix until green</name>
  <files>.planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs</files>
  <action>
Implements D-04 and D-05. Copy `.planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs` into this quick dir (same folder depth, so the repo-root path and the playwright import from `.agents/skills/phoi/assets/node_modules` still resolve). Update the header comment for this task. Keep all existing hard checks unchanged: reveal tally <= 2, hidden reveals 0, overflow 0, console errors 0, the anchor list and rule, the desktop pin budget (total <= 1.0, each pin <= 0.6, SIG-01 hold <= 0.6), mobile/reduced pin-spacer count 0 and SIG-01 not sticky, and the /ban-tin run. Keep the 14-step sweep. Replace the old 01-11 screenshot list and the old informational banner-position metric with the following (screenshots go to this dir's `shots/`, which is gitignored by `.planning/quick/*/shots/`):

SIG-1211 (all three runs). Locate root `[data-sig="1211"]`, stick `[data-sig1211-stick]`, inner `[data-sig1211-inner]`, overlay `[data-sig1211-overlay]`, card `[data-sig1211-card]`.
- Record stick position, stick top, root, stick and card heights, and `extra = rootH - stickH - cardH`. Hard: |extra| <= 2px in every run (the overlap adds no scroll).
- Hard: stick position is sticky at 1280 and 375 (motion runs) and is not sticky in reduced.
- At rest (banner bottom 40px above the viewport bottom, before the card overlaps): hard, the storefront `img` rendered width/height is within 1% of 1942/809, its rect is inside the inner rect, and its alt is non-empty. Screenshot `01-banner-rest`.
- Overlap samples with the card top at 70%, 45% and 15% of the viewport height (screenshots `02-overlap-70`, `03-overlap-45`, `04-overlap-15`). Hard in motion runs at the 45% sample: inner scale (DOMMatrix `a` of its computed transform) is below 0.995 and at least 0.88, and overlay opacity is above 0.05. Hard in reduced: inner transform is none and overlay opacity is 0.

SIG-220. Cards are `[data-sig220-card]` inside `[data-sig220-table]`.
- All runs, after the scroll-through: hard, exactly 7 cards; every card opacity >= 0.99 and visibility visible; every photo box (the image's parent) has a width/height ratio within 2% of the image's natural ratio. Screenshot `05-about-polaroids` with the table in view.
- Desktop 1280: hard, every card rect is inside the table rect expanded by 16px. Drag test: pick the first card whose centre hit-tests to itself with `elementFromPoint`, drag it with page.mouse (down, 10 move steps of +120/+60, up), wait 1200ms. Hard: its rect moved more than 30px, it is still inside the table+16px, and page overflow is 0. Screenshot `06-about-after-drag`. Fling test: drag the same card to x = innerWidth - 4 and 400px down, release, wait 1500ms. Hard: still inside the table+16px and page overflow 0.
- Mobile 375: hard, table computed overflow-x is auto or scroll, scroll-snap-type contains x, scrollWidth > clientWidth, no card has computed touch-action none, and no card is absolutely positioned. Set the table's scrollLeft to 400 and wait; hard, scrollLeft > 0 and page overflow 0. Screenshot `06-about-rail-swiped`.
- Reduced 1280: right after load, jump straight to the table (no scroll-through) and assert every card opacity >= 0.99 and position absolute. Hard: the same mouse drag moves a card by less than 2px. Screenshot `06-about-reduced`.
- Deep link, desktop only: open `/#dich-vu`, wait 2.5s, scroll to the About table, wait 1500ms. Hard: all 7 cards opacity >= 0.99.

SIG-602:
- Hard: exactly one `[data-sig602-glow]`; its closest `li` text contains "Triệt lông OPT"; `#dich-vu` still has 4 card `li` elements.
- Motion runs: scroll the Services grid into view, then sample the ring's computed background-image twice 400ms apart. Hard: the samples differ. Screenshots `07-services-glow-a` and `08-services-glow-b`. Then jump to the top of the page and sample twice 400ms apart (informational: equal means paused off-screen).
- Reduced: hard, the two in-view samples are equal and the ring's computed background is not transparent or none. Screenshot `07-services-glow-reduced`.

Extra hard checks: anchors #gioi-thieu and #dich-vu land within 6px of the expected scroll-padding + scroll-margin offset in all three runs (this already falls out of the kept anchor rule; make sure both ids are still in the list). Write everything to `shots/metrics.json`.

Run sequence (Git Bash): `npm run lint`, `npx tsc --noEmit`, `npm run build` (after the last source edit). Then start `npx next start -p 3210` in the background, poll `curl -s -o /dev/null -w "%{http_code}" http://localhost:3210/` until it returns 200, run `node .planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs --url http://localhost:3210/`, and stop the server afterwards (find the PID listening on 3210 with `netstat -ano` and end it with `taskkill //PID <pid> //F //T`). Load pages with `waitUntil: "load"` plus a 2.5s wait (hero videos never reach networkidle), as before.

Visual review with the Read tool on the PNG screenshots for desktop, mobile and reduced:
- The storefront banner is complete, including its printed text, at rest and while scaling.
- The overlap frames show a rounded beige card over a dimmed, slightly scaled banner, with no gap or flash between the banner and the card.
- The polaroids are tilted, white-framed and undistorted, the yen-capture text is fully visible, and no photo is completely buried at rest.
- The mobile rail shows one centred polaroid with a peek of the next.
- The gold ring is visible on the Triệt lông OPT card only and the other three cards are unchanged.
- The reduced run is static and fully visible.
- Vietnamese diacritics render correctly in the hints and alt-driven content.

If any hard check fails or a screenshot shows a defect, fix the source (inside this plan's files), rebuild, restart the server and re-run until the script prints "All hard checks passed" (exit 0). Then write the summary.

Do NOT commit, stash, reset or revert anything (D-06). Leave all changes in the working tree.
  </action>
  <verify>
    <automated>cd D:/projects-cv/demo_9_11_2026/yen_sapa && npm run lint && npm run build && echo "start: npx next start -p 3210 (background), wait for HTTP 200, then:" && node .planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs --url http://localhost:3210/ && test -f .planning/quick/261113-knm-sig-1211-220-602-banner-about-services/shots/metrics.json</automated>
  </verify>
  <done>verify-motion.mjs exits 0 with "All hard checks passed" against a production build at 1280, 375 and reduced. metrics.json and the screenshots exist in this quick dir's `shots/`. The visual review found no defects. The server was stopped. Nothing was committed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| visitor pointer/keyboard → client components | Drag, arrow-key and scroll input only move local CSS transforms. No data leaves the browser and nothing is persisted. |
| client-provided images → public site | Customer photos with recognisable faces are published in About. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-knm-01 | Denial of Service (client perf) | SIG-220 gsap.ticker physics, SIG-602 per-frame conic repaint | low | mitigate | SIG-220 skips ticker work when the table is off-screen or the tab is hidden (IntersectionObserver + visibilitychange). SIG-602 tween starts paused and plays only while its ScrollTrigger is active and the tab is visible. |
| T-knm-02 | Denial of Service (UX) | SIG-220 `touch-action: none` | medium | mitigate | Touch-action none and drag handlers apply only in interactive mode (fine pointer, 768px and up, motion). Touch devices keep native scrolling; mobile uses a native scroll-snap rail. |
| T-knm-03 | Tampering (layout) | SIG-220 drag and z-index growth | low | mitigate | Offsets are clamped inside the table with an 8px inset; the table has `isolation: isolate`, so raised z-index cannot cover the fixed header (z-40). The verify fling test asserts bounds and 0 overflow. |
| T-knm-04 | Information Disclosure | Customer photos (faces) in About | low | accept | Photos are client-provided and the owner approved this use in the task description. Alt text names no one and makes no claims. The STATE.md consent note for before/after photos does not apply to these group/lobby photos; it is still flagged in the summary for the owner. |
| T-knm-SC | Tampering (supply chain) | npm installs | low | accept | No packages are installed. gsap and @gsap/react are already in the project. |
</threat_model>

<verification>
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass (after the last source edit).
- `verify-motion.mjs` exits 0 at 1280x800, 375x812 and reduced 1280x800. It covers SIG-1211 extra scroll within 2px, sticky only in motion runs, image ratio intact, scale and overlay mid-overlap; SIG-220 7 visible undistorted cards, desktop drag and clamp, mobile snap rail, reduced static, deep link; SIG-602 single ring on Triệt lông OPT, animated in motion runs and static in reduced; page budgets for pins (desktop <= 1.0, mobile/reduced 0 spacers), hidden reveals 0, overflow 0, console errors 0, reveal variants <= 2, anchors.
- Screenshots of Banner/About/Services for desktop, mobile and reduced are in `shots/` and were reviewed visually.
- `git status` shows only uncommitted changes (no new commit), per D-06.
</verification>

<success_criteria>
- About slides over the storefront banner as a rounded card (SIG-1211) with 0px added scroll; the old overlap code is gone.
- About shows 7 real customer polaroids: draggable scatter on desktop with a mouse, swipe rail on mobile, static with reduced motion; never distorted; honest Vietnamese alt; heading, text and counters intact; lobby duplication removed.
- "Triệt lông OPT" is the only services card with a running gold border; static gold with reduced motion.
- Desktop total pinned scroll still <= 1 viewport (0.9 expected); mobile and reduced 0 pins; reveal variants <= 2; 0 overflow, 0 hidden, 0 console errors; anchors land correctly.
- Summary records: SIG-1211 Min Motion 4 as an owner-approved exception, the planner discretion choices above, the metrics table, and the screenshots path. No commit made.
</success_criteria>

<output>
Create `.planning/quick/261113-knm-sig-1211-220-602-banner-about-services/261113-knm-SUMMARY.md` when done (same layout as the 261113-jgz summary: what changed, verification table for desktop / mobile / reduced, reveal tally, anchors, screenshots path, deviations, known issues, self-check). Do not commit (D-06).
</output>
