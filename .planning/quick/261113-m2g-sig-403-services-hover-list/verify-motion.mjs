// Kiểm tra SIG-403 (danh sách rê hiện ảnh ở Dịch vụ), SIG-1211 (banner -> About), SIG-220 (polaroid), SIG-602 đã gỡ
// + ngân sách toàn trang (pin, reveal, overflow, anchor, console). Mở rộng từ quick 261113-knm.
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
// --only desktop|mobile|reduced: chạy riêng một lượt khi gỡ lỗi (mặc định chạy đủ cả ba + deep-link + ban-tin)
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
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
let lastLog = "start";
const check = (ok, msg) => {
  lastLog = msg.slice(0, 90);
  if (!ok) failures.push(msg);
  console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
};
const info = (msg) => {
  lastLog = msg.slice(0, 90);
  console.log(`INFO  ${msg}`);
};

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
  page.on("requestfailed", (r) => {
    // Chrome tự ngắt kết nối tải video hero (net::ERR_ABORTED) sau ~15 giây khi video đã tạm dừng ngoài màn hình;
    // xảy ra cả trên trang đứng yên, không phải lỗi của trang. Chỉ ghi INFO, mọi requestfailed khác vẫn là lỗi.
    if (/\/videos\//.test(r.url()) && r.failure()?.errorText === "net::ERR_ABORTED") {
      console.log(`INFO  media suspend (not an error): ${r.url().split("/").pop()} ERR_ABORTED`);
      return;
    }
    errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText} [after: ${lastLog}]`);
  });
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

/* ------------------------------------------------------------------ SIG-403 */

const EXPECT = [
  { title: "Chăm sóc da mặt", file: "skincare-led.jpg" },
  { title: "Chăm sóc Body", file: "body-massage.jpg" },
  { title: "Chăm sóc Tóc", file: "hair-care-massage.jpg" },
  { title: "Triệt lông OPT", file: "hair-removal-session.jpg" },
];

const OPEN_RE = /^(none|inset\(0(%|px)?( 0(%|px)?){0,3}\))$/;

async function sig403Common(page, name) {
  const st = await page.evaluate(() => {
    const sec = document.querySelector("#dich-vu");
    const root = sec.querySelector('[data-sig="403"]');
    const rows = [...root.querySelectorAll("[data-sig403-row]")];
    return {
      roots: sec.querySelectorAll('[data-sig="403"]').length,
      titles: rows.map((r) => r.querySelector("h3").textContent.trim()),
      isH3: rows.every((r) => r.querySelector("h3[data-sig403-title]")),
      hrefs: rows.map((r) => r.querySelector("a").getAttribute("href")),
      bangGia: document.querySelectorAll("#bang-gia").length,
      strayLi: [...sec.querySelectorAll("li")].filter((li) => !root.contains(li)).length,
      glow: document.querySelectorAll("[data-sig602-glow]").length,
      sectionLink: [...sec.querySelectorAll("a")].some((a) => a.textContent.includes("Xem bảng giá tất cả dịch vụ") && a.getAttribute("href") === "#bang-gia"),
      mode: root.getAttribute("data-sig403-mode"),
      floatDisplay: getComputedStyle(root.querySelector("[data-sig403-float]")).display,
    };
  });
  check(st.roots === 1, `${name}: exactly one [data-sig="403"] inside #dich-vu (${st.roots})`);
  check(JSON.stringify(st.titles) === JSON.stringify(EXPECT.map((e) => e.title)) && st.isH3, `${name}: 4 rows with h3 titles in order ${JSON.stringify(st.titles)}`);
  check(st.hrefs.length === 4 && st.hrefs.every((h) => h === "#bang-gia") && st.bangGia === 1, `${name}: every row links to #bang-gia and #bang-gia exists once (${st.bangGia})`);
  check(st.strayLi === 0, `${name}: old card grid gone, no li outside SIG-403 in #dich-vu (${st.strayLi})`);
  check(st.glow === 0, `${name}: no [data-sig602-glow] on the page (${st.glow})`);
  check(st.sectionLink, `${name}: "Xem bảng giá tất cả dịch vụ" link kept`);
  return st;
}

