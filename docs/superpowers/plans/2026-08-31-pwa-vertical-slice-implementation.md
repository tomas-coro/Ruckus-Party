# Ruckus Party PWA Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire una PWA installabile e offline-first che completa `Home -> Serata libera -> setup -> proposta -> Segnali segreti -> conferma risultato -> classifica`, con ripresa sicura e aggiornamenti espliciti.

**Architecture:** Il dominio resta puro e descrive setup, gioco, sessione, casualita e punteggio tramite tipi e transizioni deterministiche. I casi d'uso applicano una transizione, attendono il repository e pubblicano lo stato soltanto dopo un salvataggio riuscito; React consuma quei casi d'uso, mentre IndexedDB, Web Crypto, service worker, clock e diagnostica restano adapter sostituibili.

**Tech Stack:** React 19, TypeScript strict, Vite 8, CSS Modules, `idb`, `vite-plugin-pwa`, Vitest, React Testing Library, Playwright, npm e GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-31-pwa-vertical-slice-design.md`

## Global Constraints

- Smartphone portrait e il target primario a 375 e 430 CSS px; landscape, tablet e desktop devono restare usabili e senza overflow.
- La Party Night accetta 2-6 giocatori; italiano e predefinito e inglese e selezionabile senza modificare la sessione.
- Il percorso iniziale usa `Standard` e `Solo telefono`; personalizzazione, materiali e filtri esistono soltanto quanto serve alla compatibilita.
- Il dominio non dipende da React, DOM, IndexedDB, service worker, `Math.random()`, `Date.now()` o `localStorage`.
- Ogni transizione accettata viene salvata prima di essere pubblicata alla UI; una scrittura fallita conserva stato precedente e dati esistenti.
- `revealed: true` e qualsiasi segreto visibile sono stato UI effimero e non vengono mai persistiti o registrati nella diagnostica.
- IndexedDB v1 contiene solo `meta`, `settings`, `activeSession` e `diagnostics`; non creare `extraGames`.
- La PWA precache shell, font, icone, immagini, traduzioni e contenuti; nessun asset essenziale proviene da CDN.
- Gli aggiornamenti usano prompt esplicito, non ricaricano automaticamente e non si attivano durante una sessione attiva.
- Non mostrare Torneo, Quick Play, catalogo, giochi Extra, conseguenze, handicap, prossimo gioco, finale, account, backend, analytics o notifiche push.
- Tap target minimi 44x44 CSS px, focus visibile, label associate, modal con focus contenuto e sfondo bloccato, `prefers-reduced-motion` rispettato.
- npm usa un lockfile committato; la base GitHub Pages e `/Ruckus-Party/` e resta sovrascrivibile da `VITE_BASE_PATH`.
- Nessun commit, push, deploy o altra scrittura remota senza approvazione owner esplicita al relativo checkpoint.

## Dipendenze proposte e verificate il 2026-08-31

Usare versioni esatte nel primo `package-lock.json`. Le dipendenze runtime sono `react`, `react-dom`, `idb` e i due pacchetti Fontsource che Vite incorpora nella build; PWA, build, lint e test restano dev dependency.

| Pacchetto | Versione | Licenza | Motivo |
|---|---:|---|---|
| `react` | `19.2.8` | MIT | UI e Context |
| `react-dom` | `19.2.8` | MIT | renderer browser |
| `idb` | `8.0.3` | ISC | adapter Promise tipizzato per IndexedDB |
| `@fontsource/archivo-black` | `5.3.0` | OFL-1.1 | Archivo Black self-hosted, peso 400 latin |
| `@fontsource-variable/libre-franklin` | `5.3.0` | OFL-1.1 | Libre Franklin self-hosted, asse weight latin |
| `vite` | `8.2.2` | MIT | dev server e build |
| `@vitejs/plugin-react` | `6.1.0` | MIT | JSX e Fast Refresh |
| `vite-plugin-pwa` | `1.3.0` | MIT | manifest, precache e prompt update |
| `typescript` | `5.9.3` | Apache-2.0 | ultimo ramo stabile conservativo compatibile con `typescript-eslint` |
| `eslint` | `10.9.1` | MIT | lint flat config |
| `@eslint/js` | `10.0.1` | MIT | regole JavaScript raccomandate |
| `typescript-eslint` | `8.68.0` | MIT | parser e regole TypeScript strict |
| `eslint-plugin-react-hooks` | `7.1.1` | MIT | regole Hooks ufficiali |
| `eslint-plugin-react-refresh` | `0.5.5` | MIT | confini Fast Refresh |
| `vitest` | `4.1.11` | MIT | unit e component test |
| `jsdom` | `30.0.1` | MIT | DOM per React Testing Library |
| `fake-indexeddb` | `6.2.5` | Apache-2.0 | migrazioni e adapter IndexedDB in Vitest |
| `@testing-library/react` | `16.3.2` | MIT | comportamento componenti |
| `@testing-library/dom` | `10.4.1` | MIT | peer esplicita di React Testing Library |
| `@testing-library/jest-dom` | `7.0.1` | MIT | matcher semantici Vitest |
| `@testing-library/user-event` | `14.6.6` | MIT | input realistici in jsdom |
| `@playwright/test` | `1.62.1` | Apache-2.0 | Chromium e WebKit mobile |
| `@types/react` | `19.2.18` | MIT | tipi React |
| `@types/react-dom` | `19.2.5` | MIT | tipi React DOM |
| `@types/node` | `24.13.3` | MIT | config Vite, Vitest e Playwright su Node 24 LTS |

Compatibilita verificata: Node 24 LTS soddisfa Vite 8 e Vitest 4; `typescript-eslint 8.68.0` dichiara TypeScript `>=4.8.4 <6.1.0`, quindi il piano fissa TypeScript 5.9.3 invece del ramo 7 non supportato. `vite-plugin-pwa 1.3.0` amplia il peer range a Vite 8. Fonti primarie: [npm React](https://www.npmjs.com/package/react), [npm Vite](https://www.npmjs.com/package/vite), [npm vite-plugin-pwa](https://www.npmjs.com/package/vite-plugin-pwa), [typescript-eslint dependency versions](https://typescript-eslint.io/users/dependency-versions/), [Vitest guide](https://v4.vitest.dev/guide/), [Node release status](https://nodejs.org/en/about/previous-releases), [npm Archivo Black](https://www.npmjs.com/package/@fontsource/archivo-black), [npm Libre Franklin](https://www.npmjs.com/package/@fontsource-variable/libre-franklin).

## File map

### Root, tooling e automazione

- Create: `package.json`, `package-lock.json`, `.nvmrc`, `index.html`
- Create: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`
- Create: `public/icons/apple-touch-icon-180.png`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable-512.png`

### App, routing e provider

- Create: `src/main.tsx`, `src/app/App.tsx`, `src/app/bootstrap.ts`
- Create: `src/app/providers/AppServicesContext.tsx`, `src/app/providers/PartyNightContext.tsx`
- Create: `src/app/routing/route.ts`, `src/app/routing/hashRouter.ts`, `src/app/routing/RouteView.tsx`
- Create: `src/app/App.test.tsx`, `src/app/routing/hashRouter.test.ts`

### Domain

- Create: `src/domain/errors.ts`, `src/domain/localization/translationKey.ts`, `src/domain/player/player.ts`, `src/domain/player/validatePlayers.ts`
- Create: `src/domain/game/gameDefinition.ts`, `src/domain/game/gameRegistry.ts`
- Create: `src/domain/selection/partySetup.ts`, `src/domain/selection/selectEligibleGames.ts`
- Create: `src/domain/random/randomSource.ts`, `src/domain/random/seededRandom.ts`
- Create: `src/domain/session/activeSession.ts`, `src/domain/session/sessionCommand.ts`, `src/domain/session/transitionSession.ts`
- Create: `src/domain/scoring/standings.ts`
- Create: `src/domain/game/secret-signals/secretSignals.ts`, `src/domain/game/secret-signals/secretSignalsReducer.ts`
- Create matching `*.test.ts` files beside every domain module with behavior.

### Application

- Create: `src/application/ports.ts`, `src/application/result.ts`
- Create: `src/application/party-night/partyNightService.ts`
- Create: `src/application/party-night/resumeActiveSession.ts`
- Create: `src/application/updates/updateService.ts`
- Create: `src/application/party-night/partyNightService.test.ts`
- Create: `src/application/party-night/resumeActiveSession.test.ts`
- Create: `src/application/updates/updateService.test.ts`

### Infrastructure

- Create: `src/infrastructure/clock/systemClock.ts`, `src/infrastructure/random/cryptoSeedSource.ts`
- Create: `src/infrastructure/persistence/schema.ts`, `src/infrastructure/persistence/migrations.ts`
- Create: `src/infrastructure/persistence/indexedDbRepository.ts`, `src/infrastructure/persistence/indexedDbRepository.test.ts`
- Create: `src/infrastructure/diagnostics/localDiagnostics.ts`, `src/infrastructure/diagnostics/exportDiagnostics.ts`
- Create: `src/infrastructure/pwa/pwaAdapter.ts`, `src/infrastructure/pwa/usePwaLifecycle.ts`

### Content, features e UI

- Create: `src/content/translations/it.ts`, `src/content/translations/en.ts`, `src/content/translations/translator.ts`
- Create: `src/content/translations/translations.test.ts`, `src/content/games/secretSignalsDefinition.ts`, `src/content/games/secretSignalsContent.ts`
- Create one folder per feature under `src/features/`: `home`, `settings`, `party-setup`, `proposal`, `secret-signals`, `result`, `standings`, `recovery`
- Each feature creates one screen component, its CSS Module and a colocated `*.test.tsx`.
- Create: `src/ui/components/Button.tsx`, `Modal.tsx`, `ErrorPanel.tsx`, `LanguageSwitch.tsx`, `OfflineStatus.tsx`
- Create: `src/ui/brand/PassaRLogo.tsx`, `src/ui/brand/HomeIcon.svg`
- Create: `src/ui/layout/AppShell.tsx`, `src/ui/styles/tokens.css`, `global.css`, `fonts.css`, `motion.css`
- Create matching component tests for modal focus, errors, language, offline state and update prompt.

### End-to-end

- Create: `tests/e2e/fixtures.ts`, `tests/e2e/consoleGuard.ts`
- Create: `tests/e2e/installability.spec.ts`, `offline.spec.ts`, `vertical-slice.spec.ts`
- Create: `tests/e2e/resume.spec.ts`, `updates.spec.ts`, `recovery.spec.ts`, `responsive-accessibility.spec.ts`
- Create: `scripts/build-update-fixtures.mjs`, `scripts/pwa-test-server.mjs`; ignore generated `tests/.artifacts/`

---

### Task 1: Toolchain strict e shell React minima

**Files:**
- Create: `package.json`, `package-lock.json`, `.nvmrc`, `index.html`
- Create: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/app/App.test.tsx`, `src/test/setup.ts`

