# Ruckus Party - Project Agent Rules

Queste regole valgono per ogni attività nel repository. Il repository è la fonte di verità durevole.

## Regole universali

### Lingua e comunicazione

- Comunica sempre in italiano. Mantieni in inglese identificatori, API e terminologia tecnica standard.
- Non produrre em dash, en dash o equivalenti HTML: usa il trattino ASCII `-`. Non alterare arbitrariamente contenuti esterni che li contengono.
- Applica `Think enough. Read enough. Verify enough. Say less.` La concisione riguarda l'output, mai analisi, contesto, debugging, test, QA, sicurezza o verifiche necessarie.
- Scrivi risposte concise e operative: `risultato -> evidenza -> prossimo passo`, idealmente 5-12 righe utili per task normali. Evita introduzioni, ripetizioni, piani impliciti, alternative inutili e sezioni vuote; approfondisci solo quando decisioni, rischi o complessità lo richiedono.
- Non narrare ogni azione interna. Aggiorna soltanto per decisioni owner, rischi, blocchi, cambi di scope o milestone significativi. Spiega il perché in 1-2 righe, dai una raccomandazione netta e chiudi con un solo prossimo step utile.
- Non dichiarare completato o funzionante ciò che non hai verificato. Per gli errori comunica nell'ordine: posizione, causa, correzione. I dettagli e i formati sono in `docs/WORKFLOW.md`.

### CAMPO, autonomia e scope

- Per richieste non banali verifica internamente CAMPO: Contesto, Attività, Materiali, Paletti, Output. Non trasformarlo in un questionario automatico.
- Leggi prima la fonte di verità pertinente. Chiedi solo se l'informazione mancante cambia materialmente prodotto, architettura, UX, dati, sicurezza, costi o compatibilità; proponi già risposta consigliata e motivo.
- Una raccomandazione non è un'approvazione. Non inventare decisioni owner e registra quelle importanti secondo `docs/WORKFLOW.md` in `docs/DECISIONS.md`.
- Non aggiungere feature, refactor collaterali, astrazioni premature, ottimizzazioni non misurate o lavoro speculativo. Se lo scope cresce, completa la parte coerente e proponi il resto come workstream separato.

### Qualità

- Usa TypeScript strict ed evita `any` senza una ragione concreta.
- Separa business logic e UI; la logica rilevante deve essere testabile senza componenti React.
- Non usare fallback silenziosi, catch vuoti o errori ignorati. Gestisci gli errori in modo esplicito e leggibile.
- Aggiungi o aggiorna i test pertinenti quando cambia un comportamento. Proporziona ispezione e verifica al rischio senza ridurre il rigore necessario.
- Non dichiarare concluso un task senza applicare la Definition of Done pertinente in `docs/WORKFLOW.md`.

## What to read for each task

Leggi sempre questo file e le eventuali istruzioni più specifiche della directory. Poi carica soltanto il contesto indicato e i file o test direttamente coinvolti.

| Task | Contesto da leggere |
|---|---|
| Product o feature definition | `docs/PRODUCT.md`; `docs/DECISIONS.md` se cambia o verifica una decisione; specifica di Phase pertinente |
| Architecture | invarianti sotto; `docs/GAME_SYSTEM.md`; `docs/DECISIONS.md`; codice e test coinvolti. `docs/ARCHITECTURE.md` solo quando esisterà un'architettura tecnica approvata |
| Game logic o nuovo gioco | `docs/GAME_SYSTEM.md`; definizione, codice e test del gioco; `docs/PRODUCT.md` solo se cambia il perimetro |
| UX o UI | `docs/DESIGN.md`; componente coinvolto; `docs/UX_FLOWS.md` e specifica di Phase solo per flussi o UI sostanziali |
| Workflow, test, Git o contesto | sezione pertinente di `docs/WORKFLOW.md`; `git diff` e `git status` per preparare o chiudere lavoro |
| Roadmap o scope futuro | `docs/ROADMAP.md`; `docs/DECISIONS.md`; non caricarli per un fix corrente senza impatto di pianificazione |

Esempi: un overflow UI richiede `AGENTS.md`, `docs/DESIGN.md` e il componente; un nuovo gioco richiede `GAME_SYSTEM`, codice e test; una modifica al finale richiede `PRODUCT`, `GAME_SYSTEM`, `DECISIONS` e codice; preparare un commit richiede `WORKFLOW` e stato Git.

## Prodotto e invarianti architetturali

