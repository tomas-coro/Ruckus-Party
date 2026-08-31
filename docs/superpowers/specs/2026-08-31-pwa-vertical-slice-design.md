# Ruckus Party PWA - Vertical Slice Design

## Stato

Design approvato dall'owner in chat il 2026-08-31. Questa spec traduce le decisioni approvate in un confine tecnico verificabile. Non autorizza ancora implementazione, installazione di dipendenze, commit o deploy.

## Obiettivo

Costruire la prima vertical slice interna e installabile dell'app vera:

`Home -> Serata libera -> setup -> proposta -> Segnali segreti -> conferma risultato -> classifica`

La slice deve dimostrare che architettura, offline, ripresa della sessione, private reveal, persistenza e aggiornamenti sono affidabili prima di ampliare il catalogo.

## Decisioni approvate

- PWA installabile, ottimizzata per smartphone iOS e Android.
- Funzionamento completo offline dopo la prima apertura riuscita.
- Nessun account, backend, sincronizzazione o telemetria esterna nella V1.
- Dati, diagnostica e giochi Extra restano sul dispositivo.
- Architettura web compatibile con una futura integrazione Capacitor, non inclusa ora.
- Smartphone come target primario; tablet e desktop restano responsive e usabili.
- Prime build pubblicate su GitHub Pages tramite GitHub Actions.
- Aggiornamenti controllati automaticamente all'apertura e manualmente da `Impostazioni -> Controlla aggiornamenti`; attivazione sempre esplicita e mai durante una sessione attiva.
- Giochi ufficiali e traduzioni inclusi e versionati nella PWA, senza CMS.
- Backup e importazione dei dati utente restano fuori dalla prima milestone.
- Le schede dei giochi ufficiali hanno link hash condivisibili; sessioni e risultati non sono esposti nell'URL.
- La vertical slice con un gioco è una build interna, non la release pubblica della V1.
- Torneo, Quick Play e catalogo non compaiono finché i rispettivi flussi non sono implementati.

## Scope della prima milestone

### Incluso

- shell installabile e manifest PWA;
- Home nella direzione `Petrolio festa` + `Passa la R`;
- selezione lingua italiano/inglese;
- impostazioni minime e controllo aggiornamenti;
- setup Serata libera per 2-6 giocatori;
- default `Standard` e `Solo telefono`;
- personalizzazione opzionale necessaria alla compatibilità;
- riepilogo del setup;
- proposta di `Segnali segreti`;
- private reveal coperto per ogni giocatore;
- round condiviso, accusa, risultato derivato e conferma prima del punteggio;
- classifica con un punto per vittoria;
- salvataggio automatico e ripresa della sessione;
- stati di errore e recupero definiti in questa spec;
- build, test e deploy automatico su GitHub Pages.

### Escluso

- Torneo;
- Quick Play;
- catalogo esplorabile e giochi Extra modificabili dalla UI;
- `Mirror Moves` e altri giochi;
- conseguenze, handicap, prossimo gioco e finale;
- account, backend, cloud, analytics e notifiche push;
- backup/importazione dei dati;
- Capacitor, App Store e Google Play;
- storico persistente tra Party Night;
- rilascio pubblico dichiarato come V1.

Le esclusioni non devono apparire come azioni disabilitate o promesse incomplete nella UI.

## Stack

### Runtime

- React;
- TypeScript strict;
- Vite;
- CSS Modules per componente;
- CSS globale soltanto per reset, design token, font, motion e primitive condivise;
- `idb` come wrapper Promise tipizzato di IndexedDB;
- `vite-plugin-pwa` per manifest, precache, service worker e prompt di aggiornamento.

### Verifica

- Vitest per dominio, casi d'uso, migrazioni e adapter;
- React Testing Library per comportamento e semantica dei componenti;
- Playwright per vertical slice, responsive, offline, ripresa, aggiornamenti e browser reali;
- ESLint e TypeScript per controlli statici.

Non introdurre Redux, Zustand, React Router, i18next, Tailwind, CSS-in-JS, Dexie o un framework full-stack nella prima milestone.

## Struttura proposta

```text
src/
  app/
    App.tsx
    bootstrap.ts
    providers/
    routing/
  domain/
    game/
    player/
    session/
    scoring/
    selection/
    random/
  application/
    party-night/
    game-session/
    updates/
  infrastructure/
    persistence/
    pwa/
    diagnostics/
    random/
    clock/
  content/
    games/
    translations/
  features/
    home/
    settings/
    party-setup/
    proposal/
    secret-signals/
    result/
    standings/
  ui/
    components/
    layout/
    styles/
    motion/
tests/
  e2e/
```