**Interfaces:**
- Produces: comandi `dev`, `build`, `lint`, `typecheck`, `test`, `test:run`, `test:e2e` e una root React verificabile.

- [ ] **Step 1: Dichiarare toolchain e versioni esatte**

Creare `package.json` con `private: true`, `type: module`, Node `>=24.11 <25`, gli script sopra e le versioni della tabella. Eseguire soltanto durante l'implementazione:

```bash
npm install --save-exact react@19.2.8 react-dom@19.2.8 idb@8.0.3 @fontsource/archivo-black@5.3.0 @fontsource-variable/libre-franklin@5.3.0
npm install --save-dev --save-exact vite@8.2.2 @vitejs/plugin-react@6.1.0 vite-plugin-pwa@1.3.0 typescript@5.9.3 eslint@10.9.1 @eslint/js@10.0.1 typescript-eslint@8.68.0 eslint-plugin-react-hooks@7.1.1 eslint-plugin-react-refresh@0.5.5 vitest@4.1.11 jsdom@30.0.1 fake-indexeddb@6.2.5 @testing-library/react@16.3.2 @testing-library/dom@10.4.1 @testing-library/jest-dom@7.0.1 @testing-library/user-event@14.6.6 @playwright/test@1.62.1 @types/react@19.2.18 @types/react-dom@19.2.5 @types/node@24.13.3
```

Expected: `package-lock.json` nasce con le versioni dirette esatte e `npm ls --depth=0` termina con exit code 0.

- [ ] **Step 2: Scrivere il test smoke fallente**

