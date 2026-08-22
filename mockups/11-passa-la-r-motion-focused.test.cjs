const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const mockup = path.join(__dirname, '11-passa-la-r-motion-focused.html');
const out = process.env.RUCKUS_LOGO_QA_DIR || '/tmp/ruckus-passa-r-motion-qa';

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const target of [
    { name: 'mobile-narrow', viewport: { width: 390, height: 844 } },
    { name: 'mobile-wide', viewport: { width: 430, height: 932 } },
    { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  ]) {
    const context = await browser.newContext({ viewport: target.viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1350);
    assert.equal(await page.locator('[data-static-icon] svg').count(), 1);
    assert.equal(await page.locator('[data-sizes] .size').count(), 3);
    assert.equal(await page.locator('[data-static-icon] svg').getAttribute('viewBox'), '0 0 100 100');
    assert.equal(await page.locator('[data-static-icon] .home-carrier').getAttribute('fill'), '#6fd2b8');
    assert.equal(await page.locator('[data-static-icon] .home-challenger').getAttribute('fill'), '#ff643b');
    const homeSpacing = await page.locator('[data-static-icon]').evaluate(el => {
      const tile = el.querySelector('.home-tile').getBBox();
      const letter = el.querySelector('.home-r').getBBox();
      return {
        top: letter.y - tile.y,
        right: tile.x + tile.width - (letter.x + letter.width),
        bottom: tile.y + tile.height - (letter.y + letter.height),
        left: letter.x - tile.x,
      };
    });
    assert.ok(Object.values(homeSpacing).every(value => value >= 5), `${target.name}: R Home troppo vicina ai bordi ${JSON.stringify(homeSpacing)}`);
    const homeLetterSize = await page.locator('[data-static-icon] .home-r').evaluate(el => { const box = el.getBBox(); return { width: box.width, height: box.height }; });
    assert.ok(homeLetterSize.width >= 30 && homeLetterSize.height >= 45, `${target.name}: R Home troppo piccola ${JSON.stringify(homeLetterSize)}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `${target.name}: overflow ${overflow}px`);
    const button = await page.locator('[data-replay]').boundingBox();
    assert.ok(button && button.height >= 48);
    const rCenter = await page.locator('.r-letter').evaluate(el => { const box = el.getBBox(); return box.x + box.width / 2; });
    assert.ok(Math.abs(rCenter - 195) < 1, `${target.name}: R non centrata, centro ${rCenter}`);
    assert.equal(Number(await page.locator('.party').evaluate(el => getComputedStyle(el).opacity)), 1);
    await page.screenshot({ path: path.join(out, `${target.name}.png`), fullPage: true });
    assert.deepEqual(errors, []);
    await context.close();
  }

  const motionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(pathToFileURL(mockup).href);
  await motionPage.locator('[data-replay]').click();
  await motionPage.waitForTimeout(150);
  assert.ok(Number(await motionPage.locator('.party').evaluate(el => getComputedStyle(el).opacity)) < 0.1, 'PARTY deve restare nascosto prima dell urto');
  assert.ok(Number(await motionPage.locator('.r-tile').evaluate(el => getComputedStyle(el).opacity)) < 0.1, 'La R deve essere invisibile prima dello scontro');
  const earlyGap = await motionPage.evaluate(() => document.querySelector('.challenger').getBoundingClientRect().left - document.querySelector('.carrier').getBoundingClientRect().right);
  assert.ok(earlyGap > 4, `Le aree non devono ancora toccarsi prima del reveal: gap ${earlyGap}`);
  await motionPage.screenshot({ path: path.join(out, 'motion-before-impact.png'), fullPage: true });
  let collisionAt = null;
  let revealAt = null;
  for (let elapsed = 150; elapsed <= 650; elapsed += 20) {
    const state = await motionPage.evaluate(() => ({
      gap: document.querySelector('.challenger').getBoundingClientRect().left - document.querySelector('.carrier').getBoundingClientRect().right,
      opacity: Number(getComputedStyle(document.querySelector('.r-tile')).opacity),
    }));
    if (collisionAt === null && state.gap <= 2) collisionAt = elapsed;
    if (revealAt === null && state.opacity >= 0.05) revealAt = elapsed;
    if (collisionAt !== null && revealAt !== null) break;
    await motionPage.waitForTimeout(20);
  }
  assert.notEqual(collisionAt, null, 'Le aree devono scontrarsi');
  assert.notEqual(revealAt, null, 'La R deve apparire');
  assert.ok(Math.abs(revealAt - collisionAt) <= 80, `Reveal e scontro non sincronizzati: collisione ${collisionAt}ms, R ${revealAt}ms`);
  await motionPage.waitForTimeout(180);
  assert.ok(Number(await motionPage.locator('.r-tile').evaluate(el => getComputedStyle(el).opacity)) > 0.9, 'La R deve essere visibile durante lo scontro');
  await motionPage.screenshot({ path: path.join(out, 'motion-at-impact.png'), fullPage: true });
  await motionPage.waitForTimeout(900);
  assert.equal(await motionPage.locator('.r-tile').evaluate(el => getComputedStyle(el).transform), 'matrix(1, 0, 0, 1, 0, 0)');
  assert.equal(Number(await motionPage.locator('.party').evaluate(el => getComputedStyle(el).opacity)), 1);
  await motionContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(pathToFileURL(mockup).href);
  assert.equal(await reduced.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  assert.equal(await reduced.locator('.impact').evaluate(el => getComputedStyle(el).display), 'none');
  assert.equal(Number(await reduced.locator('.party').evaluate(el => getComputedStyle(el).opacity)), 1);
  await reduced.screenshot({ path: path.join(out, 'reduced-motion.png'), fullPage: true });
  await browser.close();
  console.log('PASS Passa la R motion: mobile 390/430, desktop, centratura R, sequenza e reduced motion verificati');
})().catch(error => { console.error(error); process.exit(1); });
