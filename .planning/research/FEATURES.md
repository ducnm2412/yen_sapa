# Feature Research

**Domain:** Vietnamese spa / skincare clinic, one-page marketing landing page with booking form (mobile-first, traffic mainly from Facebook)
**Researched:** 2026-11-12
**Confidence:** MEDIUM. The feature set rests on well-established conventions for local-service landing pages and on the project's own brief (PROJECT.md, YEU_CAU.md, MEDIA.md). No live competitor teardown was run, so the Vietnam-specific channel behavior (Zalo, Messenger, Facebook in-app browser) is from domain knowledge. Verify it on real devices during build.

## Feature Landscape

### Table Stakes (Users Expect These)

A visitor from a Facebook ad or post decides within a few seconds whether this is a real, trustworthy spa. Missing any of these makes the page feel unfinished or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero with spa photo or video, brand name, one-line promise, primary CTA "Đặt lịch" | First-screen impression and the conversion entry point. The user has to know in 3 seconds what this is and how to book. | LOW | Use `lobby.jpg` as the poster. An optional muted looping `facial-mask-short.mp4` (9s) can go on top. The CTA scrolls to the form. Keep the hero light so LCP stays fast on 4G. |
| Floating contact buttons (call / Zalo / Messenger), always visible on mobile | Vietnamese customers book by calling, Zalo or Fanpage inbox. This is the real conversion path, because the current process is hotline plus Fanpage messages. | LOW | `tel:` link, `https://zalo.me/<số>` link, `https://m.me/SpabeauteYenhcm` link. Decision needed: which of the 2 hotlines the floating call button uses. YEU_CAU lists 0899 607 279 (branch 1) as the SĐT/Zalo. The Zalo number is not confirmed for branch 2. Hide or merge buttons on desktop. Make touch targets at least 44px. Add pulse animation sparingly. |
| Sticky header or nav with brand logo, anchor links, and a "Đặt lịch" CTA | Anchor navigation is the standard for one-page sites. | LOW | Collapse to a hamburger or a compact bar on mobile. Highlight the active section only if it is cheap. |
| Services section (5 groups) with image and short benefit-oriented description | Visitors need to know what the spa treats (acne, dark spots, melasma, rejuvenation, relaxation). | LOW-MEDIUM | Card grid, no detail pages (out of scope). Use the images already classified in MEDIA.md. Each card carries a "Đặt lịch dịch vụ này" CTA that pre-selects the service in the form. Avoid unsupported medical claims; use "hỗ trợ cải thiện", not "chữa khỏi". |
| Booking form: name, phone, service, branch, date/time, note | Core feature. The brief lists the fields. | MEDIUM | See the dedicated section below. Validation matters (Vietnamese phone formats `0[3|5|7|8|9]xxxxxxxx`, +84, date not in the past, time inside 09:00-21:00). Use native `input type="tel"` with the numeric keypad. |
| Form success state | Given in the brief: submit only shows a success message. | LOW | Honest copy is critical (see Anti-Features and Pitfall notes below). The success state should also surface the call/Zalo/Messenger buttons. |
| Contact section with both branches: address, hotline (tap to call), Google Maps embed or link, opening hours 09:00-21:00 daily, Fanpage link | Local service visitors always check "where is it, is it open, how to get there". | LOW-MEDIUM | Two branch cards. Add a "Chỉ đường" button using a Google Maps directions link per branch. Use a link, or a lazy-loaded iframe, to keep performance. The brief gives only one Google Maps short link; confirm whether each branch needs its own link. |
| Real space gallery (6 photos) | Clients judge a spa by its look. Real photos build trust better than stock. | MEDIUM | Responsive grid or carousel with a lightbox. Use `next/image` with `sizes` and blur placeholders. Squarish source images (1080-1290px) suit a uniform grid. Swipe support on mobile. |
| Brand intro and commitments | Establishes who they are and the tone (gentle, refined, modern, relaxing). | LOW | Short copy plus 1 image. Use the content from YEU_CAU section 3. |
| USP / "Vì sao chọn Yên" section | Answers "why you vs the spa down the street". | LOW | 4 items from YEU_CAU section 6. Icons plus one line each. |
| Mobile-first responsive layout and fast load | Most traffic is Facebook mobile. The Facebook in-app browser is slow and unforgiving. | MEDIUM | Performance budget: optimized images, lazy-load everything below the fold, no heavy JS libraries, no autoplaying large video. |
| Vietnamese copy with full diacritics, correct fonts | Language-only site. Font subsets without Vietnamese glyphs break the page visually. | LOW | Choose a font with the `vietnamese` subset (via `next/font` with `subsets: ['vietnamese','latin']`). |
| Basic SEO and sharing metadata: title, description, Open Graph image, favicon, LocalBusiness JSON-LD (2 branches) | Facebook link previews are the main sharing path. A weak OG card hurts every share. Local search for "spa quận 3" depends on structured data. | LOW | OG image from the logo or a hero crop (1200x630). JSON-LD with address, phone, openingHours, geo if known. The brief lists this as active. |
| Footer with brand, branches, social links, copyright | Convention. | LOW | Reuse data constants from the contact section. |