```tsx
// src/app/App.test.tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the Ruckus Party application landmark', () => {
  render(<App />);
  expect(screen.getByRole('main', { name: 'Ruckus Party' })).toBeInTheDocument();
});
```

- [ ] **Step 3: Verificare il fallimento del test**

Run: `npm run test:run -- src/app/App.test.tsx`

Expected: FAIL per modulo `./App` assente o landmark mancante.

- [ ] **Step 4: Implementare configurazione strict e shell minima**

Impostare `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `useUnknownInCatchVariables`, `noFallthroughCasesInSwitch` e `noEmit`. Implementare:

```tsx
// src/app/App.tsx
export function App() {
  return <main aria-label="Ruckus Party" />;
}
```

`src/test/setup.ts` importa `@testing-library/jest-dom/vitest` e pulisce il DOM dopo ogni test.

- [ ] **Step 5: Verificare shell e controlli statici**

Run: `npm run test:run -- src/app/App.test.tsx && npm run typecheck && npm run lint && npm run build`

Expected: tutti PASS; `dist/index.html` esiste e non contiene asset remoti.

- [ ] **Step 6: Preparare il checkpoint Git**

Mostrare diff, test e `git status`; dopo autorizzazione owner:

```bash
git add package.json package-lock.json .nvmrc index.html tsconfig*.json vite.config.ts vitest.config.ts eslint.config.js src/main.tsx src/app/App.tsx src/app/App.test.tsx src/test/setup.ts
git commit -m "build: scaffold strict React PWA"
```

### Task 2: Errori tipizzati, porte e localizzazione completa

**Files:**
- Create: `src/domain/errors.ts`, `src/domain/localization/translationKey.ts`, `src/application/result.ts`, `src/application/ports.ts`
- Create: `src/content/translations/it.ts`, `en.ts`, `translator.ts`, `translations.test.ts`

**Interfaces:**
- Produces: `AppError`, `Result<T>`, `Clock`, `SeedSource`, `SessionRepository`, `SettingsRepository`, `DiagnosticsPort`, `UpdatePort`, `TranslationKey`, `createTranslator(locale)`.

- [ ] **Step 1: Scrivere test fallenti per parita e formattazione**

```ts
it('keeps Italian and English dictionaries in exact key parity', () => {
  expect(Object.keys(it).sort()).toEqual(Object.keys(en).sort());
});

it('formats players with the active locale', () => {
  const t = createTranslator('it');
  expect(t.list(['Ada', 'Luca'])).toBe('Ada e Luca');
  expect(t.number(2)).toBe('2');
});
```

- [ ] **Step 2: Verificare il fallimento mirato**

Run: `npm run test:run -- src/content/translations/translations.test.ts`

Expected: FAIL per dizionari e translator assenti.

- [ ] **Step 3: Definire errori e porte senza implementazioni browser**

```ts
export type AppError =
  | { type: 'invalid-input'; code: 'PLAYERS_COUNT' | 'PLAYER_NAME' | 'SETUP_RESOURCE'; field?: string }
  | { type: 'invalid-transition'; code: 'COMMAND_NOT_ALLOWED'; phase: SessionPhase }
  | { type: 'storage-unavailable' | 'read-failed' | 'write-failed' | 'migration-failed'; code: string; safeState: 'preserved' }
  | { type: 'missing-content' | 'missing-translation'; code: string; key: string }
  | { type: 'update-offline' | 'update-check-failed'; code: string }
  | { type: 'unknown-route'; code: 'ROUTE_UNKNOWN'; route: string };

export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };
```

Le porte espongono solo metodi Promise espliciti. `SessionRepository.save(session)` non pubblica eventi e `DiagnosticsPort.record(event)` vieta payload con nomi o segreti.

- [ ] **Step 4: Implementare chiavi e translator**

Definire `TranslationKey` nel dominio di localizzazione, includendo tutte le chiavi necessarie a Home, impostazioni, setup, proposta, reveal, round, risultato, classifica, offline, update e recovery. Tipizzare i dizionari con `satisfies Record<TranslationKey, string>` e usare `Intl.PluralRules`, `Intl.ListFormat` e `Intl.NumberFormat` dentro `createTranslator`.

- [ ] **Step 5: Verificare parita, tipi e assenza di fallback vuoti**

Run: `npm run test:run -- src/content/translations/translations.test.ts && npm run typecheck`

Expected: PASS; rimuovendo una chiave da un dizionario il typecheck deve fallire.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add typed app contracts and localization`.

### Task 3: Setup Party Night e selezione gioco nel dominio

**Files:**
- Create: `src/domain/player/player.ts`, `validatePlayers.ts`, `validatePlayers.test.ts`
- Create: `src/domain/game/gameDefinition.ts`, `gameRegistry.ts`
- Create: `src/domain/selection/partySetup.ts`, `selectEligibleGames.ts`, `partySetup.test.ts`
- Create: `src/content/games/secretSignalsDefinition.ts`

**Interfaces:**
- Produces: `Player`, `PartySetup`, `GameDefinition`, `validatePlayers`, `validatePartySetup`, `selectEligibleGames`.

- [ ] **Step 1: Scrivere test fallenti per 2-6 giocatori e default**

```ts
it.each([0, 1, 7])('rejects %i players', count => {
  const players = Array.from({ length: count }, (_, i) => ({ id: `p${i}`, name: `P${i}` }));
  expect(validatePlayers(players)).toMatchObject({ ok: false, error: { type: 'invalid-input' } });
});

it('creates the approved defaults', () => {
  expect(createDefaultSetup()).toEqual({
    duration: 'standard',
    resources: ['phone'],
    contentCategories: ['general'],
  });
});
```

- [ ] **Step 2: Scrivere test di compatibilita fallenti**

Verificare che `Segnali segreti` sia eleggibile per 2-6 giocatori con `phone`, venga escluso per 1 o 7 giocatori e che un no-match restituisca la causa concreta senza mutare filtri.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/domain/player src/domain/selection`

Expected: FAIL per funzioni assenti.

- [ ] **Step 4: Implementare tipi e validazioni pure**

```ts
export interface GameDefinition<TState> {
  readonly id: string;
  readonly nameKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly rulesKey: TranslationKey;
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly requiredResources: readonly ResourceId[];
  readonly support: readonly ('physical' | 'virtual')[];
  readonly contentCategories: readonly ContentCategory[];
  readonly resultType: 'single-winner';
  readonly supportsConsequences: boolean;
  readonly supportsHandicaps: boolean;
  createState(playerIds: readonly string[], random: RandomSource): TState;
}
```

`selectEligibleGames` restituisce `{ eligible, rejections }`, dove ogni rejection contiene game id e requisito fallito.

- [ ] **Step 5: Verificare dominio e typecheck**

Run: `npm run test:run -- src/domain/player src/domain/selection && npm run typecheck`

Expected: PASS per limiti, nomi vuoti/duplicati normalizzati, default e no-match esplicito.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: model party setup and game eligibility`.

