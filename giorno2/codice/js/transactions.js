// =============================================================================
// Gestione movimenti bancari: dati mock + rendering + filtri
// =============================================================================

// Array di transazioni mock — simulazione dati da API (verranno da fetch() al G3)
// PERCHÉ const per l'array: non riassegnamo 'transactions', ma possiamo filtrare
// creando NUOVI array (immutabilità). Non usiamo let o var.
const transactions = [
  {
    id: "T001",
    type: "credit",
    amount: 2850.0,
    date: "2024-01-31",
    description: "Stipendio Gennaio",
    category: "income",
  },
  {
    id: "T002",
    type: "debit",
    amount: 1200.0,
    date: "2024-01-28",
    description: "Affitto Febbraio",
    category: "housing",
  },
  {
    id: "T003",
    type: "debit",
    amount: 127.5,
    date: "2024-01-25",
    description: "Supermercato Esselunga",
    category: "food",
  },
  {
    id: "T004",
    type: "debit",
    amount: 85.0,
    date: "2024-01-24",
    description: "Bolletta Enel",
    category: "utilities",
  },
  {
    id: "T005",
    type: "credit",
    amount: 350.0,
    date: "2024-01-20",
    description: "Rimborso spese Lipari",
    category: "income",
  },
  {
    id: "T006",
    type: "debit",
    amount: 49.99,
    date: "2024-01-18",
    description: "Netflix + Spotify",
    category: "entertainment",
  },
  {
    id: "T007",
    type: "debit",
    amount: 230.0,
    date: "2024-01-15",
    description: "Assicurazione Auto",
    category: "insurance",
  },
  {
    id: "T008",
    type: "credit",
    amount: 120.0,
    date: "2024-01-10",
    description: "Bonifico Mario Bianchi",
    category: "transfer",
  },
];

// =============================================================================
// UTILITY FUNCTIONS (in produzione queste sarebbero in utils.js importato)
// =============================================================================

/**
 * Formatta un numero come valuta EUR
 * @param {number} amount
 * @param {'credit'|'debit'} type
 * @returns {string}
 */
const formatCurrency = (amount, type) => {
  // Intl.NumberFormat: API nativa per formattazione locale-aware
  // PERCHÉ: 1250.5 → "1.250,50 €" in italiano, "€1,250.50" in inglese
  const formatted = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);

  return type === "credit" ? `+${formatted}` : `-${formatted}`;
};

/**
 * Formatta una data ISO in formato italiano leggibile
 * @param {string} dateString - es: '2024-01-31'
 * @returns {string} - es: '31 gen 2024'
 */
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

/**
 * Calcola il saldo totale dall'array di transazioni
 * @param {Array} txList
 * @returns {number}
 */
const calculateBalance = (txList) => {
  return txList.reduce((acc, t) => {
    return t.type === "credit" ? acc + t.amount : acc - t.amount;
  }, 0); // ← 0 come valore iniziale è FONDAMENTALE — senza, reduce usa T001 come acc
};

/**
 * Raggruppa transazioni per categoria usando reduce
 * @param {Array} txList
 * @returns {Object} - es: { income: [...], housing: [...] }
 */
const groupByCategory = (txList) => {
  return txList.reduce((acc, t) => {
    const key = t.category;
    // Nullish coalescing assignment: se acc[key] non esiste, inizializza array
    acc[key] ??= [];
    acc[key].push(t);
    return acc;
  }, {});
};

// =============================================================================
// RENDERING — da array di oggetti a HTML della tabella
// =============================================================================

/**
 * Crea un elemento <tr> per una transazione
 * PERCHÉ document.createElement invece di innerHTML:
 * 1. Sicuro contro XSS (nessun HTML iniettato come stringa)
 * 2. Mantiene i reference agli elementi per event listener
 * 3. Performance migliore su operazioni ripetute
 * @param {Object} transaction
 * @returns {HTMLTableRowElement}
 */
const createTransactionRow = (transaction) => {
  const { id, type, amount, date, description, category } = transaction; // destructuring!

  const tr = document.createElement("tr");
  tr.classList.add("transaction-row", `transaction-row--${type}`);
  // dataset: collega i dati al DOM senza variabili globali
  tr.dataset.transactionId = id;
  tr.dataset.amount = amount;

  // Crea ogni cella separatamente — safer di innerHTML per dati utente
  const cells = [
    { text: formatDate(date), class: "transaction-date" },
    { text: description, class: "transaction-description" },
    { text: category, class: "transaction-category" },
    {
      text: formatCurrency(amount, type),
      class: `transaction-amount transaction-amount--${type}`,
    },
  ];

  cells.forEach(({ text, class: className }) => {
    const td = document.createElement("td");
    td.className = className;
    td.textContent = text; // textContent: sicuro, non esegue HTML
    tr.appendChild(td);
  });

  return tr;
};

/**
 * Renderizza l'array di transazioni nella tabella HTML
 * @param {Array} txList - array di transazioni (può essere filtrato)
 */
