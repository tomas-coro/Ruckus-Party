# Ruckus Party - Product Definition

## Stato

`Phase 2A - UX architecture e prototipo low-fidelity: completata il 2026-08-22`

Le scelte durevoli e il loro grado di approvazione sono registrati in `docs/DECISIONS.md`. Le raccomandazioni di Phase 1 costituiscono la baseline da verificare nel prossimo workstream, non decisioni owner implicite.

## Visione

Ruckus Party è una piattaforma mobile-first di party game per almeno 2 persone presenti nella stessa stanza. Serve coppie, amici, piccoli gruppi e party.

La promessa centrale è:

> Apri l'app, riunisci i giocatori e cominci rapidamente. Ruckus Party mantiene il ritmo tra giochi diversi, risultati, conseguenze e classifica, poi chiude la serata con un finale riconoscibile.

Ruckus Party non è una raccolta statica di regole, un clone di UNO, un'app soltanto di carte, un prodotto soltanto per coppie o una raccolta di drinking game. Il dominio principale è `Game`; le carte sono una capability opzionale.

## Principi di prodotto

1. Il divertimento inizia prima della personalizzazione approfondita.
2. Il telefono dirige la serata senza monopolizzare l'attenzione.
3. Ogni gioco proposto è compatibile con persone, tempo, materiali e contenuti scelti.
4. Risultato, conseguenza e prossimo gioco formano un passaggio breve e leggibile.
5. La sessione produce sempre una conclusione, anche quando viene fermata in anticipo.

## Esperienze principali

### Party Night

È l'esperienza principale. Collega più giochi in una sessione con punteggio condiviso, conseguenze opzionali e finale.

La sessione non promette in anticipo un numero rigido di giochi. Usa la durata scelta per proporre una sequenza adattiva e non interrompe mai una partita già iniziata. Prima di proporre il gioco successivo considera tempo restante, compatibilità e varietà.

La Party Night prevede due formati di prodotto:

- **Serata libera**: conserva il percorso adattivo della V1, permette sostituzioni e può terminare dopo il gioco in corso.
- **Torneo**: è un formato competitivo Later. Blocca partecipanti, quantità, calendario e ordine dei giochi dopo la conferma iniziale. Le regole complete sono in `docs/GAME_SYSTEM.md`.

Il formato viene scelto all'avvio della Party Night. `Torneo` non è una modalità principale separata e non sostituisce il torneo autonomo di `Doppio`, che resta invariato.

### Quick Play

Avvia un solo gioco senza classifica di serata, progressione o finale Party Night. L'utente può:

- scegliere un gioco dal catalogo compatibile;
- usare `Surprise me` per ricevere subito una proposta.

`Random Play` non è una modalità separata. È l'azione `Surprise me` dentro Quick Play.

### Games

È il catalogo esplorabile. Permette di capire requisiti e varianti di un gioco e avviarlo in Quick Play. Non sostituisce Party Night.

### Mazzi Originali

`Mazzi Originali` è il nome di lavoro, non definitivo, di una raccolta futura di dieci giochi competitivi phone-only per 3-8 persone. Ogni titolo usa un mazzo digitale dedicato, dura indicativamente 5-10 minuti e può entrare in Quick Play, Serata libera o Torneo.

La raccolta non replica giochi tradizionali con carte colorate, francesi o italiane. Le carte contengono situazioni, prove, complicazioni, obiettivi e vincoli progettati per la singola meccanica. Gli stessi dieci giochi offrono contenuti 14+ come base e carte 18+ separate, sempre opt-in.

Ogni gioco include `Carta bianca`, alternativa manuale e illimitata con cui il giocatore può creare il testo richiesto dalla carta corrente. Il contenuto inserito dal giocatore non viene classificato, moderato o tradotto automaticamente. Il roster e le regole candidate sono documentati in `docs/GAME_IDEAS.md`.

### Standalone Games

I giochi più profondi e lunghi, come una futura versione completa di `Scala Flash`, sono Later. Se una variante condivide il nucleo di regole con una versione breve, resta una variante dello stesso `Game`; diventa standalone solo quando richiede un'esperienza e un flusso autonomi.

### Couple, Party e Team

`Couple` e `Party` sono preset di contenuto e tono, non modalità principali. Ogni preset rimane modificabile. `Team` è Later perché influenza risultati, punteggio e compatibilità dei giochi.

## Avvio di Party Night

### Required

- almeno 2 giocatori identificati da un display name locale;
- risorse disponibili, con `Phone only` come scelta immediata.

