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
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDirectory, `${name}.png`), fullPage: true });
}

async function assertCurrentLayout(page, label) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    device: document.querySelector(".device").scrollWidth - document.querySelector(".device").clientWidth
  }));
  assert.ok(overflow.document <= 1, `${label}: overflow pagina ${overflow.document}px`);
  assert.ok(overflow.device <= 1, `${label}: overflow device ${overflow.device}px`);

  const undersizedTargets = await page.locator(".screen button:visible, .app-header button:visible").evaluateAll(buttons => buttons.map(button => {
    const rect = button.getBoundingClientRect();
    return { action: button.dataset.action || button.textContent.trim(), height: rect.height, width: rect.width };
  }).filter(target => target.height < 44 || target.width < 44));
  assert.deepEqual(undersizedTargets, [], `${label}: controlli sotto 44x44 CSS px`);
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
  await assert.doesNotReject(() => page.locator("[data-ruckus-logo]").waitFor({ state: "visible" }));
  assert.equal(await page.locator(".home-mode").count(), 3, "La Home deve mostrare tre accessi distinti");
  assert.equal(await page.locator(".home-object-action").count(), 3, "Ogni accesso deve avere il proprio oggetto interattivo");
  assert.equal(await page.locator(".home-brand-icon svg").count(), 1, "La Home deve usare l'icona R approvata");
  assert.equal(await page.locator(".home-brand-icon svg").getAttribute("viewBox"), "0 0 100 100");
  assert.equal(await page.locator(".home-logo-carrier").getAttribute("fill"), "#6fd2b8");
  assert.equal(await page.locator(".home-logo-challenger").getAttribute("fill"), "#ff643b");
  assert.equal(await page.locator(".ruckus-carrier").getAttribute("fill"), "#6fd2b8");
  assert.equal(await page.locator(".ruckus-challenger").getAttribute("fill"), "#ff643b");

  const logoBox = await page.locator("[data-ruckus-logo]").boundingBox();
  const promiseBox = await page.locator(".home-promise").boundingBox();
  assert.ok(logoBox && promiseBox && logoBox.y + logoBox.height <= promiseBox.y + 1, "Logo e promessa Home non devono sovrapporsi");

  const homeLetterSpacing = await page.locator(".home-brand-icon").evaluate(element => {
    const tile = element.querySelector(".home-logo-tile").getBBox();
    const letter = element.querySelector(".home-logo-r").getBBox();
    return {
      top: letter.y - tile.y,
      right: tile.x + tile.width - (letter.x + letter.width),
      bottom: tile.y + tile.height - (letter.y + letter.height),
      left: letter.x - tile.x
    };
  });
  assert.ok(Object.values(homeLetterSpacing).every(value => value >= 5), `La R dell'icona è troppo vicina ai bordi: ${JSON.stringify(homeLetterSpacing)}`);
  assert.equal(Number(await page.locator(".ruckus-party").evaluate(element => getComputedStyle(element).opacity)), 1);

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

async function verifyLogoMotion(page) {
  await page.locator('[data-route="home"]').click();
  await page.evaluate(() => {
    document.getAnimations().forEach(animation => {
      animation.pause();
      animation.currentTime = 0;
    });
  });
  assert.ok(Number(await page.locator(".ruckus-party").evaluate(element => getComputedStyle(element).opacity)) < 0.1, "PARTY deve restare nascosto prima dell'urto");
  assert.ok(Number(await page.locator(".ruckus-r-tile").evaluate(element => getComputedStyle(element).opacity)) < 0.1, "La R deve essere invisibile prima dello scontro");
  const earlyGap = await page.evaluate(() => document.querySelector(".ruckus-challenger").getBoundingClientRect().left - document.querySelector(".ruckus-carrier").getBoundingClientRect().right);
  assert.ok(earlyGap > 4, `Le aree non devono toccarsi prima del reveal: gap ${earlyGap}`);

  await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));

  let collisionAt = null;
  let revealAt = null;
  for (let elapsed = 0; elapsed <= 650; elapsed += 20) {
    const state = await page.evaluate(() => ({
      gap: document.querySelector(".ruckus-challenger").getBoundingClientRect().left - document.querySelector(".ruckus-carrier").getBoundingClientRect().right,
      opacity: Number(getComputedStyle(document.querySelector(".ruckus-r-tile")).opacity)
    }));
    if (collisionAt === null && state.gap <= 2) collisionAt = elapsed;
    if (revealAt === null && state.opacity >= 0.05) revealAt = elapsed;
    if (collisionAt !== null && revealAt !== null) break;
    await page.waitForTimeout(20);
  }
  assert.notEqual(collisionAt, null, "Le aree devono scontrarsi");
  assert.notEqual(revealAt, null, "La R deve apparire");
  assert.ok(Math.abs(revealAt - collisionAt) <= 80, `Reveal e scontro non sincronizzati: collisione ${collisionAt}ms, R ${revealAt}ms`);
  await page.waitForTimeout(900);
  assert.equal(Number(await page.locator(".ruckus-party").evaluate(element => getComputedStyle(element).opacity)), 1);
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
  await assert.doesNotReject(() => page.locator('[data-action="format-next"]').waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('.home-mode-quick [data-action="quick-play"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="quick-surprise"]').waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('.home-mode-games [data-action="games"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="game-detail"]').first().waitFor({ state: "visible" }));
  await page.locator('[data-route="home"]').click();

  await page.locator('[data-route="home"]').click();
  await page.locator('[data-action="language"]').click();
  await page.locator('[data-action="set-language-en"]').click();
  await page.locator('[data-action="language-back"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await assert.match(await page.locator(".home-promise").innerText(), /One voice calls/);
}

