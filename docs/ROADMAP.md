# Ruckus Party - Roadmap

## Stato attuale

`Vertical slice PWA interna: implementata, in attesa del gate owner`

Il repository contiene definizione di prodotto, UX architecture, prototipo high-fidelity approvato e una prima vertical slice PWA testata. La slice copre setup locale, `Segnali segreti`, private reveal, risultato, classifica, ripresa IndexedDB, recovery, due lingue, installabilità, offline e aggiornamenti a prompt. Non è ancora una V1 pubblica e non amplia lo scope a catalogo, Quick Play, Torneo, account o multiplayer online.

## Phase 1 - Product Definition

Deliverable completati:

- `docs/PRODUCT.md`: promessa, modalità, sessione, progressione, contenuti e scope;
- `docs/GAME_SYSTEM.md`: definizione minima, compatibilità, selezione, conseguenze e segreti;
- `docs/UX_FLOWS.md`: flussi completi da First launch a finale;
- `docs/DECISIONS.md`: D-004 confermata e raccomandazioni durevoli;
- revisione critica e confine MVP, Later e Future.

Phase 1 non ha prodotto codice, prototipi, dipendenze, backend, giochi o schermate definitive.

## MVP

Obiettivo: validare che un gruppo possa iniziare rapidamente, alternare giochi compatibili e arrivare a un finale soddisfacente.

- Party Night per 2-6 giocatori locali su un dispositivo condiviso.
- Quick Play con catalogo compatibile e `Surprise me`.
- Giochi phone-only e fisici, con supporto Virtual Deck, Assisted e Full Digital quando necessario.
- Risultato, un punto per vittoria, classifica, conseguenza opzionale e prossimo gioco.
- Conseguenze immediate, handicap per il gioco successivo, filtri opt-in e private reveal breve.
- Fine naturale o `Finish session now`, entrambe con riepilogo e risultato finale.

Il numero esatto dei giochi iniziali non è deciso in Phase 1. Il catalogo MVP deve essere il più piccolo insieme che consenta varietà reale per 2 persone e per gruppi da 3-6, incluso un percorso phone-only.

## Later

- giochi standalone e varianti più lunghe;
- raccolta phone-only con nome di lavoro `Mazzi Originali` e dieci concept da playtestare;
- formato `Torneo` configurabile dentro Party Night, senza modificare il torneo di `Doppio`;
- preset e punteggio team;
- streak, bonus, milestone ed eventi speciali;
- conseguenze persistenti;
- private state più complesso;
- personalizzazione e raccomandazioni più evolute.

## Future

- account, profili e statistiche persistenti;
- multiplayer su più dispositivi e online;
- custom penalties e contenuti creati dagli utenti;
- storico persistente dei tornei, social, community e condivisione;
- branding commerciale, monetizzazione, shop, abbonamenti e achievement complessi.

## Phase 2A - UX / information architecture / low-fidelity prototype

`Completata il 2026-08-22`

Un solo obiettivo: verificare il percorso mobile da apertura al primo gioco e il ritmo tra risultato, conseguenza e gioco successivo prima di progettare UI definitiva o implementazione.

Output atteso:

- mappa della navigazione e degli entry point;
- flusso low-fidelity da apertura a primo gioco;
- flusso risultato, conseguenza, progressione e prossimo gioco;
- varianti necessarie per Physical, Virtual e private reveal;
- prototipo mobile verificato e sottoposto all'approvazione dell'owner.

## Gate UX validato

Phase 2A ha validato:

- quali dati chiedere davvero prima del primo gioco;
- comprensione di durata, risorse e contenuti attivi;
- differenza percepita tra Party Night e Quick Play;
- velocità del loop tra due giochi;
- casi di errore e uscita anticipata.

Branding definitivo, monetizzazione, account, backend, multiplayer online e quantità finale del catalogo non sono entrati in Phase 2A.

## Deliverable completati in Phase 2A

- Information architecture Session-first approvata dall'owner.
- Setup Party Night in tre schermate approvato.
- Core loop con risultato, conseguenza e prossimo gioco separati approvato.
- Private reveal con pressione continua e alternativa accessibile approvato.
- Italiano predefinito con inglese selezionabile approvato.
- Specifica UX validata: `docs/PHASE_2A_UX.md`.
- Prototipo low-fidelity cliccabile: `prototypes/phase-2a-low-fidelity.html`.
- QA verificato su flusso principale, stati critici, due lingue, viewport, tap target, modal e reduced motion.

## Phase 2B - visual direction / design system / high-fidelity prototype

`Completata - prototipo high-fidelity approvato dall'owner il 2026-08-30`

Un solo obiettivo: trasformare i flussi approvati in una direzione visiva distintiva e in un prototipo mobile high-fidelity, senza iniziare ancora il codice prodotto.

Output atteso:

- 2-3 direzioni visive realmente diverse, ognuna con mood e riferimento concreto;
- approvazione owner di una direzione;
- palette, tipografia, gerarchia, componenti e motion rules;
- prototipo high-fidelity del percorso da Home al secondo gioco;
- stati Physical, Virtual, private reveal, errore e finale nella direzione scelta.

Backend, account, multiplayer online e implementazione dell'app restano fuori da Phase 2B.

## Deliverable prodotti in Phase 2B

- Tre direzioni visive confrontabili: `mockups/01-phase-2b-direzioni.html`.
- `Manifesto Sociale` selezionata e affinata con Home teatrale, interni più calmi, Montserrat unica e palette funzionale.
- `Petrolio festa` prodotto come candidato successivo e verificato nel motion lab: `mockups/06-petrolio-festa-motion.html`.
- Sistema logo `Passa la R` e icona Home approvati dall'owner in D-021: `mockups/11-passa-la-r-motion-focused.html`.
- Design system e limiti: `docs/PHASE_2B_DESIGN.md`.
- Prototipo high-fidelity corrente con Home `Petrolio festa` e sistema logo D-021 trasferito: `prototypes/phase-2b-high-fidelity.html`.
- Prototipo completato con setup Serata libera e Torneo, catalogo contestuale, Quick Play, due giochi simulabili, risultati, finali e stati Torneo.
- QA end-to-end completato su mobile, landscape e desktop, flussi, lingue, tap target, modal, errori e reduced motion.

## Gate Phase 2B chiuso

L'owner ha approvato il prototipo high-fidelity completo il 2026-08-30. Phase 2B è conclusa.

Il workstream successivo ha prodotto la specifica architetturale approvata e la vertical slice interna descritta sotto. Questo non promuove automaticamente la slice a V1 pubblica.

## Vertical slice PWA interna

`Implementata il 2026-09-01 - gate owner e commit ancora aperti`

- Stack approvato: React, TypeScript strict, Vite, CSS Modules e IndexedDB tramite `idb`.
- Test: Vitest e React Testing Library per dominio/componenti, Playwright per Chromium e WebKit mobile.
- Deploy predisposto per GitHub Pages solo da `main` dopo i gate verdi.
- Limite del runner: Playwright WebKit non supporta stabilmente il reload offline con service worker; WebKit copre installabilità e flussi, mentre l'offline reale è verificato in Chromium.
- Restano fuori dalla slice catalogo completo, Quick Play, conseguenze, secondo gioco, Torneo, backend, account e multiplayer online.
