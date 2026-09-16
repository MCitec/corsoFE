/** Categories available for account transactions. */
export enum TransactionCategory {
  Work = "Lavoro",
  Home = "Casa",
  Groceries = "Alimentari",
  Utilities = "Utenze",
  Entertainment = "Intrattenimento",
  Health = "Salute",
  Dining = "Ristorazione",
  Transport = "Trasporti",
  Other = "Altro",
}

/** A normalized bank-account transaction. */
export interface ITransaction {
  id: string | number;
  accountId: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  description: string;
  category: TransactionCategory;
  currency: string;
}

/** Calculates credits minus debits, returning zero for an empty collection. */
export function calculateNetBalance(transactions: ITransaction[]): number {
  return transactions.reduce<number>(
    (balance: number, transaction: ITransaction): number => {
      return transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount;
    },
    0,
  );
}

/** Groups debit amounts by category, returning an empty map when there are no transactions. */
export function getSpendingByCategory(
  transactions: ITransaction[],
): Map<string, number> {
  const spendingByCategory: Map<string, number> = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "debit") {
      continue;
    }

    const currentAmount: number =
      spendingByCategory.get(transaction.category) ?? 0;
    spendingByCategory.set(
      transaction.category,
      currentAmount + transaction.amount,
    );
  }

  return spendingByCategory;
}

/** Returns net balance for each of the last N calendar months in YYYY-MM format. */
export function getMonthlyTrend(
  transactions: ITransaction[],
  lastNMonths: number,
): { month: string; balance: number }[] {
  if (
    transactions.length === 0 ||
    lastNMonths <= 0 ||
    !Number.isFinite(lastNMonths)
  ) {
    return [];
  }

  const monthCount: number = Math.floor(lastNMonths);
  if (monthCount === 0) {
    return [];
  }

  const latestDate: number = transactions.reduce<number>(
    (latestTimestamp: number, transaction: ITransaction): number => {
      const timestamp: number = Date.parse(transaction.date);
      return Number.isNaN(timestamp)
        ? latestTimestamp
        : Math.max(latestTimestamp, timestamp);
    },
    Number.NEGATIVE_INFINITY,
  );

  if (latestDate === Number.NEGATIVE_INFINITY) {
    return [];
  }

  const latest: Date = new Date(latestDate);
  const result: { month: string; balance: number }[] = [];

  for (let offset: number = monthCount - 1; offset >= 0; offset -= 1) {
    const monthDate: Date = new Date(
      Date.UTC(latest.getUTCFullYear(), latest.getUTCMonth() - offset, 1),
    );
    const month: string = monthDate.toISOString().slice(0, 7);
    const balance: number = transactions.reduce<number>(
      (monthlyBalance: number, transaction: ITransaction): number => {
        const transactionDate: Date = new Date(transaction.date);
        if (transactionDate.toISOString().slice(0, 7) !== month) {
          return monthlyBalance;
        }

        return transaction.type === "credit"
          ? monthlyBalance + transaction.amount
          : monthlyBalance - transaction.amount;
      },
      0,
    );

    result.push({ month, balance });
  }

  return result;
}

/** Finds the transaction with the greatest amount, optionally limited by type. */
export function findLargestTransaction(
  transactions: ITransaction[],
  type?: "credit" | "debit",
): ITransaction | undefined {
  return transactions
    .filter(
      (transaction: ITransaction): boolean =>
        type === undefined || transaction.type === type,
    )
    .reduce<ITransaction | undefined>(
      (
        largest: ITransaction | undefined,
        transaction: ITransaction,
      ): ITransaction => {
        return largest === undefined || transaction.amount > largest.amount
          ? transaction
          : largest;
      },
      undefined,
    );
}

/** Returns a 1-based page of items and navigation metadata without mutating the source array. */
export function paginateTransactions<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; hasNext: boolean; hasPrev: boolean; total: number } {
  const total: number = items.length;
  const normalizedPageSize: number = Math.max(1, Math.floor(pageSize));
  const normalizedPage: number = Math.max(1, Math.floor(page));
  const start: number = (normalizedPage - 1) * normalizedPageSize;

  return {
    items: items.slice(start, start + normalizedPageSize),
    hasNext: start + normalizedPageSize < total,
    hasPrev: normalizedPage > 1 && total > 0,
    total,
  };
}