async function verifyPartyFormatChoice(page) {
  await page.locator('[data-route="home"]').click();
  await page.locator('.home-mode-party [data-action="start-party"]').click();
  await assert.doesNotReject(() => page.locator('[data-format="free"]').waitFor({ state: "visible" }));
  await assert.doesNotReject(() => page.locator('[data-format="tournament"]').waitFor({ state: "visible" }));

  await page.locator('[data-format="free"]').click();
  await page.locator('[data-action="format-next"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="players-next"]').waitFor({ state: "visible" }));

  await page.reload({ waitUntil: "domcontentloaded" });
  const savedFormat = await page.evaluate(() => JSON.parse(localStorage.getItem("ruckus-phase-2b-prototype")).partyFormat);
  assert.equal(savedFormat, "free", "Il formato Party Night deve restare nello stato locale del prototipo");
}

async function verifyFreeAndTournamentSetup(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-action="start-party"]').click();
  await page.locator('[data-format="free"]').click();
  await page.locator('[data-action="format-next"]').click();
  await page.locator('[data-action="players-next"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="setup-next"]').waitFor({ state: "visible" }));
  await page.locator('[data-action="setup-next"]').click();
  await page.locator('[data-action="customize"]').click();
  await assert.doesNotReject(() => page.locator('[data-preset="party"]').waitFor({ state: "visible" }));
  await assert.doesNotReject(() => page.locator('[data-consequence="off"]').waitFor({ state: "visible" }));
  await assertCurrentLayout(page, "customize-mobile");
  await screenshot(page, "customize-mobile-430");

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-action="start-party"]').click();
  await page.locator('[data-format="tournament"]').click();
  await page.locator('[data-action="format-next"]').click();
  await page.locator('[data-action="players-next"]').click();
  await assert.doesNotReject(() => page.locator('[data-tournament-count="5"]').waitFor({ state: "visible" }));
  await assertCurrentLayout(page, "tournament-setup-mobile");
  await screenshot(page, "tournament-setup-mobile-430");
  await page.locator('[data-tournament-count="5"]').click();
  await page.locator('[data-tournament-method="auto"]').click();
  await page.locator('[data-action="tournament-calendar"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="lock-calendar"]').waitFor({ state: "visible" }));
  await assertCurrentLayout(page, "tournament-calendar-mobile");
  await screenshot(page, "tournament-calendar-mobile-430");
  await page.locator('[data-action="lock-calendar"]').click();
  assert.equal(await page.locator('[data-calendar-locked="true"]').count(), 1, "Il calendario Torneo deve diventare non modificabile dopo la conferma");
}

async function verifyCatalogContexts(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('.home-mode-games [data-action="games"]').click();
  assert.equal(await page.locator('[data-catalog-context="browse"]').count(), 1);
  await assert.match(await page.locator(".catalog-game small").first().innerText(), /giocatori - Solo telefono/);
  const brokenImages = await page.locator(".catalog-screen img").evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
  assert.deepEqual(brokenImages, [], "Le copertine del catalogo devono caricarsi tutte");
  await assertCurrentLayout(page, "catalog-browse-mobile");
  await screenshot(page, "catalog-browse-mobile-430");

  await page.locator('[data-action="back"]').click();
  await page.locator('.home-mode-quick [data-action="quick-play"]').click();
  await page.locator('[data-action="quick-games"]').click();
  assert.equal(await page.locator('[data-catalog-context="quick"]').count(), 1);
  await page.locator('[data-action="game-detail"]').first().click();
  assert.equal(await page.locator('[data-action="select-quick-game"]').count(), 1);

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-action="start-party"]').click();
  await page.locator('[data-format="tournament"]').click();
  await page.locator('[data-action="format-next"]').click();
  await page.locator('[data-action="players-next"]').click();
  await page.locator('[data-tournament-method="manual"]').click();
  await page.locator('[data-action="tournament-calendar"]').click();
  assert.equal(await page.locator('[data-catalog-context="tournament"]').count(), 1);
  await page.locator('[data-action="toggle-tournament-game"]').first().click();
  assert.ok(await page.locator('[data-selected-game="true"]').count() >= 1, "Il catalogo Torneo deve supportare la selezione multipla");
}

