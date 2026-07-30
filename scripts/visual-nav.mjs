/**
 * Visual navigator — drive the built site in a real browser and capture what
 * it actually looks like, at any route, any viewport, any scroll position.
 *
 * A production build must already be served (default http://localhost:3111):
 *   pnpm build && npx next start -p 3111
 *
 * Usage:
 *   node scripts/visual-nav.mjs                     every route, desktop + mobile
 *   node scripts/visual-nav.mjs --route /shop       one route
 *   node scripts/visual-nav.mjs --mobile            mobile viewport only
 *   node scripts/visual-nav.mjs --full              full-page capture, not viewport
 *   node scripts/visual-nav.mjs --scroll 2400       capture at a scroll offset
 *   node scripts/visual-nav.mjs --out ./shots       where to write
 *
 * Beyond screenshots it reports the things that are easy to miss by eye and
 * expensive to miss in production: horizontal overflow, elements breaching the
 * viewport, console errors, and failed network requests.
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : (argv[i + 1]?.startsWith("--") ? true : argv[i + 1]) ?? true;
};
const has = (name) => argv.includes(`--${name}`);

const BASE = flag("base", "http://localhost:3111");
const OUT = path.resolve(flag("out", "./.visual"));
const FULL = has("full");
const SCROLL = Number(flag("scroll", 0)) || 0;

const ALL_ROUTES = [
  "/",
  "/shop",
  "/journal",
  "/visit",
  "/the-wolf-way",
  "/the-house-and-rooms",
  "/experiences/consultation",
  "/pieces/the-marble-plinths",
  "/rooms/atrium-living",
];

const routes = flag("route") ? [flag("route")] : ALL_ROUTES;

const VIEWPORTS = [];
if (!has("mobile")) VIEWPORTS.push({ name: "desktop", viewport: { width: 1600, height: 950 }, isMobile: false });
if (!has("desktop")) VIEWPORTS.push({ name: "mobile", ...devices["iPhone 14"] });

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ ...vp, reducedMotion: "no-preference" });
  const page = await context.newPage();

  const errors = [];
  const failed = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e.message).slice(0, 200)));
  page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 110)}`));

  for (const route of routes) {
    errors.length = 0; failed.length = 0;
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    // Let the reveal/scroll-trigger work settle before capturing.
    await page.waitForTimeout(2500);
    if (SCROLL) {
      await page.evaluate((y) => window.scrollTo(0, y), SCROLL);
      await page.waitForTimeout(1500);
    }

    const audit = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const breaches = [];
      for (const n of document.body.querySelectorAll("*")) {
        const cs = getComputedStyle(n);
        if (cs.position === "fixed" || cs.visibility === "hidden") continue;
        const b = n.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.right > vw + 1 || b.left < -1) {
          breaches.push(`${n.tagName}.${String(n.className.baseVal ?? n.className).slice(0, 40)} [${Math.round(b.left)}..${Math.round(b.right)}]`);
        }
      }
      // Anything smaller than 44px that is meant to be tapped.
      const small = [];
      for (const n of document.querySelectorAll("a,button,[role=button]")) {
        const b = n.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.height < 44 || b.width < 24) {
          small.push(`${n.tagName} "${(n.textContent || "").trim().slice(0, 24)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
        }
      }
      return {
        viewport: vw,
        scrollWidth: de.scrollWidth,
        overflowsX: de.scrollWidth > vw,
        breaches: breaches.slice(0, 8),
        smallTargets: small.slice(0, 8),
        title: document.title,
      };
    });

    const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
    const file = path.join(OUT, `${slug}.${vp.name}${SCROLL ? `.y${SCROLL}` : ""}.png`);
    await page.screenshot({ path: file, fullPage: FULL });

    results.push({ route, viewport: vp.name, ...audit, errors: [...errors], failedRequests: [...failed], shot: file });
  }
  await context.close();
}

await browser.close();

// Compact, scannable report — problems first.
for (const r of results) {
  const problems = [
    r.overflowsX ? `OVERFLOW-X (+${r.scrollWidth - r.viewport}px)` : null,
    r.errors.length ? `${r.errors.length} console error(s)` : null,
    r.failedRequests.length ? `${r.failedRequests.length} failed request(s)` : null,
  ].filter(Boolean);
  console.log(`\n${problems.length ? "✗" : "✓"} ${r.route}  [${r.viewport}]  ${problems.join("  ") || "clean"}`);
  if (r.errors.length) r.errors.slice(0, 3).forEach((e) => console.log(`    error: ${e}`));
  if (r.failedRequests.length) r.failedRequests.slice(0, 3).forEach((e) => console.log(`    ${e}`));
  if (r.breaches.length) console.log(`    breaches: ${r.breaches.slice(0, 3).join(" | ")}`);
  if (r.smallTargets.length) console.log(`    small tap targets: ${r.smallTargets.slice(0, 3).join(" | ")}`);
}
console.log(`\nScreenshots -> ${OUT}`);
