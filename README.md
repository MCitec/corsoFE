# LipariBank — Day 4 Fix Mission

Giorno 4! Il progetto usa TypeScript puro (niente framework). Il codice compila
con `strict: false`, ma sono stati introdotti **3 bug** legati ai tipi, alle
importazioni ES e alla gestione dei valori nullable. Il tuo compito è
individuarli e correggerli.

---

## Come avviare

```bash
npm install
npm run build
```

Poi apri `login.html` o `dashboard.html` con **Live Server** di VS Code (tasto
destro → *Open with Live Server*), oppure da un altro server statico sulla porta
5500.

> Serve un server HTTP: i moduli ES non funzionano con il protocollo `file://`.

---

## Le 3 Missioni

### Missione 1 — Il progetto non compila

Esegui `npm run build`. Il compilatore TypeScript si ferma subito con un errore.

**Sintomo:** `npm run build` termina con un errore di compilazione ancora prima
di produrre qualsiasi file nella cartella `dist/`. L'app non può essere avviata.

Leggi attentamente il messaggio di errore nel terminale: indica esattamente il
file e la riga incriminata. Osserva come viene importata la classe
`TransactionService` in `src/main.ts` e confronta con come viene esportata nel
file di origine.

---

### Missione 2 — La dashboard crasha all'apertura

Dopo aver risolto la Missione 1 e ricompilato, apri `dashboard.html` nel
browser.

**Sintomo:** la pagina appare bianca o vuota. Aprendo DevTools → Console trovi
un errore del tipo:

```
TypeError: Cannot set properties of null (reading 'addEventListener')
```

oppure

```
TypeError: Cannot read properties of null (reading 'addEventListener')
```

La pagina di login funziona correttamente. Solo la dashboard crasha.

Pensa a quali moduli vengono importati da `src/main.ts` e considera gli effetti
collaterali che si verificano a livello di modulo quando il codice viene caricato.

---

### Missione 3 — I tipi `any` nascondono un bug visivo

Dopo aver risolto le prime due missioni, la dashboard si carica ma la colonna
**Importo** mostra sempre `€ NaN` per ogni transazione.

**Sintomo:** tutti gli importi appaiono come `€ NaN` invece dei valori corretti.
Il saldo in cima alla pagina è calcolato correttamente, quindi i dati arrivano.

Per trovare questo bug, abilita `"strict": true` in `tsconfig.json` e
riesegui `npm run build`. Osserva tutti gli errori che emergono: uno di essi
punta direttamente alla riga che causa il valore `NaN`. Correggi anche tutti gli
altri errori di tipo che il compilatore segnala.

---

## Struttura del progetto

```
liparibank-day4-broken/
├── login.html              → pagina di accesso
├── dashboard.html          → dashboard con lista movimenti
├── css/
│   └── main.css
├── src/
│   ├── models/
│   │   └── transaction.model.ts   ← dati e interfacce
│   ├── services/
│   │   └── transaction.service.ts ← logica di business
│   ├── ui/
│   │   ├── transactions.ui.ts     ← rendering tabella
│   │   └── login.ui.ts            ← gestione form login
│   ├── main.ts                    ← entry point dashboard
│   └── login-main.ts              ← entry point login
├── dist/                   ← generata da tsc (non modificare)
├── package.json
└── tsconfig.json
```

Buona fortuna!