async function verifyPlayableGames(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-route="proposal"]').click();
  await page.locator('[data-action="prepare-virtual"]').click();
  await page.locator('[data-action="start-private"]').click();

  for (let player = 0; player < 2; player += 1) {
    await page.locator('[data-action="private-ready"]').click();
    await page.locator('[data-action="toggle-reveal-mode"]').click();
    await page.locator('[data-reveal-zone]').click();
    await page.locator('[data-action="memorized"]').click();
  }

  await page.locator('[data-action="active-game"]').click();
  assert.equal(await page.locator('[data-action="finish-game"]').count(), 0, "Secret Signals non deve terminare con un pulsante generico");
  await page.locator('[data-accuser]').first().click();
  await page.locator('[data-action="resolve-secret-signals"]').click();
  await assert.doesNotReject(() => page.locator('.result-screen').waitFor({ state: "visible" }));
  await assert.match(await page.locator('.big-result strong').innerText(), /Alex/i);

  await page.locator('[data-route="physical"]').click();
  await page.locator('[data-action="physical-active"]').click();
  assert.equal(await page.locator('[data-action="finish-game"]').count(), 0, "Mirror Moves non deve terminare con un pulsante generico");
  await page.locator('[data-action="call-freeze"]').click();
  await page.locator('[data-eliminated="Marta"]').click();
  await assert.doesNotReject(() => page.locator('.result-screen').waitFor({ state: "visible" }));
  await assert.match(await page.locator('.big-result strong').innerText(), /Alex/i);
}

async function verifyQuickAndFinalStates(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-route="final"]').click();
  assert.equal(await page.locator('[data-final-kind="neutral"]').count(), 1, "Una sessione senza risultati deve chiudersi senza inventare campioni");

  await page.locator('[data-route="home"]').click();
  await page.locator('[data-action="quick-play"]').click();
  await page.locator('[data-action="quick-surprise"]').click();
  await page.locator('[data-route="result-entry"]').click();
  await page.locator('[data-winner="Alex"]').click();
  await page.locator('[data-action="confirm-result"]').click();
  assert.equal(await page.locator('[data-action="quick-home"]').count(), 1, "Quick Play deve chiudere fuori dalla classifica Party Night");
  assert.equal(await page.locator('[data-action="standings"]').count(), 0);

  await page.locator('[data-route="tournament-retirement"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="confirm-retirement"]').waitFor({ state: "visible" }));
  await page.locator('[data-route="tiebreak"]').click();
  await assert.doesNotReject(() => page.locator('[data-action="play-tiebreak"]').waitFor({ state: "visible" }));
}

async function verifyNewFlowLocalization(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-action="start-party"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "it");
  await assert.match(await page.locator(".screen-title").innerText(), /Come giochiamo/);
  await assert.match(await page.locator('[data-format="free"] strong').innerText(), /Serata libera/);

  await page.locator('[data-format="tournament"]').click();
  await page.locator('[data-action="format-next"]').click();
  await page.locator('[data-action="players-next"]').click();
  await assert.match(await page.locator(".screen-title").innerText(), /Costruisci il calendario/);
  await assert.match(await page.locator('[data-action="tournament-calendar"]').innerText(), /Genera calendario/);

  await page.locator('[data-route="tournament-retirement"]').click();
  await assert.match(await page.locator(".screen-title").innerText(), /Chi si ritira/);
  await page.locator('[data-route="tiebreak"]').click();
  await assert.match(await page.locator(".screen-title").innerText(), /parità/);
  await page.locator('[data-route="final"]').click();
  await assert.match(await page.locator("[data-final-kind=neutral]").innerText(), /Nessun risultato confermato/i);

  await page.locator('[data-route="home"]').click();
  await page.locator('[data-action="language"]').click();
  await page.locator('[data-action="set-language-en"]').click();
  await page.locator('[data-action="language-back"]').click();
  await page.locator('[data-route="final"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await assert.match(await page.locator("[data-final-kind=neutral]").innerText(), /No confirmed results/i);
}

