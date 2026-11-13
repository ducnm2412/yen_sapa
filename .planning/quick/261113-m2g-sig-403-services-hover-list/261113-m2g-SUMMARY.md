---
phase: quick-261113-m2g
plan: 01
subsystem: ui
tags: [signature, gsap, quickTo, hover-list, services, next-image]
requires:
  - phase: quick-261113-knm
    provides: SIG-602 gold ring (removed here), verify-motion.mjs harness
provides:
  - SIG-403 hover list (cursor-follow photo) replacing the 4-card grid in #dich-vu
  - per-image focus values in site.serviceGroups
affects: [ServicesSection, MotionSystem, globals.css]
tech-stack:
  added: []
  patterns: [JS-gated hover mode via gsap.matchMedia + data attribute, inline-photo default layout]
key-files:
  created:
    - src/components/signature/SIG-403/SIG-403.tsx
    - src/components/signature/SIG-403/README.md
    - .planning/quick/261113-m2g-sig-403-services-hover-list/verify-motion.mjs
  modified:
    - src/components/ServicesSection.tsx
    - src/content/site.ts
    - src/app/globals.css
    - src/components/motion/MotionSystem.tsx
  deleted:
    - src/components/signature/SIG-602/SIG-602.tsx
    - src/components/signature/SIG-602/README.md
key-decisions:
  - "Hover mode is switched on by JS only (data-sig403-mode on the root), so SSR / no-JS / touch / reduced motion all show inline 4:5 photos"
  - "Floating frame is a sibling of the ul so the site's data-reveal=stagger only touches rows"
  - "Keyboard focus anchors the frame beside the row using the measured title span right edge"
requirements-completed: [QUICK-261113-m2g]
duration: ~1h 15m
completed: 2026-11-13
status: complete
---

# Phase quick-261113-m2g Plan 01: SIG-403 services hover list Summary

**Services section is now a big editorial list (index, Cormorant title, sub line) where a 4:5 photo follows the mouse with gsap.quickTo lag and swaps with a clip-path reveal; phones, touch and reduced motion get every photo inline at 160px; SIG-602 is removed.**

No git commits, stashes, resets or checkouts were made (D-10). All changes are left in the working tree for the orchestrator.

## What changed

- **SIG-403** (`src/components/signature/SIG-403/SIG-403.tsx`, v1.0.0, draft, built in-project, library `.agents/skills` untouched): hover mode only at `(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. quickTo follow (0.65 / 0.5 / 0.4s by intensity), cursor + 32px with flip and clamps, velocity tilt (max 0/4/7 deg, one reusable delayedCall), clip-path swap with z-index counter and reset on complete, hide on leave, scroll re-apply while active, keyboard anchor (focusin/focusout). Cleanup removes the mode attribute, listeners, tweens and inline props. No ticker, RAF, ScrollTrigger, random or dates.
- **ServicesSection**: card `ul` replaced by `Sig403HoverList` fed from `site.serviceGroups` (href `#bang-gia`), theme via `--sig-*` vars on a wrapper, `listAttrs={{ "data-reveal": "stagger" }}`. Eyebrow, h2, "Xem bảng giá tất cả dịch vụ" link and Wave unchanged.
- **site.ts**: `focus` added to each service group after viewing each photo: `skincare-led` 30% 50% (LED lamp, masked face, printed text block), `body-massage` 70% 50% (therapist, drops the empty curtain), `hair-care-massage` 65% 50% (face and hands), `hair-removal-session` 65% 50% (OPT handpiece, arm, goggles).
- **SIG-602 removed**: folder deleted, nothing references it.
- **Dead code removed**: `.service-card` rules, `.card-overlay` / `.card-pill` hover block (no users) in `globals.css`; the `[data-scale-in]` block in `MotionSystem.tsx` (no other user). `.lift-card` / `.usp-card` untouched.
- **README** for SIG-403: status draft, v1.0.0, props, mobile / reduced behavior, Spec, Port notes (incl. focus values).

## Verification (real results)

`npx tsc --noEmit`, `npm run lint`, `npm run build`: pass. `verify-motion.mjs` (Chromium, `next start -p 3210`): **All hard checks passed, exit 0, 274 PASS.**

| Metric | Desktop 1280 | Mobile 375 | Reduced 1280 |
|--------|--------------|------------|--------------|
| Total pinned scroll | 0.9 viewport (1 spacer) | 0 | 0 |
| Horizontal overflow | 0 | 0 | 0 |
| Hidden reveal elements | 0 | 0 | 0 |
| Console errors | 0 | 0 | 0 |
| Reveal tally (home) | strips 1, chars 2, line 2, words 2, fade-up 2, stagger 2, blur-words 2, mask-right 1, blur 1, slide-left 1, clip-center 1 (all <= 2, same in all three runs) | same | same |

`/ban-tin`: words 2, strips 1, line 2, clip-up 2, stagger 2, blur-words 2, mask-right 1, fade-up 1; 0 hidden, 0 errors. Deep-link `/#dich-vu` and all 8 section anchors land under the header. SIG-1211 and SIG-220 checks still pass.

SIG-403 specifics:

