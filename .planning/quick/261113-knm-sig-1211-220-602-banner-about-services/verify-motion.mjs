// Kiểm tra SIG-1211 (banner -> About), SIG-220 (polaroid), SIG-602 (viền sáng) + ngân sách toàn trang
// (pin, reveal, overflow, anchor, console). Mở rộng từ quick 261113-jgz.
// Usage: node verify-motion.mjs [--url http://localhost:3210/]
// Ghi ./shots/*.png|jpg và ./shots/metrics.json. Thoát mã 1 nếu có hard check thất bại.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const pwPath = path.join(root, ".agents/skills/phoi/assets/node_modules/playwright/index.mjs");
const { chromium } = await import(pathToFileURL(pwPath).href);

const argv = process.argv.slice(2);
const url = argv.includes("--url") ? argv[argv.indexOf("--url") + 1] : "http://localhost:3210/";
const base = url.replace(/\/$/, "");
const out = path.join(here, "shots");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function findChromium() {
  const def = chromium.executablePath();
  if (fs.existsSync(def)) return undefined;
  const b = path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), ".cache"), "ms-playwright");
  if (!fs.existsSync(b)) return undefined;
  const dirs = fs.readdirSync(b).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
  for (const d of dirs) {
    for (const exe of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
      const p = path.join(b, d, exe);
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: findChromium() });
const failures = [];
const metrics = { url, runs: {} };
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
};
const info = (msg) => console.log(`INFO  ${msg}`);

const ANCHORS = ["trang-chu", "gioi-thieu", "dich-vu", "san-pham", "khong-gian", "bang-gia", "danh-gia", "lien-he"];

async function jump(page, y) {
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.max(0, Math.round(y)));
  await page.waitForTimeout(450);
}

/** Cuộn từ trên xuống dưới theo bước 0.5 viewport để mọi trigger batch được kích hoạt. */
async function scrollThrough(page) {
  const { h, total } = await page.evaluate(() => ({ h: innerHeight, total: document.documentElement.scrollHeight }));
  for (let y = 0; y <= total; y += h * 0.5) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(y));
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1500);
}

async function newPage(w, h, reduced, errors) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  return page;
}

const revealTally = (page) =>
  page.evaluate(() => {
    const t = {};
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const v = el.getAttribute("data-reveal");
      t[v] = (t[v] ?? 0) + 1;
    });
    return t;
  });

const hiddenReveal = (page) =>
  page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) bad.push(`${el.getAttribute("data-reveal")}:${(el.textContent || "").trim().slice(0, 30)}`);
    });
    return bad;
  });

const pageOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

/* ------------------------------------------------------------------ SIG-1211 */

const abs = {
  cardTop: () => document.querySelector("[data-sig1211-card]").getBoundingClientRect().top + scrollY,
};

async function sig1211Sample(page, vh, frac) {
  const topAbs = await page.evaluate(abs.cardTop);
  await jump(page, topAbs - frac * vh);
  return page.evaluate(() => {
    const inner = document.querySelector("[data-sig1211-inner]");
    const overlay = document.querySelector("[data-sig1211-overlay]");
    const card = document.querySelector("[data-sig1211-card]");
    const tf = getComputedStyle(inner).transform;
    return {
      scale: tf === "none" ? 1 : new DOMMatrix(tf).a,
      transform: tf,
      overlay: parseFloat(getComputedStyle(overlay).opacity),
      cardTop: Math.round(card.getBoundingClientRect().top),
      cardRadius: getComputedStyle(card).borderTopLeftRadius,
    };
  });
}

