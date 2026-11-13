---
phase: quick-261113-jgz
plan: 01
type: execute
wave: 1
depends_on: []
quick_id: 261113-jgz
slug: phoi-b-nang-xuyen-la-hieu-ung
date: 2026-11-13
files_modified:
  - src/components/Hero.tsx
  - src/components/motion/MotionSystem.tsx
  - src/components/SectionHeading.tsx
  - src/components/PosterRail.tsx
  - src/components/AboutSection.tsx
  - src/components/ServicesSection.tsx
  - src/components/PromoSection.tsx
  - src/components/BentoShowcase.tsx
  - src/components/PricingSection.tsx
  - src/components/newsletter/Newsletter.tsx
  - src/components/signature/SIG-01/SIG-01.tsx
  - src/components/signature/SIG-01/README.md
  - src/components/signature/SIG-505/SIG-505.tsx
  - src/components/signature/SIG-505/README.md
  - src/components/signature/SIG-305/SIG-305.tsx
  - src/components/signature/SIG-305/README.md
  - src/components/BrandSentence.tsx
  - src/components/SpaceSection.tsx
  - src/components/ReviewsSection.tsx
  - src/app/page.tsx
  - src/app/globals.css
  - .planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs
autonomous: true
requirements: [QUICK-261113-jgz]

must_haves:
  truths:
    - "Hero: the two gold glow blobs are gone; a low-opacity palm-shadow layer (palm-shadow-texture.jpg) drifts slowly with scroll over the hero video/LCP image, never covers the scroll-down button, and the LCP image is never set to opacity 0 (D-02)"
    - "Between About and Services, the confirmed slogan 'Yêu mình một cách Yên lành' (site.slogans[2]) stays fixed on desktop while leaf layers drift behind it; on mobile and with reduced motion it is a normal static block (D-01a, D-04)"
    - "#khong-gian shows the 6 photos of public/images/space exactly once each in a 3x2 grid; on desktop the grid zooms into treatment-room.jpg (pin 55vh), on mobile it is a 2-column stacked grid with no pin; branch/hours info, the 'Xem tất cả ảnh không gian' lightbox button and story 02 are still on the page (D-01b)"
    - "Reviews: the real quote 'Chắc chắn phải gặp Yên mỗi cuối tuần để chữa lành thôi ạ.' (exact substring of Trang Minh's Google review in site.ts) is highlighted line by line, with no pin (D-01c, D-04)"
    - "On the home page every reveal variant renders at most 2 elements; on /ban-tin every variant renders at most 2 elements; Pricing has no reveal animation (D-03)"
    - "Desktop 1280x800: total extra pinned scroll (GSAP pin spacers + SIG-01 sticky hold) <= 1 viewport; 375px: zero pins and no sticky hold; prefers-reduced-motion: zero pins, no scrub/parallax, every element visible (D-04)"
    - "npm run build and npm run lint pass; no horizontal overflow at 375 and 1280; anchors trang-chu, gioi-thieu, dich-vu, san-pham, khong-gian, bang-gia, danh-gia, lien-he each exist once and land in view (D-05)"
  artifacts:
    - path: "src/components/signature/SIG-01/SIG-01.tsx"
      provides: "Sticky brand sentence with drifting leaf layers (client)"
      contains: "DUDI Signature SIG-01"
    - path: "src/components/signature/SIG-505/SIG-505.tsx"
      provides: "3x2 grid zoom into center tile (client)"
      contains: "DUDI Signature SIG-505"
    - path: "src/components/signature/SIG-305/SIG-305.tsx"
      provides: "Line-by-line highlighter for a quote (client)"
      contains: "DUDI Signature SIG-305"
    - path: "src/components/BrandSentence.tsx"
      provides: "Server wrapper feeding site.ts copy + nature images into SIG-01"
    - path: ".planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs"
      provides: "Playwright screenshots + metrics (pins, reveal counts, overflow, anchors)"
  key_links:
    - from: "src/app/page.tsx"
      to: "src/components/BrandSentence.tsx"
      via: "rendered between the Banner/About wrapper and ServicesSection"
    - from: "src/components/SpaceSection.tsx"
      to: "src/components/signature/SIG-505/SIG-505.tsx"
      via: "site.gallery filtered to /images/space/ (center = treatment-room, around = other 5)"
    - from: "src/components/ReviewsSection.tsx"
      to: "src/components/signature/SIG-305/SIG-305.tsx"
      via: "lines prop built from the existing quote"
    - from: "src/components/motion/MotionSystem.tsx"
      to: "src/components/Hero.tsx"
      via: "data-hero-palm scroll-linked tween inside the hero block"
    - from: "src/components/motion/MotionSystem.tsx"
      to: "every component using the new variants"
      via: "reveal() registrations for slide-left and mask-right (an unregistered variant stays visibility:hidden forever because of the .js CSS rule)"
---

