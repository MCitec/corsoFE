# 🔧 LipariBank Day 2 — JavaScript Fix Mission

Siamo al giorno 2! Il frontend ora ha JavaScript. Qualcuno ha introdotto **3 bug JS** che
rendono l'app inaffidabile. Il tuo compito è individuarli e correggerli senza modificare il
comportamento atteso.

---

## Come avviare

```bash
npm start
```

Apre automaticamente `http://localhost:3000` con live reload.

> Credenziali di test: **mario.rossi** / **password123**

---

## Le 3 Missioni

### Missione 1 — L'ordinamento "rompe" le transazioni

Apri `transactions.html`. Usa il menu **Ordina per** per cambiare l'ordinamento (es. passa da
"Data ↓" a "Importo ↓"). Poi prova a tornare all'ordinamento per data.

**Sintomo:** dopo aver ordinato per importo, resettare i filtri non ripristina l'ordine originale
per data. La lista rimane nell'ultimo ordinamento applicato anche quando non dovrebbe. Se cambi
ordinamento più volte in sequenza, i risultati diventano inconsistenti e difficili da spiegare.

---

### Missione 2 — Il login va in crash silenzioso

Apri `login.html` e premi il pulsante **Accedi** (anche con credenziali corrette).

**Sintomo:** il form non risponde: nessun messaggio di errore, nessun redirect, nessun feedback
visivo.

---

### Missione 3 — Il saldo mostra NaN

Apri `transactions.html`. Guarda il riquadro **Saldo periodo** in alto a destra.

**Sintomo:** invece di un importo in euro, il riquadro mostra `NaN €` (o un valore assurdo).
Il totale delle transazioni non viene calcolato correttamente.

---

## Struttura del progetto

```
liparibank-day2-broken/
├── index.html              → redirect a login.html
├── login.html              → pagina di accesso
├── transactions.html       → lista transazioni con filtri e saldo
├── js/
│   ├── utils.js            → dati mock + funzioni condivise
│   ├── login.js            → controller login
│   └── transactions.js     → filtri e rendering transazioni
├── css/
│   └── main.css            → stili
└── package.json
```

Buona fortuna! 🚀
