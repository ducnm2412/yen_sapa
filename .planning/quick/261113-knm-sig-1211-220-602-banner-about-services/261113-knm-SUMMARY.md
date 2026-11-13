---
phase: quick-261113-knm
plan: 01
status: complete
date: 2026-11-13
subsystem: motion / landing page
tags: [gsap, scrolltrigger, signature, SIG-1211, SIG-220, SIG-602]
key-files:
  created:
    - src/components/signature/SIG-1211/SIG-1211.tsx (+ README.md)
    - src/components/signature/SIG-220/SIG-220.tsx (+ README.md)
    - src/components/signature/SIG-602/SIG-602.tsx (+ README.md)
    - src/components/BannerAboutStack.tsx
    - .planning/quick/261113-knm-sig-1211-220-602-banner-about-services/verify-motion.mjs
  modified:
    - src/components/BannerSection.tsx
    - src/components/AboutSection.tsx
    - src/components/ServicesSection.tsx
    - src/components/motion/MotionSystem.tsx
    - src/content/site.ts
    - src/app/page.tsx
---

# Quick 261113-knm: SIG-1211 + SIG-220 + SIG-602 (Banner / About / Services) Summary

Banner to About now uses a real card-over transition (SIG-1211, CSS sticky + scrub, zero added scroll). About shows 7 real customer photos as polaroids (SIG-220: draggable scatter on desktop with a mouse, swipe rail on mobile, static with reduced motion). Only the "Triệt lông OPT" services card has a running gold border (SIG-602). `npm run lint`, `npx tsc --noEmit` and `npm run build` pass; the browser script prints "All hard checks passed" (exit 0, 156 PASS, `failures: []`).

**No git commits were made (D-06).** Everything is uncommitted in the working tree. Nothing was committed, stashed, reset, restored or checked out. The production server on port 3210 was stopped afterwards.

**Motion level exception (recorded as requested):** SIG-1211 has Min Motion level 4. This site is Motion level 3. The owner approved this as an exception for this task; it is also written in `SIG-1211/README.md` ("owner-approved exception on this Motion-3 site (quick 261113-knm)").

## What changed

- **SIG-1211 (D-01):** new `Sig1211CardOver` plus server wrapper `BannerAboutStack` (`intensity={2}`, `radius="3rem"`, moss-950 overlay, `--sig-bg` beige-50, `--sig-card-shadow` = the shadow About used to carry). `page.tsx` renders `<BannerAboutStack />` in place of the old relative wrapper. Removed dead overlap code: Banner's `data-stack`/`data-stack-inner` hooks and sticky/z/top classes, About's z-index, rounded-top and shadow classes, and the MotionSystem "Overlapping scroll sections" block. `grep data-stack src` is empty. The storefront image, its `width/height`, `sizes` and full alt text are unchanged. `#gioi-thieu` stays on About's own section (no duplicate id).
- **SIG-220 (D-02):** 7 photos in `site.aboutPolaroids` (order: photo-diary-1, yen-capture-1, photo-diary-2, yen-capture-2, photo-diary-3, yen-capture-3, photo-diary-4), each alt starting "Khách hàng tại Yên Spa" and describing only what is visible (looked at all 7 files first). No captions (no facts exist). The lobby photo and the floating "Chăm da khoa học" card are removed from About; the "01" numeral, heading, lead, CTA and the 3 counters are unchanged. The 206px thumbnail is not used.
- **SIG-602 (D-03):** `Sig602GlowRing` rendered only inside the `triet-long` card (`GLOW_GROUP_ID`). Grid, aspect ratios, image, glass bar, title and sub are untouched. No badge.
- **Verify script:** extended copy of the jgz script with SIG-1211/220/602 checks, deep-link run, and the old banner-position metric replaced.

## Verification (D-05)

Static: `npx tsc --noEmit` pass, `npm run lint` pass (0 problems), `npm run build` pass (run after the last source edit). `.planning` checks from the plan's `<verify>` blocks (grep for old hooks, lobby, `customers-8`, random/date calls) all passed.

Browser script against `next start -p 3210`, run 2 of 2 (run 1 had 2 failures, see deviations): **All hard checks passed.**