<objective>
Apply phôi option B "Nắng xuyên lá" (Motion level 3, no WebGL) to the existing Next.js 16 one-page site: replace the hero glow with a palm-shadow layer, port three DUDI Signatures (SIG-01, SIG-505, SIG-305) into real sections fed with confirmed content, de-duplicate scroll reveals, and keep pins inside a 1-viewport desktop budget, then prove it with build, lint and browser measurements.

Locked decisions (from the user-approved description):
- D-01 Port SIG-01 (D-01a), SIG-505 (D-01b), SIG-305 (D-01c) as "use client" components under src/components/signature/SIG-xx/, version header kept, content via props, colors via theme tokens. Only confirmed copy and client photos.
- D-02 Remove the hero gold glow blobs (Hero.tsx markup + the MotionSystem glow tween) and add a slow scroll-linked palm-shadow layer. LCP image never starts at opacity 0.
- D-03 Every reveal effect at most 2 times per page (home counted on what renders; /ban-tin has its own budget of 2). Calm zones (pricing, form, contact) get no animation. 1–2 new light variants allowed.
- D-04 Desktop extra pinned scroll ≤ 1 viewport total; each pin ≤ 60vh; mobile < 768px no pins; reduced motion no pin/scrub/parallax; readable from the first frame.
- D-05 Verify with npm run build, npm run lint, screenshots at 375 and 1280 in this quick dir, overflow and anchor checks.
- D-06 Git: the working tree holds many UNCOMMITTED user changes in these same files. Do NOT commit, stash, reset, restore, checkout or revert anything under src/ or public/. Leave all source changes in the working tree. This overrides the executor's usual per-task commit step: skip task commits entirely. Only .planning docs may be committed, by the orchestrator.

Claude's discretion (recorded):
- SIG-01 uses nature imagery only (light-leaves-bg.jpg backdrop + leaf PNG cutouts). All 6 space photos are reserved for the SIG-505 grid so the two signatures never show the same photo (honours "do not duplicate images").
- SIG-505 center tile = treatment-room.jpg ("Phòng chăm sóc da đón ánh nắng tự nhiên"), which matches the sunlight metaphor. Story 01's two photos in SpaceSection (lobby, treatment-room) are removed because the grid now shows them; its text moves into the SIG-505 heading/caption.
- Pin split: SIG-505 55vh + SIG-01 sticky hold 35vh = 0.9 viewport (10% margin under D-04).
- New variants: slide-left (used only inside sections with overflow-hidden) and mask-right (clip-path, no layout overflow).

Output: three ported signatures, one new server wrapper, edited sections, a verification script, screenshots and metrics in this quick dir.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.claude/CLAUDE.md
@.agents/skills/phoi/references/rules-core.md
@.agents/skills/phoi/references/layout/landing-standard.md
@.agents/skills/phoi/references/motion/levels.md
@src/components/motion/MotionSystem.tsx
@src/app/page.tsx

