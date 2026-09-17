"use strict";

import type { Account } from "../models/account.model";
import { fetchAccounts, getMockAccounts } from "../services/account.service";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function renderAccountCard(account: Account): string {
  return `
    <div class="account-card">
      <p class="account-card__iban">${account.iban}</p>
      <p class="account-card__holder">${account.holder}</p>
      <p class="account-card__balance">${formatCurrency(account.balance)}</p>
      <a href="transactions.html" class="btn btn--primary">Vedi movimenti</a>
    </div>`;
}

async function loadAccounts(baseUrl: string): Promise<Account[]> {
  try {
    return await fetchAccounts(baseUrl);
  } catch {
    return getMockAccounts();
  }
}

export async function initDashboard(): Promise<void> {
  const container = document.getElementById("accountsList");
  if (!container) return;

  container.innerHTML = '<p class="state-loading">Caricamento conti…</p>';

  const baseUrl = import.meta.env.VITE_API_URL;
  const accounts = baseUrl ? await loadAccounts(baseUrl) : getMockAccounts();

  if (accounts.length === 0) {
    container.innerHTML = '<p class="state-empty">Nessun conto trovato.</p>';
    return;
  }

  container.innerHTML = accounts.map(renderAccountCard).join("");
}