### Task 4: RNG deterministico e stato di Segnali segreti

**Files:**
- Create: `src/domain/random/randomSource.ts`, `seededRandom.ts`, `seededRandom.test.ts`
- Create: `src/domain/game/secret-signals/secretSignals.ts`, `secretSignalsReducer.ts`, `secretSignalsReducer.test.ts`
- Create: `src/content/games/secretSignalsContent.ts`
- Create: `src/infrastructure/random/cryptoSeedSource.ts`

**Interfaces:**
- Produces: `RandomState { seed: number; position: number }`, `RandomSource.nextInt(max)`, `createSecretSignalsState`, `reduceSecretSignals`.

- [ ] **Step 1: Scrivere il test RNG fallente**

```ts
it('replays the same sequence from seed and position', () => {
  const first = createSeededRandom({ seed: 123456, position: 0 });
  const values = [first.nextInt(10), first.nextInt(10), first.nextInt(10)];
  const resumed = createSeededRandom({ seed: 123456, position: 2 });
  expect(resumed.nextInt(10)).toBe(values[2]);
});
```

- [ ] **Step 2: Scrivere test gioco fallenti**

Testare assegnazione deterministica a ogni player id, avanzamento reveal soltanto in ordine, rifiuto di player errato, accusa con `correctAccuserId`, correzione prima della conferma e immutabilita dopo conferma.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/domain/random src/domain/game/secret-signals`

Expected: FAIL per reducer assente.

- [ ] **Step 4: Implementare RNG e reducer minimo**

```ts
export type SecretSignalsState =
  | { phase: 'assigning'; assignments: readonly SecretAssignment[]; currentIndex: number }
  | { phase: 'shared-round'; assignments: readonly SecretAssignment[] }
  | { phase: 'result-pending'; winnerId: string; correctAccuserId: string }
  | { phase: 'confirmed'; winnerId: string };
```

Le assegnazioni persistono come chiavi di contenuto, non come testo renderizzato. Nessun campo indica che il segreto e attualmente visibile.

- [ ] **Step 5: Verificare determinismo e privacy strutturale**

Run: `npm run test:run -- src/domain/random src/domain/game/secret-signals && rg "Math\.random|Date\.now|revealed|secretVisible" src/domain`

Expected: test PASS; `rg` non trova API vietate o flag visuali persistibili.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add deterministic secret signals domain`.

### Task 5: Macchina a stati ActiveSession e punteggio

**Files:**
- Create: `src/domain/session/activeSession.ts`, `sessionCommand.ts`, `transitionSession.ts`, `transitionSession.test.ts`
- Create: `src/domain/scoring/standings.ts`, `standings.test.ts`

**Interfaces:**
- Produces: unione discriminata `ActiveSession`, `SessionCommand`, `transitionSession(session, command, deps)` e `rankStandings`.

- [ ] **Step 1: Scrivere test di transizione fallenti**

Copertura minima: `setupPlayers -> setupPreferences -> setupReview -> proposal -> privateRevealCovered -> privateRevealReady -> sharedRound -> resultPendingConfirmation -> standings`, piu comando fuori fase per ogni gruppo.

```ts
it('does not award a point before result confirmation', () => {
  const pending = sessionAtResultPending('p1');
  expect(pending.scores.p1).toBe(0);
  const confirmed = transitionSession(pending, { type: 'confirm-result' }, deps);
  expect(confirmed).toMatchObject({ ok: true, value: { phase: 'standings', scores: { p1: 1 } } });
});
```

- [ ] **Step 2: Testare correzione e back consentito**

Verificare `correct-result` prima della conferma, nessuna doppia assegnazione, back setup consentito, uscita con scelta non salvata che restituisce `confirmation-required` e session phases mai impostabili con una stringa arbitraria.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/domain/session src/domain/scoring`

Expected: FAIL per transizioni assenti.

- [ ] **Step 4: Implementare l'unione discriminata completa**

Ogni variante include `schemaVersion`, `contentVersion`, `id`, `players`, `setup`, `scores`, `random`, `createdAt`, `updatedAt` e solo i dati validi per la fase. `resultPendingConfirmation` contiene il risultato correggibile; `standings` contiene il risultato confermato.

- [ ] **Step 5: Verificare transizioni e exhaustive checks**

Run: `npm run test:run -- src/domain/session src/domain/scoring && npm run typecheck`

Expected: PASS; ogni `switch` usa `assertNever`, transizioni vietate restituiscono `invalid-transition`.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add persisted party night state machine`.

### Task 6: Casi d'uso con save-before-publish

**Files:**
- Create: `src/application/party-night/partyNightService.ts`, `partyNightService.test.ts`
- Create: `src/application/party-night/resumeActiveSession.ts`, `resumeActiveSession.test.ts`
- Create: `src/test/fakes/fakeRepositories.ts`, `fakeClock.ts`, `fakeSeedSource.ts`

**Interfaces:**
- Produces: `PartyNightService.startFreeNight`, `dispatch`, `subscribe`, `getSnapshot`; `resumeActiveSession`.

- [ ] **Step 1: Scrivere il test atomico fallente**

```ts
it('keeps the published state unchanged when persistence fails', async () => {
  const repository = failingSessionRepository('write-failed');
  const service = createPartyNightService({ repository, clock, seedSource, diagnostics });
  const before = service.getSnapshot();
  const result = await service.startFreeNight();
  expect(result).toMatchObject({ ok: false, error: { type: 'write-failed' } });
  expect(service.getSnapshot()).toEqual(before);
});
```

- [ ] **Step 2: Testare ordine save-publish e resume sicuro**