### Differentiators (Competitive Advantage)

Most local spa pages are template-style sites with stock photos and a plain contact form. The project's real assets (vertical videos, real space photos, two branches) are where it can stand out. These align with the Core Value: see the space and service, then book in one tap.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Vertical (9:16) video showcase in a reels or story style, tap-to-play with poster frames | Matches how the audience already consumes Facebook and TikTok content. Real treatment footage is strong social proof that most competitor sites do not have. | MEDIUM-HIGH | Do not autoplay many videos. Use poster images, `preload="none"`, play on tap or when in view, and only one video playing at a time. Compress first (the 66 MB file is the main risk). Horizontal snap carousel on mobile. Use `playsinline` and `muted` for inline autoplay on iOS. Check the Facebook in-app browser behavior. Group by service (acne, body, LED, face-lifting, space tour). Drop the duplicate `body-acupressure-lowres.mp4` after verification. |
| Service cards that deep-link into the booking form with the service pre-selected | Cuts the friction between interest and action. | LOW | Client-side state or a URL hash plus a shared form state. Cheap and high value. |
| Branch picker that connects the map, hotline and form: choosing a branch in the form shows that branch's address and phone | Two branches are a real complexity for visitors; reducing the "which one?" confusion helps booking. | LOW-MEDIUM | Single data source for branches. Optionally show "gần bạn" only if cheap; do not request geolocation (see Anti-Features). |
| Open-now indicator ("Đang mở cửa, đến 21:00") | Reduces calls to a closed spa and signals responsiveness. Hours are simple (09:00-21:00, every day). | LOW | Compute client-side in the Asia/Ho_Chi_Minh timezone. Beware hydration mismatch in SSR; compute after mount. |
| "Tư vấn theo tình trạng da" mini-guide: pick a concern (mụn, thâm nám, da xỉn, lão hóa, thư giãn) and see the matching treatment group with a CTA | Expresses the main USP (treatment tailored to skin condition) in an interactive way, without a backend. | MEDIUM | Static content, simple filter or tabs. Optional; fits as a phase-2 enhancement. Avoid diagnosing; frame it as a "gợi ý" only. |
| Team section with real photos and roles | Trust and humanity. Many spas hide staff. | LOW | Use `team-selfie.jpg` as the primary photo. Avoid the Tết-frame photos as the primary image (per MEDIA.md). Names and roles are not provided in the brief, so confirm content or keep it as a generic "Đội ngũ kỹ thuật viên" block. |
| Click and conversion tracking: events for call, Zalo, Messenger and form-submit, plus Meta Pixel or GA4 | The success metric is the number of bookings and contacts from the website, yet the form stores nothing. Without tracking, the site cannot prove its value to the client. | LOW-MEDIUM | Vercel Analytics custom events or GA4 is enough. Meta Pixel is valuable if the client runs Facebook ads (most likely). Needs a client decision on consent and which ID. See Open Question. |
| Lightbox gallery with swipe and keyboard support | Polished feel at a modest cost. | MEDIUM | Prefer a small dependency or a hand-rolled dialog. Keep accessibility (focus trap, Esc). |
| Subtle scroll-reveal animation and polished typography matching the green + beige + burgundy palette | Makes the page feel premium and calm, which fits the brand. | LOW-MEDIUM | CSS-only or minimal JS. Respect `prefers-reduced-motion`. Do not hurt LCP. |
| Prefilled "gửi qua Zalo/Messenger" handoff after the form succeeds | Turns the dead-end success message into a real booking path. | LOW-MEDIUM | Needs a client decision because the brief says "chỉ báo thành công". Option: success screen shows a summary of the user's entry plus buttons that open Zalo or Messenger. Zalo does not reliably accept prefilled text, so offer a "Sao chép nội dung" button as well. |
| Accessible, honest micro-copy and trust signals (opening hours, real photos, address on map, Fanpage link) | Reduces fear for first-time visitors. | LOW | Mostly content work. Do not invent reviews, counts or certificates. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Misleading success message such as "Đặt lịch thành công! Chúng tôi sẽ xác nhận trong 15 phút" | Feels like the right ending for a booking form. | The form saves and sends nothing. The customer believes the booking is made, and then does not show up or is not contacted. This damages the business, which is worse than no form. | Honest copy: "Yên đã ghi nhận thông tin của bạn" is still risky if nothing is received. Safer: "Cảm ơn bạn! Để giữ lịch nhanh nhất, vui lòng gọi hoặc nhắn Zalo/Fanpage" with big action buttons. Confirm the wording with the client, and make them aware that no data reaches the spa. |
| Backend, admin dashboard, booking calendar, slot availability | "Real" booking systems feel professional. | Explicitly out of scope. Needs a database, auth, concurrency and staff workflow. Heavy for a marketing page. | Keep the form client-only. Wire it to email, Google Sheet or Zalo OA later as a separate milestone. |
| Online payment, deposits, cart, price list | Standard in e-commerce. | Out of scope, the client did not provide prices, and wrong prices create liability. | Use "Liên hệ để được tư vấn" and rely on consultation. |
| Multi-page site: service detail pages, blog, news | Good for long-term SEO. | Out of scope, and it multiplies content and maintenance. | Single page with anchored sections. Revisit after validation. |
| Multi-language switcher | "Tourists" or modernity. | Vietnamese-only audience (nữ 20-45 in TP.HCM). Doubles copy and QA. | Vietnamese only. |
| Customer accounts, login, loyalty, member card | Retention. | Not needed for the goal of booking. | Fanpage and Zalo already handle retention. |
| Autoplaying multiple videos with sound, or a heavy full-screen video hero | "Wow" factor. | Kills mobile performance and data, fails autoplay policies, and the 66 MB file will not load on 4G in a Facebook webview. | One short muted hero loop at most, poster images, tap-to-play for the rest, compressed files (target a few MB each). |
| Fake social proof: invented reviews, customer counts, before/after photos, awards | Conversion boosting. | Only client-supplied content is allowed. Before/after claims in skincare carry regulatory and trust risk in Vietnam. Fabricated content is also an ethical and legal issue. | Use real photos and videos only. Link to Facebook for reviews. Add reviews only if the client supplies real ones. |
| Embedded Facebook feed or Page Plugin widget | Shows activity. | Heavy third-party script, hurts performance and privacy, often blocked or broken in webviews. | A plain "Xem Fanpage" link or button. |
| Live chat widget or chatbot (Tawk, Zalo OA widget, custom bot) | Responsiveness. | Extra script weight, needs staff to monitor, duplicates the floating buttons. | Floating Zalo and Messenger buttons that deep-link to the existing channels. |
| Popups, exit-intent modals, cookie banners that cover the screen | Lead capture. | On mobile they cover the CTA and annoy Facebook traffic. The site collects no data, so a heavy consent UI is unnecessary. If a tracking pixel is added, use a small unobtrusive notice. | Inline CTAs. |
| Geolocation prompt for "nearest branch" | Convenience. | Permission prompts reduce trust and rarely work in webviews. | Let the user choose a branch, with 2 clear cards. |
| Real-time "Đang có X người xem" or fake urgency timers | Urgency. | Dishonest and off-brand for a calm, refined spa. | Honest CTA and opening hours. |
| Full-screen intro or splash animation | Brand feel. | Delays the first interaction and hurts LCP and bounce on mobile. | Fast hero with a subtle fade-in. |
| Huge libraries for carousels, animation or date pickers (e.g. full calendar or GSAP-scale stacks) | Faster to build. | Bundle weight on a performance-sensitive page. | Native `input type="date"` and `type="time"` (or a lightweight custom picker), CSS scroll-snap carousels, CSS animation. |

