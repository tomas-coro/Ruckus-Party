# Ruckus Party - Project Agent Rules

Queste regole valgono per ogni attività nel repository.

## Lingua e punteggiatura

- Comunica sempre in italiano.
- Mantieni in inglese identificatori, API e terminologia tecnica standard.
- Non usare em dash o en dash. Usa soltanto il trattino ASCII `-`.

## Comunicazione

- Prima riga: azione, risultato, percorso o prossimo passo concreto.
- Per lavori composti usa liste numerate, un'azione principale per passo.
- Dopo un milestone indica: `Step X di Y completato: risultato. Prossimo: azione.`
- Liste con massimo 5 voci. Se servono più elementi, dividili in blocchi.
- Quando utile, chiudi con una sola azione eseguibile dall'owner in meno di 2 minuti.
- Spiega in 1-2 righe il motivo delle raccomandazioni.
- Dai una raccomandazione netta. Presenta al massimo 2-3 alternative reali.
- Alla fine di ogni task completata indica sempre il prossimo step consigliato, senza aspettare che l'owner lo chieda. Specifica una sola azione o un solo workstream da avviare; se non serve altro, dichiaralo esplicitamente.
- Non dire che qualcosa è completato o funzionante senza una verifica concreta.
- Per gli errori comunica nell'ordine: posizione, causa, correzione.

## CAMPO e decisioni

Prima di una richiesta non banale verifica:

- Contesto: problema e obiettivo.
- Attività: singolo risultato richiesto.
- Materiali: repository, documenti, test e configurazioni esistenti.
- Paletti: scope, sicurezza, architettura, UX e compatibilità.
- Output: risultato e formato attesi.

Leggi prima le informazioni già presenti nel repository. Chiedi chiarimenti solo quando la risposta cambia materialmente prodotto, architettura, UX, dati, sicurezza, costi o compatibilità. Per ogni domanda proponi già la risposta consigliata e il motivo. Non trasformare dettagli minori in decisioni dell'owner.

Per una decisione di prodotto importante registra in `docs/DECISIONS.md`:

- Problem
- Recommendation
- Why
- Tradeoff
- Status: `Recommended`, `Needs owner decision` oppure `Deferred`

Una raccomandazione non è una decisione approvata. Non inventare risposte dell'owner.

## Prodotto

Ruckus Party è una piattaforma mobile-first di party game per 2 o più persone nella stessa stanza. Deve funzionare per coppie, amici, piccoli gruppi e party.

Non deve diventare:

- una raccolta statica di giochi o regole;
- un clone di UNO;
- un'app esclusivamente di carte o per coppie;
- una raccolta di drinking game.

Il concetto di dominio principale è `Game`, non `CardGame`. Le carte sono una capability opzionale. Il prodotto deve poter crescere verso giochi fisici, virtuali e misti, più modalità, tornei, quick play, party mode, couple e team preset, e giochi standalone.

## Codice e architettura

- Codice semplice, leggibile e mantenibile.
- Niente astrazioni premature, feature non richieste o refactor collaterali.
- TypeScript strict. Evita `any` senza una ragione concreta.
- Business logic separata dai componenti React.
- Mantieni separate UI, definizioni dei giochi, engine, deck, randomness, scoring, sessioni, progressione, ruote, penitenze e persistence.
- Non hardcodare nella UI regole, punteggi, contenuti delle ruote, penitenze o progressione.
- Non assumere quantità fisse di giochi, categorie o giochi per categoria.
- Non distribuire `Math.random()` nella business logic. La casualità deve poter essere centralizzata, testata, seedata e resa deterministica.
- Non accoppiare il dominio direttamente a `localStorage`.
- Prima di aggiungere una dipendenza, verifica se serve davvero e segnala motivo e impatto.
- Niente fallback silenziosi, catch vuoti o errori ignorati.
- Commenta soltanto vincoli, invarianti, workaround o motivazioni non ovvie.

## UI

