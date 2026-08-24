# Ruckus Party - Engineering Workflow

## Responsabilità

Questo documento definisce come analizzare, eseguire, verificare e chiudere il lavoro. `AGENTS.md` contiene i principi universali; qui vivono le procedure da caricare solo quando il task le richiede.

## CAMPO e decisioni

Prima di una richiesta non banale controlla internamente:

- **Contesto**: problema, obiettivo e stato corrente.
- **Attività**: un risultato richiesto e verificabile.
- **Materiali**: repository, documenti, file, test e configurazioni pertinenti.
- **Paletti**: scope, sicurezza, architettura, UX, dati, costi e compatibilità.
- **Output**: forma della consegna e controlli attesi.

Se CAMPO è sufficiente, procedi. Fai domande soltanto quando una risposta cambia materialmente il risultato; per ogni domanda proponi già la raccomandazione e il motivo. Non delegare all'owner dettagli minori risolvibili dalle fonti del repository.

Per una decisione importante aggiorna `docs/DECISIONS.md` con `Problem`, `Recommendation`, `Why`, `Tradeoff` e uno stato tra `Recommended`, `Needs owner decision` e `Deferred`. Una raccomandazione non è un'approvazione e una risposta owner non va dedotta.

## Communication efficiency

Il principio è `Think enough. Read enough. Verify enough. Say less.` Comprimi la comunicazione, non il lavoro tecnico: concisione e densità dell'output non autorizzano a ridurre analisi, accuratezza, debugging, test, QA, sicurezza, verifiche o contesto necessario.

### Stile predefinito

- Vai direttamente al punto e preferisci `risultato -> evidenza -> prossimo passo`.
- Per un task normale completato punta indicativamente a 5-12 righe utili, senza trattarlo come limite rigido.
- Usa più spazio per architettura, bug complessi, tradeoff, errori non ovvi, rischi o decisioni owner.
- Evita introduzioni, riepiloghi ripetuti, spiegazioni ovvie, piani impliciti, cronologie complete e conclusioni che duplicano quanto già detto.
- Un'informazione importante compare normalmente una sola volta. Non aggiungere sezioni vuote.

### Durante il lavoro

Non descrivere ogni file aperto, ricerca, comando ovvio o ipotesi intermedia. Aggiorna l'owner soltanto quando:

- serve una decisione;
- emerge un rischio o cambia lo scope;
- il task è bloccato;
- viene raggiunto un milestone significativo.

Se il task è chiaro, procedi senza una conferma preliminare che ripeta richiesta e piano. CAMPO resta una checklist interna e non richiede domande o narrazione quando le fonti sono sufficienti.

### Formati finali

Usa solo le righe pertinenti al task:

| Task | Formato preferito |
|---|---|
| Normale | `Risultato` in 1-3 righe, `Verifica` con controlli reali, `Git` solo se rilevante, un solo `Prossimo` |
| Bugfix | `Posizione`, `Causa`, `Fix`, `Verifica`; ometti la cronologia completa salvo richiesta |
| UI | `Modifica`, `QA` su viewport e stati realmente controllati, problemi residui solo se presenti |
| Decisione tecnica | `Consiglio`, massimo 2-3 motivi, tradeoff principale; alternative solo se competitive |
| Git semplice | stato reale e comando o commit consigliato, senza spiegare il funzionamento di Git |

### Domande, spiegazioni e riferimenti

- Quando una domanda è necessaria, fanne una precisa con raccomandazione già indicata e al massimo 2-3 opzioni. Questionari lunghi sono riservati alla product discovery esplicitamente richiesta.
- Spiega il perché in 1-2 righe; approfondisci su richiesta, per decisioni importanti, comportamenti controintuitivi o rischi concreti.
- Riferisci il documento pertinente invece di copiarne grandi blocchi. Non ripetere prompt, checklist o decisioni già persistite nel repository.
- Non omettere errori, rischi o limiti e non fare assunzioni per accorciare la risposta. La Definition of Done e le verifiche restano invariate.

## Proporzionalità del task

