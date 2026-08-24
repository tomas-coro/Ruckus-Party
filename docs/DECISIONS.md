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

## Decisioni confermate in Phase 2A

### D-013 - Struttura del setup Party Night

- Problem: raccogliere i dati indispensabili senza mostrare un'unica schermata densa o un wizard lungo.
- Recommendation: usare tre schermate rapide: giocatori; durata e materiali; riepilogo con `Customize` opzionale e `Start Party`.
- Why: ogni schermata ha un compito chiaro, resta utilizzabile con una mano e rende visibili i default prima dell'avvio.
- Tradeoff: il setup richiede più transizioni rispetto a un unico form scorrevole.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: usare la soluzione ritenuta migliore e più coerente per la V1.

### D-014 - Ritmo tra due giochi

- Problem: mantenere leggibili risultato, conseguenza e proposta successiva senza creare una schermata sovraccarica.
- Recommendation: usare tre momenti full-screen distinti: risultato e punteggio; conseguenza opzionale; prossimo gioco.
- Why: ogni passaggio conserva una sola azione primaria ed è comprensibile mentre il telefono passa tra più persone.
- Tradeoff: il loop include più schermate e deve essere verificato per evitare lentezza percepita.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: confermati i tre momenti distinti.

### D-015 - Interazione del private reveal

- Problem: impedire che un segreto resti visibile durante il passaggio del telefono senza escludere utenti con difficoltà motorie.
- Recommendation: usare una pressione continua che nasconde il contenuto al rilascio, con alternativa accessibile a due tocchi nello stesso flusso.
- Why: la pressione riduce le esposizioni accidentali; l'alternativa evita di rendere il gesto un requisito esclusivo.
- Tradeoff: il flusso richiede di spiegare due modalità senza aumentare il carico cognitivo.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: confermata pressione continua con alternativa accessibile.

### D-016 - Information architecture Session-first

- Problem: distinguere Home, catalogo e sessione senza far percepire Ruckus Party come una raccolta statica di giochi.
- Recommendation: usare la Home come hub, rendere `Start Party` dominante e trattare una Party Night attiva come percorso dedicato senza bottom navigation globale.
- Why: mantiene la promessa della serata guidata e limita le distrazioni durante il core loop.
- Tradeoff: catalogo e funzioni secondarie richiedono un ritorno esplicito alla Home o il menu sessione.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: confermato l'approccio Session-first.

### D-017 - Gestione del core loop e dell'uscita

- Problem: rendere coerenti Physical, Virtual, annullamento, punteggio e fine anticipata.
- Recommendation: separare preparazione e gioco, non creare risultati per partite annullate, confermare soltanto l'uscita anticipata e produrre sempre un riepilogo coerente con i risultati registrati.
- Why: evita dati inventati e conferme ridondanti, mantenendo recuperabili gli errori.
- Tradeoff: il prototipo deve coprire più rami e stati trasversali.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: confermato il core loop proposto.

### D-018 - Lingua della V1

- Problem: stabilire la lingua predefinita senza limitare l'accessibilità del prodotto a chi preferisce l'inglese.
- Recommendation: usare l'italiano come lingua predefinita e offrire l'inglese dalla Home e dalle impostazioni della sessione, applicandolo all'intera esperienza senza perdere lo stato corrente.
- Why: corrisponde al pubblico iniziale indicato dall'owner e mantiene disponibile una seconda lingua completa con un controllo semplice.
- Tradeoff: ogni testo di interfaccia, gioco, errore e contenuto deve essere mantenuto in entrambe le lingue.
- Status: `Recommended`, confermata dall'owner il 2026-08-22.
- Owner answer: gioco in italiano con possibilità di impostare l'inglese; il resto della direzione Phase 2A è approvato.

## Decisioni confermate in Phase 2B

### D-019 - Direzione visiva della V1

