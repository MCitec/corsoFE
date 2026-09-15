const transactions = [
  {
    id: "T001",
    date: "2024-01-15",
    description: "Stipendio Gennaio",
    amount: 2800,
    type: "credit",
  },
  {
    id: "T002",
    date: "2024-01-14",
    description: "Affitto Gennaio",
    amount: 950,
    type: "debit",
  },
  {
    id: "T003",
    date: "2024-01-12",
    description: "Spesa supermercato",
    amount: 124.5,
    type: "debit",
  },
  {
    id: "T004",
    date: "2024-01-10",
    description: "Bonifico ricevuto",
    amount: 450,
    type: "credit",
  },
  {
    id: "T005",
    date: "2024-01-09",
    description: "Bolletta luce",
    amount: 86.3,
    type: "debit",
  },
  {
    id: "T006",
    date: "2024-01-07",
    description: "Rimborso spese",
    amount: 175,
    type: "credit",
  },
  {
    id: "T007",
    date: "2024-01-05",
    description: "Abbonamento trasporti",
    amount: 42,
    type: "debit",
  },
  {
    id: "T008",
    date: "2024-01-03",
    description: "Interessi bancari",
    amount: 12.75,
    type: "credit",
  },
  {
    id: "T009",
    date: "2024-01-02",
    description: "Cena ristorante",
    amount: 68,
    type: "debit",
  },
  {
    id: "T010",
    date: "2024-01-01",
    description: "Premio produzione",
    amount: 1200,
    type: "credit",
  },
];

function renderTransactionsTable(items) {
  const tableBody = document.getElementById("transactionsBody");
  if (!tableBody) return;

  tableBody.replaceChildren();

  items.forEach((transaction) => {
    const row = document.createElement("tr");
    row.dataset.transactionId = transaction.id;

    const idCell = document.createElement("td");
    idCell.textContent = transaction.id;
    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(transaction.date);
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = transaction.description;
    const typeCell = document.createElement("td");
    typeCell.textContent = transaction.type === "credit" ? "Entrata" : "Uscita";
    const amountCell = document.createElement("td");
    amountCell.className =
      transaction.type === "credit"
        ? "amount amount--credit"
        : "amount amount--debit";
    amountCell.textContent = `${transaction.type === "credit" ? "+" : "-"} ${formatCurrency(transaction.amount)}`;

    row.append(idCell, dateCell, descriptionCell, typeCell, amountCell);
    tableBody.appendChild(row);
  });
}

const transactionsBody = document.getElementById("transactionsBody");

if (transactionsBody) {
  const typeFilter = document.getElementById("typeFilter");
  const minimumAmount = document.getElementById("minimumAmount");
  const sortSelect = document.getElementById("sortSelect");

  function refreshTransactions() {
    const selectedType = typeFilter.value;
    const minimum =
      minimumAmount.value === "" ? 0 : Number(minimumAmount.value);
    const [sortKey, direction] = sortSelect.value.split("-");

    const filteredTransactions = transactions.filter((transaction) => {
      const matchesType =
        selectedType === "all" || transaction.type === selectedType;
      return matchesType && transaction.amount >= minimum;
    });

    renderTransactionsTable(sortBy(filteredTransactions, sortKey, direction));
  }

  [typeFilter, minimumAmount, sortSelect].forEach((control) => {
    control.addEventListener("change", refreshTransactions);
    control.addEventListener("input", refreshTransactions);
  });

  renderTransactionsTable(transactions);
  console.log(transactions);
}
