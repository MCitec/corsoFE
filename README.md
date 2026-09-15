# LipariBank — Day 3 Fix Mission

Giorno 3! L'app ora ha un backend mock (json-server) e JavaScript asincrono: fetch, eventi
DOM, debounce. Qualcuno ha introdotto **3 bug** che rendono l'interfaccia instabile e
silenziosa nei fallimenti. Il tuo compito è individuarli e correggerli.

---

## Come avviare

```bash
npm install
npm start
```

Poi apri `dashboard.html` o `transactions.html` con **Live Server** di VS Code (tasto destro
→ *Open with Live Server*), oppure da un altro server statico sulla porta 5500.

> Il backend json-server ascolta su `http://localhost:3001`.

---

## Le 3 Missioni

### Missione 1 — La ricerca produce risultati "sfasati"

Vai su **Movimenti** (`transactions.html`) e digita rapidamente nel campo di ricerca una
parola come "stipendio" o "enel".

**Sintomo:** mentre digiti, la lista si aggiorna in modo caotico mostrando risultati
intermedi. Più scrivi velocemente, più la lista salta tra stati diversi prima di
stabilizzarsi. A volte il risultato finale mostrato non corrisponde a quello che hai
digitato — come se la lista "tornasse indietro" a una ricerca precedente.

Apri DevTools → Network → filtra per Fetch/XHR e osserva quante richieste vengono generate
digitando una singola parola.

---

### Missione 2 — Cliccare una riga non apre il dettaglio

Vai su **Movimenti** e clicca su una qualsiasi riga della tabella.
Ti aspetti di vedere il pannello **Dettaglio movimento** apparire in fondo alla pagina.

**Sintomo:** non succede nulla. Il pannello non appare mai, indipendentemente da quale
riga clicchi. Se presti molta attenzione puoi notare che la riga si evidenzia per una
frazione di secondo, ma poi torna normale.

Apri DevTools → Console e aggiungi un `console.log` dentro `handleRowClick` per capire
quante volte viene chiamata per ogni singolo click.

---

### Missione 3 — Gli errori di rete non vengono gestiti

Ferma il server json-server (premi `Ctrl+C` nel terminale) e poi ricarica la pagina
**Movimenti** nel browser.

**Sintomo:** invece di un messaggio d'errore leggibile, la pagina resta in stato di
caricamento o mostra un errore criptico nella console tipo:
`TypeError: Cannot read properties of undefined (reading 'forEach')`
oppure `Uncaught (in promise) TypeError: Failed to fetch`.

Nessun feedback visivo per l'utente: la pagina sembra "bloccata" senza spiegazione.

Poi riavvia il server e prova a modificare temporaneamente l'URL in `api.js` per puntare
a una risorsa inesistente (`/nonexistent`). Osserva che la funzione ritorna qualcosa di
inaspettato anche quando il server risponde con un errore HTTP.

---

## Struttura del progetto

```
liparibank-day3-broken/
├── index.html             → redirect automatico a dashboard.html
├── dashboard.html         → panoramica conto e movimenti recenti
├── transactions.html      → lista completa con ricerca e dettaglio
├── css/
│   └── main.css
├── js/
│   ├── api.js
│   ├── dashboard.js
│   ├── search.js
│   ├── events.js
│   └── transactions.js
├── db.json                ← dati mock (json-server)
└── package.json
```

Buona fortuna! 🚀
