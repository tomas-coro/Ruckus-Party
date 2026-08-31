# Phase 2B - Visual direction, design system e high-fidelity prototype

## Stato

`Manifesto Sociale` è stata approvata dall'owner il 2026-08-22 come base della V1. `Petrolio festa` è stata approvata dall'owner il 2026-08-29 come affinamento high-fidelity: trasferisce nel prototipo una palette petrolio, una nuova coppia tipografica e motion indipendente per ruota, dado e carte. Il sistema logo `Passa la R` resta quello approvato in D-021.

## Obiettivo

Trasformare i flussi mobile approvati in Phase 2A in un'identità visiva distintiva, leggibile durante una festa e coerente dall'apertura al finale della Party Night.

Phase 2B non include codice prodotto, backend, account, multiplayer online, persistence reale, catalogo definitivo o branding commerciale finale.

## Direzioni confrontate

### Manifesto Sociale - selezionata e affinata

- Mood: energico, adulto, diretto e sociale.
- Riferimento: manifesti culturali italiani contemporanei e inviti editoriali.
- Firma: wordmark tipografico, ruota centrale, dado e carte come oggetti di gioco, con barre di sessione più calme durante il percorso.
- Motivo: comunica subito un evento condiviso senza usare codici infantili, da nightlife o da UI SaaS.

### Sala Giochi Civile

- Mood: ordinato, competitivo e analogico.
- Riferimento: fogli punteggio, circoli sociali e tabelloni da tavolo.
- Tradeoff: molto leggibile, ma più competitivo e meno spontaneo.

### Cartoline in Movimento

- Mood: conviviale, caldo ed espressivo.
- Riferimento: inviti risograph e ritagli di carta.
- Tradeoff: molto accogliente, ma più facile da spingere verso un tono infantile.

Confronto cliccabile: `mockups/01-phase-2b-direzioni.html`.

### Petrolio festa - candidato più recente, non approvato

- Mood: energico, adulto, materico e sociale, senza codici nightlife.
- Riferimento: grafica da festa stampata, tipografia da manifesto e oggetti analogici da tavolo.
- Palette candidata: Petrol `#0D3432`, Petrol Deep `#132824`, Mandarin `#FF643B`, Honey `#F7C64B`, Shell `#FFF0D1` e Mint `#6FD2B8`.
- Tipografia candidata: `Archivo Black` per wordmark e titoli espressivi, `Libre Franklin` per interfaccia e corpo.
- Motion candidata: ruota con fermo immobile, dado 3D con risultato leggibile e quattro assi mescolati e rivelati; ogni gesto termina senza loop.
- Tradeoff: migliora carattere e calore, ma modifica palette e tipografia approvate nella baseline e richiede quindi un nuovo gate owner.

Confronto motion verificabile: `mockups/06-petrolio-festa-motion.html`. Il relativo controllo automatico vive in `mockups/06-petrolio-festa-motion.test.cjs`.

### Sistema logo approvato - Passa la R

- Lockup: due aree Mint e Mandarin si scontrano su Petrol Deep; la tessera Honey con la R appare soltanto al contatto e `PARTY` viene rivelato dopo l'impatto.
- Icona Home: R Honey dominante su Petrol Deep, con due innesti laterali Mint e Mandarin. Non comprime il lockup completo nel quadrato.
- Motion: evento singolo senza loop, con stato finale stabile. In reduced motion logo, R e `PARTY` sono visibili immediatamente.
- Riduzioni verificate: 16, 32, 64 e 96 CSS px.
- Stato: approvato dall'owner il 2026-08-23 in D-021 e trasferito nel prototipo high-fidelity. L'approvazione e il trasferimento del logo non approvano automaticamente D-020.

Mockup approvato: `mockups/11-passa-la-r-motion-focused.html`. QA automatico: `mockups/11-passa-la-r-motion-focused.test.cjs`.

## Design system baseline approvato - Manifesto Sociale

### Principi

