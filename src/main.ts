import { fetchTransactions } from "./services/transaction.service";
import { renderTransactionsTable } from "./ui/transactions.ui";

async function init(): Promise<void> {
  const container: HTMLElement | null =
    document.getElementById("transactionsBody");
  if (container === null) {
    return;
  }

  const transactions = await fetchTransactions();
  renderTransactionsTable(container, transactions);
}

document.addEventListener("DOMContentLoaded", (): void => {
  void init();
});