const rowGeom = (page, i) =>
  page.evaluate((i) => {
    const row = document.querySelectorAll("[data-sig403-row]")[i];
    const t = row.querySelector("[data-sig403-title-text]").getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const w = document.querySelector("[data-sig403-wrap]").getBoundingClientRect();
    return { titleLeft: t.left, titleRight: t.right, titleTop: t.top, titleBottom: t.bottom, rowTop: r.top, rowBottom: r.bottom, rowMid: r.top + r.height / 2, wrapLeft: w.left, wrapRight: w.right, wrapTop: w.top };
  }, i);

const frameState = (page) =>
  page.evaluate(() => {
    const root = document.querySelector('[data-sig="403"]');
    const f = root.querySelector("[data-sig403-float]");
    const cs = getComputedStyle(f);
    const r = f.getBoundingClientRect();
    const imgs = [...f.querySelectorAll("[data-sig403-img]")];
    let top = imgs[0];
    let zi = -1;
    imgs.forEach((e) => {
      const z = parseInt(getComputedStyle(e).zIndex, 10) || 0;
      if (z > zi) {
        zi = z;
        top = e;
      }
    });
    const img = top.querySelector("img");
    return {
      opacity: parseFloat(cs.opacity),
      visibility: cs.visibility,
      active: root.getAttribute("data-sig403-active"),
      topIdx: imgs.indexOf(top),
      src: decodeURIComponent(img.currentSrc || img.src),
      clip: getComputedStyle(top).clipPath,
      complete: img.complete,
      nat: img.naturalWidth,
      fit: getComputedStyle(img).objectFit,
      pos: getComputedStyle(img).objectPosition,
      ow: f.offsetWidth,
      oh: f.offsetHeight,
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
      iw: innerWidth,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });

const hitRow = (page, x, y) =>
  page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    const row = el?.closest("[data-sig403-row]");
    return row ? Number(row.getAttribute("data-index")) : -1;
  }, { x, y });

async function placeWrap(page, topPx = 120) {
  const abs = await page.evaluate(() => document.querySelector("[data-sig403-wrap]").getBoundingClientRect().top + scrollY);
  await jump(page, abs - topPx);
  await page.waitForTimeout(600);
}

