# LipariBank — Day 5 Fix Mission

Giorno 5! Il progetto usa **Vite + TypeScript** con un foglio di stile SCSS e
una pipeline CI su GitHub Actions. Sono stati introdotti **3 bug** che coinvolgono
variabili d'ambiente, riferimenti a file e stili responsive. Il tuo compito è
individuarli e correggerli.

---

## Come avviare

```bash
npm install
npm run build       # compila i bundle TypeScript → dist/
```

Poi apri `dashboard.html` o `transactions.html` con **Live Server** di VS Code
(tasto destro → *Open with Live Server*) dalla radice del progetto.

Per lo sviluppo incrementale puoi usare anche:

```bash
npm run dev         # avvia il dev server Vite
npm run type-check  # solo controllo tipi TypeScript (senza build)
npm run build:scss  # ricompila il CSS da src SCSS
```

---

## Le 3 Missioni

### Missione 1 — La pipeline CI diventa rossa

Apri il tab **Actions** su GitHub dopo il primo push: il job `TypeScript
type-check` fallisce immediatamente.

**Sintomo:** `npm run type-check` termina con un errore TypeScript prima ancora
che la build produca output. L'errore è un `TS2345` — un argomento di tipo
incompatibile passato a una funzione. Il problema nasce da una variabile
d'ambiente che potrebbe non essere definita a runtime.

Leggi attentamente il messaggio di errore: indica il file, la riga e i tipi
coinvolti. Aggiungi la gestione del caso in cui la variabile non sia presente.

---

### Missione 2 — La pagina Movimenti è vuota

Dopo aver corretto la Missione 1 ed eseguito `npm run build`, apri
`transactions.html` nel browser.

**Sintomo:** la pagina si carica (header visibile, stili applicati) ma la
tabella rimane nello stato di caricamento e nella console di DevTools compare
un errore simile a:

```
GET http://localhost:5500/dist/main.js  404 (Not Found)
Failed to load module script
```

Nessun dato viene mostrato. La dashboard funziona correttamente.

Confronta attentamente il tag `<script>` in `transactions.html` con i nomi
dei file prodotti da `npm run build` nella cartella `dist/` e con la
configurazione di `vite.config.ts`.

---

### Missione 3 — Il bottone "Nuovo bonifico" sparisce su mobile

Apri `transactions.html`, poi simula un dispositivo mobile attivando il
**Device Toolbar** in DevTools (icona smartphone, oppure `Ctrl+Shift+M` /
`Cmd+Shift+M`) e scegli un preset a larghezza ≤ 767 px.

**Sintomo:** il pulsante "Nuovo bonifico" è completamente invisibile — la riga
dove dovrebbe comparire è vuota. Il testo esiste nel DOM (ispezionabile con
DevTools → Elements) ma non è visibile.

Usa DevTools → Elements → Computed styles sul bottone per individuare quale
regola CSS sovrascrive il colore di sfondo. Poi trova e correggi la regola nei
sorgenti SCSS.

---

## Struttura del progetto

```
liparibank-day5-broken/
├── src/
│   ├── models/
│   │   └── account.model.ts
│   ├── services/
│   │   └── account.service.ts
│   ├── ui/
│   │   └── dashboard.ui.ts
│   ├── vite-env.d.ts
│   ├── main.ts                  ← entry point dashboard
│   └── transactions.ts          ← entry point movimenti
├── dashboard.html
├── transactions.html
├── scss/
│   ├── main.scss
│   ├── _variables.scss
│   └── _responsive.scss
├── css/
│   └── main.css                 ← CSS pre-compilato (aggiornare con build:scss)
├── .github/
│   └── workflows/
│       └── ci.yml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Buona fortuna!
