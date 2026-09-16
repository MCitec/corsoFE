import type { ITransaction } from "./transaction.model";

/** Calculates credits minus debits, returning zero for an empty array. */
export function calculateNetBalance(transactions: ITransaction[]): number {
  return transactions.reduce<number>(
    (balance: number, transaction: ITransaction): number =>
      transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount,
    0,
  );
}

/** Groups debit amounts by transaction category. */
export function getSpendingByCategory(
  transactions: ITransaction[],
): Map<string, number> {
  const spending: Map<string, number> = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type === "debit") {
      spending.set(
        transaction.category,
        (spending.get(transaction.category) ?? 0) + transaction.amount,
      );
    }
  }

  return spending;
}

/** Returns the net balance for each of the last N months represented by the data. */
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

  const latestTimestamp: number = transactions.reduce<number>(
    (latest: number, transaction: ITransaction): number =>
      Math.max(latest, Date.parse(transaction.date)),
    Number.NEGATIVE_INFINITY,
  );
  if (!Number.isFinite(latestTimestamp)) {
    return [];
  }

  const latestDate: Date = new Date(latestTimestamp);
  const months: { month: string; balance: number }[] = [];
  const monthCount: number = Math.floor(lastNMonths);

  for (let offset: number = monthCount - 1; offset >= 0; offset -= 1) {
    const date: Date = new Date(
      Date.UTC(
        latestDate.getUTCFullYear(),
        latestDate.getUTCMonth() - offset,
        1,
      ),
    );
    const month: string = date.toISOString().slice(0, 7);
    const balance: number = transactions.reduce<number>(
      (total: number, transaction: ITransaction): number => {
        if (transaction.date.slice(0, 7) !== month) {
          return total;
        }
        return transaction.type === "credit"
          ? total + transaction.amount
          : total - transaction.amount;
      },
      0,
    );
    months.push({ month, balance });
  }

  return months;
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
    .reduce<
      ITransaction | undefined
    >((largest: ITransaction | undefined, transaction: ITransaction): ITransaction => (largest === undefined || transaction.amount > largest.amount ? transaction : largest), undefined);
}

/** Returns a generic page of items together with navigation metadata. */
export function paginateTransactions<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; hasNext: boolean; hasPrev: boolean; total: number } {
  const total: number = items.length;
  const safePage: number = Math.max(1, Math.floor(page));
  const safePageSize: number = Math.max(1, Math.floor(pageSize));
  const start: number = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    hasNext: start + safePageSize < total,
    hasPrev: safePage > 1 && total > 0,
    total,
  };
}