const renderTransactions = (txList) => {
  const tbody = document.getElementById("transactionsBody");
  const summaryEl = document.getElementById("transactionsSummary");

  if (!tbody) return; // Guard: se la tabella non esiste, non fare nulla

  // Svuota il tbody prima di ri-renderizzare
  // PERCHÉ non innerHTML = '': mantiene intatti gli event listener sul tbody
  // (event delegation — Giorno 3). Rimuoviamo i figli manualmente.
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  if (txList.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="4" class="table-empty-state">
        Nessun movimento trovato con i filtri selezionati
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  // Crea tutti i row, aggiungi al DOM in un unico batch
  // PERCHÉ DocumentFragment: appendiamo tutti i tr a un fragment PRIMA
  // di inserirlo nel DOM — un solo reflow invece di N reflow separati
  const fragment = document.createDocumentFragment();
  txList.forEach((t) => fragment.appendChild(createTransactionRow(t)));
  tbody.appendChild(fragment);

  // Aggiorna summary
  if (summaryEl) {
    const total = calculateBalance(txList);
    summaryEl.textContent = `${txList.length} movimenti | Saldo: ${formatCurrency(Math.abs(total), total >= 0 ? "credit" : "debit")}`;
  }
};

// =============================================================================
// FILTRI — funzioni pure che ritornano nuovi array filtrati
// La lista originale `transactions` NON viene mai mutata
// =============================================================================

/**
 * Filtra e ordina le transazioni in base ai criteri selezionati
 * @param {Object} filters - { type, minAmount, maxAmount, search, sortBy, sortDir }
 * @returns {Array} - nuovo array filtrato e ordinato
 */
const applyFilters = (filters) => {
  const { type, minAmount, maxAmount, search, sortBy, sortDir } = filters;

  // Pipeline di trasformazioni — ogni step ritorna un nuovo array
  let result = [...transactions]; // shallow copy — non muta l'originale

  // Filtro per tipo (credit/debit/all)
  if (type && type !== "all") {
    result = result.filter((t) => t.type === type);
  }

  // Filtro per importo minimo
  if (minAmount) {
    result = result.filter((t) => t.amount >= parseFloat(minAmount));
  }

  // Filtro per importo massimo
  if (maxAmount) {
    result = result.filter((t) => t.amount <= parseFloat(maxAmount));
  }

  // Filtro ricerca testuale (case-insensitive)
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower),
    );
  }

  // Ordinamento — SEMPRE su una copia (sort muta l'array!)
  // sortBy può essere: 'date', 'amount', 'description'
  if (sortBy) {
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        // Confronto date: converti in timestamp numerico
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "description") {
        // localeCompare per ordinamento alfabetico corretto (supporta accenti)
        comparison = a.description.localeCompare(b.description, "it");
      }
      // sortDir: 'asc' → comparison invariata, 'desc' → invertita
      return sortDir === "desc" ? -comparison : comparison;
    });
  }

  return result;
};

// =============================================================================
// EVENT LISTENERS — filtri UI
// =============================================================================

// Legge lo stato attuale dei filtri dal DOM
const readFilters = () => ({
  type: document.getElementById("filterType")?.value ?? "all",
  minAmount: document.getElementById("filterMinAmount")?.value ?? "",
  maxAmount: document.getElementById("filterMaxAmount")?.value ?? "",
  search: document.getElementById("searchInput")?.value ?? "",
  sortBy: document.getElementById("sortBy")?.value ?? "date",
  sortDir: document.getElementById("sortDir")?.value ?? "desc",
});

// Un unico handler per tutti i filtri — DRY (Don't Repeat Yourself)
const handleFilterChange = () => {
  const filters = readFilters();
  const filtered = applyFilters(filters);
  renderTransactions(filtered);
};

// Attacca il listener a tutti i controlli filtro
[
  "filterType",
  "filterMinAmount",
  "filterMaxAmount",
  "sortBy",
  "sortDir",
].forEach((id) => {
  document.getElementById(id)?.addEventListener("change", handleFilterChange);
});

// Search input: qui al Giorno 3 aggiungeremo il DEBOUNCE
// Per ora: esegue ad ogni carattere (non ottimale per API reali)
document
  .getElementById("searchInput")
  ?.addEventListener("input", handleFilterChange);

// =============================================================================
// INIZIALIZZAZIONE — eseguita al caricamento della pagina
// =============================================================================
const initTransactions = () => {
  renderTransactions(transactions); // render iniziale con tutti i dati

  // Aggiorna il saldo in dashboard (se l'elemento esiste)
  const balanceEl = document.getElementById("totalBalance");
  if (balanceEl) {
    const total = calculateBalance(transactions);
    balanceEl.textContent = formatCurrency(
      Math.abs(total),
      total >= 0 ? "credit" : "debit",
    );
  }
};

// Esegui quando il DOM è pronto
// PERCHÉ DOMContentLoaded invece di 'load': DOMContentLoaded si attiva
// quando l'HTML è parsato (anche se immagini/CSS non sono caricate).
// 'load' aspetta tutto — spesso inutile e più lento.
// Se il <script> è in fondo al body con 'defer', DOMContentLoaded è sufficiente.
document.addEventListener("DOMContentLoaded", initTransactions);