- Desktop: mode = hover; 4 inline figures measure <= 1px but keep alt; frame hidden before hover. Each of the 4 rows: frame opacity 1, active index and top image = row index, src matches the expected photo, clip fully open, image loaded with object-fit cover, frame 4:5 (333 wide at 1280), inside viewport, cursor not inside frame, `elementFromPoint(cursor)` is the row (pointer-events none proven), 0 overflow.
- Follow: 160px mouse move gave 160px frame move (244 to 404); 60ms after the move the frame had travelled only about 70px (lag present).
- Swap: ~80ms after changing rows the new image was `inset(43.6% 0% 0%)` (reveal in progress), `inset(0%)` after 900ms.
- Right edge (last row, 6px from wrap edge): frame right 1154 of 1280, cursor not under it, 0px overflow.
- Leave: frame opacity < 0.05, active index -1. Click on row 4: hash `#bang-gia`.
- Keyboard (mouse parked outside): 2 Tabs from the section link focuses row 2, frame opacity 1, active index 1, overlaps row 2 vertically, frame left 795 vs title right 573 (no overlap with title), inside viewport; 3 more Tabs hide it.
- Mobile: no mode attribute, frame `display: none`, thumbnails >= 160px wide at ratio 1.25, correct photos, loaded, alt present, inside viewport, 0 overflow.
- Reduced: same inline checks; hovering a row keeps no mode attribute and frame `display: none`.
- No `[data-sig602-glow]` on the page, SIG-602 folder absent on disk, `.agents/skills` has no changes.

## Screenshots

Gitignored folder `.planning/quick/261113-m2g-sig-403-services-hover-list/shots/` (all reviewed with the Read tool except the 15 sweep jpgs per run):
`desktop-sig403-hover-01..04.png`, `desktop-sig403-follow.png`, `desktop-sig403-right-edge.png`, `desktop-sig403-keyboard.png`, `mobile-sig403-inline-a.png` (rows 1-2), `mobile-sig403-inline-b.png` (rows 3-4), `reduced-sig403-inline.png`, plus the existing banner / About / sweep shots and `metrics.json` (SIG-403 numbers under `runs.<name>.sig403`).

## Deviations from Plan

**1. [Rule 3 - Blocking, script only] Hero video `net::ERR_ABORTED` counted as a console error.**
- **Found during:** Task 3, first two runs (the only failing check, 2 events: `space-tour-1.mp4`, `facial-led-device.mp4`).
- **Cause:** Chrome closes the range request of the paused hero videos about 15-18s after they leave the viewport. Reproduced on an idle page with no SIG-403 interaction (probe: no aborts for 15s, then both aborts at t+18s), so it is timing-dependent and unrelated to SIG-403. Earlier quick runs were simply shorter than that window.
- **Fix:** `verify-motion.mjs` now logs `requestfailed` + `ERR_ABORTED` on `/videos/` URLs as INFO ("media suspend"); every other requestfailed or console error still counts. No budget was loosened for the page itself. The app code was not changed for this.
- **Not counted** as a source fix loop (0 of 2 used).

**2. [Rule 2 - harness] Script conveniences added:** `--only desktop|mobile|reduced` flag and the last check/info line appended to `requestfailed` messages, to bisect the issue above. Default run (no flag) is the full plan run.

Otherwise: plan executed as written. The knm script was copied and the SIG-602 check replaced by the SIG-403 / "no SIG-602" checks as specified.

## Known issues / notes

- **Frame covers part of the hovered title** when the cursor is at the left of a title: by spec the frame sits 32px to the right of the cursor and above the rows, so the rest of that title is hidden while the pointer stays there (visible in `desktop-sig403-hover-01..04.png`). Title is readable up to the cursor and again once the pointer moves right or the row is left. Keyboard mode avoids this (frame is beside the title). If the owner wants the title always readable, options are a larger cursor offset or putting the frame under the text layer; not done because both change the locked spec.
- In hover mode the frame can extend up to 0.25 frame height above the first row or 0.25 below the last (per the vertical clamp), so near the first row it can pass under the fixed header.
- Chromium only; no real-device or Safari / Firefox check, no real touchscreen test (touch logic is covered by the `hover: hover` / `pointer: fine` gate and the mobile / reduced runs).
- Hover on desktop sets `loading="eager"` for the 4 float images (about 4 extra small image requests on desktop hover mode only; phones never load them).
- SIG-403 is built in-project and not yet cast in the DUDI library; owner reviews with `/phoi-duc` before any library cast.
- Hero video media-suspend aborts are a pre-existing browser behavior (see Deviation 1); not fixed.

## Known Stubs

None.

## Threat Flags

None. No new endpoints, auth paths, file access or schema; the component only moves a CSS transform from local pointer and focus events (T-m2g-01 mitigated: quickTo only, scroll listener only while visible, all listeners removed in cleanup).

## Self-Check: PASSED

- FOUND: `src/components/signature/SIG-403/SIG-403.tsx`, `src/components/signature/SIG-403/README.md`, `.planning/quick/261113-m2g-sig-403-services-hover-list/verify-motion.mjs`, `shots/metrics.json`, `shots/desktop-sig403-hover-04.png`, `shots/mobile-sig403-inline-b.png`
- MISSING (as intended): `src/components/signature/SIG-602`
- Commits: none made by design (D-10); working tree holds all changes.
- Server on port 3210 stopped (only TIME_WAIT sockets remain).
