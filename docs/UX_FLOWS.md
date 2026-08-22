# Ruckus Party - UX Flows

## Stato

`Phase 2A - flussi e prototipo low-fidelity validati; nessuna UI definitiva`

I flussi descrivono ciò che l'utente comprende, decide e riceve. Layout, componenti e animazioni appartengono al prossimo workstream.

## Principi

- Mobile-first, portrait e un dispositivo condiviso.
- Primo gioco raggiungibile senza onboarding obbligatorio o account.
- Configurazione minima separata dalla personalizzazione.
- Un solo momento principale tra risultato e gioco successivo.
- Ogni uscita anticipata produce una conclusione comprensibile.

## First launch

1. **Vede** una breve promessa del prodotto e tre accessi: `Start Party`, `Quick Play`, `Games`.
2. **Fa** una scelta senza creare un account, accettare un tutorial lungo o configurare preferenze permanenti.
3. **Riceve** il contesto necessario dentro il flusso scelto, soltanto quando serve.
4. **Esce** verso Party Night, Quick Play o catalogo. Tornando alla Home non perde una sessione attiva senza conferma.

L'italiano è attivo al primo avvio. La Home permette di passare all'inglese; la stessa scelta resta disponibile nelle impostazioni della sessione e non azzera i dati già inseriti.

## Start Party Night

1. **Vede** l'inserimento dei giocatori e aggiunge almeno due display name locali.
2. **Sceglie** durata e risorse disponibili. `Phone only` offre il percorso più rapido.
3. **Vede** un riepilogo dei default: contenuti generali, conseguenze `Playful` e selezione varia. Può aprire `Customize`.
4. **Personalizza**, se vuole, preset, contenuti, esclusioni, intensità e preferenze. Le categorie sensibili sono sempre opt-in.
5. **Avvia** la sessione e riceve subito una proposta compatibile, con `Replace` e `Choose game` come alternative.

Se non esiste alcun gioco compatibile, l'app indica la preferenza o la risorsa che blocca l'avvio e propone una modifica esplicita. Non cambia filtri in silenzio.

## Physical game

1. **Vede** obiettivo, durata indicativa, giocatori supportati e materiali necessari.
2. **Controlla** di avere ciò che serve. Se manca qualcosa, sceglie una variante virtuale disponibile oppure sostituisce il gioco.
3. **Conferma** l'avvio, consulta le regole essenziali e gioca principalmente fuori dall'app.
4. **Ritorna** al telefono e registra il risultato nel formato previsto dal gioco.
5. **Esce** verso il reveal del risultato. Può abbandonare il gioco senza inventare un risultato e scegliere una sostituzione.

## Virtual game

1. **Vede** obiettivo, regole e ruolo del telefono: Virtual Deck, Assisted Game o Full Digital Game.
2. **Fa** le azioni richieste dall'app, che mostra soltanto lo stato necessario alla partita.
3. **Usa** il private reveal quando esistono ruoli, missioni o carte segrete brevi.
4. **Conclude** quando la condizione del gioco è soddisfatta; il risultato viene prodotto dall'app o confermato dai giocatori.
5. **Esce** verso il reveal del risultato. Errori o interruzioni mostrano se il gioco può riprendere o deve essere annullato.

## Private reveal

1. **Vede** un contenuto coperto e l'indicazione della persona a cui passare il telefono.
2. **Conferma** di essere la persona corretta prima di rivelare.
3. **Legge** il segreto e conferma di averlo memorizzato.
4. **Nasconde** il contenuto prima di restituire il dispositivo.
5. **Prosegue** soltanto quando lo schermo è di nuovo sicuro da mostrare al gruppo.

Il flusso non conserva il segreto in una cronologia consultabile durante la partita. Se il gioco richiede accesso privato continuo, non è compatibile con l'MVP.

## Game result

1. **Vede o inserisce** vincitori, ultimi classificati o esito di gruppo secondo il modello del gioco.
2. **Conferma** il risultato prima che modifichi la classifica.
3. **Riceve** un reveal breve con risultato e punto assegnato a ogni vincitore.
4. **Vede** classifica aggiornata e stato indicativo della sessione.
5. **Esce** verso il Consequence moment quando previsto, altrimenti verso il prossimo gioco.

Prima della conferma il risultato è correggibile. Dopo la conferma, una correzione resta disponibile dalla cronologia della sessione e deve rendere visibile l'effetto sul punteggio.

## Consequence moment

1. **Vede** se la conseguenza è immediata o un handicap per il prossimo gioco, chi coinvolge e quale intensità usa.
2. **Riceve** una proposta già filtrata per categorie abilitate e compatibilità.
3. **Sceglie** `Accept`, `Replace` oppure `Skip`, senza penalità aggiuntive.
4. **Conferma** il completamento di una conseguenza immediata oppure l'attivazione dell'handicap.
5. **Esce** verso il prossimo gioco. Un handicap appare nel riepilogo e scade dopo quel gioco.

Una ruota può accompagnare una conseguenza speciale, ma non è obbligatoria e non espone contenuti esclusi.

## Next game

1. **Vede** una proposta compatibile con durata restante, materiali, preferenze e handicap.
2. **Capisce** in una riga perché il gioco è adatto e quali materiali servono.
3. **Sceglie** `Play`, `Replace`, `Choose game` oppure `Finish session now`.
4. **Riceve** varietà rispetto ai giochi recenti quando il catalogo lo consente.
5. **Esce** verso il gioco scelto oppure verso il finale della sessione.

La selezione è immediata. La ruota non viene usata per rallentare ogni passaggio.

## Session ending

1. **Arriva** dopo il gioco in corso quando la durata è soddisfatta, oppure tramite `Finish session now`.
2. **Conferma** soltanto l'uscita anticipata; la conclusione naturale non richiede un passaggio ridondante.
3. **Vede** campione o campioni, classifica e breve riepilogo dei giochi svolti.
4. **Riceve** una conseguenza finale per l'ultimo posto soltanto se le conseguenze sono abilitate e non sono tutti a pari merito, con `Replace` e `Skip`.
5. **Esce** verso Home o avvia una nuova Party Night. I risultati della sessione corrente non diventano un profilo persistente nell'MVP.

Una sessione senza risultati validi termina con un riepilogo neutro e senza inventare vincitore o ultimo posto.

## Quick Play

1. **Vede** `Choose game` e `Surprise me`.
2. **Indica** numero di giocatori e risorse soltanto se non sono già disponibili nella sessione locale.
3. **Sceglie o riceve** un gioco compatibile; può applicare filtri di contenuto prima dell'avvio.
4. **Gioca** attraverso il relativo flusso Physical o Virtual e conclude la partita.
5. **Esce** verso `Play again`, scelta di un altro gioco o Home. Non entra automaticamente nella classifica Party Night.

Quick Play può mostrare una conseguenza soltanto se l'utente l'ha abilitata per quella partita. Non crea progressione di serata implicita.

## Stati trasversali da progettare nella fase successiva

- sessione attiva lasciata e poi ripresa;
- nessun gioco compatibile con i filtri correnti;
- gioco annullato prima del risultato;
- risultato errato da correggere;
- private reveal interrotto o visto dalla persona sbagliata;
- testo lungo, loading, errore, disabled, focus e reduced motion.

Questi stati sono requisiti del prossimo prototipo, non nuove feature di Phase 1.
