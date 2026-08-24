# Ruckus Party - Game System

## Stato

`Phase 1 - requisiti di prodotto completati; nessuno schema TypeScript definito`

Questo documento stabilisce le informazioni e le regole di prodotto. Strutture dati, API e algoritmi appartengono alle fasi successive.

## Principio di dominio

L'entità principale è `Game`, non `CardGame`. Le carte sono una capability opzionale. L'aggiunta di un gioco non deve richiedere modifiche profonde al prodotto e il sistema non assume quantità fisse di giochi, categorie o mazzi.

## Definizione minima di un Game

Ogni gioco deve descrivere soltanto dati che influenzano eleggibilità, comprensione, esecuzione o risultato.

### Identità e comprensione

- identificatore stabile, titolo e descrizione breve;
- istruzioni essenziali e condizione di fine;
- durata indicativa e livello di complessità;
- variante disponibile, se quick e completa condividono lo stesso nucleo.

### Compatibilità

- minimo e massimo di giocatori;
- supporto individuale o team;
- materiali richiesti e sostituzioni offerte dall'app;
- modalità di supporto digitale disponibili;
- requisiti di informazioni segrete;
- categorie di contenuto e intensità.

### Esperienza

- uno o due tag di gameplay dominanti, come bluff, luck, strategy, memory, speed, social, reaction, trivia o challenge;
- uno o due tag di tono, come chill, competitive, chaotic, couple o party;
- modello di risultato;
- compatibilità con conseguenze e handicap.

Questi valori sono faccette di filtro, non una gerarchia rigida. I mazzi `Colored Deck`, `French Deck` e `Italian Deck` sono materiali, non categorie di esperienza.

## Materiali e supporto digitale

Un gioco può offrire più modi compatibili di essere giocato:

- **Physical**: materiali reali e partita principalmente fuori dall'app.
- **Virtual Deck**: l'app sostituisce il materiale casuale, come un mazzo o una pescata.
- **Assisted Game**: l'app gestisce anche turni, timer, punteggio o stato pubblico.
- **Full Digital Game**: l'intera partita rilevante avviene nell'app.

La distinzione è utile perché cambia istruzioni e flusso. Non viene presentata come scelta tecnica all'avvio della sessione. L'utente dichiara le risorse disponibili e vede soltanto versioni giocabili.

`Mixed` non è un livello del singolo gioco. Descrive una Party Night che alterna versioni Physical e Virtual.

## Mazzi digitali originali

Una raccolta può raggruppare giochi che usano carte digitali progettate appositamente, senza trasformare `Game` in `CardGame`. Ogni gioco mantiene un mazzo dedicato e non deve condividere struttura, tono o meccanica con gli altri titoli della raccolta.

La raccolta con nome di lavoro `Mazzi Originali` applica queste regole:

- 3-8 giocatori, con esperienza ideale da validare tra 4 e 6;
- 5-10 minuti per gioco;
- otto giochi individuali e due con alleanze temporanee;
- nessuna eliminazione e partecipazione attiva fino alla fine;
- votazioni pubbliche o segrete secondo la meccanica;
- contenuti 14+ disponibili di base e mazzi 18+ separati, sempre opt-in;
- possibilità illimitata di saltare una carta senza penalità;
- `Carta bianca` manuale e sempre disponibile al posto di una carta preparata.

`Carta bianca` conserva la funzione richiesta dal gioco, come situazione, prova, risposta, complicazione o obiettivo. Il contenuto creato dal giocatore non riceve classificazione 14+/18+, moderazione o traduzione automatica.

## Varianti quick e standalone

Una variante resta parte dello stesso `Game` quando mantiene identità, obiettivo e regole centrali, modificando durata o profondità. La selezione può scegliere la variante più adatta al tempo restante.

Un gioco diventa standalone quando richiede configurazione, stato o loop propri e non trae valore dal ritmo di Party Night. Le varianti standalone lunghe sono Later. L'MVP privilegia versioni brevi compatibili con Party Night e Quick Play.

## Modelli di risultato

Un gioco deve dichiarare quale risultato può registrare:

- uno o più vincitori;
- uno o più ultimi classificati;
- vincitori e ultimi classificati;
- esito di gruppo senza punteggio individuale.

Nell'MVP ogni vincitore riceve 1 punto. Un esito di gruppo non modifica la classifica. Il gioco deve indicare quali partecipanti sono eleggibili per una conseguenza, senza dedurlo dalla UI.

Classifiche complete, pesi diversi e punteggi specifici del gioco possono esistere dentro il gioco, ma non alterano il punteggio Party Night nell'MVP.

## Selezione del prossimo gioco

Phase 1 non definisce un algoritmo. Stabilisce due livelli di regole.

### Vincoli obbligatori

Un gioco o una variante è eleggibile soltanto se:

- supporta il numero e la struttura dei giocatori;
- può essere giocato con i materiali dichiarati o con una sostituzione digitale disponibile;
- rientra nei contenuti e nell'intensità abilitati;
- è adatto al tempo restante oppure la sessione è `Endless`;
- gestisce le informazioni segrete con le capability disponibili;
- è compatibile con eventuali handicap attivi.

Se nessun gioco soddisfa tutti i vincoli, il sistema mostra chiaramente quale preferenza impedisce la selezione e propone di modificarla. Non sceglie in silenzio un gioco incompatibile.

### Preferenze di varietà

Tra i giochi eleggibili, la selezione preferisce:

- giochi non ancora svolti nella sessione;
- un gameplay diverso dai giochi appena conclusi;
- alternanza ragionevole tra materiali e supporto digitale;
- intensità coerente con il momento della sessione;
- minore ripetizione di fortuna, attività fisica e conseguenze della stessa famiglia.