- Problem: dare a Ruckus Party un'identità riconoscibile, adulta e inclusiva senza ricorrere a codici infantili, da nightlife o da UI SaaS generica.
- Recommendation: adottare `Manifesto Sociale` come base visiva affinata della V1. Usare Montserrat come unica famiglia, Aubergine per l'atmosfera, Coral per l'azione, Gold per caso e selezione, Teal per Physical e conferme, Ivory per istruzioni. Rendere ruota, dado e carte la firma scenica della Home, con schermate operative più calme.
- Why: presenta la Party Night come un evento condiviso e giocoso, rende la Home meno aziendale e più suggestiva, mantiene immediata la gerarchia mobile e non restringe il prodotto a carte o a una singola meccanica.
- Tradeoff: la Home più teatrale richiede disciplina per non competere con `Start Party`; gli oggetti di gioco devono ricomparire soltanto quando hanno un ruolo e la palette deve mantenere associazioni funzionali stabili.
- Status: `Recommended`, confermata dall'owner il 2026-08-22 come base migliorabile.
- Owner answer: proseguire con `Manifesto Sociale`; approvati ruota centrale animabile, dado e carte scenici, Home più suggestiva, interni più calmi, Montserrat unica e palette funzionale proposta.

## Decisione owner aperta in Phase 2B

### D-020 - Affinamento Petrolio festa

- Problem: decidere se il candidato più recente debba sostituire palette e tipografia della baseline `Manifesto Sociale` mantenendone struttura Session-first e oggetti scenici.
- Recommendation: valutare `Petrolio festa` nel prototipo high-fidelity corrente. Usa Petrol, Mandarin, Honey, Shell e Mint; abbina `Archivo Black` a `Libre Franklin`; assegna a ruota, dado e carte tre interazioni indipendenti e prive di loop.
- Why: il candidato rende la Home più calda, materica e riconoscibile, mentre le interazioni restano leggibili e rispettano reduced motion.
- Tradeoff: cambia due elementi esplicitamente approvati in D-019, palette e Montserrat unica, quindi non può essere promosso a nuova baseline senza una risposta owner.
- Status: `Needs owner decision`.
- Owner answer: non ancora ricevuta.

## Decisione confermata dall'owner sul sistema logo

### D-021 - Logo Passa la R e icona Home

- Problem: rendere il nome e l'icona Home riconoscibili come Ruckus Party senza ridurre il marchio a frecce generiche o schiacciare il logo completo dentro un quadrato.
- Recommendation: adottare `Passa la R`. Nel logo Mint e Mandarin si scontrano e solo allora rivelano la tessera Honey con la R; `PARTY` appare dopo l'impatto. L'icona Home usa una R Honey dominante su Petrol Deep con due innesti laterali Mint e Mandarin, ottimizzati per le riduzioni.
- Why: il movimento comunica una sfida tra persone, mentre l'icona conserva il DNA del logo e resta leggibile a 16, 32, 64 e 96 CSS px.
- Tradeoff: l'icona non replica il lockup completo, ma sacrifica la corrispondenza letterale per garantire riconoscibilità alle dimensioni di sistema.
- Status: `Recommended`, confermata dall'owner il 2026-08-23.
- Owner answer: approvato il sistema `Passa la R` dopo la correzione del timing d'impatto e dell'icona Home; autorizzati commit e push. Questa risposta non approva D-020 né chiude il gate finale di Phase 2B.

### D-022 - Catalogo V1 e consultazione delle regole

- Problem: rendere esplorabili giochi, materiali compatibili e regole senza trasformare Ruckus Party in una raccolta statica o nascondere le differenze tra mazzi, dadi e giochi fisici personali.
- Recommendation: adottare la direzione B del Catalogo V1 mostrata in `mockups/12-catalogo-v1-regole.html`. Usare le cinque raccolte visuali come accessi per materiale, mantenere ricerca e filtri espliciti, aprire le regole nello stesso flusso e consentire giochi Extra salvati localmente. Su mobile il catalogo diventa un percorso verticale; su desktop usa indice, raccolte e dettaglio affiancati.
- Why: il catalogo resta consultabile e concreto, ma Party Night conserva il ruolo di esperienza principale. Le copertine distinguono subito i materiali e il dettaglio rende verificabili regole, vittoria e ruolo del telefono.
- Tradeoff: quantità, bilanciamento e completezza dei giochi devono ancora essere validati con playtest; l'approvazione del mockup non equivale a implementazione prodotto né chiude D-020 o Phase 2B.
- Status: `Recommended`, confermata dall'owner il 2026-08-24.
- Owner answer: approvato il Catalogo V1 dopo QA visivo e interattivo su mobile, landscape, desktop, stati, lingue, testo ingrandito e reduced motion.

### D-023 - Sezione Complicità e Controcanto

