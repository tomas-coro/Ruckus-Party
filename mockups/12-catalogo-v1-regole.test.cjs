const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('/Users/skafiskafnjak/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const mockup = path.join(__dirname, '12-catalogo-v1-regole.html');
const out = process.env.RUCKUS_CATALOG_QA_DIR || '/tmp/ruckus-catalog-v1-qa';

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${label}: overflow orizzontale ${overflow}px`);
}

async function assertVisibleTapTargets(page, label) {
  const tooSmall = await page.locator('button:visible, input:not([type="checkbox"]):visible, select:visible, textarea:visible').evaluateAll(elements => elements
    .map(element => {
      const box = element.getBoundingClientRect();
      return { text: element.textContent?.trim().slice(0, 45) || element.getAttribute('aria-label') || element.tagName, width: box.width, height: box.height };
    })
    .filter(box => box.width < 44 || box.height < 44));
  assert.deepEqual(tooSmall, [], `${label}: target sotto 44px ${JSON.stringify(tooSmall)}`);
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const target of [
    { name: 'mobile-narrow', viewport: { width: 375, height: 812 } },
    { name: 'mobile-wide', viewport: { width: 430, height: 932 } },
    { name: 'landscape', viewport: { width: 844, height: 390 } },
    { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  ]) {
    const context = await browser.newContext({ viewport: target.viewport });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });

    await page.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(350);

    assert.equal(await page.locator('[data-game-id]').count(), 40);
    assert.equal(await page.locator('.deck-filter').count(), 6);
    assert.equal(await page.locator('.catalog-count').textContent(), '40 giochi');
    assert.equal(await page.locator('.collection-tile').count(), 5);
    assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--focus').trim()), '#0d3432');
    assert.equal(await page.locator('.deck-stage .collection-tile').count(), 3);
    assert.equal(await page.locator('.support-stage .collection-tile').count(), 2);
    assert.equal(await page.locator('.collection-art .cover-svg').count(), 0);
    assert.deepEqual(await page.locator('[data-collection="colored"] .colored-card-photo').evaluateAll(cards => cards.map(card => ({
      loaded: card.complete && card.naturalWidth > 0,
      transparentAsset: card.currentSrc.endsWith('.png'),
    }))), [{ loaded: true, transparentAsset: true }]);
    assert.equal(await page.locator('[data-collection="colored"] svg').count(), 0);
    assert.deepEqual(await page.locator('[data-collection="french"] .poker-composite-photo').evaluateAll(images => images.map(image => ({
      loaded: image.complete && image.naturalWidth > 0,
      transparentAsset: image.currentSrc.endsWith('.png'),
    }))), [{ loaded: true, transparentAsset: true }]);
    assert.equal(await page.locator('[data-collection="french"] .poker-card-photo').count(), 0);
    assert.equal(await page.locator('[data-collection="french"] svg').count(), 0);
    assert.deepEqual(await page.locator('[data-collection="italian"] .italian-composite-photo').evaluateAll(images => images.map(image => ({
      loaded: image.complete && image.naturalWidth > 0,
      transparentAsset: image.currentSrc.endsWith('.png'),
    }))), [{ loaded: true, transparentAsset: true }]);
    assert.equal(await page.locator('[data-collection="italian"] .italian-card-photo').count(), 0);
    assert.equal(await page.locator('[data-collection="italian"] svg').count(), 0);
    assert.deepEqual(await page.locator('[data-collection="dice"] .dice-composite-photo').evaluateAll(images => images.map(image => ({
      loaded: image.complete && image.naturalWidth > 0,
      transparentAsset: image.currentSrc.endsWith('.png'),
    }))), [{ loaded: true, transparentAsset: true }]);
    const diceBackground = [...await sharp(path.join(__dirname, 'assets/catalog-covers/dice-composite-v1.png')).extract({ left: 4, top: 4, width: 1, height: 1 }).removeAlpha().raw().toBuffer()];
    assert.ok(diceBackground[0] > 180 && diceBackground[1] > diceBackground[0] + 5 && diceBackground[1] > diceBackground[2] + 5 && diceBackground[2] > 180, `${target.name}: sfondo Dadi fuori palette ${diceBackground}`);
    assert.equal(await page.locator('[data-collection="dice"] .dice-cup, [data-collection="dice"] .dice-object').count(), 0);
    assert.equal(await page.locator('[data-collection="dice"] svg').count(), 0);
    assert.deepEqual(await page.locator('[data-collection="extra"] .extra-composite-photo').evaluateAll(images => images.map(image => ({
      complete: image.complete,
      width: image.naturalWidth,
      height: image.naturalHeight
    }))), [{ complete: true, width: 1672, height: 941 }]);
    assert.equal(await page.locator('[data-collection="extra"] .extra-component').count(), 0);
    assert.doesNotMatch(await page.locator('body').innerText(), /Lorem ipsum|\bTODO\b/i);
    const initialToast = await page.locator('#toast').evaluate(element => ({
      visible: element.dataset.visible,
      top: element.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
    }));
    assert.equal(initialToast.visible, 'false');
    assert.ok(initialToast.top >= initialToast.viewportHeight, `${target.name}: toast inattivo dentro il viewport`);
    await assertNoHorizontalOverflow(page, target.name);
    await assertVisibleTapTargets(page, target.name);

    if (target.name === 'desktop') {
      const deckBoxes = await page.locator('.deck-stage .collection-tile').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect();
        return { top: Math.round(box.top), width: Math.round(box.width), height: Math.round(box.height) };
      }));
      assert.equal(new Set(deckBoxes.map(box => box.top)).size, 1, 'desktop: i tre mazzi non sono allineati');
      assert.ok(Math.max(...deckBoxes.map(box => box.width)) - Math.min(...deckBoxes.map(box => box.width)) <= 1, 'desktop: i tre mazzi non hanno la stessa larghezza');
      assert.ok(Math.max(...deckBoxes.map(box => box.height)) - Math.min(...deckBoxes.map(box => box.height)) <= 1, 'desktop: i tre mazzi non hanno la stessa altezza');
      await page.screenshot({ path: path.join(out, 'desktop-materials.png'), fullPage: true });
      await page.screenshot({ path: path.join(out, 'desktop-materials-viewport.png') });
    }

    await page.getByRole('button', { name: /Briscola Bersaglio/ }).first().click();
    await page.waitForTimeout(50);
    assert.equal(await page.locator('#game-detail h2').textContent(), 'Briscola Bersaglio');
    assert.equal(await page.locator('.rules-list li').count(), 3);
    assert.match(await page.locator('.phone-block').textContent(), /Full Digital|modalità/);
    await assertNoHorizontalOverflow(page, `${target.name}-detail`);

    if (target.viewport.width <= 1040) {
      assert.equal(await page.locator('#catalog').isHidden(), true);
      if (target.name === 'mobile-narrow') {
        await page.screenshot({ path: path.join(out, 'mobile-narrow-detail.png'), fullPage: true });
        await page.screenshot({ path: path.join(out, 'mobile-narrow-detail-viewport.png') });
      }
      await page.locator('[data-mobile-back]').click();
      assert.equal(await page.locator('#catalog').isVisible(), true);
    }

    await page.locator('[data-deck="italian"].deck-filter').click();
    assert.equal(await page.locator('[data-game-id]').count(), 10);
    assert.equal(await page.locator('.catalog-count').textContent(), '10 giochi');

    await page.locator('[data-deck="colored"].deck-filter').click();
    assert.equal(await page.locator('[data-game-id]').count(), 14);
    assert.equal(await page.locator('.catalog-count').textContent(), '14 giochi');
    assert.equal(await page.locator('[data-game-id="speed"]').count(), 1);

    await page.locator('[data-deck="dice"].deck-filter').click();
    assert.equal(await page.locator('[data-game-id]').count(), 10);
    assert.equal(await page.locator('.catalog-count').textContent(), '10 giochi');
    const diceNames = await page.locator('[data-game-id] span:first-child').allTextContents();
    assert.deepEqual(diceNames, ['Mira 100', 'Spaccato!', 'Poker di Dadi', 'Dubito!', 'Banco Rotto', 'Cambio Faccia', 'Codice Comune', 'Linea Storta', 'Te lo Passo', 'Faccia Segreta']);

    await page.locator('#game-search').fill('testo che non esiste');
    assert.equal(await page.locator('.empty-state').count(), 1);
    await page.locator('#game-search').fill('');
    await page.locator('[data-deck="all"].deck-filter').click();

    await page.locator('#language-button').click();
    assert.equal(await page.locator('#app-title').textContent(), 'Games');
    assert.equal(await page.locator('.catalog-count').textContent(), '40 games');

    await page.locator('[data-demo-state="loading"]').click();
    assert.equal(await page.locator('.skeleton-row').count(), 4);
    await page.locator('[data-demo-state="loading"]').click();
    assert.equal(await page.locator('[data-retry]').count(), 1);
    await page.locator('[data-retry]').click();
    assert.equal(await page.locator('[data-game-id]').count(), 40);

    await page.screenshot({ path: path.join(out, `${target.name}.png`), fullPage: true });
    if (target.name === 'mobile-narrow') await page.screenshot({ path: path.join(out, 'mobile-catalog-viewport.png') });
    assert.deepEqual(pageErrors, [], `${target.name}: page errors`);
    assert.deepEqual(consoleErrors, [], `${target.name}: console errors`);
    await context.close();
  }

  const allGamesContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const allGamesPage = await allGamesContext.newPage();
  await allGamesPage.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
  const ids = await allGamesPage.locator('[data-game-id]').evaluateAll(buttons => [...new Set(buttons.map(button => button.dataset.gameId))]);
  assert.equal(ids.length, 40);
  for (const id of ids) {
    await allGamesPage.locator(`[data-game-id="${id}"]`).first().click();
    assert.ok((await allGamesPage.locator('#game-detail h2').textContent()).trim().length > 1, `${id}: titolo mancante`);
    assert.equal(await allGamesPage.locator('.rules-list li').count(), 3, `${id}: regole incomplete`);
    assert.ok((await allGamesPage.locator('.result-block p').textContent()).trim().length > 12, `${id}: vittoria mancante`);
    assert.ok((await allGamesPage.locator('.phone-block p').textContent()).trim().length > 12, `${id}: modalità telefono mancante`);
  }
  await allGamesPage.locator('[data-deck="colored"].deck-filter').click();
  await allGamesPage.locator('[data-game-id="speed"]').click();
  assert.match(await allGamesPage.locator('.detail-deck').textContent(), /Carte colorate - compatibili/);
  await allGamesContext.close();

  const extraContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const extraPage = await extraContext.newPage();
  await extraPage.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
  await extraPage.locator('[data-add-extra]').click();
  assert.equal(await extraPage.locator('#extra-game-form').count(), 1);
  await extraPage.locator('.save-extra').click();
  assert.equal(await extraPage.locator('#extra-form-error').isVisible(), true);
  assert.equal(await extraPage.locator(':focus').getAttribute('id'), 'extra-name');
  await extraPage.locator('#extra-name').fill('La Scatola Misteriosa');
  await extraPage.locator('#extra-players').fill('2-5');
  await extraPage.locator('#extra-material').fill('Scatola originale, 36 carte speciali e 8 segnalini');
  await extraPage.locator('#extra-rules').fill('Distribuite cinque carte a testa.\nCompletate il vostro obiettivo segreto.\nIl primo che chiude la mano ferma il round.');
  await extraPage.locator('#extra-duration').fill('15-20 min');
  await extraPage.locator('.advanced-rules summary').click();
  await extraPage.locator('#extra-points').fill('3');
  await extraPage.locator('#extra-result').selectOption('1');
  await extraPage.locator('#extra-consequence').selectOption('1');
  await extraPage.locator('[name="repeatable"]').check();
  await assertVisibleTapTargets(extraPage, 'extra-form');
  await extraPage.screenshot({ path: path.join(out, 'extra-game-form.png'), fullPage: true });
  await extraPage.screenshot({ path: path.join(out, 'extra-game-form-viewport.png') });
  await extraPage.locator('.save-extra').click();
  assert.equal(await extraPage.locator('#game-detail h2').textContent(), 'La Scatola Misteriosa');
  assert.equal(await extraPage.locator('.phone-block strong').textContent(), 'Ruolo del telefono');
  assert.match(await extraPage.locator('.meta-strip').textContent(), /Materiale originale/);
  assert.equal(await extraPage.locator('[data-extra-available]').isChecked(), true);
  assert.equal(await extraPage.locator('.catalog-count').textContent(), '1 gioco');
  const storedExtra = await extraPage.evaluate(() => JSON.parse(localStorage.getItem('ruckus-extra-games-v1')));
  assert.equal(storedExtra.length, 1);
  assert.equal(storedExtra[0].points, 3);
  assert.equal(storedExtra[0].repeatable, true);
  await extraPage.reload({ waitUntil: 'domcontentloaded' });
  await extraPage.locator('[data-deck="extra"].deck-filter').click();
  assert.equal(await extraPage.locator('[data-game-id]').count(), 1);
  assert.equal(await extraPage.locator('[data-extra-available]').isChecked(), true);
  await extraPage.locator('[data-game-id]').click();
  await extraPage.screenshot({ path: path.join(out, 'extra-game-saved.png'), fullPage: true });
  await extraPage.locator('[data-extra-available]').uncheck();
  const updatedExtra = await extraPage.evaluate(() => JSON.parse(localStorage.getItem('ruckus-extra-games-v1')));
  assert.equal(updatedExtra[0].available, false);
  await extraContext.close();

  const textScaleContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const textScalePage = await textScaleContext.newPage();
  await textScalePage.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
  await textScalePage.evaluate(() => { document.documentElement.style.fontSize = '150%'; });
  await textScalePage.waitForTimeout(50);
  await assertNoHorizontalOverflow(textScalePage, 'text-scale-150');
  await textScalePage.screenshot({ path: path.join(out, 'text-scale-150.png'), fullPage: true });
  await textScaleContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(pathToFileURL(mockup).href, { waitUntil: 'domcontentloaded' });
  await reducedPage.waitForTimeout(50);
  assert.equal(await reducedPage.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);
  await reducedPage.screenshot({ path: path.join(out, 'reduced-motion.png'), fullPage: true });
  await reducedContext.close();

  await browser.close();
  console.log('PASS catalogo V1: 40 giochi, 3 mazzi allineati, 10 dadi, compatibilità T, Giochi Extra locali, IT/EN, mobile 375/430, landscape 844, desktop 1440, stati, tap target, overflow e reduced motion');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
