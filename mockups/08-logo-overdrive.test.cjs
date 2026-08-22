const { chromium } = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const fileUrl = `file://${path.resolve(__dirname, '08-logo-overdrive.html')}`;
  const out = process.env.RUCKUS_LOGO_QA_DIR || '/tmp/ruckus-logo-overdrive-qa';
  const fs = require('fs');
  fs.mkdirSync(out, { recursive: true });

  for (const target of [
    { name: 'mobile', viewport: { width: 390, height: 844 } },
    { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  ]) {
    const page = await browser.newPage({ viewport: target.viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(fileUrl);
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('.dir-panel').count(), 2);
    assert.equal(await page.locator('#chips button').count(), 2);
    for (let i = 0; i < 2; i += 1) {
      await page.locator('#chips button').nth(i).click();
      await page.waitForTimeout(1500);
      const visible = page.locator('.dir-panel:not([hidden])');
      assert.equal(await visible.count(), 1);
      const overflow = await visible.evaluate(el => el.scrollWidth > el.clientWidth + 1);
      assert.equal(overflow, false, `${target.name}: overflow nella direzione ${i + 1}`);
      const replay = visible.locator('.replay');
      const box = await replay.boundingBox();
      assert(box && box.height >= 44, `${target.name}: tap target replay sotto 44px`);
      await page.screenshot({ path: path.join(out, `${target.name}-direction-${i + 1}.png`), fullPage: true });
    }
    assert.deepEqual(errors, [], `${target.name}: errori pagina`);
    await page.screenshot({ path: path.join(out, `${target.name}.png`), fullPage: true });
    await page.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await context.newPage();
  await reduced.goto(fileUrl);
  const motion = await reduced.locator('.d-lock .word').evaluate(el => getComputedStyle(el).animationName);
  assert.equal(motion, 'none');
  const dash = await reduced.locator('.e-lock .path').evaluate(el => getComputedStyle(el).strokeDashoffset);
  assert.equal(dash, '0px');
  await reduced.screenshot({ path: path.join(out, 'reduced-motion.png'), fullPage: true });
  await browser.close();
  console.log('PASS logo overdrive: due direzioni, mobile, desktop, replay e reduced motion verificati');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
