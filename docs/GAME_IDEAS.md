# Ruckus Party - Idee di gioco

## Stato

Questo documento raccoglie candidati da prototipare e playtestare. Non costituisce catalogo approvato, non modifica lo scope dell'MVP e non sostituisce `docs/GAME_SYSTEM.md`.

## Complicità

### Controcanto

- Stato: concept confermato dall'owner il 2026-08-24; bilanciamento da playtestare.
- Giocatori: 3-6, cooperativo; durata 8-12 minuti.
- Materiali: telefono, carta e penne.
- Nucleo: un giocatore non vede la parola. Gli altri scrivono un indizio ciascuno; gli indizi unici diventano `Solisti`, quelli uguali o con la stessa radice formano il `Coro` coperto.
- Punteggio: un tentativo con i Solisti vale 2 punti. Se fallisce, si rivela il Coro e l'ultimo tentativo vale 1 punto. La partita dura sei parole e produce un risultato condiviso.
- Da playtestare: criterio di equivalenza degli indizi, soglie del risultato finale e ritmo con 3 giocatori.

## Giochi con dadi

### Mira 100

- Stato: regole di base confermate dall'owner il 2026-08-23; bilanciamento da playtestare.
- Giocatori: 2-6.
- Materiali: un dado; app come supporto a bersaglio, turni e totali.
- Bersaglio standard: 100, scelto dal gruppo oppure generato dall'app.
- Struttura: tre round; ogni giocatore effettua un lancio per round.
- Scelta: dopo il lancio il giocatore conserva il valore oppure aggiunge uno zero. Un 5 può quindi valere 5 oppure 50.
- Risultato: dopo tre lanci vince chi è più vicino al bersaglio. Superarlo è consentito. Un bersaglio centrato esattamente garantisce il miglior risultato, ma il round si completa per consentire un pareggio.
- Variante candidata `Bersaglio grande`: obiettivo tra 300 e 900 e possibilità di usare `x1`, `x10` oppure `x100`.
- Gameplay dominante: luck, strategy.
- Tono: competitive, party.

### Spaccato!

- Stato: regole di base confermate dall'owner il 2026-08-23; bilanciamento da playtestare.
- Giocatori: 2-6.
- Materiali: un dado; app come supporto a bersaglio, turni, protezioni e totali.
- Bersaglio standard: 25.
- Struttura: a turno ogni giocatore lancia il dado e sceglie se aggiungere il risultato al proprio totale oppure sottrarlo a un avversario.
- Precisione: il bersaglio deve essere raggiunto esattamente. Se una somma lo supera, quell'azione non è valida.
- Attacco: può essere colpito soltanto un giocatore in vantaggio. Ogni partecipante dispone inizialmente di due attacchi.
- Risultato: chi raggiunge esattamente il bersaglio vince. Dopo otto minuti, se nessuno lo raggiunge, vince chi è più vicino senza averlo superato.
- Gameplay dominante: luck, strategy, take-that.
- Tono: competitive, chaotic.

### Poker di Dadi

- Stato: nucleo e doppia durata confermati dall'owner il 2026-08-23; categorie e punteggi da playtestare.
- Nota sul nome: `Poker di Dadi` è un nome di lavoro autonomo. Non usare il marchio registrato `Yahtzee` nel prodotto.
- Giocatori: 2-6.
- Materiali: cinque dadi condivisi; app come scheda punti e guida alle combinazioni.
- Nucleo: durante il proprio turno ogni giocatore può effettuare fino a tre lanci, tenendo i dadi desiderati tra un lancio e l'altro. Il risultato viene assegnato a una combinazione ancora libera.
- Versione completa candidata: otto combinazioni e otto turni per giocatore.
- Versione Flash candidata: quattro combinazioni pubbliche estratte dall'app e quattro turni per giocatore.
- Risultato: vince il totale più alto; i pareggi restano validi nella Party Night.
- Gameplay dominante: luck, strategy, set collection.
- Tono: competitive, chill.

### Dubito!

- Stato: nucleo e doppia durata confermati dall'owner il 2026-08-23; durata e gestione dei pareggi da playtestare.
- Giocatori: 2-6.
- Materiali: fino a cinque dadi e un bicchiere opaco per giocatore. La versione fisica richiede dadi nascosti e non viene sostituita da un unico telefono condiviso nell'MVP.
- Nucleo: ogni giocatore vede soltanto i propri dadi. Una dichiarazione indica quantità e faccia, come `cinque 6`.
- Rilancio: il giocatore successivo può dubitare oppure aumentare obbligatoriamente la quantità, mantenendo o cambiando la faccia. Dopo `cinque 6` sono validi, per esempio, `sei 6` e `sei 4`.
- Verifica: con `Dubito!` si scoprono tutti i dadi. Se il gruppo contiene almeno la quantità dichiarata perde un dado chi ha dubitato; altrimenti lo perde chi ha fatto la dichiarazione.
- Versione completa candidata: cinque dadi iniziali, gli 1 sono jolly e vince l'ultimo giocatore con almeno un dado.
- Versione Flash candidata: tre dadi iniziali, gli 1 valgono soltanto come 1, massimo tre round e vittoria a chi conserva più dadi.
- Gameplay dominante: bluff, deduction, social.
- Tono: competitive, party.

## Domande di playtest aperte

- `Mira 100`: verificare vantaggio dell'ordine di turno, frequenza dei bersagli esatti e intervallo migliore per i bersagli casuali.
- `Spaccato!`: verificare durata, accanimento sul leader, quantità di attacchi e frequenza dei turni senza azioni valide.
- `Poker di Dadi`: verificare se quattro e otto categorie producono davvero due durate distinte senza svuotare le decisioni.
- `Dubito!`: verificare leggibilità delle dichiarazioni, durata con gruppi numerosi e parità nella versione Flash.