async function checkSig1211(page, name, w, vh, reduced, shot) {
  const m = {};
  const geo = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const root = q('[data-sig="1211"]');
    const stick = q("[data-sig1211-stick]");
    const card = q("[data-sig1211-card]");
    const csStick = getComputedStyle(stick);
    return {
      found: !!(root && stick && q("[data-sig1211-inner]") && q("[data-sig1211-overlay]") && card),
      stickPosition: csStick.position,
      stickTopCss: csStick.top,
      rootH: root.offsetHeight,
      stickH: stick.offsetHeight,
      cardH: card.offsetHeight,
      extra: root.offsetHeight - stick.offsetHeight - card.offsetHeight,
      stickContainsBanner: !!stick.querySelector('section[aria-label^="Mặt tiền"]'),
      cardContainsAbout: !!card.querySelector("#gioi-thieu"),
      duplicateIds: document.querySelectorAll("#gioi-thieu").length,
    };
  });
  m.geo = geo;
  check(geo.found, `${name}: SIG-1211 hooks found (root, stick, inner, overlay, card)`);
  check(geo.stickContainsBanner && geo.cardContainsAbout && geo.duplicateIds === 1, `${name}: banner is outgoing, About is incoming, #gioi-thieu unique`);
  check(Math.abs(geo.extra) <= 2, `${name}: SIG-1211 adds no scroll: root ${geo.rootH} - stick ${geo.stickH} - card ${geo.cardH} = ${geo.extra}px (|x| <= 2)`);
  if (reduced) check(geo.stickPosition !== "sticky", `${name}: SIG-1211 stick position = ${geo.stickPosition} (not sticky in reduced)`);
  else check(geo.stickPosition === "sticky", `${name}: SIG-1211 stick position = ${geo.stickPosition} (sticky) top=${geo.stickTopCss}`);

  // Nghỉ: thẻ chưa chạm banner (đỉnh thẻ = đáy viewport + 2px) — banner phải đủ, không biến dạng.
  const topAbs = await page.evaluate(abs.cardTop);
  await jump(page, topAbs - vh - 2);
  const rest = await page.evaluate(() => {
    const img = document.querySelector('[data-sig1211-stick] img[src*="banner-storefront"], [data-sig1211-stick] img');
    const inner = document.querySelector("[data-sig1211-inner]");
    const ir = img.getBoundingClientRect();
    const nr = inner.getBoundingClientRect();
    return { w: ir.width, h: ir.height, ratio: ir.width / ir.height, alt: img.alt, inside: ir.left >= nr.left - 1 && ir.right <= nr.right + 1 && ir.top >= nr.top - 1 && ir.bottom <= nr.bottom + 1 };
  });
  m.rest = rest;
  const want = 1942 / 809;
  check(Math.abs(rest.ratio / want - 1) <= 0.01, `${name}: storefront rendered ${rest.w.toFixed(0)}x${rest.h.toFixed(0)} ratio ${rest.ratio.toFixed(3)} vs ${want.toFixed(3)} (within 1%)`);
  check(rest.inside, `${name}: storefront image inside the inner layer (nothing cropped)`);
  check(rest.alt.length > 40, `${name}: storefront alt present (${rest.alt.length} chars)`);
  await shot("01-banner-rest");

  const s70 = await sig1211Sample(page, vh, 0.7);
  await shot("02-overlap-70");
  const s45 = await sig1211Sample(page, vh, 0.45);
  await shot("03-overlap-45");
  const s15 = await sig1211Sample(page, vh, 0.15);
  await shot("04-overlap-15");
  m.samples = { s70, s45, s15 };
  if (reduced) {
    check(s45.transform === "none" && s45.overlay === 0, `${name}: reduced overlap sample inner transform=${s45.transform}, overlay=${s45.overlay} (none, 0)`);
  } else {
    check(s45.scale < 0.995 && s45.scale >= 0.88, `${name}: overlap@45% inner scale = ${s45.scale.toFixed(4)} (0.88..0.995)`);
    check(s45.overlay > 0.05, `${name}: overlap@45% overlay opacity = ${s45.overlay.toFixed(3)} (> 0.05)`);
    info(`${name}: scale 70%/45%/15% = ${s70.scale.toFixed(3)}/${s45.scale.toFixed(3)}/${s15.scale.toFixed(3)}; overlay ${s70.overlay.toFixed(2)}/${s45.overlay.toFixed(2)}/${s15.overlay.toFixed(2)}; card radius ${s70.cardRadius}/${s45.cardRadius}/${s15.cardRadius}`);
  }
  return m;
}

/* ------------------------------------------------------------------ SIG-220 */