async function checkSig403Desktop(page, name, shot) {
  const m = {};
  m.common = await sig403Common(page, name);
  check(m.common.mode === "hover", `${name}: root data-sig403-mode = "${m.common.mode}" (hover)`);
  const inl = await page.evaluate(() =>
    [...document.querySelectorAll("[data-sig403-inline]")].map((f) => {
      const r = f.getBoundingClientRect();
      return { w: r.width, h: r.height, alt: f.querySelector("img")?.alt ?? "" };
    }),
  );
  check(inl.length === 4 && inl.every((f) => f.w <= 1.01 && f.h <= 1.01), `${name}: inline thumbnails visually hidden in hover mode ${JSON.stringify(inl.map((f) => [f.w, f.h]))}`);
  check(inl.every((f) => f.alt.length > 5), `${name}: inline imgs keep a real alt in the accessibility tree`);

  await placeWrap(page);
  await page.mouse.move(640, 20);
  await page.waitForTimeout(500);
  const rest = await frameState(page);
  check(rest.opacity < 0.05, `${name}: frame hidden before hovering (opacity ${rest.opacity})`);

  m.hover = [];
  let g;
  for (let i = 0; i < 4; i++) {
    g = await rowGeom(page, i);
    const x = g.titleLeft + 40;
    const y = g.rowMid;
    await page.mouse.move(x, y, { steps: 8 });
    await page.waitForTimeout(900);
    const s = await frameState(page);
    const hit = await hitRow(page, x, y);
    m.hover.push({ x, y, ...s, hit });
    const ex = EXPECT[i];
    check(s.opacity >= 0.99, `${name}: row ${i + 1} hover frame opacity = ${s.opacity} (>= 0.99)`);
    check(s.active === String(i) && s.topIdx === i, `${name}: row ${i + 1} active=${s.active}, top image=${s.topIdx}`);
    check(s.src.includes(ex.file), `${name}: row ${i + 1} frame image src has ${ex.file} (${s.src.slice(-60)})`);
    check(OPEN_RE.test(s.clip), `${name}: row ${i + 1} top image fully open (clip-path ${s.clip})`);
    check(s.complete && s.nat > 0 && s.fit === "cover", `${name}: row ${i + 1} image loaded (${s.nat}px), object-fit ${s.fit}, position ${s.pos}`);
    check(Math.abs(s.oh / s.ow - 1.25) <= 0.02 && s.ow >= 240 && s.ow <= 345, `${name}: row ${i + 1} frame ${s.ow}x${s.oh} 4:5, width 240..345`);
    check(s.left >= -1 && s.right <= s.iw + 1, `${name}: row ${i + 1} frame inside viewport (${s.left.toFixed(0)}..${s.right.toFixed(0)} of ${s.iw})`);
    check(x < s.left || x > s.right || y < s.top || y > s.bottom, `${name}: row ${i + 1} cursor (${x.toFixed(0)},${y.toFixed(0)}) is not inside the frame`);
    check(hit === i, `${name}: row ${i + 1} elementFromPoint(cursor) is inside that row (pointer-events none proven): ${hit}`);
    check(s.overflow <= 0, `${name}: row ${i + 1} hover page overflow = ${s.overflow}`);
    await shot(`sig403-hover-0${i + 1}`);
  }

  // Bám theo: row 1, kéo chuột 160px sang phải.
  g = await rowGeom(page, 0);
  await page.mouse.move(g.titleLeft + 40, g.rowMid, { steps: 6 });
  await page.waitForTimeout(900);
  const f0 = await frameState(page);
  await page.mouse.move(g.titleLeft + 200, g.rowMid, { steps: 4 });
  await page.waitForTimeout(60);
  const f1 = await frameState(page);
  await page.waitForTimeout(900);
  const f2 = await frameState(page);
  m.follow = { f0: f0.left, f1: f1.left, f2: f2.left };
  info(`${name}: follow 60ms after a 160px move: delta ${(f1.left - f0.left).toFixed(1)}px ${f1.left - f0.left < 150 ? "(lag present)" : "(no visible lag)"}`);
  check(Math.abs(f2.left - f0.left - 160) <= 24, `${name}: frame followed the 160px mouse move by ${(f2.left - f0.left).toFixed(1)}px (160 +- 24)`);
  await shot("sig403-follow");

  // Đổi dòng: row 1 -> row 2, clip mở từ dưới lên.
  g = await rowGeom(page, 1);
  await page.mouse.move(g.titleLeft + 200, g.rowMid, { steps: 4 });
  await page.waitForTimeout(80);
  const sw1 = await frameState(page);
  await page.waitForTimeout(900);
  const sw2 = await frameState(page);
  m.swap = { early: sw1.clip, late: sw2.clip, earlyTop: sw1.topIdx };
  info(`${name}: swap clip after ~80ms = ${sw1.clip} (top image ${sw1.topIdx}) ${OPEN_RE.test(sw1.clip) ? "(already open)" : "(partially clipped, expected)"}`);
  check(sw2.topIdx === 1 && OPEN_RE.test(sw2.clip), `${name}: swap finished: top image ${sw2.topIdx}, clip ${sw2.clip} (fully open)`);

  // Mép phải: hàng cuối, sát mép phải của wrap.
  g = await rowGeom(page, 3);
  const rx = g.wrapRight - 6;
  await page.mouse.move(rx, g.rowMid, { steps: 10 });
  await page.waitForTimeout(900);
  const re = await frameState(page);
  m.rightEdge = re;
  check(re.right <= re.iw + 1 && re.left >= -1, `${name}: right-edge hover frame inside viewport (${re.left.toFixed(0)}..${re.right.toFixed(0)} of ${re.iw})`);
  check(re.overflow <= 0, `${name}: right-edge hover page overflow = ${re.overflow}`);
  check(rx < re.left || rx > re.right || g.rowMid < re.top || g.rowMid > re.bottom, `${name}: right-edge cursor not inside the frame`);
  check(re.topIdx === 3 && re.src.includes(EXPECT[3].file), `${name}: right-edge frame shows the 4th photo`);
  await shot("sig403-right-edge");

  // Rời danh sách.
  await page.mouse.move(640, 30, { steps: 6 });
  await page.waitForTimeout(700);
  const gone = await frameState(page);
  check(gone.opacity < 0.05, `${name}: frame hidden after leaving the list (opacity ${gone.opacity})`);
  check(gone.active === "-1", `${name}: active index = ${gone.active} after leave (-1)`);

  // Bấm hàng 4 -> #bang-gia.
  await placeWrap(page);
  g = await rowGeom(page, 3);
  await page.mouse.click(g.titleLeft + 40, g.rowMid);
  await page.waitForTimeout(800);
  const hash = await page.evaluate(() => location.hash);
  check(hash === "#bang-gia", `${name}: clicking row 4 sets hash ${hash}`);
  await page.mouse.move(640, 5);
  await page.evaluate(() => history.replaceState(null, "", location.pathname));

  // Bàn phím.
  await placeWrap(page);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
  await page.locator("#dich-vu a.arrow-link").focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(900);
  const kb = await page.evaluate(() => {
    const root = document.querySelector('[data-sig="403"]');
    const f = root.querySelector("[data-sig403-float]");
    const fr = f.getBoundingClientRect();
    const row = document.querySelectorAll("[data-sig403-row]")[1];
    const rr = row.getBoundingClientRect();
    const tt = row.querySelector("[data-sig403-title-text]").getBoundingClientRect();
    const inter = !(fr.right <= tt.left || fr.left >= tt.right || fr.bottom <= tt.top || fr.top >= tt.bottom);
    return {
      focusOnRow2: document.activeElement === row.querySelector("a"),
      active: root.getAttribute("data-sig403-active"),
      opacity: parseFloat(getComputedStyle(f).opacity),
      overlapsRowV: fr.top < rr.bottom && fr.bottom > rr.top,
      hitsTitle: inter,
      left: fr.left, right: fr.right, top: fr.top, bottom: fr.bottom, iw: innerWidth,
      titleRight: tt.right,
    };
  });
  m.keyboard = kb;
  check(kb.focusOnRow2, `${name}: after 2 Tabs the focus is on row 2 link`);
  check(kb.active === "1" && kb.opacity >= 0.99, `${name}: keyboard active=${kb.active}, frame opacity ${kb.opacity}`);
  check(kb.overlapsRowV, `${name}: keyboard frame vertically overlaps row 2`);
  check(!kb.hitsTitle, `${name}: keyboard frame does not cover row 2 title (frame left ${kb.left.toFixed(0)}, title right ${kb.titleRight.toFixed(0)})`);
  check(kb.left >= -1 && kb.right <= kb.iw + 1, `${name}: keyboard frame inside viewport`);
  await shot("sig403-keyboard");
  for (let k = 0; k < 3; k++) await page.keyboard.press("Tab");
  await page.waitForTimeout(700);
  const kb2 = await frameState(page);
  check(kb2.opacity < 0.05, `${name}: frame hidden after tabbing out of the list (opacity ${kb2.opacity})`);
  return m;
}

