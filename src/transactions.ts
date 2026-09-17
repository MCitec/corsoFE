'use strict';

import type { Transaction } from './models/account.model';
import { getMockTransactions } from './services/account.service';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function renderTransactions(list: Transaction[]): void {
  const tbody = document.getElementById('transactionsBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="state-empty">Nessuna transazione trovata.</td></tr>';
    return;
  }

  tbody.innerHTML = list
    .map(tx => {
      const isCredit    = tx.type === 'credit';
      const amountClass = isCredit ? 'amount--credit' : 'amount--debit';
      const sign        = isCredit ? '+' : '-';
      return `
        <tr>
          <td style="color:var(--muted);font-size:13px">${formatDate(tx.date)}</td>
          <td>${tx.description}</td>
          <td><span class="badge">${tx.category}</span></td>
          <td style="text-align:right" class="${amountClass}">
            ${sign}${formatCurrency(tx.amount)}
          </td>
        </tr>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTransactions(getMockTransactions());
});
