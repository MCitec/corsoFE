const API_URL = "http://localhost:3001/transactions";

function debounce(callback, delay) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delay);
  };
}

function createStatusElement(className, text) {
  const element = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 5;
  cell.className = className;
  cell.textContent = text;
  element.appendChild(cell);
  return element;
}

export function initRealTimeSearch({
  input = "#searchInput",
  clearButton = "#searchClear",
  resultCount = "#searchResultCount",
  resultsContainer = "#transactionsBody",
  onResults = () => {},
  apiUrl = API_URL,
  delay = 300,
} = {}) {
  const searchInput = document.querySelector(input);
  if (!searchInput) return null;

  const resultCountElement = document.querySelector(resultCount);
  const resultsElement = document.querySelector(resultsContainer);
  const clearButtonElement = document.querySelector(clearButton);
  let abortController = null;
  let lastQuery = "";

  const spinnerStyle = document.createElement("style");
  spinnerStyle.textContent =
    "@keyframes search-spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(spinnerStyle);

  function updateCount(count) {
    if (resultCountElement) {
      resultCountElement.textContent = `${count} movimenti trovati`;
    }
  }

  function showLoading() {
    if (!resultsElement) return;
    const loadingRow = createStatusElement(
      "search-state search-state--loading",
      "Caricamento...",
    );
    const spinner = document.createElement("span");
    spinner.className = "search-spinner";
    spinner.style.cssText =
      "display:inline-block;width:14px;height:14px;margin-right:8px;border:2px solid #e9ecef;border-top-color:#1a3c5e;border-radius:50%;vertical-align:-2px;animation:search-spin .7s linear infinite";
    spinner.setAttribute("aria-hidden", "true");
    loadingRow.firstElementChild.prepend(spinner);
    resultsElement.replaceChildren(loadingRow);
  }

  function showEmpty(query) {
    if (!resultsElement) return;
    resultsElement.replaceChildren(
      createStatusElement(
        "search-state search-state--empty",
        `Nessun risultato per '${query}'`,
      ),
    );
  }

  function showError(message) {
    if (!resultsElement) return;
    resultsElement.replaceChildren(
      createStatusElement("search-state search-state--error", message),
    );
  }

  async function search(query) {
    lastQuery = query;

    if (abortController) abortController.abort();
    abortController = new AbortController();

    if (!query) {
      updateCount(0);
      onResults([]);
      return;
    }

    showLoading();

    try {
      const response = await fetch(
        `${apiUrl}?search=${encodeURIComponent(query)}`,
        { signal: abortController.signal },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const results = await response.json();
      if (query !== lastQuery) return;

      updateCount(results.length);
      if (results.length === 0) showEmpty(query);
      onResults(results);
    } catch (error) {
      if (error.name === "AbortError" || query !== lastQuery) return;

      showError("Impossibile caricare i movimenti.");
      const retryButton = document.createElement("button");
      retryButton.type = "button";
      retryButton.className = "search-retry";
      retryButton.textContent = "Riprova";
      retryButton.addEventListener("click", () => search(query));
      const retryRow = createStatusElement(
        "search-state search-state--error",
        "",
      );
      retryRow.firstElementChild.appendChild(retryButton);
      resultsElement?.appendChild(retryRow);
    }
  }

  const debouncedSearch = debounce((event) => {
    search(event.target.value.trim());
  }, delay);

  searchInput.addEventListener("input", debouncedSearch);
  clearButtonElement?.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    search("");
  });

  return { search, destroy: () => abortController?.abort() };
}