| Tipo | Percorso operativo |
|---|---|
| Micro-task | `inspect -> modify -> targeted verification` |
| Feature | `relevant context -> implementation -> tests -> relevant docs -> final verification` |
| Architettura, migrazione o debug aperto | contesto e piano più ampi, ipotesi esplicite, verifiche progressive |
| UI | `inspect -> modify -> targeted visual QA -> iterate -> final responsive QA` |
| Solo documenti o Git/status | controlli dei file e Git pertinenti, senza build o suite non correlate |

Se la soluzione è semplice e CAMPO è completo, non creare un piano lungo. Se il lavoro supera lo scope, completa la parte sicura e coerente, segnala l'espansione e proponi il blocco successivo separatamente.

## Sviluppo

- Prima di modificare un file leggilo, individua il test collegato e cerca un solo precedente utile quando esiste.
- Mantieni il cambiamento più piccolo che soddisfa il requisito; niente feature future, refactor ipotetici o astrazioni premature.
- Separa business logic e componenti React e rispetta gli invarianti di `AGENTS.md` e `docs/GAME_SYSTEM.md`.
- Prima di aggiungere una dipendenza verifica se il repository può risolvere il problema senza di essa, poi segnala motivo e impatto.
- Rendi espliciti errori, fallimenti di rete o input e stati non recuperabili. Niente fallback silenziosi o valori che mascherano un errore.

## Testing e verifica progressiva

Quando cambia un comportamento, aggiungi o aggiorna test pertinenti. La business logic deve essere testabile senza UI.

Durante l'iterazione esegui prima il controllo più mirato, poi lint o typecheck dell'area quando disponibili. Evita il loop `tiny fix -> full build` ripetuto e non rieseguire suite identiche se nessun file rilevante è cambiato.

Alla chiusura di una feature significativa esegui, quando applicabili:

1. lint;
2. typecheck;
3. test;
4. build;
5. QA visuale secondo `docs/DESIGN.md`.

La proporzionalità decide quali controlli sono applicabili, non autorizza a saltare quelli necessari per accuratezza, sicurezza o rischio. Leggi sempre l'output prima di dichiarare un esito.

## Documentazione

Aggiorna documentazione e decisioni soltanto quando cambiano prodotto, comportamento, architettura, convenzioni, limiti o stato di Phase. Un micro-fix senza impatto durevole non richiede una voce di roadmap.

Mantieni una fonte principale per ogni informazione e usa riferimenti invece di duplicarla. A fine workstream aggiorna solo documenti, TODO, limitazioni e test realmente coinvolti.

## Definition of Done

Un task è concluso soltanto quando:

- il risultato richiesto e i casi rilevanti sono coperti senza espansione inutile dello scope;
- i controlli pertinenti sono eseguiti sullo stato corrente e i loro esiti sono stati letti;
- errori, fallback, limitazioni e rischi residui sono dichiarati senza claim non verificati;
- documentazione e decisioni sono aggiornate soltanto quando richiesto dal cambiamento;
- `git diff` e `git status` sono controllati, senza scritture remote o Git non autorizzato.

## Git e chiusura

- Controlla branch e stato prima di modifiche sostanziali; considera con attenzione file modificati e untracked dell'utente.
- Non scartare, sovrascrivere o includere cambiamenti estranei. Non usare reset, stash o checkout distruttivi per aggirarli.
- Non eseguire commit o push senza richiesta esplicita. Prima della conferma riporta file cambiati, controlli, stato Git e messaggio Conventional Commits consigliato.
- Prima di un'azione distruttiva o remota descrivi bersaglio ed effetto e chiedi conferma.
- Alla chiusura controlla sempre `git diff` e `git status`.

## Caricamento del contesto

Usa `minimum sufficient context`, non `maximum available context`:

1. leggi `AGENTS.md` e le istruzioni applicabili;
2. formula internamente l'informazione cercata;
3. usa ricerca mirata e leggi file, sezioni e test probabilmente pertinenti;
4. amplia l'ispezione quando resta un'ambiguità concreta o emerge una dipendenza;
5. carica più contesto ogni volta che accuratezza o sicurezza lo richiedono.

Preferisci `hypothesis -> targeted inspection -> confirmation` a `scan everything -> decide later`. Non rileggere fonti invariate e ancora affidabili durante lo stesso workstream; rileggile se possono essere cambiate, servono dettagli precisi, la memoria è incerta o la decisione è critica.

