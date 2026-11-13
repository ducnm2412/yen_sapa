// Kiểm tra chuyển động "Nắng xuyên lá": screenshot + số đo (pin, reveal, overflow, anchor, console).
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

  // Lượt cuộn đầu: kích hoạt trigger, nạp ảnh lazy, rồi về đầu trang để đo vị trí gốc.
  await scrollThrough(page);
  await jump(page, 0);
  await page.waitForTimeout(600);

  const pos = await page.evaluate(() => {
    const top = (el) => (el ? el.getBoundingClientRect().top + scrollY : null);
    const hh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * parseFloat(getComputedStyle(document.documentElement).fontSize) || 80;
    const sig01 = document.querySelector('[data-sig="01"]');
    const quote = document.querySelector(".sig305-line")?.parentElement;
    return {
      headerH: hh,
      sig01Top: top(sig01),
      sig01H: sig01?.offsetHeight,
      khong: top(document.getElementById("khong-gian")),
      quoteTop: top(quote),
      quoteH: quote?.offsetHeight,
      bangGia: top(document.getElementById("bang-gia")),
    };
  });
  m.positions = pos;
  const vh = h;

  // ---- Screenshots theo plan ----
  await shot("01-hero", 0);
  await shot("02-hero-scrolled", vh * 0.5);
  if (pos.sig01Top != null) {
    await shot("03-sig01-entry", pos.sig01Top - vh * 0.7);
    await shot("04-sig01-mid-hold", pos.sig01Top - pos.headerH + vh * 0.17);
  }
  const pinStart = pos.khong - pos.headerH;
  await shot("05-space-pin-start", pinStart + 2);
  await shot("06-space-pin-mid", pinStart + vh * 0.27);
  await shot("07-space-pin-end", pinStart + vh * 0.55 - 4);
  await shot("08-space-after", pinStart + vh * 0.55 + vh * 0.4);
  if (pos.quoteTop != null) {
    await shot("09-reviews-quote-40", pos.quoteTop - vh * 0.4);
    await shot("10-reviews-quote-after", pos.quoteTop - vh * 0.2);
  }
  await shot("11-pricing-top", pos.bangGia - 20);

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
  m.overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  m.pins = await page.evaluate(() => {
    const vh = innerHeight;
    const spacers = [...document.querySelectorAll(".pin-spacer")].map((s) => parseFloat(getComputedStyle(s).paddingBottom) || 0);
    const sticky = document.querySelector("[data-sig-sticky]");
    const root = document.querySelector('[data-sig="01"]');
    const isSticky = !!sticky && getComputedStyle(sticky).position === "sticky";
    const sigHold = isSticky && root ? root.offsetHeight - sticky.offsetHeight : 0;
    const banner = document.querySelector("[data-stack]");
    return {
      vh,
      spacerCount: spacers.length,
      spacersPx: spacers,
      spacersVh: spacers.map((p) => +(p / vh).toFixed(3)),
      sig01Sticky: isSticky,
      sig01HoldPx: sigHold,
      sig01HoldVh: +(sigHold / vh).toFixed(3),
      totalVh: +((spacers.reduce((a, b) => a + b, 0) + sigHold) / vh).toFixed(3),
      bannerPosition: banner ? getComputedStyle(banner).position : null,
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
}

await runHome("desktop", 1280, 800, false);
await runHome("mobile", 375, 812, false);
await runHome("reduced", 1280, 800, true);

// ---- /ban-tin: ngân sách reveal riêng ----
{
  const errors = [];
  const page = await newPage(1280, 800, false, errors);
  await page.goto(`${base}/ban-tin`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2500);
  await scrollThrough(page);
  const reveal = await revealTally(page);
  const hidden = await hiddenReveal(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
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
