# Ruckus Party - Decision Log

## Come usare questo file

Ogni decisione importante indica problema, raccomandazione, motivi, tradeoff e stato.

- `Recommended`: baseline proposta per il lavoro successivo. Non equivale da sola ad approvazione dell'owner.
- `Needs owner decision`: richiede una risposta esplicita prima di procedere.
- `Deferred`: scelta rinviata fuori dallo scope corrente.

## Vincoli confermati dal brief

### D-001 - Tipo di prodotto

- Problem: evitare che il concept si restringa a una raccolta di giochi o di carte.
- Recommendation: usare `Game` come concetto principale e trattare le carte come capability opzionale.
- Why: permette giochi con e senza carte, varianti fisiche e virtuali e crescita oltre i primi 15 giochi.
- Tradeoff: richiede definizioni di gioco più generali rispetto a un catalogo basato soltanto sui mazzi.
- Status: `Recommended`, vincolo esplicito del brief.

### D-002 - Contesto multiplayer MVP

- Problem: stabilire il contesto d'uso senza progettare prematuramente multiplayer online.
- Recommendation: assumere un dispositivo condiviso e persone nella stessa stanza.
- Why: corrisponde all'esperienza centrale e riduce drasticamente lo scope iniziale.
- Tradeoff: i giochi con informazioni segrete devono rispettare il flusso private reveal definito per l'MVP.
- Status: `Recommended`, vincolo esplicito del brief.

### D-003 - Scope di Phase 1

- Problem: evitare che la definizione prodotto venga confusa con implementazione o design definitivo.
- Recommendation: produrre soltanto documentazione di prodotto e flussi testuali.
- Why: il prodotto deve essere coerente prima di costruire giochi, UI e sistemi tecnici.
- Tradeoff: nessun prototipo giocabile viene prodotto in questa fase.
- Status: `Recommended`, vincolo esplicito del brief.

## Decisione confermata dall'owner

### D-004 - Perimetro dei contenuti e delle penitenze

- Problem: decidere se l'esperienza includa contenuti romantici, alcolici o più audaci e come evitare che vengano mostrati senza consenso.
- Recommendation: prevedere un catalogo ampio e molto personalizzabile. L'esperienza base usa contenuti generali; romantico, alcol, contenuti audaci e altre categorie sensibili sono disponibili come pacchetti o filtri opzionali, disattivati di default. L'app può suggerire preset, ma l'utente può modificarli.
- Why: Ruckus Party può servire pubblici e serate differenti senza diventare un drinking game o mostrare contenuti sensibili per sorpresa.
- Tradeoff: chi cerca subito un tono specifico deve attivarlo esplicitamente; la personalizzazione richiede controlli chiari senza trasformarsi in un pannello infinito.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: il prodotto conterrà contenuti di ogni tipo, con suggerimenti e forte personalizzazione; i contenuti sensibili saranno presenti ma disattivati di default.

## Raccomandazioni di Phase 1

### D-005 - Struttura delle modalità

- Problem: distinguere accessi realmente diversi senza affollare la Home con modalità equivalenti.
- Recommendation: usare `Party Night` come esperienza principale e `Quick Play` come accesso a una singola partita. `Surprise me` è un'azione interna a Quick Play, non una modalità `Random Play` separata. `Games` resta il catalogo esplorabile.
- Why: ogni ingresso ha uno scopo riconoscibile e la scelta casuale resta disponibile senza moltiplicare le modalità.
- Tradeoff: Random Play ha meno visibilità come marchio autonomo.
- Status: `Recommended`.

### D-006 - Avvio e configurazione di Party Night

- Problem: raccogliere abbastanza informazioni per proporre giochi compatibili senza creare un wizard lento.
- Recommendation: richiedere soltanto almeno due giocatori, un preset di durata e le risorse disponibili. Usare come default contenuti generali e conseguenze `Playful`. Spostare esclusioni, tono, tipi di gioco e intensità in `Customize`.
- Why: il primo gioco rimane raggiungibile rapidamente, mentre chi ha esigenze precise conserva il controllo.
- Tradeoff: il primo suggerimento può essere meno personalizzato per chi salta `Customize`.
- Status: `Recommended`.

### D-007 - Physical, Virtual e Mixed