## Conversazioni, checkpoint e handoff

Applica `Keep useful context. Drop stale context.` Continua nella stessa chat finché il contesto corrente è utile al workstream. Non suggerire un cambio durante debugging attivo o mentre si lavora sullo stesso problema.

Consiglia una nuova chat quando un workstream è concluso e il prossimo task è chiaramente diverso, oppure quando cronologia non più utile, tentativi precedenti o contesto obsoleto rischiano di confondere il lavoro. Fallo anche quando continuare aumenterebbe probabilmente il context usage senza un beneficio concreto. Applica `Recommend the switch and package the restart.`: quando consigli il cambio, includi automaticamente nello stesso messaggio questo mini-handoff pronto da usare, senza aspettare una richiesta separata:

```text
CONTEXT CHECK: consiglio una nuova chat.
Motivo: <una frase breve>.

HANDOFF:
- Fatto: <1-2 righe>
- Stato: <modifiche non committate, branch e verifica rilevante>
- Aperto: <solo ciò che resta realmente, oppure nessuna questione aperta>
- File: <massimo 3-5 file o documenti utili>
- Prossimo: <un solo task concreto>

NUOVA CHAT:
"<prompt breve che specifica esattamente da dove riprendere>"
```

Mantieni il messaggio entro circa 8-12 righe utili e non creare documenti lunghi. Includi soltanto ciò che serve per riprendere con precisione: niente cronologia, ragionamenti intermedi, tentativi falliti irrilevanti o informazioni già facilmente recuperabili dal repository, che resta la source of truth. Se il cambio non è consigliato, non produrre alcun handoff.

Nella nuova chat leggi `AGENTS.md`, usa l'eventuale handoff e carica soltanto file, documenti e test necessari al task. Non rileggere automaticamente l'intero progetto.

## Usage, modello e reasoning

L'obiettivo è massima qualità utile per unità di lavoro: `remove waste, not rigor`. Correttezza, sicurezza, comprensione sufficiente e test pertinenti hanno priorità sul risparmio.

### Reasoning level

Medium è il default. Prima di iniziare ogni task non banale valuta internamente se è sufficiente.

Consiglia High soltanto quando il task coinvolge materialmente uno o più di questi casi:

- decisioni architetturali importanti, decisioni di sicurezza o scelte costose da invertire;
- debugging difficile che coinvolge più subsystem o problemi ambigui con più soluzioni tecniche valide;
- grandi refactor con rischio reale di regressioni o code review critica;
- problemi complessi di stato, data flow o concorrenza.

Non consigliare High soltanto perché:

- il prompt è lungo, ci sono molti file o bisogna leggere documentazione;
- è una normale feature;
- bisogna eseguire test, QA o build;
- serve parecchio codice ma la soluzione è già definita.

Se Medium è sufficiente, non dire nulla sul reasoning e procedi normalmente.

Se High è realmente necessario e non puoi cambiare autonomamente il livello, fermati prima del lavoro costoso, scrivi esattamente `REASONING CHECK: consiglio di passare da Medium a High perché: <motivo breve e concreto>.` e attendi la conferma dell'owner.

Dopo un task eseguito in High, ricorda una sola volta di tornare a Medium per il lavoro ordinario. High è un'eccezione motivata, non la modalità standard.

### Usage reporting

Per un task davvero costoso avvisa una sola volta soltanto quando il costo è materialmente significativo e, se utile, proponi una divisione più efficiente. Non usare la lunghezza del prompt, il numero di file o i normali controlli come prova automatica di costo elevato.

Alla fine di un workstream significativo aggiungi `USAGE CHECK: Light|Normal|Heavy - motivo sintetico.` Non inventare token consumati, percentuali, credito restante o dati non disponibili.

## Istruzioni locali future

Non creare `AGENTS.md` annidati finché un subsystem non ha regole proprie, inutili altrove, e il file locale riduce davvero contesto o ambiguità. La codebase attuale non giustifica ancora istruzioni locali.

## Project skills

- `ui-qa`: targeted visual and interaction QA in `.agents/skills/ui-qa/SKILL.md`.

## Future skill candidates

Non sono implementate. Valutare solo dopo questo refactor:

- `bugfix`;
- `feature-finish`;
- `context-handoff`.