La `Serata libera` richiede la durata `Short`, `Standard`, `Long` oppure `Endless`. Il formato Later `Torneo` richiede invece quantità e calendario secondo `docs/GAME_SYSTEM.md`; non usa i preset di durata.

In `Serata libera`, `Standard` e `Phone only` possono essere preselezionati: sono dati necessari alla selezione, non passaggi che l'utente deve sempre compiere. I valori temporali precisi saranno validati nel prototipo e nei playtest, senza chiedere un numero esatto di giochi.

### Default applicati

- contenuti generali;
- conseguenze `Playful` in Serata libera; nel Torneo sono disattivate per default;
- giochi fisici e digitali compatibili con le risorse dichiarate;
- nessuna categoria sensibile attiva;
- selezione automatica orientata alla varietà.

I default sono sempre visibili nel riepilogo prima dell'avvio e modificabili.

### Customize

- preset `Couple` o `Party`;
- categorie di contenuto e relative esclusioni;
- contenuti romantici, alcolici o più audaci, tutti opt-in;
- intensità e attivazione delle conseguenze;
- gameplay preferiti o esclusi;
- preferenza solo fisico, solo digitale o entrambi.

Questi controlli non bloccano il percorso principale. La personalizzazione avanzata deve usare scelte brevi e preset, non un questionario obbligatorio.

## Physical, Virtual e Mixed

L'utente non sceglie una modalità astratta `Physical / Virtual / Mixed`. Dichiara cosa ha a disposizione:

- solo telefono;
- uno o più mazzi o materiali supportati.

Il sistema rende eleggibili le versioni compatibili dei giochi:

- **Physical**: il gioco avviene soprattutto fuori dall'app con materiali reali; l'app spiega, scandisce e registra il risultato.
- **Virtual**: il telefono sostituisce i materiali o gestisce la parte necessaria della partita.
- **Mixed**: è una proprietà della sequenza quando la Party Night alterna giochi Physical e Virtual.

Il riepilogo del singolo gioco mostra sempre cosa serve prima di iniziare. Se un materiale manca, l'utente può cambiare variante o sostituire il gioco.

## Core loop finale della Serata libera V1

```text
Start Party
    ↓
Players + duration + available resources
    ↓
Optional Customize
    ↓
Compatible game proposal
    ↓
Rules and required materials
    ↓
Play
    ↓
Record or confirm result
    ↓
Result reveal + score
    ↓
Optional Consequence moment
    ↓
Next compatible game or Finish session
    ↓
Final standings + recap + optional final consequence
```

La proposta del gioco successivo è automatica. `Replace` permette di riceverne un'altra e `Choose game` restituisce controllo senza uscire dalla sessione. Non serve confermare passaggi che non cambiano l'esito.

## Risultati, punteggio e finale

Ogni gioco dichiara come produce il proprio risultato. Nell'MVP un gioco può indicare uno o più vincitori, uno o più ultimi classificati oppure un esito di gruppo.

- Ogni vincitore riceve 1 punto.
- Un esito di gruppo non altera la classifica.
- I pareggi restano validi e possono produrre più campioni o più ultimi classificati.
- Tutti i giochi hanno lo stesso peso nell'MVP.

Dopo ogni gioco vengono mostrati risultato, classifica aggiornata e stato indicativo della sessione. Streak, bonus, categorie di punteggio e milestone speciali sono Later.

La sessione termina dopo il gioco in corso quando il preset di durata è soddisfatto, oppure quando l'utente sceglie `Finish session now`. Il finale usa solo risultati già registrati e comprende:

1. campione o campioni;
2. classifica e breve riepilogo;
3. conseguenza finale per l'ultimo posto, solo se abilitata e se non sono tutti a pari merito;
4. uscita verso Home oppure nuova sessione.

## Conseguenze e handicap

`Consequence moment` è un passaggio opzionale tra risultato e prossimo gioco. Il preset decide se e con quale intensità può apparire, senza obbligare una conseguenza dopo ogni partita.

Il default `Playful` propone una conseguenza breve dopo il primo risultato eleggibile, così la promessa viene sperimentata nella prima sessione. In seguito alterna giochi con e senza conseguenza; la cadenza precisa deve essere validata nei playtest.

Nell'MVP:

- le conseguenze immediate sono brevi e terminano prima del gioco successivo;
- gli handicap durano soltanto per il gioco successivo;
- ogni elemento dichiara intensità, categorie sensibili, destinatari e compatibilità;
- l'utente può sostituire o saltare una proposta senza penalità;
- il sistema evita ripetizioni ravvicinate della stessa famiglia.