Ogni cartella deve avere una responsabilità leggibile. I file cresciuti oltre una singola responsabilità vanno separati prima che diventino contenitori generici.

## Confini architetturali

### Domain

Contiene regole pure e tipi senza dipendenze da React, DOM, IndexedDB o service worker. Le funzioni ricevono input espliciti e restituiscono risultati o errori tipizzati.

Responsabilità principali:

- validare giocatori e configurazione;
- determinare compatibilità ed eleggibilità dei giochi;
- produrre transizioni valide della sessione;
- gestire stato e risultato di `Segnali segreti`;
- assegnare il punto solo dopo conferma;
- mantenere RNG deterministico e seedabile;
- impedire stati impossibili tramite unioni discriminate.

Nessuna business logic usa `Math.random()`, `Date.now()`, `localStorage`, IndexedDB o API React direttamente.

### Application

Orchestra i casi d'uso e dipende da contratti, non da implementazioni concrete.

Esempi:

- `startFreeNight`;
- `updatePartySetup`;
- `confirmPartySetup`;
- `startSecretSignals`;
- `recordPrivateRevealProgress`;
- `resolveAccusation`;
- `confirmGameResult`;
- `resumeActiveSession`;
- `checkForAppUpdate`;
- `activatePendingUpdate`.

Un caso d'uso valida il comando, calcola il nuovo stato di dominio, attende il salvataggio e soltanto dopo pubblica lo stato alla UI. Se il salvataggio fallisce, mantiene lo stato precedente e restituisce un errore leggibile.

### Infrastructure

Implementa persistenza, clock, RNG, diagnostica e service worker. Gli adapter traducono errori tecnici in errori applicativi espliciti senza fallback silenziosi.

### Features e UI

Le feature compongono schermate e interazioni. Possono leggere stato e inviare comandi, ma non calcolano punteggi, compatibilità o progressione e non accedono direttamente a IndexedDB.

`useReducer` conserva lo stato della sessione visibile. Context espone soltanto sessione e servizi necessari, evitando un contenitore globale generico.

## Modello di navigazione

Un router hash minimale e tipizzato gestisce destinazioni pubbliche e condivisibili:

- `#/`;
- `#/settings`;
- in futuro `#/games/:gameId`.

La vertical slice non introduce React Router. Il router deve gestire route sconosciute mostrando una pagina recuperabile con ritorno alla Home.

Le fasi della Party Night non sono URL pubblici. La navigazione di sessione deriva da `activeSession.phase`, salvata localmente. Il pulsante indietro deve rispettare i passaggi consentiti dal dominio e chiedere conferma quando l'uscita può perdere una scelta non salvata.

## Stato e transizioni

`ActiveSession` usa una unione discriminata o un equivalente che renda esplicite almeno queste fasi:

- `setupPlayers`;
- `setupPreferences`;
- `setupReview`;
- `proposal`;
- `privateRevealCovered`;
- `privateRevealReady`;
- `sharedRound`;
- `resultPendingConfirmation`;
- `standings`.

Ogni transizione deve dichiarare:

- comando accettato;
- precondizioni;
- nuovo stato;
- effetto persistente;
- errore restituito se la transizione non è valida.

La UI non può saltare una fase modificando direttamente una stringa di schermata.

## Casualità

All'avvio della sessione viene creato un seed tramite Web Crypto. Il seed e la posizione del generatore vengono salvati nell'active session. Il dominio riceve un'interfaccia `RandomSource`, così test e ripresa producono risultati deterministici.

La casualità serve a selezione, ordine e contenuti che la richiedono. Non deve alterare retroattivamente un risultato già confermato.

## Persistenza

### Database

IndexedDB contiene store separati per:

- `meta`: schema, versione contenuti e versione app nota;
- `settings`: lingua e preferenze locali;
- `activeSession`: al massimo una Party Night attiva;
- `diagnostics`: eventi tecnici locali con capienza limitata.

Lo store `extraGames` viene aggiunto tramite una migrazione soltanto quando entra il relativo workstream. La prima slice non crea strutture inutilizzate.

`ActiveSession` conserva almeno:

- schema e content version;
- id locale;
- fase corrente;
- giocatori e impostazioni;
- punteggi;
- gioco e stato del gioco corrente;
- risultato in attesa o confermato;
- seed e stato RNG;
- timestamp ottenuti da un `Clock` iniettato.