1. La serata è il soggetto principale, non il catalogo.
2. Ogni schermata ha una sola azione dominante.
3. Il colore segnala azione, avanzamento o stato, non decora casualmente.
4. La Home è espressiva e irregolare; setup e gioco sono più calmi senza perdere identità.
5. Il telefono guida il ritmo e poi torna in secondo piano quando il gioco è fisico.

### Palette

| Token | Valore | Ruolo |
|---|---:|---|
| `Aubergine` | `#0D0818` | Atmosfera Home, cornice del dispositivo e superfici private |
| `Ink` | `#1B1230` | Testo, bordi e controlli ad alta enfasi |
| `Ivory` | `#F7EFD9` | Superficie principale leggibile |
| `Ivory Deep` | `#EADFC5` | Superfici secondarie e separazione tra livelli |
| `Coral` | `#FF4B3E` | Azione primaria, energia e risultati principali |
| `Coral Dark` | `#D93A2E` | Stato premuto e profondità delle azioni |
| `Gold` | `#FFC53D` | Caso, selezione, progresso e accento della ruota |
| `Teal` | `#1F6F5C` | Giochi Physical, conferma positiva e supporto |
| `Danger` | `#B72F3C` | Errore e azione distruttiva |
| `Focus` | `#FFD66B` | Focus visibile da tastiera su superfici scure e chiare |

Ogni colore ha un compito stabile. Coral non segnala selezione, Gold non sostituisce l'azione primaria e Teal non appare come decorazione generica. Ivory mantiene le istruzioni calme; Aubergine costruisce l'atmosfera senza trasformare tutte le schermate in dark mode.

### Tipografia

- Unica famiglia: `Montserrat`, peso 400-900.
- Wordmark e titoli Home: peso 900, circa 44-58 CSS px, line-height 0.88-0.98.
- Titoli operativi mobile: peso 800-900, circa 34-42 CSS px, line-height 0.95-1.05.
- Corpo: peso 400-500, almeno 15 CSS px nel prototipo, line-height circa 1.5.
- Label e controlli: peso 700-800; maiuscolo riservato a contesto, stato e navigazione.

I titoli devono usare `text-wrap: balance`; corpo e istruzioni `text-wrap: pretty`. Testi localizzati più lunghi non devono essere risolti riducendo il corpo sotto la soglia leggibile.

### Spazio e forma

- Scala base: 4, 8, 12, 16, 24, 32 e 48 CSS px.
- Tap target: almeno 44x44 CSS px, normalmente 48-60 px.
- Raggio dei controlli: 12-14 px; superfici memorabili fino a 18-20 px; pillole solo per metadati compatti.
- Bordi Aubergine da 1-3 px per costruire gerarchia senza ombre diffuse.
- Ombra rigida e corta soltanto su azioni primarie, risultati e oggetti di gioco.

### Componenti chiave

- `Home stage`: wordmark, ruota, dado e carte costruiscono una sola composizione, non una griglia di funzionalità.
- `Party wheel`: interazione di marca cliccabile e animata; crea un piccolo momento casuale ma non sceglie il gioco e non sostituisce `Start Party`.
- `Game objects`: dado e carte sono oggetti vettoriali scenici in Home e ricompaiono soltanto quando coerenti con il gioco.
- `Primary action`: Coral, bordo Ink, ombra rigida, stato premuto con traslazione breve.
- `Secondary action`: Ivory, bordo Ink, inversione Ink al press o hover disponibile.
- `Context label`: testo maiuscolo breve con segnale Coral, Gold o Teal in base alla funzione.
- `Session card`: superficie Aubergine o Coral, riepilogo immediato della Party Night.
- `Game proposal`: titolo dominante, tre metadati compatti, motivazione separata da una linea.
- `Private reveal`: superficie Aubergine con segreto centrale e disco Gold; il segreto sparisce al rilascio o al secondo tocco accessibile.
- `Result moment`: superficie Gold o Coral con nome dominante e punteggio separato.
- `Error state`: fascia Danger, spiegazione concreta e recupero primario senza fallback silenzioso.

### Setup Party Night - direzione di lavoro