Effetti persistenti, eventi speciali e milestone sono Later. Le penitenze personalizzate dall'utente sono Future.

Le ruote sono un momento teatrale riservato a conseguenze speciali o scelte che meritano suspense collettiva. La normale selezione del prossimo gioco usa una proposta immediata; non ogni scelta casuale diventa una ruota.

## Perimetro dei contenuti

Il catalogo può comprendere contenuti generali, romantici, alcolici, audaci e altre famiglie future. I contenuti sensibili:

- sono disattivati di default;
- richiedono opt-in esplicito durante `Customize`;
- possono essere esclusi per categoria;
- non vengono riattivati implicitamente da un preset;
- restano sostituibili o ignorabili durante la sessione.

L'app può suggerire preset in base al tipo di serata, ma ogni suggerimento deve mostrare cosa abilita e restare modificabile.

## Lingue della V1

L'italiano è la lingua predefinita. L'inglese è selezionabile dalla Home e dalle impostazioni della sessione. Il cambio lingua riguarda l'intera esperienza, incluse interfaccia, istruzioni dei giochi, errori e contenuti, senza modificare lo stato della Party Night.

Rilevamento automatico della lingua, account e sincronizzazione delle preferenze non sono richiesti per la V1.

## MVP

- Party Night con 2-6 giocatori locali e un dispositivo condiviso.
- Quick Play con scelta dal catalogo e `Surprise me`.
- Giochi phone-only, giochi fisici e sessioni che possono alternarli.
- Catalogo iniziale ridotto ma sufficiente a provare gameplay e materiali differenti.
- Punteggio a una vittoria, classifica, finale e `Finish session now`.
- Conseguenze immediate, handicap per il gioco successivo e controlli opt-in dei contenuti.
- Private reveal pass-and-play per segreti brevi.

## Later

- varianti standalone più lunghe;
- raccolta phone-only `Mazzi Originali`, con nome definitivo ancora aperto;
- formato `Torneo` configurabile dentro Party Night;
- preset e punteggio team;
- streak, bonus, milestone ed eventi speciali;
- effetti persistenti;
- strumenti di selezione e personalizzazione più ricchi;
- supporto a giochi digitali con stato privato più complesso.

## Future

- account e profili persistenti;
- multiplayer con più dispositivi o online;
- custom penalties e contenuti creati dagli utenti;
- storico persistente dei tornei, community, social e condivisione;
- monetizzazione, shop, abbonamenti e achievement complessi.

## Revisione critica di Phase 1

### Esito sul core loop

- **2 giocatori e gruppi da 3-6**: i metadati di compatibilità impediscono proposte invalide; Couple è un preset, non un recinto del prodotto.
- **Avvio rapido senza materiali**: `Phone only` e i default consentono di saltare `Customize`; l'MVP deve includere abbastanza giochi phone-only.
- **Physical, Virtual e Mixed**: l'utente dichiara risorse concrete e il sistema deriva la composizione, evitando un selettore tecnico.
- **Quick Play e Party Night**: il primo è una singola partita; il secondo mantiene punteggio, conseguenze e finale.
- **Ruote e conseguenze**: sono momenti selettivi, sostituibili e disattivabili; non guidano ogni scelta casuale.

### Esito su crescita e semplicità

- **Giochi senza carte e crescita oltre i primi 15**: `Game` resta il dominio centrale; materiali, varianti e supporto digitale sono faccette, non assunzioni strutturali.
- **Configurazione semplice**: solo nomi richiedono sempre input; durata e `Phone only` possono partire da default visibili, mentre contenuti e preferenze vivono in `Customize`.
- **Complessità e tempi morti**: Random Play, team, streak, milestone ed effetti persistenti sono esclusi dall'MVP; le transizioni evitano conferme senza effetto.

### Correzioni applicate

- eliminato Random Play come modalità autonoma;
- rinviati streak, milestone, team ed effetti persistenti;
- limitate le informazioni segrete a private reveal brevi su un dispositivo;
- eliminato il numero fisso di giochi dalla durata;
- resi materiali e supporto digitale proprietà del gioco, non categorie rigide del prodotto.

### Rischi da validare nel prossimo workstream

- il numero e la varietà minimi dei giochi phone-only per evitare ripetizione;
- la comprensione dei preset di durata senza tempi troppo precisi;
- la velocità reale del passaggio risultato, conseguenza e prossimo gioco;
- la chiarezza del private reveal in una stanza affollata;
- l'equilibrio tra suggerimenti utili e personalizzazione percepita.