Registrare una trace `transition -> save:start -> save:end -> subscriber`; verificare che resume di `privateRevealReady` torni a `privateRevealCovered`, mentre le altre fasi restano identiche.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/application/party-night`

Expected: FAIL per service assente.

- [ ] **Step 4: Implementare service e sanitizzazione resume**

`dispatch` calcola con `transitionSession`, salva la candidate session, aggiorna snapshot e notifica. Un errore registra solo codice, phase e timestamp, mai nomi o contenuti privati.

- [ ] **Step 5: Verificare tutti i casi d'uso**

Run: `npm run test:run -- src/application/party-night && npm run typecheck`

Expected: PASS per successo, errore, ordine degli effetti, retry e private reveal coperto.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: orchestrate durable party night transitions`.

### Task 7: IndexedDB v1, migrazioni e diagnostica limitata

**Files:**
- Create: `src/infrastructure/persistence/schema.ts`, `migrations.ts`, `indexedDbRepository.ts`, `indexedDbRepository.test.ts`
- Create: `src/infrastructure/diagnostics/localDiagnostics.ts`, `localDiagnostics.test.ts`, `exportDiagnostics.ts`

**Interfaces:**
- Produces: `openRuckusDatabase`, repository concreti, `LocalDiagnostics` con capienza 100 eventi, `exportDiagnosticsBlob`.

- [ ] **Step 1: Scrivere test migrazione fallenti con fake IndexedDB**

```ts
it('creates only the four v1 stores', async () => {
  const db = await openRuckusDatabase({ name: uniqueDbName() });
  expect([...db.objectStoreNames]).toEqual(['activeSession', 'diagnostics', 'meta', 'settings']);
  expect(db.objectStoreNames.contains('extraGames')).toBe(false);
});
```

- [ ] **Step 2: Testare contratto repository e guasti**

Verificare una sola active session, settings indipendenti, save/load round-trip, dati preservati su read error, nessun `deleteDB` automatico, diagnostica ruotata a 100 record e redazione di campi proibiti.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/infrastructure/persistence src/infrastructure/diagnostics`

Expected: FAIL per adapter assente.

- [ ] **Step 4: Implementare schema e migrazione transazionale**

Usare `openDB<RuckusDb>('ruckus-party', 1, { upgrade })`; creare i quattro store soltanto quando `oldVersion < 1`. Tradurre `DOMException` in `storage-unavailable`, `read-failed`, `write-failed` o `migration-failed` e non cancellare mai il database.

- [ ] **Step 5: Implementare export manuale e reset separato**

`exportDiagnosticsBlob` produce JSON con app version, schema version e record tecnici redatti. `resetAllData()` esiste sull'adapter ma non viene chiamato da open, migrate, load o retry.

- [ ] **Step 6: Verificare adapter e assenza di localStorage**

Run: `npm run test:run -- src/infrastructure && rg "localStorage|deleteDB" src`

Expected: test PASS; `localStorage` assente; `deleteDB` compare solo nel metodo reset esplicito e nei test.

- [ ] **Step 7: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: persist sessions and local diagnostics in IndexedDB`.

### Task 8: Bootstrap, Context e hash router recuperabile

**Files:**
- Create: `src/app/bootstrap.ts`, `src/app/providers/AppServicesContext.tsx`, `PartyNightContext.tsx`
- Create: `src/app/routing/route.ts`, `hashRouter.ts`, `hashRouter.test.ts`, `RouteView.tsx`
- Modify: `src/main.tsx`, `src/app/App.tsx`

**Interfaces:**
- Produces: `bootstrapApp()`, `parseHash(hash)`, `navigate(route)`, provider con sessione e comandi.

- [ ] **Step 1: Scrivere test router fallenti**

```ts
it.each([
  ['#/', { type: 'home' }],
  ['#/settings', { type: 'settings' }],
  ['#/missing', { type: 'unknown', raw: '#/missing' }],
])('parses %s', (hash, expected) => expect(parseHash(hash)).toEqual(expected));
```

- [ ] **Step 2: Testare bootstrap failure**

Simulare storage unavailable e migration failed: `bootstrapApp` deve restituire recovery state con `Riprova`, `Esporta diagnostica` e reset non primario, senza creare una nuova sessione.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/app/routing src/app/bootstrap.test.ts`

Expected: FAIL per router/bootstrap assenti.

- [ ] **Step 4: Implementare router e provider sottili**

Il router ascolta `hashchange`; le phase di sessione non entrano nell'URL. `PartyNightContext` espone `{ session, status, dispatch }`, non repository o setter di phase.

- [ ] **Step 5: Verificare route sconosciuta e ripresa**

Run: `npm run test:run -- src/app && npm run typecheck`

Expected: PASS; una route sconosciuta mostra un errore recuperabile verso Home e una active session ripresa decide la schermata dalla phase.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: bootstrap services and typed hash routing`.

### Task 9: Design token, primitive accessibili e Home

**Files:**
- Create: `src/ui/styles/tokens.css`, `fonts.css`, `global.css`, `motion.css`
- Create: `src/ui/components/Button.tsx`, `Modal.tsx`, `LanguageSwitch.tsx`, relativi test e CSS Module
- Create: `src/ui/layout/AppShell.tsx`, `AppShell.module.css`
- Create: `src/features/home/HomeScreen.tsx`, `HomeScreen.module.css`, `HomeScreen.test.tsx`
- Modify: `src/app/RouteView.tsx`

**Interfaces:**
- Produces: primitive UI condivise e Home `Petrolio festa` + `Passa la R` con CTA `Inizia serata`, lingua e impostazioni.

- [ ] **Step 1: Scrivere component test fallenti**

Testare landmark, CTA unica dominante, target con classe min-height 44 px, cambio lingua, logo finale immediato in reduced motion, modal con focus iniziale, Escape, focus restore e `document.body.style.overflow = 'hidden'`.

- [ ] **Step 2: Verificare i fallimenti**

Run: `npm run test:run -- src/ui src/features/home`

Expected: FAIL per componenti assenti.

- [ ] **Step 3: Implementare token e font locali**

Importare `@fontsource/archivo-black/latin-400.css` e `@fontsource-variable/libre-franklin/latin-wght.css`. Definire Petrol `#0D3432`, Petrol Deep `#132824`, Mandarin `#FF643B`, Honey `#F7C64B`, Shell `#FFF0D1`, Mint `#6FD2B8`; `Archivo Black` per display e `Libre Franklin Variable` per UI. Titoli `text-wrap: balance`, corpo `text-wrap: pretty`; nessun import remoto.

