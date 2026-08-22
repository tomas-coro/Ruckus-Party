const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const mockup = path.join(__dirname, '09-passa-il-segnale-con-anima.html');
const out = process.env.RUCKUS_LOGO_QA_DIR || '/tmp/ruckus-passa-segnale-qa';

async function run() {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const target of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport: { width: target.width, height: target.height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.dir-panel').count(), 4);
    assert.equal(await page.locator('#chips button').count(), 4);
    for (let i = 0; i < 4; i += 1) {
      await page.locator('#chips button').nth(i).click();
      await page.waitForTimeout(1400);
      const panel = page.locator('.dir-panel:not([hidden])');
      assert.equal(await panel.count(), 1);
      const replayBox = await panel.locator('.replay').boundingBox();
      assert.ok(replayBox && replayBox.height >= 44, `${target.name} C${i}: replay sotto 44px`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${target.name} C${i}: overflow ${overflow}px`);
      await page.screenshot({ path: path.join(out, `${target.name}-c${i}.png`), fullPage: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(pathToFileURL(mockup).href);
  for (let i = 0; i < 4; i += 1) {
    await reduced.locator('#chips button').nth(i).click();
    const panel = reduced.locator('.dir-panel:not([hidden])');
    assert.equal(await panel.locator('[data-animated]').evaluate(el => getComputedStyle(el).opacity), '1');
  }
  assert.equal(await reduced.locator('.r-badge').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await reduced.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  await reduced.screenshot({ path: path.join(out, 'reduced-motion.png'), fullPage: true });
  await browser.close();
  console.log('PASS Passa il segnale: 4 iterazioni, mobile, desktop, replay e reduced motion verificati');
}

run().catch(error => { console.error(error); process.exit(1); });
