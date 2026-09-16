import type { ITransaction } from "../models";
import { formatCurrency, formatDate } from "../utils/format.utils";

export function renderTransactionRow(
  transaction: ITransaction,
): HTMLTableRowElement {
  const row: HTMLTableRowElement = document.createElement("tr");
  const values: string[] = [
    formatDate(transaction.date),
    transaction.description,
    transaction.category,
    formatCurrency(transaction.amount),
    transaction.type,
  ];

  for (const value of values) {
    const cell: HTMLTableCellElement = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  }

  return row;
}

export function renderTransactionsTable(
  container: HTMLElement,
  transactions: ITransaction[],
): void {
  container.replaceChildren(
    ...transactions.map(
      (transaction: ITransaction): HTMLTableRowElement =>
        renderTransactionRow(transaction),
    ),
  );
}

export function renderTransactionsFromTableId(
  transactions: ITransaction[],
): void {
  const table: HTMLTableElement | null =
    document.querySelector<HTMLTableElement>("#transactionsTable");
  if (table === null) {
    return;
  }

  const container: HTMLElement | null =
    table.querySelector<HTMLElement>("#transactionsBody");
  if (container !== null) {
    renderTransactionsTable(container, transactions);
  }
}