- Ruckus Party è una piattaforma mobile-first di party game per almeno 2 persone nella stessa stanza, adatta a coppie, amici, piccoli gruppi e party.
- Non è una raccolta statica di regole, un clone di UNO, un'app solo di carte o coppie, né una raccolta di drinking game.
- Il dominio principale è `Game`, non `CardGame`; le carte sono una capability opzionale. Non assumere quantità fisse di giochi, categorie o giochi per categoria.
- Mantieni separati UI, definizioni dei giochi, engine, deck, randomness, scoring, sessioni, progressione, ruote, conseguenze e persistence.
- Non hardcodare nella UI regole, punteggi, contenuti delle ruote, conseguenze o progressione.
- Centralizza la casualità: niente `Math.random()` distribuito nella business logic. Deve essere testabile, seedabile e deterministica.
- Astrai la persistence dal dominio e non accoppiarlo direttamente a `localStorage`.
- Prima di aggiungere una dipendenza, verifica necessità e impatto e segnalali. Scrivi codice semplice, leggibile e mantenibile; commenta solo vincoli, invarianti, workaround o motivi non ovvi.

## Git e sicurezza

- Nessun commit, push o altra scrittura remota automatica. Riporta il commit Conventional Commits consigliato, ma eseguilo solo su richiesta esplicita.
- Non riscrivere la history, usare force push, eliminare branch, eseguire `git reset --hard` o scartare modifiche dell'utente senza approvazione.
- Chiedi conferma prima di azioni distruttive o difficili da annullare.
- Non committare password, token, chiavi, credenziali, dati sensibili o `.env` reali.
- Non operare su produzione, servizi live o dati reali senza autorizzazione esplicita.

## Context e usage efficiency

- Applica `minimum sufficient context`: usa ricerca mirata, leggi file, sezioni e test pertinenti e amplia solo davanti a un'ambiguità concreta. Accuratezza e sicurezza hanno priorità.
- Non rileggere nello stesso workstream fonti appena analizzate, invariate e ancora affidabili. Non sostituire una verifica necessaria con memoria vaga.
- Rimuovi spreco, non rigore. Proporziona piano, analisi e controlli al task; la procedura completa è in `docs/WORKFLOW.md`.
- Il repository conserva regole, prodotto, decisioni, comportamento e test. Chat, checkpoint e attachment temporanei descrivono solo lo stato di passaggio e non devono diventare fonti durevoli.
- Per il cambio chat applica `Keep useful context. Drop stale context.` e `Recommend the switch and package the restart.` secondo `docs/WORKFLOW.md`; non interrompere debugging o workstream ancora attivi.
- Il reasoning predefinito è Medium. Prima di ogni task non banale valuta internamente se è sufficiente; High è un'eccezione motivata secondo `docs/WORKFLOW.md`. Se Medium basta, non parlarne.

## Fonti di verità

| Fonte | Responsabilità |
|---|---|
| `AGENTS.md` | regole universali, mappa e invarianti |
| `docs/PRODUCT.md` | prodotto e scope |
| `docs/ARCHITECTURE.md` quando esisterà | struttura tecnica approvata; oggi non è ancora presente |
| `docs/GAME_SYSTEM.md` | giochi, compatibilità e concetti di dominio |
| `docs/UX_FLOWS.md`, `docs/PHASE_2A_UX.md` | flussi e UX approvata |
| `docs/DESIGN.md`, `docs/PHASE_2B_DESIGN.md` | disciplina UI e direzione corrente |
| `docs/WORKFLOW.md` | esecuzione, verifica, Git, contesto e usage |
| `docs/DECISIONS.md` | decisioni, raccomandazioni e stato owner |
| `docs/ROADMAP.md` | stato delle Phase e ordine futuro |
| Codice e test | comportamento implementato e comportamento verificato |

## Vincolo attuale - Phase 2B

Phase 2B riguarda esclusivamente visual direction, design system e prototipo high-fidelity. Non modificare `src/`, non scrivere codice prodotto, non implementare backend, account, multiplayer online o persistence reale e non installare dipendenze.

- Usa i flussi e le decisioni approvate in Phase 2A senza riprogettare il prodotto. Lo stato esatto delle approvazioni vive in `docs/DECISIONS.md` e `docs/ROADMAP.md`.
- La direzione deve derivare dal confronto di 2-3 alternative e dall'approvazione owner; non confondere una raccomandazione o un candidato con il gate finale.
- Il prototipo deve coprire Home, setup, due giochi, Physical, Virtual, private reveal, errore e finale usando solo dati finti e stato locale.
- Prima della consegna esegui QA visuale, responsive, interattivo, bilingue e reduced motion secondo `docs/DESIGN.md`.
- Prima di chiudere Phase 2B aggiorna, se coinvolti, design system, decisioni, roadmap, limiti e controlli; verifica diff e status, poi fermati al gate owner senza commit o push.
