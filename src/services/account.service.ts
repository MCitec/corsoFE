'use strict';

import type { Account, Transaction } from '../models/account.model';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../models/account.model';

export async function fetchAccounts(baseUrl: string): Promise<Account[]> {
  const res = await fetch(`${baseUrl}/accounts`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json() as Promise<Account[]>;
}

export async function fetchTransactions(baseUrl: string): Promise<Transaction[]> {
  const res = await fetch(`${baseUrl}/transactions`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json() as Promise<Transaction[]>;
}

export function getMockAccounts(): Account[] {
  return MOCK_ACCOUNTS;
}

export function getMockTransactions(): Transaction[] {
  return MOCK_TRANSACTIONS;
}
