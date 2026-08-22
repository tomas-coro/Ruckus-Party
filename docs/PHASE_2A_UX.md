# Ruckus Party - Phase 2A UX Architecture

## Stato

`Phase 2A completata e validata dall'owner il 2026-08-22`

Questo documento traduce i requisiti di Phase 1 in information architecture e flussi mobile-first. Non definisce branding, componenti definitivi, stack tecnico, backend o codice prodotto.

## Obiettivo del workstream

Validare due percorsi su un dispositivo condiviso:

1. apertura dell'app fino al primo gioco compatibile;
2. passaggio tra risultato, conseguenza opzionale e gioco successivo.

Il prototipo deve inoltre rendere verificabili Physical, Virtual, private reveal, uscita anticipata e principali stati di errore.

## Principi UX

- La Home orienta, ma la Party Night attiva diventa un percorso dedicato.
- Ogni schermata di sessione ha una sola azione primaria.
- I default accelerano l'avvio, ma restano visibili prima di iniziare.
- Il telefono dirige la serata e torna in secondo piano durante i giochi fisici.
- Errori e incompatibilità spiegano cosa blocca il flusso e quale scelta può correggerlo.

## Information architecture

```text
Home
|-- Start Party
|   |-- Players
|   |-- Duration and materials
|   |-- Ready to start
|   |   `-- Customize
|   `-- Active Party Night
|       |-- Game proposal
|       |-- Game preparation
|       |-- Physical or Virtual play
|       |-- Result entry
|       |-- Result reveal and standings
|       |-- Optional consequence
|       |-- Next game proposal
|       `-- Session ending
|-- Quick Play
|   |-- Surprise me
|   |-- Choose game
|   `-- Single game flow
`-- Games
    |-- Catalog
    `-- Game detail
```

## Regole di navigazione

- `Start Party` è l'azione dominante della Home.
- `Quick Play` comunica esplicitamente che avvia una sola partita senza classifica di serata.
- `Games` è il catalogo esplorabile e non appare come una terza modalità equivalente.
- Se esiste una sessione attiva, `Resume Party` sostituisce l'azione dominante della Home.
- Durante una Party Night non esiste una bottom navigation globale.
- Un menu sessione raccoglie classifica, cronologia, impostazioni e `Finish session now`.
- Uscire dalla sessione attiva verso Home richiede conferma; la sessione resta riprendibile.

## Lingua della V1

- L'italiano è la lingua predefinita del prodotto.
- L'utente può passare all'inglese dalla Home o dalle impostazioni della sessione.
- Il cambio lingua non altera giocatori, filtri, sessione o risultati.
- Interfaccia, istruzioni dei giochi, errori e contenuti devono usare la stessa lingua attiva.
- Il prototipo non introduce rilevamento automatico, account o preferenze cloud.

## Flusso da apertura a primo gioco

### 1. Home

La promessa è breve. Le descrizioni distinguono le tre destinazioni:

- `Start Party`: più giochi, classifica e finale;
- `Quick Play`: una sola partita;
- `Games`: esplora il catalogo.

### 2. Players

- Due campi nome sono visibili all'apertura.
- `Add player` aggiunge un campo fino al massimo MVP di sei.
- `Continue` resta disabled finché almeno due nomi validi non sono presenti.
- La validazione appare accanto al campo interessato e non cancella gli altri nomi.

### 3. Duration and materials

- `Standard` e `Phone only` sono preselezionati e modificabili.
- La durata usa etichette qualitative. Eventuali intervalli in minuti nel prototipo sono test copy e non decisioni finali.
- Le risorse sono concrete, come telefono o mazzo francese, non categorie Physical o Virtual.

### 4. Ready to start

Il riepilogo mostra giocatori, durata, materiali, contenuti generali, conseguenze `Playful` e selezione varia. `Customize` apre controlli opzionali senza inserirli nel percorso obbligatorio.

### 5. Game proposal

La proposta mostra titolo, obiettivo, durata, materiali e una riga che spiega la compatibilità. Le azioni sono:

- `Play`, primaria;
- `Replace`;
- `Choose game`;
- menu sessione.