- Problem: rendere comprensibile il supporto dei giochi senza chiedere all'utente di conoscere categorie tecniche.
- Recommendation: non mostrare un selettore di sessione `Physical / Virtual / Mixed`. Chiedere quali materiali sono disponibili, con `Phone only` come scelta immediata. Il sistema deriva i giochi compatibili; una sessione diventa mixed quando alterna giochi fisici e digitali.
- Why: l'utente risponde a una domanda concreta e non deve prevedere in anticipo come sarà composta la sessione.
- Tradeoff: chi desidera esclusivamente giochi fisici o digitali deve usare un filtro opzionale.
- Status: `Recommended`.

### D-008 - Progressione e conclusione

- Problem: mantenere tensione e produrre una conclusione soddisfacente senza un metagame complesso.
- Recommendation: nell'MVP assegnare un punto per vittoria, mostrare classifica e avanzamento dopo ogni gioco e concludere con campione o campioni, breve riepilogo e conseguenza finale per l'ultimo posto quando abilitata e non sono tutti a pari merito. `Finish session now` usa i risultati già registrati. Streak, bonus e milestone speciali restano Later.
- Why: il punteggio è leggibile anche in una stanza caotica e la sessione non sembra interrotta quando termina prima.
- Tradeoff: giochi molto diversi hanno lo stesso peso e i pareggi possono produrre più vincitori o più ultimi classificati.
- Status: `Recommended`.

### D-009 - Ruolo delle conseguenze

- Problem: far sì che penitenze e handicap siano memorabili senza dominare ogni passaggio.
- Recommendation: usare un solo `Consequence moment` tra risultato e prossimo gioco quando previsto dal preset. Il default `Playful` lo propone dopo il primo risultato eleggibile, poi alterna giochi con e senza conseguenza. Nell'MVP supportare conseguenze immediate e handicap validi per il gioco successivo, sempre compatibili, sostituibili e disattivabili. Effetti persistenti e speciali restano Later; custom penalties restano Future.
- Why: conserva la firma giocosa del prodotto limitando durata, ripetizione e situazioni inappropriate.
- Tradeoff: l'MVP offre meno combinazioni di effetti rispetto alla visione completa.
- Status: `Recommended`.

### D-010 - Definizione e selezione dei giochi

- Problem: supportare giochi diversi senza una tassonomia rigida o un algoritmo prematuro.
- Recommendation: descrivere ogni gioco con compatibilità, durata, gameplay, tono, materiali e supporto digitale, variante, modello di risultato, informazioni segrete e compatibilità con handicap. La selezione applica prima i vincoli obbligatori e poi preferisce varietà e giochi non ancora svolti.
- Why: il catalogo può crescere oltre giochi di carte e resta testabile con regole di prodotto esplicite.
- Tradeoff: la qualità dei suggerimenti dipende dalla cura dei metadati dei giochi.
- Status: `Recommended`.

### D-011 - Informazioni segrete su dispositivo condiviso

- Problem: consentire giochi con ruoli o carte segrete senza introdurre più telefoni o multiplayer online.
- Recommendation: nell'MVP supportare solo private reveal brevi in pass-and-play, con contenuto nascosto prima e dopo la lettura. Escludere dall'MVP giochi che richiedono mani private consultabili continuamente o stato segreto simultaneo.
- Why: abilita bluff e ruoli semplici mantenendo l'assunzione di un solo dispositivo condiviso.
- Tradeoff: alcuni giochi digitali complessi dovranno essere adattati o rinviati.
- Status: `Recommended`.

### D-012 - Confine dell'MVP

- Problem: validare il loop di serata senza costruire in anticipo tutta la piattaforma.
- Recommendation: includere Party Night, Quick Play con `Surprise me`, catalogo iniziale ridotto ma vario, giochi phone-only e fisici, punteggio semplice, conseguenze immediate, handicap per il gioco successivo, private reveal e chiusura anticipata completa. Rinviare standalone lunghi, team, effetti persistenti, milestone, account e multiplayer online.
- Why: è il minimo insieme che prova avvio, varietà, ritmo tra giochi e finale.
- Tradeoff: l'MVP dimostra la promessa centrale, non ancora tutta l'ampiezza futura della piattaforma.
- Status: `Recommended`.

## Decisioni owner aperte

Nessuna decisione owner è necessaria per chiudere Phase 1. Le raccomandazioni D-005 - D-012 restano verificabili e reversibili nel prossimo workstream.
