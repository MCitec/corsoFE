import { fetchData } from "./api.service";
import type { ITransaction, ITransactionFilters } from "../models";

export async function fetchTransactions(): Promise<ITransaction[]> {
  return fetchData<ITransaction[]>("transactions");
}

export function filterTransactions(
  transactions: ITransaction[],
  filters: ITransactionFilters,
): ITransaction[] {
  const normalizedQuery: string =
    filters.searchQuery?.trim().toLowerCase() ?? "";

  return transactions.filter((transaction: ITransaction): boolean => {
    const matchesType: boolean =
      filters.type === undefined || transaction.type === filters.type;
    const matchesAmount: boolean =
      filters.minAmount === undefined ||
      transaction.amount >= filters.minAmount;
    const matchesQuery: boolean =
      normalizedQuery === "" ||
      transaction.description.toLowerCase().includes(normalizedQuery);

    return matchesType && matchesAmount && matchesQuery;
  });
}

export function sortTransactions(
  transactions: ITransaction[],
  key: keyof ITransaction,
  direction: "asc" | "desc",
): ITransaction[] {
  const multiplier: number = direction === "asc" ? 1 : -1;

  return [...transactions].sort(
    (left: ITransaction, right: ITransaction): number => {
      const leftValue: ITransaction[keyof ITransaction] = left[key];
      const rightValue: ITransaction[keyof ITransaction] = right[key];

      if (leftValue < rightValue) {
        return -1 * multiplier;
      }
      if (leftValue > rightValue) {
        return multiplier;
      }
      return 0;
    },
  );
}