## Feature Dependencies

```
Content constants (branches, hours, hotlines, links, services)
    ├──feeds──> Contact section (maps, hotlines, hours)
    ├──feeds──> Floating contact buttons
    ├──feeds──> Booking form (service and branch options)
    ├──feeds──> Open-now indicator
    └──feeds──> LocalBusiness JSON-LD

Brand tokens (green + beige + burgundy palette, fonts with Vietnamese subset)
    └──required by──> Every visual section (hero, services, gallery, form)

Optimized media pipeline (compressed videos, resized images, posters)
    ├──required by──> Hero video/image
    ├──required by──> Gallery
    └──required by──> Vertical video showcase

Booking form (client-side validation and shared state)
    ├──required by──> Success state
    ├──enhanced by──> Service-card deep link (pre-select service)
    ├──enhanced by──> Branch picker
    └──enhanced by──> Post-success Zalo/Messenger handoff

Success state ──requires──> Honest copy decision from the client

Conversion tracking ──requires──> Client decision (which Pixel / GA ID) ──enhances──> Floating buttons, Form submit

Vertical video showcase ──conflicts──> Autoplaying many videos / large unoptimized files (performance)
Backend / admin ──conflicts──> "No backend" scope decision
```

### Dependency Notes

- **Content constants feed many features:** Create a single typed data module early (branches, phones, hours, links, services). It prevents inconsistent phone numbers or addresses across the floating buttons, contact section, JSON-LD and form.
- **Media pipeline is a prerequisite for the gallery and video features:** The 66 MB video cannot ship as is, and `body-acupressure-lowres.mp4` needs a duplicate check. Compression and poster extraction should happen before building the video showcase.
- **Form depends on the services and branches data:** Build the form after the constants exist, so the options stay in sync with the service cards.
- **Service deep-link requires shared form state:** Use a hash or a small client state. Order: form first, then card CTAs.
- **Success state requires a copy decision:** Honest wording must be settled with the client before the form is considered done.
- **Tracking requires a client decision:** Without a Pixel or GA ID, tracking cannot be wired. Design the event hooks (call, Zalo, Messenger, submit) so the ID can be added later without code changes.
- **Open-now indicator needs timezone handling:** Compute on the client after mount to avoid hydration mismatch.