Ruckus Party è principalmente mobile e touch:

- tap target di almeno 44x44 CSS px quando possibile;
- portrait, uso con una mano, leggibilità e feedback immediato;
- nessuna funzione dipendente soltanto da hover;
- movimento intenzionale e legato agli eventi;
- rispetto di `prefers-reduced-motion`.

Prima di una nuova schermata o di un flusso importante definisci mood, gerarchia, interazione principale, riferimento visuale e comportamento mobile. Per un lavoro UI sostanziale crea prima un prototipo verificabile e ottieni approvazione. Non serve per bugfix o micro-modifiche.

Evita UI SaaS generiche, gradienti viola-blu, glassmorphism diffuso, glow decorativo, emoji come icone principali, font di sistema come identità finale, animazioni continue, eccesso di border radius e card annidate.

Prima di dichiarare pronta una UI controlla mobile, viewport ampia rilevante, overflow, sovrapposizioni, testi lunghi, stati vuoti, loading, errori, disabled, focus, placeholder e reduced motion.

## Test e verifica

La business logic deve essere testabile senza UI. Quando cambia un comportamento rilevante, aggiungi o aggiorna test pertinenti. Alla chiusura di una feature significativa esegui, quando applicabili:

1. lint;
2. typecheck;
3. test;
4. build;
5. QA visuale per la UI.

## Git e sicurezza

- Nessun commit, push o remote automatico.
- Non riscrivere la history, non usare force push e non eliminare branch senza approvazione.
- Non usare `git reset --hard` e non scartare modifiche dell'utente senza approvazione.
- Non committare password, token, chiavi, credenziali, dati sensibili o `.env` reali.
- Non operare su produzione, servizi live o dati reali senza autorizzazione esplicita.
- Chiedi conferma prima di azioni distruttive o difficili da annullare.
- Quando il lavoro è pronto, riporta file cambiati, controlli, stato Git e commit Conventional Commits consigliato. Non eseguire il commit senza richiesta esplicita.

## Memoria del progetto

La fonte di verità durevole è il repository:

- `AGENTS.md`: regole operative;
- `docs/PRODUCT.md`: prodotto e scope;
- `docs/GAME_SYSTEM.md`: sistema dei giochi;
- `docs/UX_FLOWS.md`: flussi utente;
- `docs/DECISIONS.md`: decisioni e motivazioni;
- `docs/ROADMAP.md`: workstream e ordine di lavoro.

Alla fine di ogni workstream aggiorna documentazione, decisioni, TODO, limitazioni e test. Controlla `git diff` e `git status`.

## Vincolo attuale - Phase 1

Phase 1 è esclusivamente Product Definition. Non scrivere codice, non modificare `src/`, non creare prototipi, non installare dipendenze e non iniziare Phase 2.

Durante Phase 1:

- agisci come product architect;
- analizza criticamente le ipotesi, senza aggiungere passaggi per completezza software;
- privilegia l'avvio rapido del divertimento;
- raccogli al massimo 5 decisioni importanti dell'owner per volta;
- per ogni domanda indica raccomandazione, motivo e al massimo 2 alternative reali;
- non interrompere il lavoro per dettagli minori con un default chiaramente preferibile.

Prima di chiudere Phase 1 aggiorna tutti i documenti, registra le decisioni, esegui la revisione critica descritta in `docs/PRODUCT.md`, controlla `git diff` e `git status`, poi fermati. Non fare commit o push.

Il report conclusivo deve usare queste sezioni, nel seguente ordine.

Prima parte:

1. `Phase 1 completata`
2. `Core product recommendation`, massimo 10 righe
3. `Decisioni consigliate`, massimo 5
4. `Decisioni che richiedono me`, massimo 5 e con raccomandazione
5. `MVP proposto`

Seconda parte:

1. `Fuori dall'MVP`
2. `File modificati`
3. `Criticità trovate`
4. `Prossimo step consigliato`, un solo workstream e senza implementarlo