Se nessun gioco è compatibile, il sistema nomina il vincolo bloccante e offre una modifica esplicita. Non cambia filtri o materiali in silenzio.

## Flussi di gioco

### Physical

1. Mostra obiettivo, materiali e regole essenziali.
2. Permette di confermare i materiali, usare una variante virtuale o sostituire il gioco.
3. Dopo `Start`, riduce l'interfaccia a stato della sessione e `Record result`.
4. Un annullamento non inventa un risultato e offre `Retry` o `Replace game`.

### Virtual

1. Spiega prima dell'avvio se il telefono funge da Virtual Deck, Assisted Game o Full Digital Game.
2. Durante la partita mostra soltanto lo stato necessario.
3. Un'interruzione comunica se il gioco può riprendere o deve essere annullato.

### Private reveal

1. Schermo coperto con indicazione della persona a cui passare il telefono.
2. Conferma dell'identità prima del reveal.
3. Pressione continua per mostrare il segreto; il rilascio lo nasconde immediatamente.
4. Alternativa accessibile a due tocchi, attivabile nello stesso flusso.
5. Conferma di memorizzazione prima di passare alla persona successiva.
6. Nessun segreto resta nella cronologia o in una schermata visibile al gruppo.

## Risultato, conseguenza e prossimo gioco

Il passaggio usa tre momenti full-screen distinti:

1. risultato e punto assegnato;
2. conseguenza, solo quando prevista;
3. proposta del prossimo gioco.

Prima della conferma il risultato è correggibile. Dopo la conferma, la cronologia permette una correzione e mostra l'effetto sul punteggio.

La conseguenza offre sempre `Accept`, `Replace` e `Skip`. Un handicap accettato compare nella proposta del prossimo gioco e scade dopo quel gioco.

## Fine sessione

- `Finish session now` richiede conferma e usa soltanto risultati già registrati.
- La fine naturale non richiede una conferma ridondante.
- Il finale mostra campione o campioni, classifica, giochi svolti e conseguenza finale quando applicabile.
- Una sessione senza risultati validi termina con un riepilogo neutro.

## Quick Play e Games

- Quick Play parte da `Surprise me` o `Choose game`, raccoglie solo giocatori e risorse mancanti e non crea progressione Party Night.
- Games permette di esplorare requisiti e varianti e avvia il gioco scelto in Quick Play.
- Una conseguenza in Quick Play compare soltanto se abilitata esplicitamente per quella partita.

## Stati trasversali richiesti nel prototipo

- sessione attiva lasciata e ripresa;
- nessun gioco compatibile;
- gioco annullato prima del risultato;
- risultato errato e correzione dalla cronologia;
- private reveal interrotto o visto dalla persona sbagliata;
- loading, errore, disabled, focus, testo lungo e reduced motion.

## Criteri di validazione owner

Il prototipo è approvabile quando permette di verificare:

- differenza immediata tra Party Night, Quick Play e Games;
- comprensione della lingua predefinita e del passaggio completo all'inglese;
- comprensione dei dati richiesti prima del primo gioco;
- visibilità di durata, materiali e contenuti attivi;
- ritmo breve e leggibile tra due giochi;
- recupero esplicito da errore, annullamento e uscita anticipata.

## Fuori scope

Branding definitivo, UI high-fidelity, catalogo finale, codice prodotto, backend, account, monetizzazione, multiplayer online e sistemi tecnici appartengono a workstream successivi.

## Verifica conclusiva

- Struttura Session-first e setup in tre schermate approvati dall'owner.
- Core loop, uscita anticipata e private reveal approvati dall'owner.
- Italiano predefinito e inglese selezionabile verificati nel prototipo.
- Percorso principale e stati critici verificati a 375 px portrait e 812 x 375 px landscape.
- Verificati tap target di almeno 44 px, assenza di overflow della pagina, blocco dello sfondo nei modal e reduced motion.

## Limitazioni da portare avanti

- Gli intervalli in minuti dei preset di durata restano test copy da validare con playtest reali.
- Il prototipo valida struttura e comprensione, non qualità o varietà del catalogo iniziale.
- Palette, tipografia e stile sono intenzionalmente provvisori e non costituiscono il branding finale.