## MVP Definition

### Launch With (v1)

The project is described as a real, client-used site, so "MVP" here means the complete one-pager. Everything in Table Stakes ships in v1, plus the cheap differentiators.

- [ ] Hero with CTA, sticky nav with CTA, brand intro, USP section: first impression and positioning
- [ ] Services section, 5 groups, with a "Đặt lịch" CTA per card that pre-selects the service: tells visitors what is offered and speeds up booking
- [ ] Booking form with validation, branch and service selects, honest success state with call/Zalo/Messenger buttons: the core conversion
- [ ] Floating call/Zalo/Messenger buttons on mobile: the real booking channel
- [ ] Contact section with both branches, maps, hours, Fanpage link: local trust
- [ ] Space photo gallery with lightbox: trust and atmosphere
- [ ] Vertical video showcase (poster + tap-to-play, compressed): the main differentiator and the use of existing assets
- [ ] Team section (generic if names are unavailable): human trust
- [ ] SEO basics, OG image, favicon, LocalBusiness JSON-LD: Facebook sharing and local search
- [ ] Performance work (image optimization, lazy-loading, video compression) and Vercel deploy: required for Facebook mobile traffic

### Add After Validation (v1.x)

- [ ] Conversion tracking (Meta Pixel / GA4 events): add as soon as the client supplies IDs; cheap if hooks are prepared in v1
- [ ] Open-now indicator: after the core is stable
- [ ] Skin-concern mini-guide ("Tư vấn theo tình trạng da"): add once the client confirms the content
- [ ] Real customer reviews or testimonials: only if the client supplies authentic ones
- [ ] Wire the form to a real destination (email, Google Sheet, Zalo OA): when the client wants leads captured

### Future Consideration (v2+)

