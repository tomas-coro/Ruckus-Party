# Phase 2B - Visual direction, design system e high-fidelity prototype

## Stato

`Manifesto Sociale` è stata approvata dall'owner il 2026-08-22 come base della V1. Il successivo affinamento ha reso la Home più teatrale e spontanea attraverso ruota, dado e carte, mantenendo le schermate operative più calme. Il prototipo high-fidelity rivisto è candidato all'approvazione owner prima di qualsiasi implementazione UI reale.

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

## Design system - Manifesto Sociale

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

### Motion

- Ingresso schermata: 240 ms, opacità e traslazione verticale di 8 px.
- Press primario: traslazione di 3 px che annulla quasi completamente l'ombra rigida.
- Ruota Home: rotazione singola di 920 ms; dado e carte reagiscono una sola volta allo stesso evento.
- Nessuna animazione continua, parallax, glow o movimento decorativo persistente.
- Con `prefers-reduced-motion: reduce` animazioni e transizioni vengono disattivate.

## Percorso high-fidelity

Il percorso principale dimostra:

1. Home Session-first e setup Party Night in tre passaggi.
2. Primo gioco Virtual, `Secret Signals`, con due private reveal sul telefono condiviso.
3. Risultato, classifica e conseguenza opzionale come momenti separati.
4. Secondo gioco Physical, `Mirror Moves`, senza materiali e con telefono usato come supporto.
5. Secondo risultato e finale, incluso il caso di più campioni a pari merito.

Gli shortcut laterali rendono verificabili anche no-match, errore recuperabile, uscita anticipata e finale senza ripercorrere ogni volta il flusso completo.

Prototipo cliccabile: `prototypes/phase-2b-high-fidelity.html`.

## Lingue

- Italiano predefinito.
- Inglese applicato a interfaccia, istruzioni, errori e contenuti senza perdere lo stato.
- I nomi dei giochi sono localizzati nel prototipo, ma naming e catalogo finali restano fuori da Phase 2B.

## QA eseguito

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

## Limiti e prossimi controlli

- La direzione è una base approvata, non ancora branding commerciale definitivo.
- Font remoti sono accettabili nel prototipo, ma la strategia di caricamento appartiene all'implementazione.
- Durate, nomi e contenuti dei giochi sono dati finti per verificare il flusso.
- Il prototipo usa `localStorage` soltanto come stato finto; il dominio prodotto non deve dipendere direttamente da questa API.
- L'approvazione del prototipo high-fidelity è il gate finale di Phase 2B.