async function verifyCoreRouteLayout(page, label) {
  const routes = [
    "players", "proposal", "next-proposal", "physical", "private-pass", "result-entry",
    "tournament-retirement", "tiebreak", "final", "no-match", "error"
  ];
  for (const route of routes) {
    await page.locator(`[data-route="${route}"]`).click();
    await assertCurrentLayout(page, `${label} ${route}`);
  }
}

async function verifyModalLock(page) {
  await page.locator('[data-route="proposal"]').click();
  await page.locator('[data-action="menu"]').click();
  assert.equal(await page.locator("#session-dialog").getAttribute("open"), "");
  const bodyState = await page.locator("body").evaluate(element => ({
    modalOpen: element.classList.contains("modal-open"),
    overflow: getComputedStyle(element).overflow,
    touchAction: getComputedStyle(element).touchAction
  }));
  assert.deepEqual(bodyState, { modalOpen: true, overflow: "hidden", touchAction: "none" });
  await page.locator('[data-dialog-action="close"]').click();
  assert.equal(await page.locator("#session-dialog").getAttribute("open"), null);
  assert.equal(await page.locator("body").evaluate(element => element.classList.contains("modal-open")), false);
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  const mobile = await openHome(browser, { width: 375, height: 900 });
  await verifyStaticHome(mobile.page);
  await verifyLogoMotion(mobile.page);
  await verifyMotion(mobile.page);
  await screenshot(mobile.page, "home-mobile-375");
  assert.deepEqual(mobile.errors, [], "La Home mobile non deve generare errori JavaScript");
  await mobile.context.close();

  const mobileWide = await openHome(browser, { width: 430, height: 932 });
  await verifyStaticHome(mobileWide.page);
  await verifyHomeRoutesAndLanguage(mobileWide.page);
  await verifyPartyFormatChoice(mobileWide.page);
  await verifyFreeAndTournamentSetup(mobileWide.page);
  await verifyCatalogContexts(mobileWide.page);
  await verifyPlayableGames(mobileWide.page);
  await verifyQuickAndFinalStates(mobileWide.page);
  await verifyNewFlowLocalization(mobileWide.page);
  await verifyModalLock(mobileWide.page);
  await verifyCoreRouteLayout(mobileWide.page, "mobile-430");
  await mobileWide.page.locator('[data-route="tiebreak"]').click();
  await screenshot(mobileWide.page, "tiebreak-mobile-430");
  await mobileWide.page.locator('[data-route="final"]').click();
  await screenshot(mobileWide.page, "final-mobile-430");
  await mobileWide.page.locator('[data-route="home"]').click();
  await mobileWide.page.waitForTimeout(1300);
  await screenshot(mobileWide.page, "home-mobile-430");
  assert.deepEqual(mobileWide.errors, [], "La Home mobile wide non deve generare errori JavaScript");
  await mobileWide.context.close();

  const landscape = await openHome(browser, { width: 844, height: 390 });
  await verifyStaticHome(landscape.page);
  await screenshot(landscape.page, "home-landscape-844");
  assert.deepEqual(landscape.errors, [], "La Home landscape non deve generare errori JavaScript");
  await landscape.context.close();

  const desktop = await openHome(browser, { width: 1440, height: 1000 });
  await verifyStaticHome(desktop.page);
  await verifyCoreRouteLayout(desktop.page, "desktop-1440");
  await desktop.page.locator('[data-route="tiebreak"]').click();
  await screenshot(desktop.page, "tiebreak-desktop-1440");
  await desktop.page.locator('[data-route="final"]').click();
  await screenshot(desktop.page, "final-desktop-1440");
  await desktop.page.locator('[data-route="home"]').click();
  await screenshot(desktop.page, "home-desktop-1440");
  assert.deepEqual(desktop.errors, [], "La Home desktop non deve generare errori JavaScript");
  await desktop.context.close();

  const reduced = await openHome(browser, { width: 375, height: 900 }, { reducedMotion: true });
  assert.equal(Number(await reduced.page.locator(".ruckus-r-tile").evaluate(element => getComputedStyle(element).opacity)), 1);
  assert.equal(Number(await reduced.page.locator(".ruckus-party").evaluate(element => getComputedStyle(element).opacity)), 1);
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
  console.log("PASS prototipo high-fidelity: flussi, giochi, responsive, lingue, motion, modal e reduced motion verificati");
}

run().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