- [ ] **Step 4: Trasferire Home senza feature escluse**

Riutilizzare il lockup e l'icona approvati dal prototipo come SVG/componenti locali. La Home mostra solo brand, `Inizia serata`, lingua, impostazioni, active-session resume se presente e stato offline; nessuna card Torneo, Quick Play o catalogo.

- [ ] **Step 5: Verificare componenti e build**

Run: `npm run test:run -- src/ui src/features/home && npm run build`

Expected: PASS; nessun URL `http` in CSS o output essenziale.

- [ ] **Step 6: Eseguire il primo `ui-check` prima di mostrare la Home**

Controllare 375, 430 e 844x390, spazio utile, overflow, sovrapposizioni, font, tap target, focus, testi IT/EN e reduced motion. Correggere ogni difetto prima del checkpoint owner.

- [ ] **Step 7: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: build accessible branded app shell`.

### Task 10: Impostazioni, lingua persistente e stati aggiornamento

**Files:**
- Create: `src/features/settings/SettingsScreen.tsx`, `SettingsScreen.module.css`, `SettingsScreen.test.tsx`
- Create: `src/ui/components/OfflineStatus.tsx`, `UpdatePrompt.tsx`, relativi test
- Modify: `src/app/RouteView.tsx`, `src/app/providers/AppServicesContext.tsx`

**Interfaces:**
- Consumes: `SettingsRepository`, `UpdatePort` tramite fake nei component test e adapter PWA in produzione.
- Produces: cambio lingua durevole e UI update `checking`, `current`, `ready`, `offline`, `error`, `deferred`.

- [ ] **Step 1: Scrivere test fallenti**

Verificare italiano predefinito, cambio a inglese senza mutare active session, stato `Controllo in corso`, retry errore, `Installa e riavvia` senza sessione e `Installa dopo la Party Night` con sessione.

- [ ] **Step 2: Verificare i fallimenti**

Run: `npm run test:run -- src/features/settings src/ui/components/UpdatePrompt.test.tsx`

Expected: FAIL per schermata e prompt assenti.

- [ ] **Step 3: Implementare comportamento e semantica**

Il cambio lingua salva settings e poi aggiorna il locale pubblicato. Il bottone update disabilita doppi click durante `checking`; errori hanno una sola primary action `Riprova`.

- [ ] **Step 4: Verificare che la sessione sia invariata**

Run: `npm run test:run -- src/features/settings && npm run typecheck`

Expected: PASS; snapshot sessione prima/dopo lingua profondamente uguale.

- [ ] **Step 5: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add local settings and update states`.

### Task 11: Setup in tre schermate e proposta compatibile

**Files:**
- Create: `src/features/party-setup/PlayersScreen.tsx`, `PreferencesScreen.tsx`, `ReviewScreen.tsx`
- Create: CSS Module e test per ogni schermata
- Create: `src/features/proposal/ProposalScreen.tsx`, CSS Module e test
- Modify: `src/app/RouteView.tsx`

**Interfaces:**
- Consumes: comandi `set-players`, `set-preferences`, `review-setup`, `confirm-setup`.
- Produces: setup 2-6, personalizzazione opzionale e proposta `Segnali segreti` derivata dal registry.

- [ ] **Step 1: Scrivere test form fallenti**

Testare label associate, nomi vuoti e duplicati, aggiunta/rimozione fino a 2-6, CTA disabilitata, messaggio errore collegato con `aria-describedby`, default Standard/Solo telefono e review completa.

- [ ] **Step 2: Testare proposta e no-match**

Verificare nome localizzato, descrizione, player range, materiale, supporto Virtual, motivazione compatibilita e no-match con modifica esplicita della risorsa che blocca.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/features/party-setup src/features/proposal`

Expected: FAIL per schermate assenti.

- [ ] **Step 4: Implementare schermate senza business logic duplicata**

Gli handler inviano comandi; non calcolano eleggibilita o phase. Personalizzazione espone solo durata, risorse concrete e categorie presenti nella slice.

- [ ] **Step 5: Verificare setup IT/EN e back**

Run: `npm run test:run -- src/features/party-setup src/features/proposal && npm run typecheck`

Expected: PASS per entrambi i dizionari e back consentito senza perdita di stato salvato.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add party setup and compatible proposal`.

### Task 12: Private reveal sicuro e accessibile

**Files:**
- Create: `src/features/secret-signals/CoveredRevealScreen.tsx`, `ReadyRevealScreen.tsx`, `SharedRoundScreen.tsx`
- Create: relativi CSS Module e test
- Modify: `src/app/RouteView.tsx`

**Interfaces:**
- Consumes: `confirm-reveal-player`, `record-private-reveal-progress`, `start-shared-round`.
- Produces: hold-to-reveal con alternativa a due tocchi e passaggio sempre coperto.

- [ ] **Step 1: Scrivere test copertura fallenti**

Verificare che il testo segreto sia assente dal DOM sulla cover, la persona corretta sia nominata, il bottone persona errata non avanzi e `I am <name>` porti alla schermata ready.

- [ ] **Step 2: Scrivere test gesto e privacy fallenti**

Con pointer down il segreto appare; pointer up, pointer cancel, blur, visibility hidden e cambio phase lo rimuovono. In modalita accessibile un tap mostra e il secondo nasconde. `Ho memorizzato` resta disabilitato finche il segreto non e stato mostrato almeno una volta nello stato effimero.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/features/secret-signals`

Expected: FAIL per schermate assenti.

- [ ] **Step 4: Implementare reveal effimero**

Usare `useState(false)` solo nel componente. Prima di inviare il comando progress, forzare `setVisible(false)`; non includere `visible` nel comando, Context o sessione.

- [ ] **Step 5: Verificare refresh sanitizzato a livello component/application**

Run: `npm run test:run -- src/features/secret-signals src/application/party-night/resumeActiveSession.test.ts`

Expected: PASS; resume da ready renderizza cover e nessun segreto.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add private reveal safeguards`.

### Task 13: Accusa, risultato correggibile e classifica

**Files:**
- Create: `src/features/result/ResultConfirmationScreen.tsx`, CSS Module e test
- Create: `src/features/standings/StandingsScreen.tsx`, CSS Module e test
- Modify: `src/features/secret-signals/SharedRoundScreen.tsx`, `src/app/RouteView.tsx`

