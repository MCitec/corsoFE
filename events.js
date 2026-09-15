"use strict";

function handleRowClick(event) {
  const row = event.target.closest("tr[data-id]");
  if (!row) return;

  document.querySelectorAll("#transactionsBody tr").forEach((item) => {
    item.classList.remove("row--selected");
  });
  row.classList.add("row--selected");
  showTransactionDetail(row.dataset.id);
}

function initTableEvents() {
  const tbody = document.getElementById("transactionsBody");
  if (!tbody) return;
  tbody.addEventListener("click", handleRowClick);
}
