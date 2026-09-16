'use strict';

import { MOCK_TRANSACTIONS, Transaction } from '../models/transaction.model';

export class TransactionService {
  private transactions: Transaction[] = MOCK_TRANSACTIONS;

  getAll(): Transaction[] {
    return this.transactions;
  }

  search(query: string): Transaction[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.transactions;
    return this.transactions.filter(
      tx =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q),
    );
  }

  getBalance(): number {
    return this.transactions.reduce((sum, tx) => {
      return tx.type === 'credit' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }
}