- [ ] Backend plus admin and a booking calendar: only if the spa wants system-managed bookings
- [ ] Service detail pages and a blog for SEO: after the one-pager shows traction
- [ ] Price list or packages: only if the client provides prices and accepts the risk

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Floating call/Zalo/Messenger buttons | HIGH | LOW | P1 |
| Booking form with validation and success state | HIGH | MEDIUM | P1 |
| Hero with CTA | HIGH | LOW | P1 |
| Contact section (2 branches, maps, hours) | HIGH | LOW-MEDIUM | P1 |
| Services section with CTAs | HIGH | LOW-MEDIUM | P1 |
| Space gallery | HIGH | MEDIUM | P1 |
| Mobile-first responsive and performance work | HIGH | MEDIUM | P1 |
| SEO, OG, favicon, JSON-LD | MEDIUM-HIGH | LOW | P1 |
| Brand intro and USP | MEDIUM | LOW | P1 |
| Vertical video showcase | HIGH | MEDIUM-HIGH | P1 |
| Team section | MEDIUM | LOW | P1 |
| Service deep link into form | MEDIUM | LOW | P1 |
| Honest success state with channel handoff | HIGH | LOW | P1 |
| Conversion tracking hooks | MEDIUM-HIGH | LOW-MEDIUM | P2 |
| Open-now indicator | LOW-MEDIUM | LOW | P2 |
| Skin-concern mini-guide | MEDIUM | MEDIUM | P3 |
| Scroll-reveal animations | LOW-MEDIUM | LOW-MEDIUM | P2 |
| Backend and admin | HIGH (later) | HIGH | P3 (out of scope) |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

No live competitor teardown was performed. This table summarizes the typical patterns of Vietnamese spa and clinic landing pages (generic template sites versus Facebook-first businesses) from domain knowledge. It is MEDIUM-LOW confidence and should be spot-checked against 2-3 local competitors if the client wants positioning decisions.

| Feature | Typical template spa site | Facebook-first spa (current state of Yên) | Our Approach |
|---------|---------------------------|-------------------------------------------|--------------|
| Booking | Contact form feeding an email or CRM; often a popup | Hotline plus Fanpage inbox | Form for convenience, but floating one-tap call/Zalo/Messenger as the main path |
| Visuals | Stock photos | Real photos and reels | Real photos and vertical videos as the main differentiator |
| Pricing | Often a price list or "giá ưu đãi" banners | Messages on request | None, "liên hệ tư vấn" (out of scope) |
| Social proof | Testimonials and before/after, often fabricated or generic | Facebook reviews and comments | Real media only, link to Fanpage |
| Mobile experience | Often heavy and slow | Native Facebook UX | Light, fast, thumb-friendly |
| Locations | A single contact block | Posts and pinned info | Two branch cards with map, directions and one-tap call |

## Open Questions for the Client / Requirements Phase

1. **Success-state honesty:** The form saves nothing. Confirm the wording and that the spa understands submissions will not reach them (the brief's success metric is the number of bookings from the website, which the form alone cannot measure). Recommend the handoff buttons on the success screen and event tracking.
2. **Which hotline and Zalo number for the floating buttons:** YEU_CAU gives one SĐT/Zalo (0899 607 279, branch 1) and a second hotline for branch 2 (0896 407 578). Decide on one primary, or on separate buttons per branch.
3. **Tracking IDs:** Does the client run Facebook ads (Meta Pixel) or want GA4 or Vercel Analytics?
4. **Team content:** Staff names and roles are not provided. Use a generic block or ask the client.
5. **Maps:** The brief has one Google Maps link. Confirm whether it covers both branches or whether a link per branch is needed.
6. **Brand naming:** Media shows "Yên Skinlab" and "Usha.beauté". Confirm which names may appear on the page.

## Sources

- D:/projects-cv/demo_9_11_2026/yen_sapa/.planning/PROJECT.md (project scope, active requirements, out-of-scope list, constraints)
- D:/projects-cv/demo_9_11_2026/yen_sapa/docs/YEU_CAU.md (client brief: services, USPs, branches, hours, channels)
- D:/projects-cv/demo_9_11_2026/yen_sapa/docs/MEDIA.md (media inventory: 19 images, 11 vertical videos, file-size and duplicate warnings)
- Domain knowledge of local-service landing page conventions and Vietnamese channel behavior (Zalo, Messenger, Facebook in-app browser). MEDIUM confidence, no external sources fetched in this run.

---
*Feature research for: Vietnamese spa / skincare clinic one-page landing page*
*Researched: 2026-11-12*
