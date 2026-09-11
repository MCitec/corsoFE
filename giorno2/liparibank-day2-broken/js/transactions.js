/**
 * transactions.js — Filtri, ordinamento e rendering transazioni
 * LipariBank Day 2
 */

"use strict";

// =============================================================================
// Rendering
// =============================================================================

function renderTransactions(list) {
  const tbody = document.getElementById("transactions-body");
  const emptyState = document.getElementById("empty-state");

  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  tbody.innerHTML = list
    .map((tx) => {
      const isCredit = tx.type === "credit";
      const amountClass = isCredit ? "amount--credit" : "amount--debit";
      const amountSign = isCredit ? "+" : "";
      const typeLabel = isCredit ? "Entrata" : "Uscita";
      const typeBadge = isCredit ? "badge--success" : "badge--neutral";

      return `
      <tr>
        <td class="col-date">${formatDate(tx.date)}</td>
        <td>${tx.description}</td>
        <td><span class="badge ${getCategoryBadgeClass(tx.category)}">${tx.category}</span></td>
        <td><span class="badge ${typeBadge}">${typeLabel}</span></td>
        <td class="col-amount ${amountClass}">
          ${amountSign}${formatCurrency(tx.amount)}
        </td>
      </tr>
    `;
    })
    .join("");
}

// =============================================================================
// Riepilogo saldo
// =============================================================================

function updateSummary(list) {
  const balanceEl = document.getElementById("balance-value");
  const countEl = document.getElementById("tx-count");

  if (balanceEl) {
    const balance = calculateBalance(list);
    balanceEl.textContent = formatCurrency(balance);

    // Applica classe colore (NaN è falsy per entrambi i confronti → nessuna classe)
    balanceEl.className = "stat-card__value";
    if (balance > 0) balanceEl.classList.add("stat-card__value--positive");
    if (balance < 0) balanceEl.classList.add("stat-card__value--negative");
  }

  if (countEl) {
    countEl.textContent = list.length;
  }

  // Riepilogo entrate / uscite nel footer
  const creditsEl = document.getElementById("total-credits");
  const debitsEl = document.getElementById("total-debits");

  if (creditsEl) {
    const credits = list
      .filter((tx) => tx.type === "credit")
      .reduce((acc, tx) => acc + Number(tx.amount), 0); // usa Number() per sicurezza
    creditsEl.textContent = formatCurrency(credits);
  }

  if (debitsEl) {
    const debits = list
      .filter((tx) => tx.type === "debit")
      .reduce((acc, tx) => acc + Math.abs(Number(tx.amount)), 0);
    debitsEl.textContent = formatCurrency(debits);
  }
}

// =============================================================================
// Filtri e ordinamento
// =============================================================================

function applyFilters() {
  const typeFilter = document.getElementById("filter-type")?.value || "all";
  const categoryFilter =
    document.getElementById("filter-category")?.value || "all";
  const sortBy = document.getElementById("sort-select")?.value || "date-desc";

  const sorted = [...transactions].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // Filtra dopo l'ordinamento della copia
  const filtered = sorted.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (categoryFilter !== "all" && tx.category !== categoryFilter)
      return false;
    return true;
  });

  renderTransactions(filtered);
  updateSummary(filtered);
}

// =============================================================================
// Inizializzazione
// =============================================================================

function initFilters() {
  const filterType = document.getElementById("filter-type");
  const filterCategory = document.getElementById("filter-category");
  const sortSelect = document.getElementById("sort-select");
  const resetBtn = document.getElementById("reset-filters");

  if (filterType) filterType.addEventListener("change", applyFilters);
  if (filterCategory) filterCategory.addEventListener("change", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (filterType) filterType.value = "all";
      if (filterCategory) filterCategory.value = "all";
      if (sortSelect) sortSelect.value = "date-desc";
      applyFilters();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
  initFilters();
});