- Problem: includere giochi cooperativi e a squadre senza introdurre un sistema Team generale nella V1.
- Recommendation: aggiungere `Complicità`, sottotitolo `Cooperativi e sfide a squadre`. I giochi a squadre della V1 richiedono esattamente 6 persone in due squadre da 3. Il primo titolo è `Controcanto`: cooperativo, 3-6 giocatori, telefono, carta e penne, con indizi divisi in `Solisti` e `Coro` e due tentativi da 2 o 1 punto.
- Why: apre una famiglia sociale distinta mantenendo limitato lo scope delle squadre.
- Tradeoff: il preset Team resta Later; la V1 ammette solo regole a squadre locali ai singoli giochi, senza estensione oltre 6 persone. Controcanto richiede playtest su equivalenza degli indizi e bilanciamento.
- Status: `Superseded` da D-024 per quantità del roster e compatibilità delle squadre; `Complicità`, `Controcanto` e la copertina restano confermati.
- Owner answer: approvati `Complicità`, `Controcanto` e la copertina C `Tavolo`.

### D-024 - Roster Complicità V1 e squadre scalabili

- Problem: portare `Complicità` alla stessa profondità delle altre raccolte senza limitare ogni gioco a sei persone o produrre cloni riconoscibili dei party game usati come riferimento.
- Recommendation: puntare a dieci giochi totali in `Complicità`, incluso `Controcanto`, con una sola copertina di raccolta. I giochi a squadre usano gruppi da 2-3 persone e possono ammettere più squadre, mentre ogni scheda dichiara la propria compatibilità. Il prototipo MVP resta ottimizzato per 2-6 persone finché setup, layout e punteggio oltre sei non vengono progettati. I nove concept candidati sono `Parola per Parola`, `Coordinate Comuni`, `Segnale Sporco`, `In Che Ordine?`, `Tre Icone, Una Bugia`, `Tutti Ora`, `Scena Spezzata`, `Lampo Comune` e `Stessa Frequenza`.
- Why: il roster combina comunicazione vincolata, lettura del gruppo, sincronizzazione, mimo, velocità verbale e intercettazione. Le meccaniche note diventano punti di partenza, mentre nomi, contenuti, combinazioni di regole e interazioni digitali restano originali Ruckus Party.
- Tradeoff: i nomi sono provvisori, non tutti i giochi supportano la stessa composizione e ogni concept richiede playtest. Il supporto reale oltre sei persone non è ancora progettato nel setup della V1.
- Status: `Recommended`, confermata dall'owner il 2026-08-24.
- Owner answer: confermati dieci giochi totali, nessuna copertina individuale, squadre da 2-3 senza tetto generale di sei persone e un mix di ispirazioni note, rivisitazioni e invenzioni originali. Apprezzate in particolare le direzioni derivate da comunicazione cifrata, coordinate di intesa e velocità per categorie.

### D-025 - Raccolta Doppio e torneo storico delle coppie

- Problem: offrire a due persone una raccolta cooperativa distinta da `Complicità`, con varietà tra partite e un risultato confrontabile nel tempo senza trasformare il dispositivo nel tavolo principale.
- Recommendation: aggiungere `Doppio`, sottotitolo `Cooperativi per due`, riservata esattamente a due giocatori. Il torneo autonomo estrae senza ripetizioni cinque giochi originali, ordinati in due facili, due medi e uno difficile; ogni gioco assegna 0-100 punti per un massimo di 500. La classifica locale ordina ogni coppia per il miglior torneo completato e conserva i pareggi. I singoli giochi sono avviabili come allenamento senza record. Il roster candidato comprende dieci giochi, quattro facili, quattro medi e due difficili, con un arco di sincronizzazione, comunicazione limitata, risorse condivise e decisioni sotto pressione. All'avvio la coppia dichiara i materiali disponibili; ogni gioco mantiene obiettivo e nucleo tra una versione fisica preferita e un adattamento accessibile senza quel materiale. Il dispositivo prepara, estrae e conta, ma lascia il gioco al tavolo quando possibile.
- Why: il formato rende confrontabili tornei casuali, distingue la cooperazione a due dalle sfide sociali di `Complicità` e sfrutta carta, penne, mazzi e dadi senza escludere chi possiede soltanto il dispositivo.
- Tradeoff: punteggi normalizzati, equivalenza delle varianti e qualità dei fallback digitali richiedono playtest. Torneo, classifica storica, profili di coppia e statistiche dipendono da persistenza locale e restano fuori dalla V1 finché il relativo workstream non viene progettato.
- Status: `Recommended`, confermata dall'owner il 2026-08-24 come definizione di prodotto da sviluppare e playtestare in futuro.
- Owner answer: approvati nome `Doppio`, formato ufficiale da cinque giochi, punteggio 0-100, record migliore per coppia, allenamento senza classifica, roster originale da dieci concept e supporto universale tramite varianti fisiche e digitali con lo stesso nucleo. Le statistiche future includeranno almeno partite, punti totali, tempo e minigiochi più giocati.

