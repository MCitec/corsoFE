"use strict";

function formatCurrency(amount) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Math.abs(Number(amount)));
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

let transactionsMap = {};
let currentDetailId = null;

function setTransactions(list) {
  transactionsMap = {};
  (list || []).forEach((tx) => {
    transactionsMap[String(tx.id)] = tx;
  });
}

function showTransactionDetail(txId) {
  const panel = document.getElementById("detailPanel");
  const tx = transactionsMap[String(txId)];
  if (!tx || !panel) return;

  if (
    currentDetailId === String(txId) &&
    panel.classList.contains("panel--visible")
  ) {
    panel.classList.remove("panel--visible");
    currentDetailId = null;
    return;
  }

  currentDetailId = String(txId);
  document.getElementById("detailDescription").textContent = tx.description;
  document.getElementById("detailDate").textContent = formatDate(tx.date);
  document.getElementById("detailCategory").textContent = tx.category;
  document.getElementById("detailAmount").textContent = formatCurrency(
    tx.amount,
  );
  panel.classList.add("panel--visible");
}

function renderTransactions(list) {
  const tbody = document.getElementById("transactionsBody");
  if (!tbody) return;

  const fragment = document.createDocumentFragment();
  (list || []).forEach((tx) => {
    const row = document.createElement("tr");
    row.dataset.id = tx.id;

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(tx.date);
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = tx.description;
    const categoryCell = document.createElement("td");
    categoryCell.textContent = tx.category;
    const typeCell = document.createElement("td");
    typeCell.textContent = tx.type === "credit" ? "Entrata" : "Uscita";
    const amountCell = document.createElement("td");
    amountCell.className =
      tx.type === "credit" ? "amount--credit" : "amount--debit";
    amountCell.textContent = `${tx.type === "credit" ? "+" : ""}${formatCurrency(tx.amount)}`;

    row.append(dateCell, descriptionCell, categoryCell, typeCell, amountCell);
    fragment.appendChild(row);
  });
  tbody.replaceChildren(fragment);
}
