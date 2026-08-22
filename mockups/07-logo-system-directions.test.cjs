const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const mockupPath = path.join(__dirname, "07-logo-system-directions.html");
const screenshotDirectory = process.env.RUCKUS_LOGO_QA_DIR;

async function openPage(browser, viewport, reducedMotion = false) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  if (reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(pathToFileURL(mockupPath).href, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(reducedMotion ? 50 : 1250);
  return { context, errors, page };
}

async function saveScreenshot(page, name) {
  if (!screenshotDirectory) return;
  fs.mkdirSync(screenshotDirectory, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDirectory, `${name}.png`), fullPage: true });
}

async function assertNoOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `Overflow orizzontale: ${overflow}px`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  const desktop = await openPage(browser, { width: 1440, height: 1000 });
  assert.equal(await desktop.page.locator("[data-direction]").count(), 3);
  assert.equal(await desktop.page.locator(".home-preview").count(), 3);
  assert.equal(await desktop.page.locator(".stage-b .b-piece").evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) === 1)), true);
  assert.equal(Number(await desktop.page.locator(".stage-b .b-word").evaluate(element => getComputedStyle(element).opacity)), 1);
  await assertNoOverflow(desktop.page);
  await saveScreenshot(desktop.page, "logos-desktop-1440");
  assert.deepEqual(desktop.errors, []);
  await desktop.context.close();

  const mobile = await openPage(browser, { width: 390, height: 844 });
  await assertNoOverflow(mobile.page);
  for (const direction of ["a", "b", "c"]) {
    await mobile.page.locator(`[data-tab="${direction}"]`).click();
    const panel = mobile.page.locator(`[data-direction="${direction}"]`);
    await assert.doesNotReject(() => panel.waitFor({ state: "visible" }));
    await mobile.page.waitForTimeout(1100);
    await mobile.page.evaluate(() => window.scrollTo(0, 0));
    await mobile.page.waitForTimeout(50);
    await saveScreenshot(mobile.page, `logo-${direction}-mobile-390`);
  }

  await mobile.page.locator('[data-tab="a"]').click();
  await mobile.page.locator('[data-direction="a"] [data-replay]').click();
  const initialPartyOpacity = Number(await mobile.page.locator(".a-party").evaluate(element => getComputedStyle(element).opacity));
  assert.ok(initialPartyOpacity < 0.1, "Party deve restare invisibile prima del proprio ingresso");
  await mobile.page.waitForTimeout(1200);
  assert.equal(Number(await mobile.page.locator(".a-party").evaluate(element => getComputedStyle(element).opacity)), 1);
  assert.deepEqual(mobile.errors, []);
  await mobile.context.close();

  const reduced = await openPage(browser, { width: 390, height: 844 }, true);
  assert.equal(await reduced.page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
  assert.equal(Number(await reduced.page.locator(".a-party").evaluate(element => getComputedStyle(element).opacity)), 1);
  await assertNoOverflow(reduced.page);
  assert.deepEqual(reduced.errors, []);
  await reduced.context.close();

  await browser.close();
  console.log("PASS logo lab: tre direzioni, mobile, desktop, replay e reduced motion verificati");
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
