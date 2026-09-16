document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  const recentBody = document.getElementById("recentBody");

  function showSkeleton() {
    content.innerHTML = `
      <div class="skeleton-grid" aria-busy="true" aria-label="Caricamento">
        <div class="skeleton skeleton--large"></div>
        <div class="skeleton skeleton--large"></div>
        <div class="skeleton skeleton--large"></div>
      </div>`;
  }

  function showError(error) {
    content.innerHTML = `
      <section class="state state--error" role="alert">
        <h2>Impossibile caricare la dashboard</h2>
        <p>${error.message}. Verifica che json-server sia attivo.</p>
        <button class="button" id="retryButton" type="button">Riprova</button>
      </section>`;
    document
      .getElementById("retryButton")
      .addEventListener("click", loadDashboard);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  function render(user, transactions) {
    const credits = transactions.filter(
      (transaction) => transaction.type === "credit",
    );
    const debits = transactions.filter(
      (transaction) => transaction.type === "debit",
    );
    content.innerHTML = `
      <section class="stats-grid">
        <article class="card card--accent"><span class="card__label">Saldo disponibile</span><strong class="card__value">${formatCurrency(user.balance)}</strong><span class="card__sub">${user.iban}</span></article>
        <article class="card"><span class="card__label">Entrate recenti</span><strong class="card__value">${formatCurrency(credits.reduce((sum, item) => sum + item.amount, 0))}</strong><span class="card__sub">${credits.length} movimenti</span></article>
        <article class="card"><span class="card__label">Uscite recenti</span><strong class="card__value">${formatCurrency(Math.abs(debits.reduce((sum, item) => sum + item.amount, 0)))}</strong><span class="card__sub">${debits.length} movimenti</span></article>
      </section>
      <section class="card"><div class="section-header"><h2>Movimenti recenti</h2><a href="transactions.html">Vedi tutti</a></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Descrizione</th><th>Categoria</th><th>Importo</th></tr></thead><tbody id="recentBody"></tbody></table></div></section>`;
    const body = document.getElementById("recentBody");
    if (transactions.length === 0) {
      body.innerHTML =
        '<tr><td colspan="4" class="state-message">Nessun movimento recente</td></tr>';
      return;
    }
    body.innerHTML = transactions
      .map(
        (transaction) => `
      <tr><td>${transaction.date}</td><td>${transaction.description}</td><td>${transaction.category}</td><td class="amount amount--${transaction.type}">${formatCurrency(transaction.amount)}</td></tr>`,
      )
      .join("");
  }

  async function loadDashboard() {
    showSkeleton();
    try {
      const [user, transactions] = await Promise.all([
        fetchData("users/1"),
        fetchData("transactions?_limit=5&_sort=date&_order=desc"),
      ]);
      render(user, transactions);
    } catch (error) {
      showError(error);
    }
  }

  loadDashboard();
});
