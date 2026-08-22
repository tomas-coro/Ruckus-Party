# Ruckus Party - Roadmap

## Stato attuale

`Phase 1 - Product Definition: completata il 2026-08-22`

Il repository contiene la definizione di prodotto e non contiene ancora implementazione. Le raccomandazioni di Phase 1 sono registrate in `docs/DECISIONS.md` e dovranno essere validate prima di diventare decisioni owner implicite.

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
- preset e punteggio team;
- streak, bonus, milestone ed eventi speciali;
- conseguenze persistenti;
- private state più complesso;
- personalizzazione e raccomandazioni più evolute.

## Future

- account, profili e statistiche persistenti;
- multiplayer su più dispositivi e online;
- custom penalties e contenuti creati dagli utenti;
- tornei, social, community e condivisione;
- branding commerciale, monetizzazione, shop, abbonamenti e achievement complessi.

## Prossimo workstream consigliato

`Phase 2A - UX / information architecture / low-fidelity prototype`

Un solo obiettivo: verificare il percorso mobile da apertura al primo gioco e il ritmo tra risultato, conseguenza e gioco successivo prima di progettare UI definitiva o implementazione.

Output atteso:

- mappa della navigazione e degli entry point;
- flusso low-fidelity da apertura a primo gioco;
- flusso risultato, conseguenza, progressione e prossimo gioco;
- varianti necessarie per Physical, Virtual e private reveal;
- prototipo mobile verificato e sottoposto all'approvazione dell'owner.

## Gate prima dell'implementazione

Non iniziare codice prodotto finché il prossimo workstream non ha validato:

- quali dati chiedere davvero prima del primo gioco;
- comprensione di durata, risorse e contenuti attivi;
- differenza percepita tra Party Night e Quick Play;
- velocità del loop tra due giochi;
- casi di errore e uscita anticipata.

Branding definitivo, monetizzazione, account, backend, multiplayer online e quantità finale del catalogo non devono entrare nel prossimo workstream.