**Interfaces:**
- Consumes: `resolve-accusation`, `correct-result`, `confirm-result`.
- Produces: risultato pendente, correzione e classifica a un punto.

- [ ] **Step 1: Scrivere test accusa fallenti**

Testare scelta del `correctAccuserId`, CTA disabilitata senza selezione, risultato derivato dal reducer e contenuti privati assenti dalla schermata condivisa.

- [ ] **Step 2: Scrivere test punteggio fallenti**

```tsx
expect(screen.getByText('0 pt')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'Conferma risultato' }));
expect(await screen.findByText('1 pt')).toBeInTheDocument();
```

Testare `Correggi` prima della conferma e impossibilita di confermare due volte.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/features/result src/features/standings src/features/secret-signals`

Expected: FAIL per schermate assenti.

- [ ] **Step 4: Implementare UI guidata dal dominio**

La UI presenta il risultato ricevuto e invia comandi; non incrementa punti. La classifica usa `rankStandings`, conserva pareggi validi e non offre prossimo gioco o finale nella slice.

- [ ] **Step 5: Verificare round completo component-level**

Run: `npm run test:run -- src/features src/domain/session && npm run typecheck`

Expected: PASS; punto assegnato solo dopo conferma e persistenza riuscita.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: confirm results and show standings`.

### Task 14: Recovery storage, migrazione, diagnostica e reset confermato

**Files:**
- Create: `src/features/recovery/RecoveryScreen.tsx`, `RecoveryScreen.module.css`, `RecoveryScreen.test.tsx`
- Create: `src/ui/components/ErrorPanel.tsx`, `ConfirmationModal.tsx`, relativi test
- Modify: `src/app/App.tsx`, `src/app/bootstrap.ts`

**Interfaces:**
- Produces: recovery per storage/migration con retry, export manuale e reset separato confermato.

- [ ] **Step 1: Scrivere test recovery fallenti**

Verificare messaggio con operazione fallita e stato precedente salvo, una sola primary action `Riprova`, export diagnostica secondario, reset nascosto dietro azione separata e conferma che nomina la perdita dati.

- [ ] **Step 2: Testare che retry non resetti**

Usare spy su `resetAllData`; bootstrap fail e retry fail devono lasciarlo a zero. Solo conferma modal porta il contatore a uno.

- [ ] **Step 3: Verificare i fallimenti**

Run: `npm run test:run -- src/features/recovery src/ui/components/ErrorPanel.test.tsx`

Expected: FAIL per recovery assente.

- [ ] **Step 4: Implementare error boundary applicativo esplicito**

Mappare ogni `AppError` a titolo, stato salvo e singola azione primaria. Errori inattesi diventano diagnostica locale con codice `UNEXPECTED_UI_ERROR`, senza stack mostrato all'utente e senza dati personali.

- [ ] **Step 5: Verificare focus e modal**

Run: `npm run test:run -- src/features/recovery src/ui/components/ConfirmationModal.test.tsx`

