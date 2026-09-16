"use strict";

import { TransactionService } from "../services/transaction.service";
import { Transaction } from "../models/transaction.model";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderRows(list: Transaction[]): void {
  const tbody = document.getElementById("transactionsBody");
  if (!tbody) return;

  if (!list || list.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="state-empty">Nessuna transazione trovata.</td></tr>';
    return;
  }

  tbody.innerHTML = list
    .map((tx: Transaction) => {
      const isCredit = tx.type === "credit";
      const sign = isCredit ? "+" : "-";
      const cssClass = isCredit ? "amount--credit" : "amount--debit";
      const formatted = formatCurrency(tx.amount);
      return `
        <tr>
          <td style="color:var(--muted);font-size:13px">${formatDate(tx.date)}</td>
          <td>${tx.description}</td>
          <td><span class="badge">${tx.category}</span></td>
          <td style="text-align:right" class="${cssClass}">${sign}${formatted}</td>
        </tr>`;
    })
    .join("");
}

export function initTransactionsUI(service: TransactionService): void {
  const transactions = service.getAll();
  renderRows(transactions);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (event: Event) => {
      const query = (event.currentTarget as HTMLInputElement).value;
      const results = service.search(query);
      renderRows(results);
    });
  }

  const balanceEl = document.getElementById("balance");
  if (balanceEl) {
    const balance = service.getBalance();
    balanceEl.textContent = formatCurrency(balance);
  }
}
