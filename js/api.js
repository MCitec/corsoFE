// =============================================================================
// Modulo API centralizzato per LipariBank Portal
// Pattern: ogni funzione gestisce i 3 stati: loading, error, success
// =============================================================================

// Configurazione centralizzata
const API_CONFIG = {
  // json-server locale oppure API pubblica mock
  BASE_URL: "http://localhost:3001",
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  TIMEOUT_MS: 10000, // 10 secondi
};

// =============================================================================
// HTTP CLIENT — wrapper su fetch con gestione errori comune
// PERCHÉ: centralizza la logica ripetitiva (headers, error handling, timeout)
// In Angular questo è HttpClient. In React è Axios o react-query.
// =============================================================================

/**
 * Esegue una richiesta HTTP con timeout e gestione errori standard
 * @param {string} url
 * @param {RequestInit} options - opzioni fetch (method, headers, body)
 * @returns {Promise<any>} - dati JSON della risposta
 * @throws {ApiError} - errore con status code e messaggio
 */
async function httpRequest(url, options = {}) {
  // AbortController: permette di cancellare la richiesta (es: timeout, navigazione)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...API_CONFIG.HEADERS, ...options.headers },
      signal: controller.signal, // collega l'abort controller alla richiesta
    });

    clearTimeout(timeoutId); // cancella il timeout se la risposta arriva in tempo

    // TRAPPOLA FETCH: status 404/500 NON lanciano eccezione!
    // fetch è "soddisfatto" se riceve una risposta HTTP valida, anche di errore.
    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorBody,
      );
    }

    // Gestisce response 204 No Content (es: DELETE con successo)
    if (response.status === 204) return null;

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Distingue errori di rete da errori HTTP
    if (error.name === "AbortError") {
      throw new ApiError("Richiesta scaduta (timeout)", 408);
    }
    if (error instanceof ApiError) throw error; // rilancia ApiError già costruito
    throw new ApiError(`Errore di rete: ${error.message}`, 0); // 0 = offline/network error
  }
}

// Custom Error class per API — porta il status code
class ApiError extends Error {
  constructor(message, statusCode, responseBody = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    this.isNetworkError = statusCode === 0;
    this.isNotFound = statusCode === 404;
    this.isUnauthorized = statusCode === 401;
    this.isServerError = statusCode >= 500;
  }
}

// =============================================================================
// API FUNCTIONS — una per risorsa
// =============================================================================

/**
 * Carica i dati del conto corrente
 * @param {string} accountId
 * @returns {Promise<{id: string, balance: number, owner: string, iban: string}>}
 */
export async function fetchAccount(accountId) {
  return httpRequest(`${API_CONFIG.BASE_URL}/accounts/${accountId}`);
}

/**
 * Carica le transazioni (con filtri opzionali)
 * @param {string} accountId
 * @param {{ type?: string, fromDate?: string, toDate?: string }} filters
 */
export async function fetchTransactions(accountId, filters = {}) {
  const params = new URLSearchParams({
    accountId,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== null),
    ),
  });
  return httpRequest(`${API_CONFIG.BASE_URL}/transactions?${params}`);
}

/**
 * Carica le filiali (per autocompletamento)
 * @param {string} query - testo di ricerca
 */
export async function fetchBranches(query) {
  return httpRequest(
    `${API_CONFIG.BASE_URL}/branches?q=${encodeURIComponent(query)}`,
  );
}

/**
 * Crea una nuova transazione
 * @param {object} transactionData
 */
export async function createTransaction(transactionData) {
  return httpRequest(`${API_CONFIG.BASE_URL}/transactions`, {
    method: "POST",
    body: JSON.stringify(transactionData),
  });
}

// =============================================================================
// UI STATE MANAGER — gestisce i 3 stati di un'operazione async
// =============================================================================

/**
 * Gestisce loading/error/success state per un container DOM
 * @param {HTMLElement} container - il div che conterrà il contenuto
 * @param {Function} fetchFn - la funzione async che carica i dati
 * @param {Function} renderFn - funzione che renderizza i dati (data => void)
 * @param {object} options - { emptyMessage, loadingRows }
 */
export async function withLoadingState(
  container,
  fetchFn,
  renderFn,
  options = {},
) {
  const { emptyMessage = "Nessun dato disponibile", loadingRows = 3 } = options;

  // STATO LOADING: mostra skeleton loader
  showSkeleton(container, loadingRows);

  try {
    const data = await fetchFn();

    // STATO EMPTY: nessun dato
    if (!data || (Array.isArray(data) && data.length === 0)) {
      showEmpty(container, emptyMessage);
      return;
    }

    // STATO SUCCESS: renderizza i dati
    container.innerHTML = "";
    renderFn(data);
  } catch (error) {
    // STATO ERROR: mostra messaggio di errore con retry
    showError(container, error, () =>
      withLoadingState(container, fetchFn, renderFn, options),
    );
  }
}

// Helper: skeleton loader
function showSkeleton(container, rows) {
  container.innerHTML = Array.from(
    { length: rows },
    () =>
      `<div class="skeleton-row" aria-hidden="true">
       <div class="skeleton skeleton--text"></div>
       <div class="skeleton skeleton--text skeleton--short"></div>
     </div>`,
  ).join("");
  container.setAttribute("aria-busy", "true"); // accessibilità: indica loading
}

// Helper: stato vuoto
function showEmpty(container, message) {
  container.innerHTML = `
    <div class="empty-state" role="status">
      <svg aria-hidden="true" class="empty-state__icon"><!-- empty icon --></svg>
      <p class="empty-state__message">${message}</p>
    </div>`;
  container.removeAttribute("aria-busy");
}

// Helper: stato errore con retry
function showError(container, error, retryFn) {
  // textContent per il messaggio di errore — mai innerHTML con dati da error
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-state__message";
  errorMsg.textContent = error.message; // SICURO: textContent

  const retryBtn = document.createElement("button");
  retryBtn.className = "btn btn--secondary";
  retryBtn.textContent = "Riprova";
  retryBtn.addEventListener("click", retryFn);

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-state";
  errorDiv.setAttribute("role", "alert");
  errorDiv.append(errorMsg, retryBtn);

  container.innerHTML = "";
  container.appendChild(errorDiv);
  container.removeAttribute("aria-busy");
}