| Metric | Desktop 1280x800 | Mobile 375x812 | Reduced 1280x800 |
|---|---|---|---|
| Pin spacers | 1 x 0.55vh | 0 | 0 |
| SIG-01 sticky hold | 0.35vh | not sticky | not sticky |
| Total pinned scroll | **0.9 viewport** (limit 1.0) | 0 | 0 |
| SIG-1211 extra scroll (root - stick - card) | 0px | 0px | 0px |
| SIG-1211 stick position | sticky | sticky (0 scroll, no spacer) | relative |
| Overlap scale at 70% / 45% / 15% | 0.976 / 0.956 / 0.932 | 0.988 / 0.978 / 0.966 | none (transform none, overlay 0) |
| Overlay at 45% | 0.28 | 0.16 | 0 |
| Card top radius 70% / 45% / 15% | 48 / 27 / 3px | 29 / 16 / 2px | n/a |
| Horizontal overflow | 0 | 0 | 0 |
| Hidden reveal elements | 0 | 0 | 0 |
| Console errors | 0 | 0 | 0 |

SIG-220: 7 cards, all visible (opacity >= 0.99), photo boxes within 2% of image ratio, all alts start "Khách hàng tại Yên Spa" in all three runs. Desktop: every card inside table + 16px at rest; drag moved a card 142px and it stayed inside; fling to the right edge and 400px down stayed inside; page overflow 0. Mobile: rail `overflow-x: auto`, `scroll-snap-type: x mandatory`, scrollWidth 1756 > clientWidth 375, no `touch-action: none`, no absolute cards, scrollLeft 442 after swipe, overflow 0. Reduced: direct jump to the table (no scroll-through) shows all 7 at absolute positions, mouse drag moved a card < 2px. Deep link `/#dich-vu` then scroll up to the table: all 7 visible.

SIG-602: exactly 1 ring, on the "Triệt lông OPT" card, `#dich-vu` still 4 cards. Desktop and mobile: two samples 400ms apart differ in view; off-screen samples equal (paused, informational). Reduced: samples equal and background colour visible.

Reveal tally, home (same at all three widths): strips 1, chars 2, line 2, words 2, fade-up 2, stagger 2, blur-words 2, mask-right 1, blur 1, slide-left 1, clip-center 1. All <= 2 (strips and blur dropped from 2 to 1 as expected). `/ban-tin`: unchanged, all <= 2, 0 hidden, 0 errors.