Expected: PASS; focus entra nel modal, sfondo non scrolla e focus torna al trigger.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add explicit local data recovery`.

### Task 15: Manifest, offline e update service worker a prompt

**Files:**
- Modify: `vite.config.ts`, `index.html`
- Create: `src/infrastructure/pwa/pwaAdapter.ts`, `usePwaLifecycle.ts`
- Create: `src/application/updates/updateService.ts`, `updateService.test.ts`
- Add: icone, font e asset locali sotto `public/`

**Interfaces:**
- Produces: manifest installabile, precache completo, `UpdatePort.check`, `activate`, `defer`, callback offline-ready.

- [ ] **Step 1: Scrivere unit test update fallenti**

Testare check automatico online silenzioso se current, manual check con stati, offline typed error, ready, attivazione senza active session e defer obbligatorio con active session.

- [ ] **Step 2: Verificare i fallimenti**

Run: `npm run test:run -- src/application/updates`

Expected: FAIL per service assente.

- [ ] **Step 3: Configurare PWA prompt**

Esportare `src/ui/brand/HomeIcon.svg` negli asset 180, 192, 512 e maskable 512. L'icona maskable mantiene la R e gli innesti dentro il safe zone centrale dell'80%; verificare dimensioni reali con `sips -g pixelWidth -g pixelHeight public/icons/*.png` su macOS e conservare l'SVG come fonte modificabile.

```ts
VitePWA({
  registerType: 'prompt',
  injectRegister: false,
  includeAssets: ['icons/*.png'],
  manifest: {
    name: 'Ruckus Party',
    short_name: 'Ruckus',
    start_url: '.',
    display: 'standalone',
    background_color: '#0D3432',
    theme_color: '#0D3432',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: { navigateFallback: 'index.html', cleanupOutdatedCaches: true },
});
```

`index.html` collega `apple-touch-icon-180.png`; il test installability verifica anche quel file con status 200.

`base` legge `VITE_BASE_PATH ?? '/Ruckus-Party/'`.

- [ ] **Step 4: Implementare adapter senza auto reload**

Usare `virtual:pwa-register/react` con `immediate: true`; `onOfflineReady` pubblica la conferma, `onNeedRefresh` pubblica ready. Chiamare `updateServiceWorker(true)` solo da `activate()` e solo senza active session.

- [ ] **Step 5: Verificare build PWA**

Run: `npm run test:run -- src/application/updates && npm run build && find dist -maxdepth 2 -type f | sort`

Expected: PASS; manifest, `sw.js`, workbox bundle, icone, font, traduzioni e asset app compaiono in `dist`.

- [ ] **Step 6: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `feat: add installable offline PWA lifecycle`.

### Task 16: Playwright vertical slice, ripresa e matrice browser

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/fixtures.ts`, `consoleGuard.ts`
- Create: tutti i file `tests/e2e/*.spec.ts` elencati nella file map

**Interfaces:**
- Produces: gate browser per Chromium mobile e WebKit mobile, server preview reale e fault injection solo in test.

- [ ] **Step 1: Configurare progetti e server**

Definire `mobile-chromium-375`, `mobile-chromium-430`, `mobile-webkit-390` e `landscape-chromium-844`; `webServer.command` usa `npm run build && npm run preview -- --host 127.0.0.1`.

- [ ] **Step 2: Scrivere il vertical slice E2E fallente in italiano**

Percorso: Home, start, due giocatori, default, review, proposta, reveal coperto per ogni player, shared round, accusa, risultato non conteggiato, conferma, classifica a 1 punto.

- [ ] **Step 3: Scrivere lo stesso outcome in inglese**

Cambiare lingua da Home, completare la slice e verificare che player id, session id, scores e phase non cambino durante il toggle.

- [ ] **Step 4: Aggiungere test resume parametrico**

Per `setupReview`, `proposal`, `privateRevealReady`, `sharedRound`, `resultPendingConfirmation` e `standings`: fermare, `page.reload()`, verificare phase corretta; private reveal deve tornare cover.

- [ ] **Step 5: Aggiungere offline, installabilita e update**

Primo load online attende `Pronta per giocare offline`; poi browser context offline, reload e slice completa. Verificare manifest, service worker controller e icone. `scripts/build-update-fixtures.mjs` esegue due build con `VITE_APP_VERSION=v1` e `v2` dentro `tests/.artifacts/v1` e `tests/.artifacts/v2`; `scripts/pwa-test-server.mjs` serve v1 e passa atomicamente a v2 su `POST /__test/switch-to-v2`. Il test chiama l'endpoint, forza il check dalla UI e verifica ready, defer con sessione e nessun reload spontaneo.

- [ ] **Step 6: Aggiungere fault injection esplicita**

Nel bootstrap test-only, accettare `window.__RUCKUS_TEST_FAULT__` solo quando `import.meta.env.MODE === 'test'`; simulare write failure, migration failure e storage unavailable. Verificare stato precedente, retry, export e reset solo confermato.

- [ ] **Step 7: Aggiungere guardie visuali e console**

Ogni test fallisce su `pageerror`, console error, response 404 e asset mancante. Misurare `document.documentElement.scrollWidth <= innerWidth`, target visibili almeno 44x44, focus visibile, modal body lock e reduced motion senza animazioni attive.

- [ ] **Step 8: Eseguire la matrice**

Run: `npx playwright install chromium webkit && npm run test:e2e`

Expected: tutti i progetti PASS su vertical slice, refresh critici, offline, update, recovery, 375, 430 e landscape.

- [ ] **Step 9: Preparare il checkpoint Git**

Commit proposto dopo approvazione: `test: cover PWA vertical slice end to end`.

### Task 17: CI, deploy Pages e chiusura documentale

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`
- Modify only if behavior reale requires it: `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/DESIGN.md`, `docs/WORKFLOW.md`

**Interfaces:**
- Produces: gate riproducibile e deploy `dist/` soltanto da `main` dopo controlli verdi.

- [ ] **Step 1: Scrivere CI locale equivalente**

`ci.yml` usa `actions/checkout@v6`, `actions/setup-node@v7` con Node 24 e cache npm, poi `npm ci`, lint, typecheck, unit/component test, build, Playwright Chromium e WebKit.

- [ ] **Step 2: Configurare Pages dopo il gate**

`deploy-pages.yml` parte su push `main`, usa `actions/upload-pages-artifact@v4` e `actions/deploy-pages@v5`, permessi minimi `contents: read`, `pages: write`, `id-token: write`, environment `github-pages` e nessun deploy se i test falliscono.

- [ ] **Step 3: Verificare sintassi e pipeline locale**

Run: `npm ci && npm run lint && npm run typecheck && npm run test:run && npm run build && npm run test:e2e`

Expected: exit code 0 per ogni comando; l'output e letto e non contiene warning PWA, errori JS o asset mancanti.

- [ ] **Step 4: Eseguire QA visuale finale con `ui-check`**

Controllare Home, setup, proposta, cover, reveal, shared round, risultato, standings, settings e recovery in IT/EN, 375, 430, 844 landscape e desktop secondario. Controllare spazio, overflow, sovrapposizioni, font, tap target, focus, modal, nomi lunghi, testi lunghi, offline e reduced motion; correggere prima di dichiarare il gate.

- [ ] **Step 5: Aggiornare solo fonti durevoli coinvolte**

Registrare architettura implementata, limiti reali, stato milestone e controlli eseguiti. Non promuovere la build interna a V1 pubblica e non inventare approvazioni owner.

- [ ] **Step 6: Verificare Definition of Done e scope negativo**

Run:

```bash
rg -n "Torneo|Quick Play|catalogo|account|analytics|push notification|localStorage|Math\.random|Date\.now" src tests
git diff --check
git diff --stat
git status --short --branch
```

Expected: le feature escluse non compaiono come UI o codice prodotto; occorrenze nei test negativi sono motivate; nessun errore whitespace; asset utente non tracciati restano intatti.

- [ ] **Step 7: Fermarsi al gate owner prima di Git remoto**

Presentare file cambiati, risultati completi, rischi residui e commit proposto. Dopo autorizzazione owner, preparare i commit Conventional Commits concordati; push e deploy richiedono autorizzazione separata se non gia esplicita.

## Self-review della specifica

| Requisito | Copertura |
|---|---|
| React strict, Vite, CSS Modules e test stack | Task 1, 9, 16 |
| Domain puro, porte, no API browser | Task 2-6 |
| Setup 2-6, default e compatibilita | Task 3, 5, 11 |
| RNG seedabile e ripresa deterministica | Task 4-6 |
| ActiveSession discriminata e transizioni | Task 5-6 |
| IndexedDB, migrazione, write failure e reset esplicito | Task 7, 14, 16 |
| Hash routes pubbliche e session phases locali | Task 8 |
| Home, lingua e impostazioni | Task 9-10 |
| Segnali segreti, reveal sicuro e accusa | Task 4, 12-13 |
| Correzione, conferma e un punto | Task 5, 13 |
| Offline, installabilita e asset locali | Task 15-16 |
| Update automatico/manuale, prompt e defer | Task 10, 15-16 |
| Errori, diagnostica privata e recovery | Task 2, 7, 14, 16 |
| Responsive, accessibilita, reduced motion | Task 9-16 |
| CI, GitHub Pages e base path | Task 1, 15, 17 |
| Scope escluso non visibile | Global Constraints, Task 17 |

Controllo interno completato: ogni sezione della spec ha almeno un task, i tipi e i nomi delle interfacce restano coerenti tra producer e consumer, e non sono presenti passaggi lasciati senza comportamento o verifica osservabile.