### Regole di salvataggio

- Salvare dopo ogni transizione di dominio accettata.
- Non salvare lo stato visuale `revealed: true` del private reveal.
- Dopo refresh o riapertura, riprendere sempre da una schermata coperta prima di mostrare contenuti privati.
- Non cancellare una sessione perché la lettura o migrazione è fallita.
- Non usare `localStorage` come repository del dominio.

### Migrazioni

Ogni schema IndexedDB ha una migrazione esplicita e testata. Le migrazioni avvengono in transazione. In caso di errore:

1. non avviare una nuova sessione sopra i dati esistenti;
2. mostrare causa comprensibile e azione `Riprova`;
3. offrire esportazione della diagnostica locale;
4. mostrare `Reimposta dati` soltanto come azione separata e confermata.

Il reset non è un fallback automatico.

## Offline e asset

La build include localmente:

- shell HTML/CSS/JS;
- manifest e icone;
- font della direzione approvata;
- immagini necessarie alla slice;
- traduzioni;
- definizione e contenuti di `Segnali segreti`.

Il service worker precache questi asset. Dopo il primo caricamento completato, l'intera vertical slice deve funzionare in modalità offline. Nessun contenuto essenziale dipende da CDN o font remoti.

La UI mostra una conferma `Pronta per giocare offline` quando il precache iniziale termina. Se il primo caricamento non completa il precache, l'app indica chiaramente che l'offline non è ancora disponibile.

## Aggiornamenti

Il service worker usa una strategia a prompt, non auto reload.

### Controllo automatico

- eseguito all'apertura quando esiste rete;
- silenzioso se non ci sono novità;
- segnala `Aggiornamento pronto` quando una nuova build è installata e in attesa.

### Controllo manuale

`Impostazioni -> Controlla aggiornamenti` forza il controllo della registrazione del service worker e mostra uno stato esplicito:

- controllo in corso;
- app aggiornata;
- aggiornamento pronto;
- offline;
- errore con azione `Riprova`.

### Attivazione

- senza sessione attiva: `Installa e riavvia` attiva la nuova build;
- con sessione attiva: l'azione predefinita è `Installa dopo la Party Night`;
- un'eventuale attivazione immediata durante la sessione richiede avviso esplicito e non fa parte della prima slice;
- una build nuova non deve auto ricaricare la pagina.

Il push su `main` non è il segnale letto dall'app. L'aggiornamento diventa disponibile soltanto dopo un deploy GitHub Pages completato.

## Contenuti e giochi

I giochi ufficiali sono definizioni locali versionate. Ogni `GameDefinition` dichiara almeno:

- id stabile;
- chiavi localizzate di nome, descrizione e regole;
- numero minimo e massimo di giocatori;
- requisiti materiali;
- supporto Physical o Virtual;
- categorie di contenuto;
- tipo di risultato;
- compatibilità con conseguenze e handicap;
- factory o reducer dello stato specifico del gioco.

Il dominio principale resta `Game`, non `CardGame`. `Segnali segreti` implementa un contratto di gioco senza introdurre condizioni speciali nel codice generico di Party Night.

## Segnali segreti

La slice implementa il gioco fino al risultato reale:

1. crea assegnazioni private tramite RNG iniettato;
2. mostra una schermata coperta prima di ogni reveal;
3. richiede conferma della persona corretta;
4. consente reveal accessibile tramite pressione o tocco esplicito;
5. nasconde il contenuto prima del passaggio;
6. passa alla schermata condivisa soltanto quando tutti hanno completato il reveal;
7. registra l'accusa condivisa;
8. deriva il vincitore dalle regole del gioco;
9. mostra un risultato correggibile;
10. assegna il punto soltanto dopo conferma.

Un'interruzione, refresh o riapertura durante il reveal non deve mai mostrare direttamente il segreto.

## Localizzazione

Italiano è predefinito; inglese è selezionabile e non modifica la sessione.

La soluzione usa:

- union type per tutte le translation key;
- dizionari locali con parità verificata in test;
- `Intl.PluralRules`, `Intl.ListFormat` e `Intl.NumberFormat` per contenuti dinamici;
- contenuti ufficiali localizzati per chiave, non tramite sostituzione del testo renderizzato.

Mancanze di traduzione falliscono in sviluppo e test. In produzione mostrano un errore diagnostico esplicito, non una stringa vuota.

## Error handling

Gli errori applicativi sono tipizzati almeno per:

