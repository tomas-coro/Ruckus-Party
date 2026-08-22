const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const mockup = path.join(__dirname, '10-passa-la-r-icon-home.html');
const out = process.env.RUCKUS_LOGO_QA_DIR || '/tmp/ruckus-passa-r-icon-qa';

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const target of [{ name: 'mobile', viewport: { width: 390, height: 844 } }, { name: 'desktop', viewport: { width: 1440, height: 1000 } }]) {
    const context = await browser.newContext({ viewport: target.viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.dir-panel').count(), 4);
    assert.equal(await page.locator('#chips button').count(), 4);
    for (let i = 0; i < 4; i += 1) {
      await page.locator('#chips button').nth(i).click();
      await page.waitForTimeout(1100);
      const panel = page.locator('.dir-panel:not([hidden])');
      assert.equal(await panel.locator('.sizes .size').count(), 3);
      if (i === 2) {
        assert.equal(await panel.locator('.sizes .r-stroke').first().evaluate(el => getComputedStyle(el).strokeDashoffset), '0px');
        assert.equal(await panel.locator('.sizes .size').first().evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 240, 209)');
      }
      const box = await panel.locator('.replay').boundingBox();
      assert.ok(box && box.height >= 44);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${target.name} variante ${i}: overflow ${overflow}px`);
      await page.screenshot({ path: path.join(out, `${target.name}-${i}.png`), fullPage: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(pathToFileURL(mockup).href);
  for (let i = 0; i < 4; i += 1) {
    await reduced.locator('#chips button').nth(i).click();
    assert.equal(await reduced.locator('.dir-panel:not([hidden]) .big-icon').evaluate(el => getComputedStyle(el).opacity), '1');
  }
  assert.equal(await reduced.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  await reduced.screenshot({ path: path.join(out, 'reduced-motion.png'), fullPage: true });
  await browser.close();
  console.log('PASS Passa la R icon: 4 varianti, palette, mobile, desktop e reduced motion verificati');
})().catch(error => { console.error(error); process.exit(1); });
