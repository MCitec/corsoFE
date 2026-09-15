"use strict";

function formatCurrencyDash(amount) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDateDash(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function initDashboard() {
  try {
    const [user, transactions] = await Promise.all([
      fetchUser(),
      fetchTransactions(),
    ]);
    document.getElementById("topbarUser").textContent = user.name;
    document.getElementById("statBalance").textContent = formatCurrencyDash(
      user.balance,
    );
    document.getElementById("statIban").textContent = user.iban;

    const credits = transactions.filter((tx) => tx.type === "credit");
    const debits = transactions.filter((tx) => tx.type === "debit");
    document.getElementById("statCredits").textContent = formatCurrencyDash(
      credits.reduce((sum, tx) => sum + Number(tx.amount), 0),
    );
    document.getElementById("statCreditsCount").textContent =
      `${credits.length} transazioni`;
    document.getElementById("statDebits").textContent = formatCurrencyDash(
      debits.reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0),
    );
    document.getElementById("statDebitsCount").textContent =
      `${debits.length} transazioni`;

    const tbody = document.getElementById("recentBody");
    const fragment = document.createDocumentFragment();
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .forEach((tx) => {
        const row = document.createElement("tr");
        const date = document.createElement("td");
        date.textContent = formatDateDash(tx.date);
        const description = document.createElement("td");
        description.textContent = tx.description;
        const category = document.createElement("td");
        category.textContent = tx.category;
        const amount = document.createElement("td");
        amount.className =
          tx.type === "credit" ? "amount--credit" : "amount--debit";
        amount.textContent = `${tx.type === "credit" ? "+" : ""}${formatCurrencyDash(tx.amount)}`;
        row.append(date, description, category, amount);
        fragment.appendChild(row);
      });
    tbody.replaceChildren(fragment);
  } catch (error) {
    document.getElementById("topbarUser").textContent = "Dati non disponibili";
    console.error("Errore caricamento dashboard:", error);
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
