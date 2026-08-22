const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const motionLabPath = "/Users/skafiskafnjak/Documents/ChatGPT/Ruckus Party/mockups/06-petrolio-festa-motion.html";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(String(error)));

  await page.goto(pathToFileURL(motionLabPath).href, { waitUntil: "domcontentloaded" });

  const randomValues = await page.evaluate(() => {
    return Array.from({ length: 128 }, () => window.__ruckusMotion.randomInt(6));
  });
  assert.ok(randomValues.every(value => Number.isInteger(value) && value >= 1 && value <= 6));
  assert.ok(new Set(randomValues).size > 1, "Il generatore deve produrre più di un risultato");

  const dieBefore = await page.locator("[data-die-cube]").getAttribute("style");
  await page.locator('[data-action="roll-die"]').click();
  await page.waitForTimeout(1050);
  const dieValue = Number(await page.locator("[data-die-cube]").getAttribute("data-value"));
  const dieAfter = await page.locator("[data-die-cube]").getAttribute("style");
  assert.ok(dieValue >= 1 && dieValue <= 6, "Il dado deve fermarsi su una faccia da 1 a 6");
  assert.notEqual(dieAfter, dieBefore, "Il dado deve ruotare realmente nello spazio");
  await assert.match(await page.locator("[data-die-status]").innerText(), /[1-6]/);

  const pointer = page.locator("[data-wheel-pointer]");
  assert.equal(await pointer.locator("xpath=ancestor::*[@data-wheel-disc]").count(), 0, "Il fermo non deve essere dentro il disco rotante");
  const pointerBefore = await pointer.evaluate(element => getComputedStyle(element).transform);
  const wheelBefore = await page.locator("[data-wheel-disc]").getAttribute("style");
  await page.locator('[data-action="spin-wheel"]').click();
  await page.waitForTimeout(1250);
  const pointerAfter = await pointer.evaluate(element => getComputedStyle(element).transform);
  const wheelAfter = await page.locator("[data-wheel-disc]").getAttribute("style");
  assert.equal(pointerAfter, pointerBefore, "Il fermo deve restare immobile");
  assert.notEqual(wheelAfter, wheelBefore, "Il disco della ruota deve girare");

  await page.locator('[data-action="shuffle-cards"]').click();
  await page.waitForTimeout(1450);
  const firstAceOrder = await page.locator(".ace-card.is-revealed").evaluateAll(cards => {
    return cards.map(card => card.dataset.suit);
  });
  assert.deepEqual([...firstAceOrder].sort(), ["clubs", "diamonds", "hearts", "spades"]);
  assert.equal(await page.locator('.ace-card.is-revealed[data-rank="A"]').count(), 4);

  await page.locator('[data-action="shuffle-cards"]').click();
  await page.waitForTimeout(1450);
  const secondAceOrder = await page.locator(".ace-card.is-revealed").evaluateAll(cards => {
    return cards.map(card => card.dataset.suit);
  });
  assert.deepEqual([...secondAceOrder].sort(), ["clubs", "diamonds", "hearts", "spades"]);
  assert.notDeepEqual(secondAceOrder, firstAceOrder, "L'ordine dei semi deve cambiare a ogni rivelazione");

  assert.deepEqual(pageErrors, [], "Il motion lab non deve generare errori JavaScript");
  await page.close();

  const reducedPage = await browser.newPage({ viewport: { width: 375, height: 900 } });
  await reducedPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedPage.goto(pathToFileURL(motionLabPath).href, { waitUntil: "domcontentloaded" });
  await reducedPage.locator('[data-action="roll-die"]').click();
  await reducedPage.waitForTimeout(50);
  const reducedValue = Number(await reducedPage.locator("[data-die-cube]").getAttribute("data-value"));
  const activeAnimations = await reducedPage.evaluate(() => document.getAnimations().length);
  assert.ok(reducedValue >= 1 && reducedValue <= 6, "Reduced motion non deve bloccare il risultato");
  assert.equal(activeAnimations, 0, "Reduced motion non deve lasciare animazioni attive");

  const consecutiveOrders = [];
  for (let reveal = 0; reveal < 12; reveal += 1) {
    await reducedPage.locator('[data-action="shuffle-cards"]').click();
    consecutiveOrders.push(await reducedPage.locator(".ace-card.is-revealed").evaluateAll(cards => {
      return cards.map(card => card.dataset.suit).join(",");
    }));
  }
  consecutiveOrders.forEach((order, index) => {
    if (index > 0) assert.notEqual(order, consecutiveOrders[index - 1]);
  });

  await reducedPage.close();
  await browser.close();
  console.log("PASS motion lab: dado, ruota, carte e reduced motion verificati");
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