const tableInfo = (page) =>
  page.evaluate(() => {
    const t = document.querySelector("[data-sig220-table]");
    const tr = t.getBoundingClientRect();
    const cs = getComputedStyle(t);
    const cards = [...t.querySelectorAll("[data-sig220-card]")].map((c, idx) => {
      const r = c.getBoundingClientRect();
      const img = c.querySelector("img");
      let o = 1;
      let vis = true;
      for (let el = img; el && el !== t; el = el.parentElement) {
        const s = getComputedStyle(el);
        o *= parseFloat(s.opacity);
        if (s.visibility === "hidden") vis = false;
      }
      const box = img.parentElement.getBoundingClientRect();
      const ccs = getComputedStyle(c);
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      return {
        idx,
        left: r.left, top: r.top, right: r.right, bottom: r.bottom, cx, cy,
        opacity: o,
        visible: vis,
        boxRatio: box.width / box.height,
        attrRatio: Number(img.getAttribute("width")) / Number(img.getAttribute("height")),
        natRatio: img.naturalWidth ? img.naturalWidth / img.naturalHeight : null,
        position: ccs.position,
        touchAction: ccs.touchAction,
        alt: img.alt,
        selfHit: !!hit && hit.closest("[data-sig220-card]") === c,
      };
    });
    return {
      table: { left: tr.left, top: tr.top, right: tr.right, bottom: tr.bottom, width: tr.width, height: tr.height },
      style: { overflowX: cs.overflowX, snap: cs.scrollSnapType, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth, scrollLeft: t.scrollLeft, interactive: t.hasAttribute("data-interactive") },
      cards,
    };
  });

const inside = (c, t, tol) => c.left >= t.left - tol && c.right <= t.right + tol && c.top >= t.top - tol && c.bottom <= t.bottom + tol;

async function tableTopAbs(page) {
  return page.evaluate(() => document.querySelector("[data-sig220-table]").getBoundingClientRect().top + scrollY);
}

/** Đưa bàn ảnh vào giữa khung nhìn (chừa header) rồi chờ. */
async function showTable(page, vh, wait = 1500) {
  const top = await tableTopAbs(page);
  const th = await page.evaluate(() => document.querySelector("[data-sig220-table]").getBoundingClientRect().height);
  await jump(page, top - Math.max(100, (vh - th) / 2));
  await page.waitForTimeout(wait);
}

async function mouseDrag(page, card, dx, dy, steps = 10) {
  await page.mouse.move(card.cx, card.cy);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(card.cx + (dx * i) / steps, card.cy + (dy * i) / steps);
    await page.waitForTimeout(20);
  }
  await page.mouse.up();
}

function checkCardsCommon(name, info7, label) {
  check(info7.cards.length === 7, `${name}${label}: exactly 7 polaroids (${info7.cards.length})`);
  check(info7.cards.every((c) => c.opacity >= 0.99 && c.visible), `${name}${label}: every card visible, opacity >= 0.99 (min ${Math.min(...info7.cards.map((c) => c.opacity)).toFixed(2)})`);
  const badRatio = info7.cards.filter((c) => Math.abs(c.boxRatio / c.attrRatio - 1) > 0.02 || (c.natRatio && Math.abs(c.boxRatio / c.natRatio - 1) > 0.02));
  check(badRatio.length === 0, `${name}${label}: photo boxes keep the image ratio within 2% ${JSON.stringify(badRatio.map((c) => ({ i: c.idx, box: +c.boxRatio.toFixed(3), attr: c.attrRatio })))}`);
  check(info7.cards.every((c) => c.alt.startsWith("Khách hàng tại Yên Spa")), `${name}${label}: every alt is a Vietnamese description starting "Khách hàng tại Yên Spa"`);
}