Queste sono priorità morbide. Non devono bloccare una sessione con un catalogo iniziale ridotto.

## Controllo dell'utente

Party Night propone automaticamente il prossimo gioco. L'utente può:

- accettarlo;
- chiedere `Replace` per una nuova proposta compatibile;
- aprire `Choose game` e scegliere tra i giochi compatibili;
- terminare la sessione.

Quick Play offre `Choose game` e `Surprise me`. La scelta casuale normale è immediata.

## Formato Torneo generale

`Torneo` è un formato configurabile dentro Party Night, distinto dalla `Serata libera` adattiva e dal torneo autonomo di `Doppio`. È Later e questa definizione non ne autorizza l'implementazione nella V1.

### Composizione e blocco

- quantità predefinite da 5, 10 o 15 giochi;
- quantità manuale da un minimo di 5 fino al numero di giochi unici compatibili;
- selezione automatica filtrata per raccolte, materiali e contenuti oppure scelta manuale dei singoli titoli;
- calendario completo con ordine e materiali mostrato prima della partenza;
- possibilità di rigenerare o modificare il calendario prima della conferma;
- partecipanti, quantità, giochi e ordine bloccati dopo l'avvio;
- nessuna ripetizione nel calendario iniziale.

Se i filtri non producono abbastanza giochi unici, il torneo non parte. Ruckus nomina il vincolo e chiede di ridurre la quantità oppure ampliare raccolte, materiali o contenuti, senza modificare le scelte in silenzio.

Dopo l'avvio non sono disponibili `Replace` o `Choose game`. Le sole eccezioni al calendario bloccato sono una sostituzione necessaria dopo un ritiro e i giochi supplementari di spareggio.

### Punteggio e spareggio

Ogni vincitore di un gioco riceve 1 punto torneo. Un pareggio nel singolo gioco assegna 1 punto a ciascun vincitore. Al termine deve esistere un solo campione:

1. partecipano allo spareggio soltanto i pari merito in testa;
2. scelgono tra estrazione casuale e selezione esplicita di un gioco compatibile non ancora disputato;
3. se il nuovo gioco produce un altro pareggio, lo spareggio continua;
4. esauriti i giochi compatibili non disputati, Ruckus può estrarre casualmente un gioco già giocato dai finalisti;
5. non sono previsti co-campioni.

### Conseguenze, ritiro e storico

Le conseguenze immediate sono opzionali e disattivate per default. Gli handicap per il gioco successivo non sono compatibili con il Torneo, perché alterano il percorso competitivo.

Un partecipante può dichiarare `Ritiro`: esce dalla classifica e i suoi punti vengono esclusi. Ruckus sostituisce soltanto i giochi futuri diventati incompatibili con il nuovo numero di partecipanti e registra il ritiro nel riepilogo.

La V1 conserva soltanto il riepilogo finale della sessione. Lo storico persistente futuro comprenderà almeno vincitore, partecipanti, giochi, punti, spareggi e ritiri.

## Ruote e casualità

La ruota è una firma teatrale, non il motore di ogni scelta casuale.

- **Wheel**: conseguenza speciale o scelta che merita suspense collettiva.
- **Instant random selection**: `Surprise me`, sostituzione rapida e scelte senza valore cerimoniale.
- **Player choice**: contenuti sensibili, sostituzione di una proposta, scelta manuale e decisioni che richiedono consenso.

Una ruota non aggira filtri, compatibilità o esclusioni.

## Consequence system

`Consequence` è il termine di prodotto che comprende penitenze immediate e handicap. Ogni elemento dichiara:

- tipo e istruzione;
- destinatario o regola di assegnazione;
- intensità e categorie sensibili;
- durata;
- giochi e contesti compatibili;
- famiglia usata per evitare ripetizioni.

Nell'MVP esistono:

- **Immediate**: si conclude prima del gioco successivo;
- **Next game handicap**: modifica soltanto il prossimo gioco compatibile.

Sono sempre disponibili `Replace` e `Skip`. Un handicap incompatibile non viene proposto e non viene trasferito silenziosamente a un gioco futuro.

Effetti persistenti ed eventi speciali sono Later. Le conseguenze personalizzate dall'utente sono Future.

## Player nell'MVP

Il giocatore locale necessita di:

- identità di sessione e display name;
- punteggio Party Night;
- risultati registrati;
- eventuale handicap attivo per il prossimo gioco.

Account, profili persistenti, statistiche storiche e progressione tra sessioni sono fuori dall'MVP.

## Informazioni segrete su dispositivo condiviso

L'MVP supporta `private reveal` brevi in pass-and-play:

1. lo schermo coperto indica a chi passare il telefono;
2. il giocatore conferma di essere pronto;
3. il contenuto segreto viene mostrato;
4. il giocatore lo nasconde prima di restituire il dispositivo;
5. il flusso prosegue senza lasciare il segreto nella cronologia visibile.

Sono compatibili ruoli, missioni o singole carte da memorizzare. Sono fuori dall'MVP mani private da consultare continuamente, stato segreto simultaneo e giochi che richiedono più dispositivi.

## Criteri di validazione per il prossimo workstream

- ogni gioco candidato è giocabile con 2 persone oppure dichiara chiaramente un minimo superiore;
- il catalogo complessivo offre una selezione realistica per gruppi da 3-6;
- esistono abbastanza opzioni phone-only per iniziare senza materiali;
- le regole di risultato alimentano punteggio e conseguenze senza interpretazioni manuali;
- una sequenza proposta evita incompatibilità e rende comprensibile ogni sostituzione.
