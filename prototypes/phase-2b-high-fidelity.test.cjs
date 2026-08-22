const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const prototypePath = path.join(__dirname, "phase-2b-high-fidelity.html");
const screenshotDirectory = process.env.RUCKUS_QA_DIR;

async function screenshot(page, name) {
  if (!screenshotDirectory) return;
  fs.mkdirSync(screenshotDirectory, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDirectory, `${name}.png`), fullPage: true });
}

async function openHome(browser, viewport, options = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  if (options.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(pathToFileURL(prototypePath).href, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  if (!options.reducedMotion) await page.waitForTimeout(1300);
  return { context, errors, page };
}

async function verifyStaticHome(page) {
  await assert.doesNotReject(() => page.locator(".chorus-logo").waitFor({ state: "visible" }));
  assert.equal(await page.locator(".home-mode").count(), 3, "La Home deve mostrare tre accessi distinti");
  assert.equal(await page.locator(".home-object-action").count(), 3, "Ogni accesso deve avere il proprio oggetto interattivo");

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    device: document.querySelector(".device").scrollWidth - document.querySelector(".device").clientWidth
  }));
  assert.ok(overflow.document <= 1, `Overflow orizzontale pagina: ${overflow.document}px`);
  assert.ok(overflow.device <= 1, `Overflow orizzontale device: ${overflow.device}px`);

  const undersizedTargets = await page.locator(".home-screen button, .home-header button").evaluateAll(buttons => {
    return buttons.map(button => {
      const rect = button.getBoundingClientRect();
      return { action: button.dataset.action, height: rect.height, width: rect.width };
    }).filter(target => target.height < 44 || target.width < 44);
  });
  assert.deepEqual(undersizedTargets, [], "I controlli Home devono essere almeno 44x44 CSS px");
}

async function verifyMotion(page) {
  const randomValues = await page.evaluate(() => Array.from({ length: 128 }, () => window.__ruckusMotion.randomInt(6)));
  assert.ok(randomValues.every(value => Number.isInteger(value) && value >= 1 && value <= 6));
  assert.ok(new Set(randomValues).size > 1, "Il generatore deve produrre più di un risultato");

  const pointer = page.locator("[data-wheel-pointer]");
  const pointerBefore = await pointer.evaluate(element => getComputedStyle(element).transform);
  const wheelBefore = await page.locator("[data-wheel-disc]").getAttribute("style");
  await page.locator('[data-action="spin-wheel"]').click();
  await page.waitForTimeout(1250);
  assert.equal(await pointer.evaluate(element => getComputedStyle(element).transform), pointerBefore, "Il fermo deve restare immobile");
  assert.notEqual(await page.locator("[data-wheel-disc]").getAttribute("style"), wheelBefore, "Il disco deve girare");
  await assert.match(await page.locator("[data-wheel-status]").innerText(), /\S+/);

  const dieBefore = await page.locator("[data-die-cube]").getAttribute("style");
  await page.locator('[data-action="roll-die"]').click();
  await page.waitForTimeout(1050);
  const dieValue = Number(await page.locator("[data-die-cube]").getAttribute("data-value"));
  assert.ok(dieValue >= 1 && dieValue <= 6, "Il dado deve fermarsi su una faccia da 1 a 6");
  assert.notEqual(await page.locator("[data-die-cube]").getAttribute("style"), dieBefore, "Il dado deve ruotare nello spazio");
  await assert.match(await page.locator("[data-die-status]").innerText(), /[1-6]/);

  const orders = [];
  for (let reveal = 0; reveal < 2; reveal += 1) {
    await page.locator('[data-action="shuffle-cards"]').click();
    await page.waitForTimeout(850);
    const cards = page.locator(".ace-card.is-revealed");
    assert.equal(await cards.count(), 4, "Il finale deve rivelare quattro assi");
    orders.push(await cards.evaluateAll(items => items.map(item => item.dataset.suit)));
  }
  assert.deepEqual([...orders[0]].sort(), ["clubs", "diamonds", "hearts", "spades"]);
  assert.notDeepEqual(orders[1], orders[0], "L'ordine dei semi deve cambiare tra due rivelazioni");
}

async function verifyHomeRoutesAndLanguage(page) {
  await page.locator('.home-mode-party [data-action="start-party"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="players-next"]').waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('.home-mode-quick [data-action="quick-play"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="quick-surprise"]').waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('.home-mode-games [data-action="games"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="game-detail"]').first().waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('[data-action="language"]').click();
  await page.locator('[data-action="set-language-en"]').click();
  await page.locator('[data-action="language-back"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await assert.match(await page.locator(".home-promise").innerText(), /One voice calls/);
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  const mobile = await openHome(browser, { width: 375, height: 900 });
  await verifyStaticHome(mobile.page);
  await verifyMotion(mobile.page);
  await screenshot(mobile.page, "home-mobile-375");
  assert.deepEqual(mobile.errors, [], "La Home mobile non deve generare errori JavaScript");
  await mobile.context.close();

  const mobileWide = await openHome(browser, { width: 430, height: 932 });
  await verifyStaticHome(mobileWide.page);
  await verifyHomeRoutesAndLanguage(mobileWide.page);
  await mobileWide.page.locator('[data-route="home"]').click();
  await mobileWide.page.waitForTimeout(1300);
  await screenshot(mobileWide.page, "home-mobile-430");
  assert.deepEqual(mobileWide.errors, [], "La Home mobile wide non deve generare errori JavaScript");
  await mobileWide.context.close();

  const desktop = await openHome(browser, { width: 1440, height: 1000 });
  await verifyStaticHome(desktop.page);
  await screenshot(desktop.page, "home-desktop-1440");
  assert.deepEqual(desktop.errors, [], "La Home desktop non deve generare errori JavaScript");
  await desktop.context.close();

  const reduced = await openHome(browser, { width: 375, height: 900 }, { reducedMotion: true });
  await reduced.page.locator('[data-action="spin-wheel"]').click();
  await reduced.page.locator('[data-action="roll-die"]').click();
  await reduced.page.locator('[data-action="shuffle-cards"]').click();
  await reduced.page.waitForTimeout(50);
  assert.equal(await reduced.page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
  assert.ok(Number(await reduced.page.locator("[data-die-cube]").getAttribute("data-value")) >= 1);
  assert.equal(await reduced.page.locator(".ace-card.is-revealed").count(), 4);
  await screenshot(reduced.page, "home-reduced-motion");
  assert.deepEqual(reduced.errors, [], "Reduced motion non deve generare errori JavaScript");
  await reduced.context.close();

  await browser.close();
  console.log("PASS high-fidelity Home: mobile, desktop, motion e reduced motion verificati");
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