async function checkSig220Desktop(page, name, vh, shot) {
  const m = {};
  await showTable(page, vh);
  let ti = await tableInfo(page);
  m.rest = ti;
  checkCardsCommon(name, ti, "");
  check(ti.cards.every((c) => inside(c, ti.table, 16)), `${name}: every card rect inside table + 16px at rest`);
  check(ti.style.interactive, `${name}: table is interactive (fine pointer, desktop, motion)`);
  await shot("05-about-polaroids");

  const target = ti.cards.find((c) => c.selfHit);
  check(!!target, `${name}: found a card whose centre hit-tests to itself`);
  if (target) {
    await mouseDrag(page, target, 120, 60);
    await page.waitForTimeout(1200);
    ti = await tableInfo(page);
    const after = ti.cards[target.idx];
    const moved = Math.hypot(after.left - target.left, after.top - target.top);
    m.drag = { moved, after };
    check(moved > 30, `${name}: drag moved the card ${moved.toFixed(0)}px (> 30)`);
    check(inside(after, ti.table, 16), `${name}: dragged card still inside table + 16px`);
    check((await pageOverflow(page)) <= 0, `${name}: page overflow after drag = 0`);
    await shot("06-about-after-drag");

    // Ném mạnh ra mép phải và xuống dưới rồi thả.
    const now = ti.cards[target.idx];
    await page.mouse.move(now.cx, now.cy);
    await page.mouse.down();
    const tx = 1280 - 4;
    const ty = Math.min(vh - 4, now.cy + 400);
    for (let i = 1; i <= 8; i++) {
      await page.mouse.move(now.cx + ((tx - now.cx) * i) / 8, now.cy + ((ty - now.cy) * i) / 8);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(1500);
    ti = await tableInfo(page);
    const fl = ti.cards[target.idx];
    m.fling = fl;
    check(inside(fl, ti.table, 16), `${name}: flung card stays inside table + 16px (right ${fl.right.toFixed(0)}/${ti.table.right.toFixed(0)}, bottom ${fl.bottom.toFixed(0)}/${ti.table.bottom.toFixed(0)})`);
    check((await pageOverflow(page)) <= 0, `${name}: page overflow after fling = 0`);
    await shot("06-about-after-fling");
  }
  return m;
}

async function checkSig220Mobile(page, name, shot) {
  const m = {};
  await showTable(page, 812, 800);
  // Nạp ảnh lazy trong dải ngang: lướt qua toàn bộ dải trước khi đo.
  const sw = await page.evaluate(() => {
    const t = document.querySelector("[data-sig220-table]");
    return t.scrollWidth - t.clientWidth;
  });
  for (let x = 0; x <= sw + 150; x += 150) {
    await page.evaluate((v) => (document.querySelector("[data-sig220-table]").scrollLeft = v), x);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => (document.querySelector("[data-sig220-table]").scrollLeft = 0));
  await page.waitForTimeout(500);
  let ti = await tableInfo(page);
  m.rest = ti;
  checkCardsCommon(name, ti, "");
  check(["auto", "scroll"].includes(ti.style.overflowX), `${name}: rail overflow-x = ${ti.style.overflowX}`);
  check(ti.style.snap.includes("x"), `${name}: rail scroll-snap-type = "${ti.style.snap}"`);
  check(ti.style.scrollWidth > ti.style.clientWidth, `${name}: rail scrollWidth ${ti.style.scrollWidth} > clientWidth ${ti.style.clientWidth}`);
  check(ti.cards.every((c) => c.touchAction !== "none"), `${name}: no card has touch-action none`);
  check(ti.cards.every((c) => c.position !== "absolute"), `${name}: no card is absolutely positioned`);
  check(!ti.style.interactive, `${name}: not interactive on touch/mobile`);
  await shot("05-about-polaroids");
  await page.evaluate(() => (document.querySelector("[data-sig220-table]").scrollLeft = 400));
  await page.waitForTimeout(800);
  ti = await tableInfo(page);
  m.swiped = ti.style;
  check(ti.style.scrollLeft > 0, `${name}: rail scrollLeft after swipe = ${ti.style.scrollLeft} (> 0)`);
  check((await pageOverflow(page)) <= 0, `${name}: page overflow after rail swipe = 0`);
  await shot("06-about-rail-swiped");
  return m;
}

async function checkSig220Reduced(page, name, vh, shot) {
  const m = {};
  // Ngay sau khi tải, không cuộn xuyên trang: mọi ảnh phải đã hiện.
  await showTable(page, vh, 600);
  let ti = await tableInfo(page);
  m.rest = ti;
  checkCardsCommon(name, ti, " (direct jump)");
  check(ti.cards.every((c) => c.position === "absolute"), `${name}: scatter layout is absolute at 1280`);
  check(ti.cards.every((c) => inside(c, ti.table, 16)), `${name}: every card rect inside table + 16px`);
  check(!ti.style.interactive, `${name}: not interactive with reduced motion`);
  await shot("06-about-reduced");
  const target = ti.cards.find((c) => c.selfHit);
  if (target) {
    await mouseDrag(page, target, 120, 60);
    await page.waitForTimeout(600);
    ti = await tableInfo(page);
    const after = ti.cards[target.idx];
    const moved = Math.hypot(after.left - target.left, after.top - target.top);
    check(moved < 2, `${name}: mouse drag moves the card ${moved.toFixed(2)}px (< 2)`);
  } else {
    check(false, `${name}: no self-hit card found for the drag test`);
  }
  return m;
}

/* ------------------------------------------------------------------ SIG-602 */

async function ringState(page) {
  return page.evaluate(() => {
    const ring = document.querySelector("[data-sig602-glow]");
    const cs = getComputedStyle(ring);
    return { bgImage: cs.backgroundImage, bgColor: cs.backgroundColor };
  });
}

async function checkSig602(page, name, vh, reduced, shot) {
  const m = {};
  const st = await page.evaluate(() => {
    const rings = document.querySelectorAll("[data-sig602-glow]");
    const li = rings[0]?.closest("li");
    return {
      count: rings.length,
      liText: (li?.textContent || "").replace(/\s+/g, " ").trim(),
      cards: document.querySelectorAll("#dich-vu a.service-card").length,
      lis: document.querySelectorAll("#dich-vu ul > li").length,
      otherRings: [...document.querySelectorAll("#dich-vu a.service-card")].filter((a) => a.querySelector("[data-sig602-glow]")).length,
    };
  });
  m.static = st;
  check(st.count === 1, `${name}: exactly one [data-sig602-glow] (${st.count})`);
  check(st.liText.includes("Triệt lông OPT") && st.otherRings === 1, `${name}: ring is on the "Triệt lông OPT" card ("${st.liText.slice(0, 40)}")`);
  check(st.cards === 4 && st.lis === 4, `${name}: #dich-vu still has 4 cards (${st.cards} cards, ${st.lis} li)`);

  // Đưa thẻ có viền vào giữa khung nhìn.
  const y = await page.evaluate(() => {
    const r = document.querySelector("[data-sig602-glow]").getBoundingClientRect();
    return r.top + scrollY + r.height / 2;
  });
  await jump(page, y - vh / 2);
  await page.waitForTimeout(1600);
  const a = await ringState(page);
  await shot(reduced ? "07-services-glow-reduced" : "07-services-glow-a");
  await page.waitForTimeout(400);
  const b = await ringState(page);
  if (!reduced) await shot("08-services-glow-b");
  m.inView = { a, b };
  if (reduced) {
    check(a.bgImage === b.bgImage, `${name}: reduced ring is static (two samples equal)`);
    check(a.bgColor !== "rgba(0, 0, 0, 0)" && a.bgColor !== "transparent", `${name}: reduced ring background colour is visible (${a.bgColor})`);
  } else {
    check(a.bgImage !== b.bgImage && a.bgImage.includes("conic-gradient"), `${name}: ring animates in view (two samples 400ms apart differ)`);
    await jump(page, 0);
    await page.waitForTimeout(500);
    const c = await ringState(page);
    await page.waitForTimeout(400);
    const d = await ringState(page);
    m.offScreen = { c, d };
    info(`${name}: off-screen ring samples ${c.bgImage === d.bgImage ? "equal (paused, expected)" : "differ (still running)"}`);
  }
  return m;
}

/* ------------------------------------------------------------------ run */

async function runHome(name, w, h, reduced) {
  const errors = [];
  const page = await newPage(w, h, reduced, errors);
  const m = { width: w, height: h, reduced };
  await page.goto(`${base}/`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2500);

  const shot = async (file, y) => {
    if (y != null) await jump(page, y);
    await page.screenshot({ path: path.join(out, `${name}-${file}.png`) });
  };

  // Reduced: kiểm tra bàn ảnh ngay sau khi tải (không cuộn xuyên trang), mọi thứ phải hiện sẵn.
  if (reduced) m.sig220 = await checkSig220Reduced(page, name, h, shot);

  // Lượt cuộn đầu: kích hoạt trigger, nạp ảnh lazy, rồi về đầu trang để đo vị trí gốc.
  await scrollThrough(page);
  await jump(page, 0);
  await page.waitForTimeout(600);

  m.sig1211 = await checkSig1211(page, name, w, h, reduced, shot);
  if (!reduced) m.sig220 = w >= 768 ? await checkSig220Desktop(page, name, h, shot) : await checkSig220Mobile(page, name, shot);
  m.sig602 = await checkSig602(page, name, h, reduced, shot);
  await jump(page, 0);
  await page.waitForTimeout(600);

  // ---- Quét 14 bước tìm khung chết ----
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((total * i) / steps);
    // cuộn từng đoạn nhỏ như người dùng thật để scrub/pin cập nhật
    const from = await page.evaluate(() => scrollY);
    const n = 8;
    for (let k = 1; k <= n; k++) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(from + ((y - from) * k) / n));
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(out, `${name}-sweep-${String(i).padStart(2, "0")}.jpg`), type: "jpeg", quality: 60 });
  }

  // ---- Số đo sau khi đã cuộn hết trang ----
  await scrollThrough(page);
  m.reveal = await revealTally(page);
  m.hidden = await hiddenReveal(page);
  m.overflow = await pageOverflow(page);
  m.pins = await page.evaluate(() => {
    const vh = innerHeight;
    const spacers = [...document.querySelectorAll(".pin-spacer")].map((s) => parseFloat(getComputedStyle(s).paddingBottom) || 0);
    const sticky = document.querySelector("[data-sig-sticky]");
    const root = document.querySelector('[data-sig="01"]');
    const isSticky = !!sticky && getComputedStyle(sticky).position === "sticky";
    const sigHold = isSticky && root ? root.offsetHeight - sticky.offsetHeight : 0;
    const s1211 = document.querySelector("[data-sig1211-stick]");
    return {
      vh,
      spacerCount: spacers.length,
      spacersPx: spacers,
      spacersVh: spacers.map((p) => +(p / vh).toFixed(3)),
      sig01Sticky: isSticky,
      sig01HoldPx: sigHold,
      sig01HoldVh: +(sigHold / vh).toFixed(3),
      totalVh: +((spacers.reduce((a, b) => a + b, 0) + sigHold) / vh).toFixed(3),
      sig1211Position: s1211 ? getComputedStyle(s1211).position : null,
    };
  });

  // ---- Anchor ----
  m.anchors = {};
  for (const id of ANCHORS) {
    const count = await page.evaluate((i) => document.querySelectorAll(`#${i}`).length, id);
    await page.evaluate(() => {
      history.replaceState(null, "", location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(400);
    await page.evaluate((i) => {
      location.hash = i;
    }, id);
    await page.waitForTimeout(1800);
    const r = await page.evaluate((i) => ({
      top: Math.round(document.getElementById(i)?.getBoundingClientRect().top ?? 9999),
      // scroll-padding-top của html + scroll-margin-top riêng của phần tử = vị trí đáp mong đợi
      expected: Math.round((parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(document.getElementById(i) ?? document.body).scrollMarginTop) || 0)),
      atBottom: scrollY >= document.documentElement.scrollHeight - innerHeight - 2,
      vh: innerHeight,
    }), id);
    m.anchors[id] = { count, top: r.top, expected: r.expected, atBottom: r.atBottom, vh: r.vh };
  }

  m.errors = errors;
  await page.close();
  metrics.runs[name] = m;

  // ---- Hard checks ----
  for (const [k, v] of Object.entries(m.reveal)) check(v <= 2, `${name}: reveal "${k}" = ${v} (<= 2)`);
  check(m.hidden.length === 0, `${name}: hidden reveal elements = ${m.hidden.length} ${JSON.stringify(m.hidden)}`);
  check(m.overflow <= 0, `${name}: horizontal overflow = ${m.overflow}px`);
  check(m.errors.length === 0, `${name}: console errors = ${m.errors.length} ${JSON.stringify(m.errors.slice(0, 3))}`);
  for (const id of ANCHORS) {
    const a = m.anchors[id];
    // Anchor gần cuối trang không thể cuộn tới 80px: chấp nhận khi trang đã cuộn hết cỡ và mục nằm trong viewport.
    const inRange = (a.top >= -4 && a.top <= 160) || Math.abs(a.top - a.expected) <= 6;
    const bottomLimited = a.atBottom && a.top >= 0 && a.top < a.vh * 0.6;
    check(a.count === 1 && (inRange || bottomLimited), `${name}: anchor #${id} count=${a.count} top=${a.top}px${a.atBottom ? " (page bottom reached)" : ""} (expected ${a.expected}px from scroll-padding + scroll-margin; or -4..160; or bottom-limited)`);
  }
  if (w >= 768 && !reduced) {
    check(m.pins.totalVh <= 1.0, `${name}: total pinned scroll = ${m.pins.totalVh} viewport (<= 1.0)`);
    check(m.pins.spacersVh.every((v) => v <= 0.6), `${name}: every pin <= 0.6vh ${JSON.stringify(m.pins.spacersVh)}`);
    check(m.pins.sig01HoldVh <= 0.6, `${name}: SIG-01 hold = ${m.pins.sig01HoldVh}vh (<= 0.6)`);
  } else {
    check(m.pins.spacerCount === 0, `${name}: pin-spacer count = ${m.pins.spacerCount} (0)`);
    check(!m.pins.sig01Sticky, `${name}: SIG-01 sticky = ${m.pins.sig01Sticky} (false)`);
  }
  info(`${name}: SIG-1211 stick position at end = ${m.pins.sig1211Position}`);
}

await runHome("desktop", 1280, 800, false);
await runHome("mobile", 375, 812, false);
await runHome("reduced", 1280, 800, true);

// ---- Liên kết sâu (desktop): mở /#dich-vu rồi cuộn lên bàn ảnh, mọi ảnh phải hiện ----
{
  const errors = [];
  const page = await newPage(1280, 800, false, errors);
  await page.goto(`${base}/#dich-vu`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2500);
  await showTable(page, 800, 1500);
  const ti = await tableInfo(page);
  metrics.runs.deepLink = { cards: ti.cards.map((c) => c.opacity), errors };
  check(ti.cards.length === 7 && ti.cards.every((c) => c.opacity >= 0.99 && c.visible), `deep-link /#dich-vu: all 7 cards visible after scrolling up to the table (min opacity ${Math.min(...ti.cards.map((c) => c.opacity)).toFixed(2)})`);
  check(errors.length === 0, `deep-link: console errors = ${errors.length} ${JSON.stringify(errors.slice(0, 3))}`);
  await page.close();
}

// ---- /ban-tin: ngân sách reveal riêng ----
{
  const errors = [];
  const page = await newPage(1280, 800, false, errors);
  await page.goto(`${base}/ban-tin`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2500);
  await scrollThrough(page);
  const reveal = await revealTally(page);
  const hidden = await hiddenReveal(page);
  const overflow = await pageOverflow(page);
  metrics.runs.banTin = { reveal, hidden, overflow, errors };
  for (const [k, v] of Object.entries(reveal)) check(v <= 2, `ban-tin: reveal "${k}" = ${v} (<= 2)`);
  check(hidden.length === 0, `ban-tin: hidden reveal elements = ${hidden.length} ${JSON.stringify(hidden)}`);
  check(errors.length === 0, `ban-tin: console errors = ${errors.length} ${JSON.stringify(errors.slice(0, 3))}`);
  await page.close();
}

await browser.close();
metrics.failures = failures;
fs.writeFileSync(path.join(out, "metrics.json"), JSON.stringify(metrics, null, 2));
console.log(failures.length ? `\n${failures.length} hard check(s) FAILED` : "\nAll hard checks passed");
process.exit(failures.length ? 1 : 0);