async function checkSig403Inline(page, name, vh, shot, reduced) {
  const m = {};
  m.common = await sig403Common(page, name);
  check(m.common.mode === null, `${name}: no data-sig403-mode attribute (${m.common.mode})`);
  check(m.common.floatDisplay === "none", `${name}: floating frame display = ${m.common.floatDisplay} (none)`);
  m.rows = [];
  for (let i = 0; i < 4; i++) {
    await page.evaluate((i) => document.querySelectorAll("[data-sig403-row]")[i].scrollIntoView({ block: "center", behavior: "instant" }), i);
    await page.waitForTimeout(300);
    await page
      .waitForFunction((i) => {
        const im = document.querySelectorAll("[data-sig403-inline] img")[i];
        return im && im.complete && im.naturalWidth > 0;
      }, i, { timeout: 10000 })
      .catch(() => {});
    const s = await page.evaluate((i) => {
      const fig = document.querySelectorAll("[data-sig403-inline]")[i];
      const im = fig.querySelector("img");
      const r = fig.getBoundingClientRect();
      return { w: r.width, h: r.height, left: r.left, right: r.right, top: r.top, bottom: r.bottom, iw: innerWidth, ih: innerHeight, src: decodeURIComponent(im.currentSrc || im.src), alt: im.alt, fit: getComputedStyle(im).objectFit, loaded: im.complete && im.naturalWidth > 0, overflow: document.documentElement.scrollWidth - innerWidth };
    }, i);
    m.rows.push(s);
    check(s.w >= 159.5, `${name}: row ${i + 1} thumbnail width ${s.w.toFixed(1)} (>= 159.5)`);
    check(Math.abs(s.h / s.w - 1.25) <= 0.03, `${name}: row ${i + 1} thumbnail ratio h/w = ${(s.h / s.w).toFixed(3)} (1.25 +- 0.03)`);
    check(s.src.includes(EXPECT[i].file) && s.loaded, `${name}: row ${i + 1} thumbnail src has ${EXPECT[i].file}, loaded ${s.loaded}`);
    check(s.alt.length > 5 && s.fit === "cover", `${name}: row ${i + 1} alt "${s.alt.slice(0, 30)}", object-fit ${s.fit}`);
    check(s.left >= 0 && s.right <= s.iw && s.top >= 0 && s.bottom <= s.ih, `${name}: row ${i + 1} thumbnail fully inside the viewport`);
    check(s.overflow <= 0, `${name}: row ${i + 1} page overflow = ${s.overflow}`);
    if (reduced && i === 0) await shot("sig403-inline");
    if (!reduced && i === 1) await shot("sig403-inline-a");
    if (!reduced && i === 3) await shot("sig403-inline-b");
  }
  if (reduced) {
    await page.evaluate(() => document.querySelectorAll("[data-sig403-row]")[0].scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(400);
    const g = await rowGeom(page, 0);
    await page.mouse.move(g.titleLeft + 40, g.rowMid, { steps: 6 });
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({
      mode: document.querySelector('[data-sig="403"]').getAttribute("data-sig403-mode"),
      display: getComputedStyle(document.querySelector("[data-sig403-float]")).display,
    }));
    check(after.mode === null && after.display === "none", `${name}: hovering a row keeps the inline layout (mode ${after.mode}, frame display ${after.display})`);
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
  m.sig403 = w >= 768 && !reduced ? await checkSig403Desktop(page, name, shot) : await checkSig403Inline(page, name, h, shot, reduced);
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

check(!fs.existsSync(path.join(root, "src/components/signature/SIG-602")), "SIG-602 folder no longer exists on disk");

if (!only || only === "desktop") await runHome("desktop", 1280, 800, false);
if (!only || only === "mobile") await runHome("mobile", 375, 812, false);
if (!only || only === "reduced") await runHome("reduced", 1280, 800, true);

if (!only) {
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

}

await browser.close();
metrics.failures = failures;
fs.writeFileSync(path.join(out, "metrics.json"), JSON.stringify(metrics, null, 2));
console.log(failures.length ? `\n${failures.length} hard check(s) FAILED` : "\nAll hard checks passed");
process.exit(failures.length ? 1 : 0);