Facts gathered during planning (do not re-derive):
- Stack rule of the phoi skill (Vite) does NOT apply; this is the existing Next.js 16 App Router project. Do not scaffold. No new npm packages (gsap ^3.15, @gsap/react ^2.1.2 already installed).
- globals.css hides every element carrying a reveal attribute while html has class .js (set in layout.tsx). MotionSystem un-hides them per registered variant, or clears them all when prefers-reduced-motion is on. Therefore any variant value that MotionSystem does not register stays invisible forever.
- No --header-h variable exists yet. Header bar is h-16 (64px) below 640px and sm:h-20 (80px) from 640px. html has scroll-padding-top: 5rem.
- There is currently no GSAP horizontal-scroll pin on the page (no hscroll attribute in any component). BannerSection is CSS sticky (data-stack) inside the Banner/About wrapper; it adds no pin spacer.
- Section order (page.tsx): Hero, [Banner + About], Services, Promo, FeatureMarquee, BentoShowcase (#san-pham), SpaceSection (#khong-gian), Pricing (#bang-gia), Reviews (#danh-gia, contains #lien-he and #dat-lich).
- About ends with a Wave whose last layer is #2f3a26; Services is bg-moss-900. A dark section between them continues the band.
- site.ts (src/content/site.ts) confirmed copy: name "Yên Spa & Beaute", tagline "Chăm sóc sức khỏe và làm đẹp khoa học", since 2019, slogans[2] "Yêu mình một cách Yên lành", hours.display "09:00 – 21:00", gallery entries with alts for all 6 space photos (lobby, treatment-room, mirror-console, staircase, product-shelf, hallway-equipment; all roughly square), reviews[0] = Trang Minh, "Local Guide · Google", text ends with "Chắc chắn phải gặp Yên mỗi cuối tuần để chữa lành thôi ạ."
- NatureDecor.tsx holds the PNG cutout sizes: palm-top-left 303x384, monstera-bottom-right 332x458, leaves-top-right 286x245, fern-top-left 536x494, fern-top-right 492x794, fern-bottom-left 437x772, fern-bottom-right 536x481.
- Signature sources: .agents/skills/phoi/assets/signature/SIG-01/SIG-01.tsx, SIG-505/SIG-505.tsx, SIG-305/SIG-305.tsx (+ README.md each). Read them once in Task 2.
- Playwright lives in .agents/skills/phoi/assets/node_modules/playwright (index.mjs present); Chromium builds exist under %LOCALAPPDATA%/ms-playwright. .agents/skills/phoi/assets/tools/shots.mjs shows how to find a local Chromium and does scroll-step screenshots.
- Existing components were edited by the user and are uncommitted. Edit them with small scoped Edit calls; never rewrite a whole existing file with Write.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Hero palm-shadow layer, two new reveal variants, and reveal de-duplication (D-02, D-03)</name>
  <files>src/components/Hero.tsx, src/components/motion/MotionSystem.tsx, src/components/SectionHeading.tsx, src/components/PosterRail.tsx, src/components/AboutSection.tsx, src/components/ServicesSection.tsx, src/components/PromoSection.tsx, src/components/BentoShowcase.tsx, src/components/PricingSection.tsx, src/components/newsletter/Newsletter.tsx</files>
  <read_first>src/components/Hero.tsx, src/components/motion/MotionSystem.tsx (already in context), src/components/SectionHeading.tsx, src/components/PosterRail.tsx (lines 20-40), plus the lines around each reveal attribute in the section files (use Grep with -n then Read with offset/limit; do not read whole large files).</read_first>
  <action>
All edits are small scoped Edit calls (D-06: user changes in these files must survive untouched).

A. Hero palm layer (D-02), in src/components/Hero.tsx:
- Delete the decorative wrapper div that has mix-blend-soft-light and contains the two gold radial-gradient divs (the "đốm sáng vàng").
- In the same place (after the top gradient div, so it paints above the LCP image and the video reel but below the scroll-down button which is z-[2]) add an aria-hidden, pointer-events-none wrapper with the attribute data-hero-palm, positioned absolute with -z-10, oversized vertically (about -top-[8%] and h-[116%], inset-x-[-4%]) so drifting never shows an edge, opacity around 0.22 and mix-blend-multiply. Inside it a next/image of /images/nature/palm-shadow-texture.jpg with fill, sizes="100vw", object-cover, alt="" and no preload (it is not the LCP element). Do not touch the LCP Image (keep preload), the data-hero-image wrapper, HeroVideoReel, the sr-only h1 or the scroll-down link.

B. MotionSystem (src/components/motion/MotionSystem.tsx):
- Remove the glow tween block entirely: the comment "Đốm sáng vàng trôi chậm", the glows constant built from the glow selector, and the ScrollTrigger.create whose onToggle resumes/pauses those glows. Remove the glow line from the header doc comment and add a line documenting data-hero-palm ("lớp bóng lá cọ trôi chậm theo cuộn").
- Inside the existing "if (heroSection)" block add one scroll-linked tween on the palm layer: fromTo from yPercent -3, xPercent 0, rotation 0 to yPercent 7 * parallaxScale, xPercent -2 * parallaxScale, rotation 1.2, ease none, scrollTrigger trigger heroSection, start "top top", end "bottom top", scrub true. No opacity animation. Reduced motion is already handled by the early return (layer stays static and visible).
- Register two new reveal variants with the existing reveal() helper, next to the others: "slide-left" from autoAlpha 0, x 40 to autoAlpha 1, x 0, duration 1.1; and "mask-right" from clipPath "inset(0% 100% 0% 0%)" to clipPath "inset(0% 0% 0% 0%)", duration 1.2. Add both names to the doc comment list of variants. Keep all other blocks unchanged.

C. Shared components:
- SectionHeading.tsx: extend the titleEffect union with "none" and add an optional boolean prop quiet. When quiet is true, the eyebrow line span, the eyebrow chars span and the optional text paragraph render without any reveal attribute (and without data-delay); the h2 gets the titleEffect value as its reveal attribute unless titleEffect is "none", in which case the h2 has no reveal attribute. Default behaviour (no props) stays as today.
- PosterRail.tsx: add an optional prop reveal with type "stagger" | "mask-right" | "none", default "stagger"; the ul gets that value as its reveal attribute, or no attribute for "none".

D. Home page reveal assignment (D-03). Target: every variant renders at most 2 elements on the home page. Apply exactly this table (location → new value; "none" means delete the reveal attribute and any data-delay on that element so it is simply visible):

| File / element | Now | New |
|---|---|---|
| AboutSection eyebrow "Về Yên Spa" span | chars | chars (keep, 1/2) |
| AboutSection eyebrow line span | line | line (keep, 1/2) |
| AboutSection h2 | words | words (keep, 1/2) |
| AboutSection lead paragraph (site.about.lead) | fade-up | fade-up (keep, 1/2) |
| AboutSection CTA "Tìm hiểu thêm" link | fade-up | none (CTA is never delayed, levels.md) |
| AboutSection stats dl | stagger | stagger (keep, 1/2) |
| AboutSection lobby image wrapper | strips | strips (keep, 2/2; Banner is 1/2) |
| AboutSection floating card link (has data-delay 0.4) | fade-up | blur (1/2), keep data-delay |
| BannerSection image wrapper | strips | unchanged (do not edit BannerSection) |
| ServicesSection eyebrow span | chars | chars (keep, 2/2) |
| ServicesSection eyebrow line | line | line (keep, 2/2) |
| ServicesSection h2 | words | blur-words (1/2) |
| ServicesSection "#bang-gia" arrow link | fade-up | none |
| ServicesSection groups ul | stagger | stagger (keep, 2/2) |
| PromoSection SectionHeading | line+chars+words+fade-up | pass quiet and titleEffect="blur-words" (blur-words 2/2; nothing else animates) |
| PromoSection PosterRail | stagger | reveal="mask-right" (1/2) |
| BentoShowcase h2 | words | words (keep, 2/2) |
| BentoShowcase intro paragraph (line ~51) | fade-up | none |
| BentoShowcase chip grid div (line ~54) | fade-up | none |
| BentoShowcase trust ul | stagger | none |
| BentoShowcase tiles ul | blur | blur (keep, 2/2) |
| BentoShowcase featured combo article (line ~117) | fade-up | slide-left (1/2; section is overflow-hidden so x offset cannot overflow) |
| BentoShowcase "Thẻ Member" article | fade-up | none |
| BentoShowcase burgundy hair-removal article | fade-up | none |
| BentoShowcase "Trước & Sau" article (#ket-qua) | fade-up | clip-center (1/2; clip only, real result photos are never distorted) |
| PricingSection (calm zone): SectionHeading | line+chars+words+fade-up | pass quiet and titleEffect="none" |
| PricingSection combos ul, comboNote p, member h3, note p, member box div, menus div, "Menu bảng giá chi tiết" h3 | stagger/fade-up/words | none (all) |
| PricingSection PosterRail | stagger | reveal="none" |
| ReviewsSection quote paragraph | fade-up | handled in Task 2 (replaced by SIG-305) |
| SpaceSection articles | fade-up x2 | handled in Task 2 (one article left, keeps fade-up 2/2) |

Leave mark-sweep in BentoShowcase, data-scale-in in Services, data-parallax and data-counter in About, Wave morphs and the marquee as they are (each is a single section use).

E. /ban-tin budget (src/components/newsletter/Newsletter.tsx, D-03): today words appears 4 times and stagger 4 times; every other variant is at most 1. In source order keep the first two words and change the 3rd and 4th to blur-words (they already wrap SplitWords, which blur-words also targets via .split-inner). Keep the first two stagger and change the 3rd and 4th to mask-right. If either of those elements is a form, contact or price block, use none instead. Do not touch anything else in that file.
  </action>
  <verify>
    <automated>cd /d/projects-cv/demo_9_11_2026/yen_sapa && test "$(grep -rn 'hero-glow' src | wc -l)" -eq 0 && grep -q 'data-hero-palm' src/components/Hero.tsx && grep -q 'data-hero-palm' src/components/motion/MotionSystem.tsx && grep -q "data-reveal='slide-left'" src/components/motion/MotionSystem.tsx && grep -q "data-reveal='mask-right'" src/components/motion/MotionSystem.tsx && test "$(grep -o 'data-reveal="[a-z-]*"' src/components/PricingSection.tsx | wc -l)" -eq 0 && test "$(grep -o 'data-reveal="words"' src/components/newsletter/Newsletter.tsx | wc -l)" -le 2 && test "$(grep -o 'data-reveal="stagger"' src/components/newsletter/Newsletter.tsx | wc -l)" -le 2 && npx tsc --noEmit && npm run lint</automated>
  </verify>
  <done>Hero has the palm layer and no glow markup; MotionSystem has no glow tween, has the palm tween and registers slide-left and mask-right; the reveal table above is applied; Pricing has no reveal attributes; /ban-tin has at most 2 words and 2 stagger; tsc and lint pass. No git commit made.</done>
</task>

<task type="auto">
  <name>Task 2: Port SIG-01, SIG-505, SIG-305 and place them in the story (D-01, D-04)</name>
  <files>src/components/signature/SIG-01/SIG-01.tsx, src/components/signature/SIG-01/README.md, src/components/signature/SIG-505/SIG-505.tsx, src/components/signature/SIG-505/README.md, src/components/signature/SIG-305/SIG-305.tsx, src/components/signature/SIG-305/README.md, src/components/BrandSentence.tsx, src/app/page.tsx, src/components/SpaceSection.tsx, src/components/ReviewsSection.tsx, src/app/globals.css</files>
  <read_first>.agents/skills/phoi/assets/signature/SIG-01/SIG-01.tsx, .agents/skills/phoi/assets/signature/SIG-505/SIG-505.tsx, .agents/skills/phoi/assets/signature/SIG-305/SIG-305.tsx and their README.md files; src/components/SpaceSection.tsx; src/components/ReviewsSection.tsx (lines 1-60); src/content/site.ts lines 15-70 and 285-310.</read_first>
  <action>
General port rules (D-01): each new SIG file starts with the "use client" directive, then keeps the original version header comment line (for example the SIG-505 line "DUDI Signature SIG-505 v1.0.0 — Grid Zoom-in to Center Tile") followed by one comment line "Ported to Next.js for Yên Spa — see README Port notes". Keep the original named export plus default export and the props interface (extend it where noted). Register plugins with gsap.registerPlugin(ScrollTrigger, useGSAP). Use next/image for every image (fill inside a sized box, explicit sizes), never plain img. No Date, Math.random or crypto in render (cacheComponents is on). Keep each component's own gsap.matchMedia inside useGSAP with scope set to the root ref so it cleans up itself. Colors come from the CSS variables the SIG already reads (--sig-bg, --sig-fg, --sig-accent, --sig-hl, --sig-font-display, --sig-font-body), set by the caller from theme tokens: beige-50 #f8f3ea, beige-100 #f0e7d7, moss-900 #263020, burgundy #7a2e2e, gold-300 #d8c08a, gold-500 #b8975a (use var(--color-...) where Tailwind exposes them). Copy each README.md next to its component and append a "## Port notes (Yên Spa, Next.js)" section listing the adaptations below. Do not add any reveal attributes inside SIG components.

0. globals.css: add a :root rule defining --header-h: 4rem, and a min-width 640px media query setting it to 5rem (matches the Header h-16 / sm:h-20). Nothing else in that file.

1. SIG-01 "Chữ đứng yên, nền cuộn" (D-01a, D-04):
- Props: keep headline, emphasis, eyebrow, caption, intensity, id, className. Change images to a list of leaf cutouts, each with src, width, height (decorative: rendered with alt="" and aria-hidden, object-contain, no border radius, no forced 4:5 aspect). Add backdrop (src string) rendered as a full-bleed cover layer at about 0.3 opacity with mix-blend-soft-light (tune by eye in Task 3 so the headline keeps strong contrast), sizes="100vw".
- Root is a section containing the headline as an h2 (not h3). Add data-sig="01" on the root and data-sig-sticky on the sticky wrapper so Task 3 can measure the hold.
- Layout is CSS-first so no hydration flash. Base styles (mobile, no-JS, reduced motion): root height auto with generous vertical padding (around 6rem top and bottom), the headline wrapper is position relative (NOT sticky), leaves placed absolutely at the left/right edges at about 44vw width alternating sides (README mobile). Only inside the media query min-width 768px AND prefers-reduced-motion no-preference: root height calc(100dvh - var(--header-h) + 35vh), headline wrapper position sticky at top var(--header-h) with height calc(100dvh - var(--header-h)). That makes the desktop hold exactly 35vh (D-04 budget share). Replace the original flex-column frame list (it needs about 250vh and would be clipped) with absolutely positioned frames: top values spread across the root (about -6%, 16%, 38%, 58%, 76%), left/width from the original SLOTS array.
- Motion (useGSAP + matchMedia): desktop = each frame fromTo y using the original SPEEDS pattern with spread 0.6 times FACTOR[intensity], trigger root, start "top bottom", end "bottom top", scrub true, invalidateOnRefresh; backdrop yPercent -6 to 6 on the same trigger; headline breathing must be readable on entry: scale 0.97 and opacity 0.9 → 1 and 1 → 1.02 and 0.88 (never the original 0.55). Mobile (max-width 767px, no-preference) = frame drift with spread 0.25 only, no breathing, no sticky. Reduced motion = no tweens at all.
- Keep the soft radial backdrop behind the text and the text-shadow; emphasis rendered in the display font with --sig-accent.
- Create src/components/BrandSentence.tsx (server component, no "use client") that imports site from @/content/site and renders the SIG-01 component with intensity 1, eyebrow built from site.name and site.since (for example "Yên Spa & Beaute · từ 2019"), headline site.slogans[2] ("Yêu mình một cách Yên lành"), emphasis "Yên lành", caption site.tagline, backdrop /images/nature/light-leaves-bg.jpg, and five cutouts: fern-top-left, leaves-top-right, monstera-bottom-right, palm-top-left, fern-bottom-right with the pixel sizes listed in context. Root style variables: --sig-bg var(--color-moss-900), --sig-fg var(--color-beige-50), --sig-accent var(--color-gold-300), --sig-font-display var(--font-display), --sig-font-body var(--font-body). Add overflow hidden on the root so cutouts never cause horizontal overflow. No space photos here (all six are reserved for SIG-505). Never invent copy: every visible string comes from site.ts.
- page.tsx: import BrandSentence and render it directly after the closing tag of the Banner/About wrapper div and before ServicesSection, with a short Vietnamese comment ("Câu thương hiệu đứng yên, lá trôi phía sau (SIG-01)"). No other page changes.

2. SIG-505 "Lưới zoom vào ô giữa", adapted to a 3x2 grid of 6 unique photos (D-01b, D-04):
- Props: center and around as today, but around uses at most 5 images and NEVER repeats (drop the modulo fill; if fewer than 5 are passed, render only those). Add optional pinVh (number) that overrides the intensity-based length, and optional as ("section" | "div", default "section") for the root tag.
- Slots for the 3x2 layout: center tile at column 2 row 1; around tiles in reading order at (1,1) dx -1 dy 0, (3,1) dx +1 dy 0, (1,2) dx -1 dy +1, (2,2) dx 0 dy +1, (3,2) dx +1 dy +1; five SPEEDS values (for example 1, 1.15, 0.85, 0.75, 1.1).
- Pinned desktop grid: grid-template-columns repeat(3, calc(var(--s) * 100vw)) and grid-template-rows repeat(2, calc(var(--s) * (100dvh - var(--header-h)))), with --s 0.27, so each tile has the stage's aspect ratio and the final zoom is a uniform scale (no distortion).
- Zoom math (the center tile is no longer at the grid's geometric center): before the timeline, set the grid's transformOrigin to the center tile's center in grid coordinates (offsetLeft + offsetWidth/2, offsetTop + offsetHeight/2, in px), and animate the grid to scale = max(stageWidth / tileWidth, stageHeight / tileHeight) * 1.002 plus x and y equal to (stage center) minus (grid's offset + tile center), so the tile center lands on the stage center. All three values are function-based so invalidateOnRefresh recomputes them on resize.
- Pin: start "top top+=" header height (read --header-h as the original does), end "+=" (window.innerHeight * pinVh / 100), pin true, pinSpacing true, anticipatePin 1, scrub 0.6, invalidateOnRefresh. Heading and grid are visible from the first frame (readable on entry); the heading fades only after the zoom starts; caption rises at the end; keep the short rest hold at the end.
- Images: next/image fill in each tile. Center tile sizes "100vw" (it ends full-bleed, a small srcset would look blurry); around tiles sizes "(min-width: 768px) 28vw, 50vw". Drop the image decode/refresh useEffect (tile sizes come from CSS, not from the images).
- Mobile (max-width 767px): no pin, 2-column grid, center tile is the full-width first card with the original clip-path open scrub, the 5 around tiles follow with the original fade-and-rise entrance, and the last around tile spans both columns (wider aspect, about 16/10) so there is no hole. Reduced motion: static 3x2 grid on desktop / 2 columns on mobile, caption in flow, no pin, no scrub.
- SpaceSection.tsx (keep "use client", useLightbox(site.gallery) and the dialog): build the photo list from site.gallery filtered to entries whose src starts with /images/space/ (6 entries; keep their alts). center = the treatment-room entry, around = the other five in gallery order. Remove story 01 ("Trải nghiệm 01") from the stories array and render instead, at the top of the section and outside the padded max-width container so the stage is full-bleed: the SIG-505 component with as "div", intensity 1, pinVh 55, eyebrow "Trải nghiệm 01 · Không gian", heading "Một khoảng lặng giữa thành phố", caption title = the center photo's alt ("Phòng chăm sóc da đón ánh nắng tự nhiên") and caption text = story 01's existing text ("Gỗ ấm, cây xanh và ánh sáng dịu ở hai chi nhánh Quận 3 và Phú Nhuận — mỗi góc nhỏ đều được chăm chút để bạn thật sự nghỉ ngơi."), no caption cta. Root style variables: --sig-bg #f4ece0 (the section's current background, so there is no seam), --sig-fg var(--color-moss-900), --sig-accent var(--color-burgundy). Directly after it, inside the padded container, a small centered row with the two story-01 meta chips (MapPin "Quận 3 · Phú Nhuận", Clock "Mở cửa " + site.hours.display) and the existing "Xem tất cả ảnh không gian" button that calls open(0) — no reveal attribute on this row. Story 02 stays as the only article and keeps its fade-up reveal (fade-up 2/2 on the page). The section keeps id khong-gian and its background; remove horizontal padding from the outer section and move it to the inner container so the SIG stage is edge to edge. SpaceSection must no longer hardcode any /images/space/ path.

3. SIG-305 "Bút dạ tô từng dòng", embedded in Reviews (D-01c, D-04):
- Props: lines, attribution (optional), intensity, className, labels; add variant "section" | "inline" (default "section"). In inline mode the root is a blockquote (no section wrapper, no min-height, no padding, no giant decorative quote mark) and typography comes entirely from className.
- Each line is an inline span with class sig305-line, box-decoration-break clone (plus the -webkit- prefix), background gradient using --sig-hl, background-position 0 85%, no-repeat; lines separated by a space and a br that is hidden below 640px so narrow screens wrap naturally. Highlight visibility is CSS-first: default background-size 100% 55% (no-JS and reduced motion show the final highlight); only under prefers-reduced-motion no-preference and the html .js class is it 0% 55% before GSAP runs.
- Motion: desktop (min-width 768px, no-preference) = one timeline over the lines (each line 0% → 100%, duration 1, ease none) driven by a ScrollTrigger with trigger root, start "top 80%", end "bottom 45%", scrub 0.6, NO pin (pin budget D-04). Mobile = the original per-line toggleActions version. Reduced motion = nothing.
- Remove the original visibilitychange effect (it disables every ScrollTrigger on the page, including the SIG-505 pin) and the ScrollTrigger.refresh call inside matchMedia (MotionSystem already refreshes after fonts load).
- ReviewsSection.tsx: replace only the big quote paragraph (the one that currently has the fade-up reveal and the highlighted "chữa lành" span) with the SIG-305 component in inline mode, lines ["“Chắc chắn phải gặp Yên", "mỗi cuối tuần để", "chữa lành thôi ạ.”"], className equal to the paragraph's current classes (mt-6 text-3xl leading-snug font-semibold tracking-tight text-beige-50 sm:text-[2.6rem] sm:leading-[1.2]), style variable --sig-hl rgb(216 192 138 / 0.45). The joined text must equal the exact substring of reviews[0].text in site.ts; do not change a single word. Keep the author line under it, the review card, the aurora and everything else unchanged.
  </action>
  <verify>
    <automated>cd /d/projects-cv/demo_9_11_2026/yen_sapa && head -3 src/components/signature/SIG-01/SIG-01.tsx | grep -q 'DUDI Signature SIG-01' && head -3 src/components/signature/SIG-505/SIG-505.tsx | grep -q 'DUDI Signature SIG-505' && head -3 src/components/signature/SIG-305/SIG-305.tsx | grep -q 'DUDI Signature SIG-305' && grep -q 'Chắc chắn phải gặp Yên mỗi cuối tuần để chữa lành thôi ạ.' src/content/site.ts && test "$(grep -c '/images/space/' src/components/SpaceSection.tsx)" -le 1 && grep -q 'BrandSentence' src/app/page.tsx && grep -q -- '--header-h' src/app/globals.css && npx tsc --noEmit && npm run lint && npm run build</automated>
  </verify>
  <done>Three SIG components exist under src/components/signature with version headers and README port notes; BrandSentence renders between About and Services; SpaceSection shows the 6 space photos once via SIG-505 (pin 55vh) plus meta row, gallery button and story 02; Reviews shows the exact real quote via SIG-305 without a pin; --header-h defined; tsc, lint and build pass. No git commit made. (The /images/space/ grep allows one occurrence: the startsWith filter string.)</done>
</task>

<task type="auto">
  <name>Task 3: Browser verification: screenshots, pin budget, reveal counts, overflow, anchors (D-04, D-05)</name>
  <files>.planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs</files>
  <read_first>.agents/skills/phoi/assets/tools/shots.mjs (lines 1-60, for the local Chromium lookup pattern).</read_first>
  <action>
1. Write verify-motion.mjs in this quick dir. Import chromium from the absolute or relative path to .agents/skills/phoi/assets/node_modules/playwright/index.mjs (a bare "playwright" import will not resolve from .planning). Reuse the findChromium lookup from shots.mjs. Accept --url (default http://localhost:3210/) and write everything to ./shots under the quick dir. Exit with code 1 if any hard check fails, and write metrics.json with all numbers.

Runs:
- desktop: 1280x800, motion on. mobile: 375x812, motion on. reduced: 1280x800 with reducedMotion "reduce". Also one /ban-tin load at 1280 for its reveal count.

For each run on the home page:
- Scroll from top to bottom in steps of 0.5 viewport with about 250ms waits (fires every batch trigger), wait 1500ms at the bottom, then compute:
  a. Reveal tally: count of elements per reveal attribute value. Hard check: every value at most 2 (home) and at most 2 on /ban-tin.
  b. Hidden content: number of elements carrying a reveal attribute whose computed visibility is hidden or opacity below 0.05. Hard check: 0.
  c. Overflow: document.documentElement.scrollWidth minus innerWidth. Hard check: at most 0 at 375 and 1280.
  d. Pins: sum of computed padding-bottom of every .pin-spacer element, plus the SIG-01 hold (offsetHeight of [data-sig="01"] minus offsetHeight of [data-sig-sticky], counted only when the sticky element's computed position is sticky). Report the BannerSection sticky hold separately as informational (it adds no spacer). Hard checks: desktop total divided by innerHeight at most 1.0, every single pin at most 0.6 viewport; mobile pin-spacer count 0 and SIG-01 not sticky; reduced pin-spacer count 0 and SIG-01 not sticky.
  e. Anchors: for ids trang-chu, gioi-thieu, dich-vu, san-pham, khong-gian, bang-gia, danh-gia, lien-he: assert exactly one element per id; from scroll top 0, set location.hash to the id, wait 1800ms (smooth scroll), read getBoundingClientRect().top. Hard check: between -4 and 160 px.
  f. Console errors collected; any error is a hard fail (hydration warnings included).
- Screenshots (viewport-only, numbered): hero at 0; hero after scrolling 0.5 viewport (palm layer moved); SIG-01 entry (root top at 70% of viewport), SIG-01 mid hold; #khong-gian at pin start, mid pin, end of pin (caption visible), just after the pin (meta row + gallery button); Reviews quote at 40% of viewport and after the highlight has run; Pricing top. Also run shots.mjs style scroll-steps (about 14 steps) for each width as a dead-frame sweep.

2. Run it: npm run build, then start the production server in the background with npx next start -p 3210, poll until http://localhost:3210/ returns 200, run node .planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs, then stop the server.

3. Look at the screenshots with the Read tool and fix in the Task 1/Task 2 files (scoped Edits only) until all of these hold, re-running the script after each fix:
- Vietnamese diacritics render correctly in the SIG-01 headline, the SIG-505 heading/caption and the SIG-305 quote (no fallback-font glyphs).
- The SIG-01 headline is readable over the leaves at every step (adjust backdrop opacity/blend, never dim the client photos).
- The hero palm layer is visible but subtle; the scroll-down button and header stay readable; the LCP photo/video is not washed out.
- No dead frame: every 1280 step and every 375 step shows a heading with text, a complete image, a fact or a CTA. At most one transition frame at 1280, none at 375.
- SIG-505 at 375: 2 columns, no hole, no pin; at 1280: the final frame is treatment-room full-bleed with the caption readable, no distortion.
- Reduced run: everything visible and static.

4. Do not git add the shots folder or any source file (D-06). Record in the SUMMARY: the metrics.json numbers (pin total per width, reveal tally per variant for home and /ban-tin, overflow, anchor offsets), the list of screenshots, the remaining cross-section photo reuse that was intentionally left alone (treatment-room is also the hero LCP image, lobby is also in About, product-shelf is also in Bento), and the uncommitted-files note for the user.
  </action>
  <verify>
    <automated>cd /d/projects-cv/demo_9_11_2026/yen_sapa && curl -sf -o /dev/null http://localhost:3210/ && node .planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/verify-motion.mjs --url http://localhost:3210/ && test -f .planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/shots/metrics.json</automated>
    <precondition>A fresh npm run build has completed and npx next start -p 3210 is running in the background (step 2 of the action); stop it after the run.</precondition>
    <human-check>Open the site on a phone width and a desktop width: the brand sentence holds briefly while leaves drift, the space grid zooms into the treatment room and releases quickly, the review quote is highlighted line by line, and nothing feels stuck or empty.</human-check>
  </verify>
  <done>verify-motion.mjs exits 0; metrics.json shows desktop pin total at most 1.0 viewport (expected about 0.9), 0 pins at 375 and in reduced motion, every reveal variant at most 2 on home and on /ban-tin, 0 hidden reveal elements, 0 horizontal overflow, all 8 anchors in view, 0 console errors; screenshots for 375, 1280 and 1280-reduced are saved under shots/ in the quick dir; build and lint pass; no source file committed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Static content → visitor browser | All content is static from src/content/site.ts and public/images; no user input, no backend, no new network calls |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-jgz-01 | Spoofing (honesty) | SIG-305 quote, SIG-01 headline | medium | mitigate | Quote must be the exact substring of reviews[0].text (grep in Task 2 verify); SIG-01 strings come from site.ts fields, no invented claims (rules-core honesty) |
| T-jgz-02 | Denial of service (mobile data / LCP) | SIG-505 six photos, hero palm layer | medium | mitigate | next/image with explicit sizes, lazy by default, only the hero LCP image keeps preload, palm layer has no preload; LCP image never starts at opacity 0 |
| T-jgz-03 | Denial of service (scroll trap) | Pins (SIG-505, SIG-01 sticky) | medium | mitigate | Pin budget measured in the browser (≤ 1 viewport desktop, 0 on mobile and reduced motion); anchors verified to land; SIG-305 global visibilitychange handler removed so it cannot disable page triggers |
| T-jgz-03b | Tampering (repo state) | Uncommitted user changes | high | mitigate | D-06: no commit/stash/reset/checkout of src or public; scoped Edits only on existing files |
| T-jgz-SC | Tampering | npm installs | low | accept | No package installs in this plan; gsap, @gsap/react and Playwright (skill folder) already present |
</threat_model>

<verification>
- npx tsc --noEmit, npm run lint, npm run build all pass.
- verify-motion.mjs exits 0 against the production server (pins, reveal tally, hidden elements, overflow, anchors, console errors).
- Screenshots at 375, 1280 and 1280 reduced motion reviewed with the Read tool; findings fixed.
- git status shows the source changes as uncommitted working-tree changes; no new commits touching src/ or public/.
</verification>

<success_criteria>
- Hero glow gone, palm-shadow layer drifting with scroll, LCP intact (D-02).
- SIG-01, SIG-505, SIG-305 ported with version headers and placed: brand sentence between About and Services, space grid in #khong-gian with 6 unique photos, real review quote highlighted (D-01).
- Every reveal variant at most 2 per page on home and /ban-tin; Pricing calm (D-03).
- Desktop extra pinned scroll at most 1 viewport, mobile and reduced motion with no pins, no dead frames (D-04).
- Build, lint, overflow and anchor checks pass with screenshots saved in the quick dir (D-05).
- Nothing in src/ or public/ committed, stashed or reverted (D-06).
</success_criteria>

<output>
Create `.planning/quick/261113-jgz-phoi-b-nang-xuyen-la-hieu-ung/261113-jgz-SUMMARY.md` when done (include the metrics, screenshot list, intentional photo reuse note, and a reminder that all source changes are uncommitted for the user to review).
</output>
