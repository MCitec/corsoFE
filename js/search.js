// src/js/search.js
// =============================================================================
// Ricerca movimenti con debounce — implementazione manuale (no librerie)
// =============================================================================
import { fetchTransactions } from "./api.js";
import { renderTransactions } from "./transactions.js";

// Tutte le transazioni caricate — cache locale
let cachedTransactions = [];

/**
 * Implementazione manuale di debounce
 * (duplicata qui per didattica — in produzione sarebbe in utils.js)
 */
function debounce(fn, delay) {
  let timerId = null;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
}

/**
 * Filtra le transazioni cached per testo di ricerca
 * PERCHÉ cache locale: non fare una chiamata API per ogni ricerca —
 * i dati sono già caricati, filtriamo client-side.
 * In un'app con milioni di transazioni: ricerca server-side con debounce.
 */
function filterByText(query) {
  if (!query) {
    renderTransactions(cachedTransactions);
    return;
  }

  const queryLower = query.toLowerCase();
  const filtered = cachedTransactions.filter(
    (t) =>
      t.description.toLowerCase().includes(queryLower) ||
      t.category.toLowerCase().includes(queryLower) ||
      t.amount.toString().includes(query),
  );

  renderTransactions(filtered);

  // Aggiorna count risultati — accessibilità: aria-live comunica a screen reader
  const resultCount = document.getElementById("searchResultCount");
  if (resultCount) {
    resultCount.textContent = `${filtered.length} movimenti trovati`;
  }
}

// Versione debounced: esegue filterByText solo dopo 300ms di silenzio
const debouncedFilter = debounce((event) => {
  filterByText(event.target.value.trim());
}, 300);

// Versione con ricerca SERVER-SIDE (quando i dati sono troppi per client-side)
let latestServerRequest = 0;

const debouncedServerSearch = debounce(async (event) => {
  const query = event.target.value.trim();
  if (query.length < 2) return; // minimo 2 caratteri prima di fare la richiesta
  const requestId = ++latestServerRequest;

  try {
    const results = await fetchTransactions("ACC-001", { search: query });
    if (requestId !== latestServerRequest) return;
    renderTransactions(results);
  } catch (error) {
    if (requestId !== latestServerRequest) return;
    console.error("Errore nella ricerca:", error);
  }
}, 400);

// =============================================================================
// INIZIALIZZAZIONE
// =============================================================================
export async function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // Carica transazioni iniziali
  try {
    cachedTransactions = await fetchTransactions("ACC-001");
    renderTransactions(cachedTransactions);
  } catch (error) {
    console.error("Errore caricamento transazioni:", error);
  }

  // Attacca il listener debounced
  searchInput.addEventListener("input", debouncedFilter);

  // Clear button
  const clearBtn = document.getElementById("searchClear");
  clearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    filterByText("");
    searchInput.focus();
  });
}
/*> // MODERNO: fetch + delegation + textContent
> const data = await fetchTransactions('ACC-001');
> const fragment = document.createDocumentFragment();
> data.forEach(t => fragment.appendChild(createTransactionRow(t))); // usa textContent
> document.querySelector('tbody').appendChild(fragment);
> document.querySelector('tbody').addEventListener('click', e => {
>   const row = e.target.closest('[data-transaction-id]');
>   if (row) openDetail(row.dataset.transactionId);
> });
>*/
