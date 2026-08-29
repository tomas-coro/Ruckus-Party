# Complete High-Fidelity Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Completare il prototipo high-fidelity cliccabile di Ruckus Party con Party Night nei formati Serata libera e Torneo, catalogo contestuale e due giochi realmente simulabili fino al risultato.

**Architecture:** Estendere il singolo prototipo HTML esistente mantenendo dati finti e stato locale. Ogni percorso conserva un contesto esplicito (`free`, `tournament`, `quick`, `browse`) che determina setup, catalogo, risultato e uscita senza duplicare le schermate condivise.

**Tech Stack:** HTML, CSS e JavaScript vanilla; `localStorage`; Node.js e Playwright per i test browser.

**Spec:** `docs/PRODUCT.md`, `docs/UX_FLOWS.md`, `docs/GAME_SYSTEM.md`, `docs/PHASE_2B_DESIGN.md`, decisioni owner D-020, D-022 e D-027, piano approvato in chat il 2026-08-24.

## Global Constraints

- Modificare soltanto prototipo, test e documentazione Phase 2B. Non modificare `src/`.
- Non installare dipendenze e non introdurre backend, account, multiplayer online o persistence reale.
- Conservare `Petrolio festa` e `Passa la R` come direzione visiva approvata.
- Torneo resta un formato Later interno a Party Night, esplorato soltanto nel prototipo.
- Italiano predefinito, inglese completo, viewport portrait primaria, tap target almeno 44 CSS px e `prefers-reduced-motion` rispettato.
- Nessun commit o push senza una nuova autorizzazione esplicita.

---

### Task 1: Navigazione e contesti

**Files:**
- Modify: `prototypes/phase-2b-high-fidelity.test.cjs`
- Modify: `prototypes/phase-2b-high-fidelity.html`

**Interfaces:**
- Produces: `state.flowContext`, `state.partyFormat`, scelta formato dopo `Start Party`, ritorno contestuale e sessione riprendibile.

- [x] Scrivere test browser che richiedano la scelta `Serata libera` o `Torneo` prima dei giocatori e verifichino il ripristino del formato.
- [x] Eseguire il test e verificare il fallimento dovuto alla schermata formato assente.
- [x] Implementare stato, schermata formato e routing contestuale minimo.
- [x] Eseguire il test e verificare il passaggio senza regressioni Home.

### Task 2: Setup Serata libera e Torneo

**Files:**
- Modify: `prototypes/phase-2b-high-fidelity.test.cjs`
- Modify: `prototypes/phase-2b-high-fidelity.html`

**Interfaces:**
- Consumes: `state.partyFormat`.
- Produces: configurazione Serata libera completa e `state.tournament` con quantità, metodo di selezione, titoli selezionati, calendario e lock.

- [x] Scrivere test per default Serata libera, filtri opzionali, quantità Torneo, selezione automatica/manuale, calendario bloccabile e incompatibilità recuperabile.
- [x] Eseguire i test e verificare i fallimenti sui controlli mancanti.
- [x] Implementare i due setup riusando giocatori, materiali e riepiloghi condivisi.
- [x] Eseguire i test e correggere soltanto i comportamenti richiesti.

### Task 3: Catalogo contestuale D-022

**Files:**
- Modify: `prototypes/phase-2b-high-fidelity.test.cjs`
- Modify: `prototypes/phase-2b-high-fidelity.html`

**Interfaces:**
- Consumes: `state.flowContext`, risorse, giocatori e filtri.
- Produces: ricerca, raccolte, filtri, dettaglio e azione primaria specifica per Browse, Quick Play, Serata libera e selezione multipla Torneo.

- [x] Scrivere test che aprano il catalogo dai quattro contesti e verifichino destinazione, selezione e ritorno corretti.
- [x] Eseguire i test e verificare il fallimento del catalogo globale attuale.
- [x] Integrare la struttura mobile approvata D-022 e un dataset finto sufficiente al calendario da cinque giochi.
- [x] Eseguire i test e verificare che `Surprise me`, `Cambia` e `Scegli gioco` non attraversino contesti errati.

### Task 4: Due giochi e loop dei risultati

**Files:**
- Modify: `prototypes/phase-2b-high-fidelity.test.cjs`
- Modify: `prototypes/phase-2b-high-fidelity.html`

**Interfaces:**
- Consumes: contesto di sessione, giocatori e gioco scelto.
- Produces: fasi di `Secret Signals`, fasi di `Mirror Moves`, risultato derivato dalle azioni, correzione, classifica, conseguenza e prossimo gioco.

- [x] Scrivere test end-to-end per private reveal, accusa, freeze, eliminazione e risultati derivati.
- [x] Eseguire i test e verificare che falliscano sul pulsante generico `Finish game`.
- [x] Implementare le interazioni brevi, gli stati di interruzione e i modelli di risultato necessari.
- [x] Eseguire i test su Serata libera, Quick Play e primo round Torneo.

### Task 5: Stati avanzati, finali e QA

**Files:**
- Modify: `prototypes/phase-2b-high-fidelity.test.cjs`
- Modify: `prototypes/phase-2b-high-fidelity.html`
- Modify: `docs/PHASE_2B_DESIGN.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/ROADMAP.md`

**Interfaces:**
- Consumes: tutti i flussi precedenti.
- Produces: ritiro, spareggio e finale Torneo tramite shortcut; finale naturale, anticipato e neutro; Quick Play completo; QA tracciato.

- [x] Scrivere test per uscita anticipata, ripresa, finale neutro, conseguenza finale, ritiro e spareggio Torneo.
- [x] Eseguire i test e verificare i fallimenti sugli stati mancanti.
- [x] Implementare gli stati e completare italiano e inglese.
- [x] Eseguire il test end-to-end su 375, 430, 844 landscape e 1440 CSS px, focus, modal, reduced motion e console.
- [x] Eseguire `ui-check` sui tre blocchi, il detector Impeccable una volta e correggere in un solo batch.
- [x] Aggiornare i documenti soltanto con decisioni e controlli realmente eseguiti.
- [x] Verificare `git diff`, `git status` e l’assenza di modifiche a `src/`, commit o push.