### D-026 - Raccolta futura di mazzi digitali originali

- Problem: aggiungere giochi di carte sociali e competitivi che non dipendano dai mazzi tradizionali e non replichino una sola meccanica di giudizio, dilemma o completamento comico.
- Recommendation: definire una raccolta phone-only con nome di lavoro non definitivo `Mazzi Originali`, composta da dieci giochi per 3-8 persone e 5-10 minuti. Ogni gioco usa un mazzo digitale dedicato; il roster comprende otto titoli individuali e due con alleanze temporanee, senza eliminazioni. I contenuti 14+ sono la base e i mazzi 18+ restano opt-in. Ogni gioco offre una `Carta bianca` manuale, facoltativa e illimitata. Il roster candidato è `Scommetti sul Gruppo`, `Punto di Rottura`, `Difesa Indifendibile`, `Peggior Consiglio`, `Classifica Clandestina`, `Quasi Vero`, `Due Versioni`, `Vendilo Male`, `Alibi a Due` e `Patto Impossibile`.
- Why: la raccolta estende il catalogo con carte progettate per il singolo gioco, conserva varietà tra lettura sociale, bluff, persuasione, creatività e negoziazione e permette ai giocatori di creare contenuti senza rendere obbligatoria l'improvvisazione.
- Tradeoff: nome della raccolta, nomi dei giochi, contenuti, punteggi interni e numero di round richiedono naming e playtest. Prompt personali e contenuti creati dagli utenti richiedono attenzione a ritmo, accanimento e classificazione.
- Status: `Recommended`, confermata dall'owner il 2026-08-24 come definizione di prodotto futura.
- Owner answer: approvati roster, meccaniche candidate, fascia 3-8, durata 5-10 minuti, livelli 14+/18+, assenza di eliminazioni, mix tra voti pubblici e segreti, otto giochi individuali, due ad alleanze e `Carta bianca` sempre disponibile. Il nome resta esplicitamente in standby.

### D-027 - Formato Torneo configurabile dentro Party Night

- Problem: offrire una competizione lunga e vincolante senza duplicare Party Night con una seconda modalità quasi identica o modificare il torneo autonomo di `Doppio`.
- Recommendation: trattare Party Night come contenitore con i formati `Serata libera` e `Torneo`. Il Torneo usa 5, 10, 15 giochi oppure una quantità manuale minima di 5, selezionati automaticamente tramite filtri o manualmente. Mostra calendario, ordine e materiali prima della conferma, poi blocca partecipanti e percorso senza ripetizioni iniziali. Ogni vittoria vale 1 punto. I pari merito disputano spareggi successivi fino a un campione unico, usando prima giochi compatibili non disputati e poi, se esauriti, ripetizioni casuali. Le conseguenze immediate sono opzionali e spente per default; gli handicap sono esclusi. Un ritiro elimina giocatore e punti e sostituisce solo i giochi futuri incompatibili.
- Why: il giocatore percepisce un impegno competitivo reale, può controllare raccolte, materiali e giochi ammessi e ottiene un vincitore unico senza togliere flessibilità alla Serata libera.
- Tradeoff: durata, generazione del calendario, sostituzioni dopo un ritiro, compatibilità degli spareggi e storico persistente richiedono un workstream autonomo. Lo storico resta Future e il Torneo generale resta Later.
- Status: `Recommended`, confermata dall'owner il 2026-08-24 come definizione di prodotto futura.
- Owner answer: approvati scelta del formato all'avvio di Party Night, quantità 5/10/15 e manuale da 5, filtri o selezione esatta, calendario visibile e poi bloccato, un punto per vittoria, nessun co-campione, spareggi a oltranza, conseguenze immediate opzionali, esclusione degli handicap, gestione del ritiro e storico futuro. `Doppio` non viene modificato.