- input invalido;
- transizione non consentita;
- storage non disponibile;
- lettura o scrittura fallita;
- migrazione fallita;
- contenuto o traduzione mancante;
- update offline;
- controllo update fallito;
- route sconosciuta.

Ogni errore presenta:

- cosa non è riuscito;
- se lo stato precedente è salvo;
- una sola azione primaria di recupero;
- diagnostica tecnica locale senza dati personali non necessari.

Catch vuoti, reset automatici e fallback incompatibili sono vietati.

## Privacy e diagnostica

- Nessun dato lascia il dispositivo.
- Nessun identificatore utente o dispositivo viene creato.
- I nomi dei giocatori restano dentro l'active session locale.
- La diagnostica usa codici tecnici e contesto minimo; non registra segreti mostrati, contenuti privati o nomi dei giocatori.
- L'esportazione diagnostica avviene soltanto su azione manuale.
- La diagnostica ha limite di dimensione e rotazione locale definita nell'implementazione.

## UI, responsive e accessibilità

La UI trasferisce il prototipo approvato senza copiarne la struttura monolitica. I componenti usano design token condivisi per palette, tipografia, spazio, bordi, motion e z-index.

Requisiti:

- target touch almeno 44x44 CSS px;
- smartphone portrait primario a 375 e 430 CSS px;
- landscape usabile senza overflow;
- tablet e desktop responsive ma secondari;
- focus visibile e ordine tastiera coerente;
- label e messaggi di errore associati ai campi;
- modal con focus contenuto e sfondo bloccato;
- nessun significato affidato soltanto al colore;
- `prefers-reduced-motion` rispettato;
- testi lunghi e nomi realistici senza sovrapposizioni;
- contenuto essenziale visibile senza hover.

## Strategia di test

### Unit

- validazione giocatori e setup;
- transizioni ammesse e vietate;
- compatibilità del gioco;
- RNG deterministico;
- assegnazioni e risultato di `Segnali segreti`;
- conferma e correzione del risultato;
- punteggio;
- repository contract con fake;
- migrazioni di schema;
- parità delle traduzioni.

### Component

- campi e messaggi di errore;
- CTA abilitate/disabilitate;
- private reveal coperto e accessibile;
- conferma risultato;
- prompt aggiornamento;
- stati storage e offline;
- focus e label semantiche.

### End-to-end

- primo avvio e offline ready;
- installabilità PWA;
- vertical slice completa in italiano e inglese;
- refresh e riapertura in ogni fase critica;
- refresh durante private reveal con ritorno coperto;
- risultato non conteggiato prima della conferma;
- sessione ripresa offline;
- aggiornamento pronto con e senza sessione attiva;
- errore storage e migrazione simulati;
- 375, 430 e landscape;
- Chromium mobile e WebKit mobile;
- reduced motion;
- assenza di errori JavaScript e asset mancanti.

## CI e deploy

Usare npm con lockfile committato.

Ogni pull request e push rilevante esegue:

1. installazione riproducibile;
2. lint;
3. typecheck;
4. unit e component test;
5. build;
6. test end-to-end previsti per il gate.

Il workflow di deploy parte soltanto su `main` e pubblica `dist/` su GitHub Pages dopo tutti i controlli verdi. La configurazione Vite deve usare il base path del repository `Ruckus-Party` e restare modificabile per un futuro dominio.

Un deploy fallito non invalida la versione già presente nella cache degli utenti.

## Definition of Done della vertical slice

La milestone è completata soltanto quando:

- tutti i comportamenti inclusi sono implementati senza feature escluse visibili;
- lint, typecheck, test e build passano sullo stato corrente;
- la PWA è installabile da GitHub Pages;
- la slice funziona offline dopo il primo caricamento;
- una sessione può essere ripresa senza perdita o salto di fase;
- private reveal non espone contenuti dopo refresh o riapertura;
- una scrittura fallita non modifica lo stato confermato né cancella dati;
- un aggiornamento non ricarica durante una sessione;
- QA visuale e interattivo passa sui viewport e browser definiti;
- documentazione, decisioni e limiti riflettono il comportamento reale;
- nessun account, backend, analytics, Torneo, Quick Play o catalogo incompleto è stato aggiunto.

## Passaggio successivo

Dopo l'approvazione owner di questa spec:

1. creare il piano di implementazione dettagliato con milestone e test-first;
2. proporre le dipendenze esatte e verificarne versioni e licenze;
3. implementare la vertical slice senza espandere lo scope;
4. usare la build interna per playtest e decisione sul catalogo minimo pubblico.