Anchors (top after hash jump, all counts 1, identical in the three runs): trang-chu 0, gioi-thieu 80, dich-vu 80, san-pham 80, khong-gian 80, bang-gia 80, danh-gia 80, lien-he 176 (the section's own `scroll-mt-24`, pre-existing, accepted by the script rule).

## Planner-discretion choices (as planned)

- SIG-1211 intensity 2 (scale 0.92, overlay 0.5), `radius="3rem"`, moss-950 overlay (banner darkens instead of washing out).
- SIG-1211 CSS sticky stays active on mobile. It adds 0px scroll and no pin-spacer, same as the old banner; the script measures it (extra 0px, 0 spacers).
- SIG-220 replaces the lobby photo and removes the floating card (duplicate link to `#dich-vu`, duplicate of the h2, and it would sit on top of draggable photos). Dragging only for fine pointers at >= 768px.
- SIG-602 is a masked ring inside the card, intensity 1, no "Được đề xuất" badge (would be a new editorial claim).

## Screenshots

Folder (gitignored): `D:/projects-cv/demo_9_11_2026/yen_sapa/.planning/quick/261113-knm-sig-1211-220-602-banner-about-services/shots/` plus `metrics.json`. For each of `desktop-`, `mobile-`, `reduced-`: `01-banner-rest`, `02-overlap-70`, `03-overlap-45`, `04-overlap-15`; `*-05-about-polaroids` (desktop, mobile); `desktop-06-about-after-drag`, `desktop-06-about-after-fling`, `mobile-06-about-rail-swiped`, `reduced-06-about-reduced`; `*-07-services-glow-a` / `desktop-08` / `mobile-08` `-glow-b` (reduced: `07-services-glow-reduced`); and `sweep-00` to `sweep-14` JPGs per run.

Visual review (Read tool): storefront complete with printed text at rest and while scaling; overlap frames show a rounded beige card over a dimmed, slightly scaled banner with no gap or flash; polaroids tilted, white-framed, undistorted, yen-capture text fully visible, no photo fully buried at rest or after fling; mobile rail shows one polaroid with a peek of the next; gold ring visible on the Triệt lông OPT card only; reduced run static and fully visible; Vietnamese diacritics correct in the hints and headings.

## Deviations from Plan

**1. [Rule 1 - Bug] Mobile rail was as wide as its content (1756px).** First script run failed two checks (`scrollWidth 1756 > clientWidth 1756`, `scrollLeft after swipe = 0`). The grid item had `min-width: auto`, so the flex rail expanded the column (page overflow stayed 0 only because SIG-1211's root clips). Fix: `min-w-0` on About's right column wrapper and `min-width: 0; max-width: 100%` on the SIG-220 root. Second run passed. Files: `AboutSection.tsx`, `SIG-220.tsx`.
**2. [Rule 1 - Bug/visibility] Glow ring too faint at 1x.** The ported base alpha 0.18 at 2px was barely visible on the dark photo in the first screenshots (the ring itself rendered correctly at 3x zoom). Changed to base alpha 0.28 and 3px thickness (default `--sig602-thickness`). Recorded in the SIG-602 README.
**3. [Rule 3] SIG-220 structure differs from the plan text.** GSAP merges a CSS `rotate` into `transform` and sets `rotate: none`, which would have lost the resting tilt. So the drop-in tween targets an inner `[data-sig220-drop]` wrapper (`data-sig220-card` stays on the `li`, so rest position, hit-testing and drag still use the `li`), and dragging writes the CSS `translate` property (applied before `rotate`, so motion follows screen axes). Both recorded in the README port notes.
**4. Script adjustments.** "At rest" sample is taken with the card top 2px below the viewport bottom (banner not yet overlapped), because "banner bottom 40px above the viewport bottom" would already be overlapped by the card. Card visibility is measured as the product of opacity/visibility from the image up to the table (the drop wrapper animates, not the `li`). Photo ratio is compared with the image `width/height` attributes (and `naturalWidth/Height` when loaded), after sweeping the mobile rail so lazy images load. An extra screenshot `desktop-06-about-after-fling` is produced. `reduced-05-about-polaroids` is not produced (the reduced run shoots `06-about-reduced`, per the plan).
**5.** Two fix loops used (rail fix, glow visibility); both within the limit of 2.

## Known issues / notes for the owner

- **Short banner is bottom-anchored.** SIG-1211 holds a section when its bottom reaches the viewport bottom. The banner is shorter than the viewport, so while the card is arriving a beige band (page background) opens above the banner, and on mobile (banner about 223px tall, 812px viewport) the card covers the banner almost immediately, so the scale/dim effect is hard to see on phones. This is how the signature works for short outgoing sections; it was accepted ("sticky on mobile with 0 added scroll").
- **Glow ring is subtle** on the 1x desktop screenshots (3px gold line with a brighter runner). Raise `--sig602-thickness` or the base alpha if you want it stronger.
- **Customer faces (T-knm-04):** the 7 polaroids show recognisable customers. The owner approved this use in the task description. The STATE.md consent note for before/after photos was written for different photos, but please confirm the group/lobby photos have consent too. Alt texts name nobody and make no claims.
- `lien-he` anchor lands at 176px (own `scroll-mt-24`), pre-existing.
- Verification used Chromium only; no real-device check (iOS / Facebook in-app browser) was done.
- SIG-220's `gsap.ticker` physics only runs for fine pointers at >= 768px, while the table is on screen and the tab is visible.

## Threat Flags

None. No new endpoints, auth paths, file access or schema; client-side pointer/keyboard input only moves local CSS transforms.

## Known Stubs

None. All strings come from `site.ts` or existing section copy.

## Self-Check: PASSED

- Created files present: `SIG-1211/`, `SIG-220/`, `SIG-602/` (`.tsx` + `README.md` each), `BannerAboutStack.tsx`, `verify-motion.mjs`, `shots/metrics.json`.
- No commits made by design (D-06); `git status` shows only uncommitted changes.
