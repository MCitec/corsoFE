function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const body = document.getElementById("transactionsBody");
  const detailPanel = document.getElementById("detailPanel");
  let controller = null;
  let transactions = [];
  let selectedId = null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  function renderRows(items) {
    transactions = items;
    if (items.length === 0) {
      body.innerHTML =
        '<tr><td colspan="5" class="state-message">Nessun movimento trovato</td></tr>';
      return;
    }
    body.innerHTML = items
      .map(
        (transaction) => `
      <tr data-transaction-id="${transaction.id}"><td>${transaction.date}</td><td>${transaction.description}</td><td>${transaction.category}</td><td>${transaction.type}</td><td class="amount amount--${transaction.type}">${formatCurrency(transaction.amount)}</td></tr>`,
      )
      .join("");
  }

  function showDetail(transaction) {
    if (selectedId === transaction.id) {
      detailPanel.hidden = true;
      selectedId = null;
      return;
    }
    selectedId = transaction.id;
    detailPanel.hidden = false;
    detailPanel.innerHTML = `<div class="detail-panel__header"><h2>Dettaglio movimento</h2><button id="closeDetail" class="icon-button" type="button" aria-label="Chiudi">&#10005;</button></div><dl class="detail-grid"><dt>ID</dt><dd>${transaction.id}</dd><dt>Data</dt><dd>${transaction.date}</dd><dt>Descrizione</dt><dd>${transaction.description}</dd><dt>Importo</dt><dd>${formatCurrency(transaction.amount)}</dd><dt>Tipo</dt><dd>${transaction.type}</dd><dt>Categoria</dt><dd>${transaction.category}</dd></dl>`;
    document
      .getElementById("closeDetail")
      .addEventListener("click", closeDetail);
  }

  function closeDetail() {
    detailPanel.hidden = true;
    selectedId = null;
  }

  async function search(query) {
    if (controller) controller.abort();
    controller = new AbortController();
    body.innerHTML =
      '<tr><td colspan="5" class="state-message">Ricerca in corso...</td></tr>';
    try {
      const results = await fetchData(
        `transactions?q=${encodeURIComponent(query)}`,
        { signal: controller.signal },
      );
      renderRows(results);
    } catch (error) {
      if (error.name !== "AbortError")
        body.innerHTML = `<tr><td colspan="5" class="state-message">${error.message}</td></tr>`;
    }
  }

  body.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (!row || !row.dataset.transactionId) return;
    const transaction = transactions.find(
      (item) => String(item.id) === row.dataset.transactionId,
    );
    if (transaction) showDetail(transaction);
  });

  input.addEventListener(
    "input",
    debounce((event) => search(event.target.value.trim()), 300),
  );
  search("");
});
