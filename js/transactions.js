/**
 * transactions.js — Filtri, ordinamento e rendering transazioni
 * LipariBank Day 2
 */

"use strict";

import {
  calculateBalance,
  formatCurrency,
  formatDate,
  getCategoryBadgeClass,
  transactions,
} from "./utils.js";

// =============================================================================
// Rendering
// =============================================================================

export function renderTransactions(list) {
  const tbody = document.getElementById("transactions-body");
  const emptyState = document.getElementById("empty-state");

  if (!tbody) return;

  if (list.length === 0) {
    tbody.replaceChildren();
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  const fragment = document.createDocumentFragment();

  list.forEach((tx) => {
    const isCredit = tx.type === "credit";
    const typeLabel = isCredit ? "Entrata" : "Uscita";
    const row = document.createElement("tr");
    row.dataset.transactionId = tx.id;

    const dateCell = document.createElement("td");
    dateCell.className = "col-date";
    dateCell.textContent = formatDate(tx.date);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = tx.description;

    const categoryCell = document.createElement("td");
    const categoryBadge = document.createElement("span");
    categoryBadge.className = `badge ${getCategoryBadgeClass(tx.category)}`;
    categoryBadge.textContent = tx.category;
    categoryCell.appendChild(categoryBadge);

    const typeCell = document.createElement("td");
    const typeBadge = document.createElement("span");
    typeBadge.className = `badge ${isCredit ? "badge--success" : "badge--neutral"}`;
    typeBadge.textContent = typeLabel;
    typeCell.appendChild(typeBadge);

    const amountCell = document.createElement("td");
    amountCell.className = `col-amount ${isCredit ? "amount--credit" : "amount--debit"}`;
    amountCell.textContent = `${isCredit ? "+" : "-"}${formatCurrency(Math.abs(Number(tx.amount)))}`;

    row.append(dateCell, descriptionCell, categoryCell, typeCell, amountCell);
    fragment.appendChild(row);
  });

  tbody.replaceChildren(fragment);
}

function initRowDelegation() {
  const tbody = document.getElementById("transactions-body");
  if (!tbody) return;

  tbody.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-transaction-id]");
    if (!row || !tbody.contains(row)) return;

    if (typeof openDetail === "function") {
      openDetail(row.dataset.transactionId);
    }
  });
}

// =============================================================================
// Riepilogo saldo
// =============================================================================

function updateSummary(list, summaryList = list) {
  const balanceEl = document.getElementById("balance-value");
  const countEl = document.getElementById("tx-count");

  if (balanceEl) {
    const balance = calculateBalance(summaryList);
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
    const credits = summaryList
      .filter((tx) => tx.type === "credit")
      .reduce((acc, tx) => acc + Number(tx.amount), 0); // usa Number() per sicurezza
    creditsEl.textContent = formatCurrency(credits);
  }

  if (debitsEl) {
    const debits = summaryList
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

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (categoryFilter !== "all" && tx.category !== categoryFilter)
      return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
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

  renderTransactions(sorted);
  updateSummary(sorted, transactions);
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
  initRowDelegation();
});