- Struttura A+B: chiarezza operativa e avanzamento leggibile, con titoli espressivi ma istruzioni e pulsanti letterali.
- Testata operativa pulita: nessun logo decorativo ridotto nell'angolo; il brand resta riconoscibile tramite palette, tipografia e forme.
- `Personalizza` resta una schermata secondaria separata dal percorso principale.
- La scelta dei materiali distingue `Solo Telefono` dai materiali fisici e usa queste etichette concrete: `Mazzo da Poker`, `Mazzo da Briscola`, `Carte da Uno`, `Dadi`, `Carta e Penna`.
- Ogni schermata principale usa un solo controllo `?` nella stessa posizione. La guida contestuale spiega sempre `Cosa devi fare`, `Perché te lo chiediamo` e `Cosa farà l'app`, con accesso alla guida generale di Ruckus Party.
- Stato: direzione accettata dall'owner il 2026-08-23 come base per proseguire il confronto delle altre sezioni; non è ancora il gate finale di Phase 2B.

### Identità delle proposte gioco - direzione di lavoro

- La proposta usa il gioco e le informazioni come protagonisti, senza copertine o illustrazioni obbligatorie.
- Direzione selezionata: `Titolo in testa`, con tipografia forte, una frase sociale, metadati compatti, obiettivo e ruolo del telefono.
- I materiali sono etichette concrete e non diventano disegni decorativi dominanti. Filigrane o piccoli segni restano possibili soltanto come supporto secondario e non sono approvati in questa iterazione.
- Stato: direzione A accettata dall'owner il 2026-08-23 come base temporanea per proseguire il flusso; non è ancora il gate finale di Phase 2B.

### Preparazione dei giochi - direzione di lavoro

- La preparazione usa la stessa gerarchia per giochi fisici e digitali: obiettivo, metadati, tre passaggi essenziali e ruolo esplicito del telefono.
- Nei giochi fisici il telefono prepara e registra, ma il tavolo resta protagonista. Nei giochi digitali l'app anticipa con chiarezza passaggi privati e fase condivisa.
- Il controllo `?` mantiene le tre sezioni `Cosa devi fare`, `Perché te lo chiediamo` e `Cosa farà l'app`, adattate al tipo di gioco.
- Stato: struttura condivisa accettata dall'owner il 2026-08-23 come base per proseguire con le schermate di partita; non è ancora il gate finale di Phase 2B.

### Motion

- Ingresso schermata: 240 ms, opacità e traslazione verticale di 8 px.
- Press primario: traslazione di 3 px che annulla quasi completamente l'ombra rigida.
- Ruota Home: rotazione singola di 920 ms; dado e carte reagiscono una sola volta allo stesso evento.
- Nessuna animazione continua, parallax, glow o movimento decorativo persistente.
- Con `prefers-reduced-motion: reduce` animazioni e transizioni vengono disattivate.

## Percorso high-fidelity

Il percorso principale dimostra:

1. Home Session-first, scelta tra `Serata libera` e `Torneo` dentro Party Night e setup completo dei due formati.
2. Catalogo integrato nei contesti consultazione, Quick Play, Serata libera e selezione multipla Torneo.
3. Primo gioco Virtual, `Secret Signals`, con private reveal e accusa condivisa fino al risultato.
4. Secondo gioco Physical, `Mirror Moves`, con freeze, scelta di chi si è mosso e risultato.
5. Classifiche, conseguenze, finale neutro o con punteggio, ritiro e spareggio Torneo.

Gli shortcut laterali rendono verificabili anche no-match, errore recuperabile, uscita anticipata e finale senza ripercorrere ogni volta il flusso completo.

Prototipo cliccabile: `prototypes/phase-2b-high-fidelity.html`. Lo stato corrente incorpora la combinazione approvata `Petrolio festa` + `Passa la R`.

## Lingue

- Italiano predefinito.
- Inglese applicato a interfaccia, istruzioni, errori e contenuti senza perdere lo stato.
- I nomi dei giochi sono localizzati nel prototipo, ma naming e catalogo finali restano fuori da Phase 2B.

## QA baseline eseguito prima del candidato Petrolio festa

