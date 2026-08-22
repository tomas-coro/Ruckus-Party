# Ruckus Party - Design Workflow

## Responsabilità

Questo documento definisce la disciplina UI valida attraverso le Phase. La direzione visiva corrente, i token e i componenti di `Manifesto Sociale` vivono in `docs/PHASE_2B_DESIGN.md`; i flussi approvati vivono in `docs/UX_FLOWS.md` e `docs/PHASE_2A_UX.md`.

Per un micro-fix visuale leggi questa guida e il componente coinvolto. Per una schermata o un flusso sostanziale leggi anche le fonti di Phase pertinenti.

## Regia prima dell'implementazione

Prima di una nuova schermata o di un flusso importante definisci:

1. mood e tono;
2. gerarchia e unica azione dominante;
3. interazione principale;
4. riferimento visuale concreto;
5. comportamento mobile e touch.

Per un lavoro UI sostanziale crea prima 2-3 direzioni realmente diverse, rendile confrontabili in un prototipo verificabile e ottieni l'approvazione owner prima del codice prodotto. Bugfix e micro-modifiche non richiedono un nuovo mockup né una nuova approvazione estetica.

## Principi UI

- Ruckus Party è mobile-first, portrait, touch e pensata per l'uso con una mano in una stanza condivisa.
- Ogni schermata comunica una gerarchia chiara e offre feedback immediato. Nessuna funzione dipende soltanto da hover.
- Il colore ha un ruolo stabile legato ad azione, selezione, stato o contesto; whitespace, superfici e profondità sono intenzionali.
- La tipografia deve avere una gerarchia reale e restare leggibile con testi localizzati lunghi. Per la direzione corrente usa i vincoli tipografici di `docs/PHASE_2B_DESIGN.md`.
- Il movimento è legato agli eventi e aiuta a comprendere transizioni, risultato o causalità; non è decorazione continua.

## Anti-pattern visuali

Evita:

- UI SaaS generiche, gradienti viola-blu e colori freddi saturi usati come accento principale senza motivo;
- glassmorphism o blur diffusi, glow decorativo e ombre pesanti su ogni superficie;
- emoji come icone funzionali principali e identità basate su font di sistema generici;
- eccesso di pillole, border radius, card annidate e griglie di card identiche centrate;
- tipografia tutta sans senza gerarchia, movimento continuo o atmosfera priva di profondità intenzionale.

## Mobile, touch e accessibilità

- Mantieni i tap target ad almeno 44x44 CSS px quando possibile; per le azioni principali preferisci 48-60 px.
- Verifica portrait come target principale e la viewport ampia rilevante. Evita overflow orizzontale e dipendenze da hover.
- Conserva contrasto leggibile, focus visibile, ordine di tab coerente, label comprensibili e stati `disabled` distinguibili.
- Testi lunghi non devono sovrapporsi, essere troncati senza motivo o richiedere di ridurre il corpo sotto una soglia leggibile.
- I modal devono bloccare lo sfondo, mantenere il focus nel dialogo e offrire un'uscita chiara.

## Motion

- Preferisci pochi momenti ad alto impatto, collegati a ingresso, pressione, reveal, scelta o risultato.
- Usa CSS quando sufficiente e rispetta sempre `prefers-reduced-motion` disattivando animazioni e transizioni non essenziali.
- Evita parallax, loop, glow pulsanti e movimento persistente. Lo stato finale deve restare comprensibile senza animazione.
- Per timing, reazioni degli oggetti e motion della direzione corrente usa `docs/PHASE_2B_DESIGN.md` come fonte unica.

## Prototipi

- I prototipi sostanziali devono essere cliccabili, usare dati finti e stato locale e rendere verificabili i percorsi critici senza dipendenze di produzione.
- Una scelta di direzione si mostra a confronto, non soltanto in descrizione testuale.
- Il prototipo deve coprire stati principali, errore e recupero, loading, empty, disabled, focus, testi lunghi e reduced motion quando pertinenti.
- Le approvazioni vivono in `docs/DECISIONS.md`; la presenza di un mockup o candidato non equivale ad approvazione owner.

## Visual QA

Prima di mostrare una UI sostanziale e prima di dichiararla pronta, verifica sullo stato corrente:

1. viewport mobile primaria e viewport ampia rilevante, senza overflow o spazio sprecato;
2. nessuna sovrapposizione, troncamento inatteso, disallineamento, placeholder o refuso;
3. tap target, focus, contrasto, disabled, loading, empty ed errori recuperabili;
4. modali con sfondo fermo, contenuto bilingue completo e testi lunghi;
5. interazioni principali, console, `prefers-reduced-motion` e assenza di movimento continuo.

Correggi i difetti trovati prima del gate. Registra in un documento di Phase soltanto i controlli realmente eseguiti, senza trasformare la checklist in una dichiarazione automatica.
