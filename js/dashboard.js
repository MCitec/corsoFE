// =============================================================================
// Dashboard LipariBank — fetcha dati al caricamento, rendering dinamico
// =============================================================================
import { fetchAccount, fetchTransactions, withLoadingState } from "./api.js";
import { formatCurrency, formatDate } from "./utils.js";

// ID account hardcoded per ora — al Giorno 4 (TypeScript) verrà da sessione autenticata
const CURRENT_ACCOUNT_ID = "ACC-001";

// =============================================================================
// RENDERING FUNCTIONS
// =============================================================================

const renderBalanceWidget = (account) => {
  const balanceEl = document.getElementById("balanceAmount");
  if (!balanceEl) return;

  // Anima il numero (counter animation — effetto visivo premium)
  animateCounter(balanceEl, 0, account.balance, 1000);
  balanceEl.setAttribute(
    "aria-label",
    `Saldo: ${formatCurrency(account.balance, "credit")}`,
  );
};

const renderRecentTransactions = (transactions) => {
  const list = document.getElementById("recentTransactionsList");
  if (!list) return;

  // Prende solo le ultime 5 transazioni
  const recent = transactions.slice(0, 5);

  list.innerHTML = ""; // svuota skeleton

  const fragment = document.createDocumentFragment();
  recent.forEach((t) => {
    const li = document.createElement("li");
    li.className = "transaction-preview-item";
    li.dataset.transactionId = t.id;

    // Struttura sicura: textContent per dati utente
    const descEl = document.createElement("span");
    descEl.className = "transaction-preview-item__desc";
    descEl.textContent = t.description; // SICURO

    const amountEl = document.createElement("span");
    amountEl.className = `transaction-preview-item__amount transaction-preview-item__amount--${t.type}`;
    amountEl.textContent = formatCurrency(t.amount, t.type); // SICURO

    const dateEl = document.createElement("time");
    dateEl.className = "transaction-preview-item__date";
    dateEl.setAttribute("datetime", t.date);
    dateEl.textContent = formatDate(t.date); // SICURO

    li.append(descEl, amountEl, dateEl);
    fragment.appendChild(li);
  });

  list.appendChild(fragment);
};

// Animazione counter numerica — effetto UX premium per saldo bancario
function animateCounter(element, from, to, duration) {
  const start = performance.now();
  const diff = to - from;

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutQuart per rallentare alla fine
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = from + diff * eased;

    element.textContent = formatCurrency(current, "credit");

    if (progress < 1) {
      requestAnimationFrame(step); // sincrono con il refresh rate del browser (60fps)
    }
  }

  requestAnimationFrame(step);
}

// =============================================================================
// INIZIALIZZAZIONE DASHBOARD
// =============================================================================

async function initDashboard() {
  // Aggiorna data corrente nel header
  const currentDateEl = document.getElementById("currentDate");
  if (currentDateEl) {
    const now = new Date();
    currentDateEl.textContent = new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);
    currentDateEl.setAttribute("datetime", now.toISOString());
  }

  // Carica account e transazioni in PARALLELO (non in sequenza)
  const balanceContainer =
    document.getElementById("balanceAmount")?.parentElement;
  const transactionsContainer = document.getElementById(
    "recentTransactionsList",
  );

  await Promise.allSettled([
    // withLoadingState gestisce skeleton + error + success per ogni widget
    withLoadingState(
      balanceContainer,
      () => fetchAccount(CURRENT_ACCOUNT_ID),
      renderBalanceWidget,
      { emptyMessage: "Saldo non disponibile" },
    ),
    withLoadingState(
      transactionsContainer,
      () => fetchTransactions(CURRENT_ACCOUNT_ID),
      renderRecentTransactions,
      { emptyMessage: "Nessun movimento recente", loadingRows: 5 },
    ),
  ]);
  // Promise.allSettled: se uno fallisce, l'altro continua.
  // Meglio di Promise.all che blocca tutto se uno fallisce.
}

document.addEventListener("DOMContentLoaded", initDashboard);