- Flusso completo automatico da Home al secondo gioco e al finale.
- Viewport 375, 768 e 1440 CSS px senza overflow della pagina.
- Tap target interattivi visibili di almeno 44x44 CSS px.
- Home e stati critici controllati visivamente: Virtual, private reveal, Physical, errore e finale.
- Montserrat verificato come unica famiglia calcolata su tutti gli elementi visibili.
- Ruota, dado e carte verificati come interazione singola senza errore JavaScript.
- Cambio completo italiano-inglese verificato.
- Modali verificati con sfondo bloccato.
- `prefers-reduced-motion` verificato tramite emulazione.
- Nessun errore JavaScript rilevato durante i percorsi automatici.

## QA del trasferimento Petrolio festa

- Test originale del motion lab superato su ruota, dado, carte e reduced motion.
- Home del prototipo verificata a 375, 430 e 1440 CSS px senza overflow orizzontale o tap target sotto 44x44 CSS px.
- Tre oggetti scenici verificati nel prototipo con risultato finale leggibile, casualità via Web Crypto e nessun errore JavaScript.
- Accessi separati verso Party Night, Quick Play e Games e cambio italiano-inglese verificati senza perdere la funzione scenica degli oggetti.
- Reduced motion verificato senza animazioni attive e senza bloccare i risultati.

## QA end-to-end del prototipo completo

- Flussi Serata libera, Torneo, quattro contesti del catalogo, Quick Play e due giochi simulabili verificati fino al risultato.
- Viewport 375, 430, 844 landscape e 1440 CSS px verificati senza overflow orizzontale; controlli visibili verificati ad almeno 44x44 CSS px.
- Italiano e inglese verificati sui nuovi flussi senza perdita di stato; metadati dinamici del catalogo inclusi.
- Finale senza risultati verificato senza vincitore inventato; ritiro e spareggio Torneo verificati come percorsi accessibili.
- Modal verificato con sfondo bloccato; reduced motion verificato senza animazioni attive e con risultati immediatamente leggibili.
- Nessun errore JavaScript rilevato durante i percorsi automatici. Test: `prototypes/phase-2b-high-fidelity.test.cjs`.

## QA del sistema logo Passa la R

- Collisione e reveal verificati causalmente: la R resta invisibile prima del contatto e appare nello stesso intervallo dell'urto.
- `PARTY` resta nascosto fino al completamento dell'impatto.
- Icona Home verificata a 16, 32, 64 e 96 CSS px con R dominante e margini interni misurati.
- Viewport 390, 430 e 1440 CSS px, focus, replay, console e reduced motion verificati.

## QA del trasferimento logo nel prototipo

- Lockup e icona Home D-021 trasferiti senza cambiare palette, oggetti scenici o stato owner del candidato D-020.
- Collisione, nascita della R e reveal di `PARTY` verificati causalmente nel prototipo; il finale resta stabile e senza loop.
- Home verificata a 375, 430, 844 landscape e 1440 CSS px senza overflow, sovrapposizioni, tap target sotto 44 CSS px o errori JavaScript.
- Icona Home verificata con colori, `viewBox` e margini interni della R approvati; italiano e inglese mantengono logo e gerarchia.
- Reduced motion mostra subito R e `PARTY`; ruota, dado e carte mantengono risultati leggibili senza animazioni attive.
- Il menu di sessione continua a bloccare lo sfondo e a ripristinarlo alla chiusura.

## Limiti e prossimi controlli

- La direzione è una base approvata, non ancora branding commerciale definitivo.
- Font remoti sono accettabili nel prototipo, ma la strategia di caricamento appartiene all'implementazione.
- Durate, nomi e contenuti dei giochi sono dati finti per verificare il flusso.
- Il prototipo usa `localStorage` soltanto come stato finto; il dominio prodotto non deve dipendere direttamente da questa API.
- L'approvazione visuale di `Petrolio festa` non rende definitivi durata, naming o contenuti finti del catalogo.
- Il prototipo high-fidelity completo è stato approvato dall'owner il 2026-08-30. Phase 2B è conclusa; stack e architettura dell'app vera richiedono un workstream separato.
