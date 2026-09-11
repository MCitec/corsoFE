/**
 * Restituisce un importo finito e positivo, oppure null se l'importo non e valido.
 * @param {*} amount Importo da normalizzare.
 * @returns {number|null} Importo numerico positivo o null.
 */
const normalizeAmount = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return null;
  }

  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  return Number.isFinite(numericAmount) ? Math.abs(numericAmount) : null;
};

/**
 * Calcola il saldo come somma degli accrediti meno la somma degli addebiti.
 * Le transazioni con importo non valido vengono ignorate.
 * @param {Array<{type: string, amount: number|string}>} transactions Transazioni da analizzare.
 * @returns {number} Saldo complessivo.
 */
const calculateBalance = (transactions = []) =>
  transactions.reduce((balance, { type, amount }) => {
    const normalizedAmount = normalizeAmount(amount);

    if (normalizedAmount === null) {
      return balance;
    }

    return type === "credit"
      ? balance + normalizedAmount
      : type === "debit"
        ? balance - normalizedAmount
        : balance;
  }, 0);

/**
 * Restituisce le categorie con la maggiore spesa complessiva.
 * @param {Array<{type: string, amount: number|string, category?: string}>} transactions Transazioni da analizzare.
 * @param {number} n Numero massimo di categorie da restituire.
 * @returns {Array<{category: string, total: number}>} Categorie ordinate per spesa decrescente.
 */
const getTopCategories = (transactions = [], n = 0) => {
  const categoryTotals = transactions
    .filter(
      ({ type, amount }) =>
        type === "debit" && normalizeAmount(amount) !== null,
    )
    .reduce((totals, { category = "Uncategorized", amount }) => {
      const normalizedAmount = normalizeAmount(amount);
      return {
        ...totals,
        [category]: (totals[category] ?? 0) + normalizedAmount,
      };
    }, {});

  return Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((first, second) => second.total - first.total)
    .slice(0, Math.max(0, Number.isFinite(n) ? n : 0));
};

/**
 * Raggruppa le transazioni per mese e calcola il saldo mensile.
 * `months` limita il risultato agli ultimi mesi disponibili.
 * @param {Array<{type: string, amount: number|string, date: string|Date}>} transactions Transazioni da analizzare.
 * @param {number} months Numero massimo di mesi da restituire.
 * @returns {Array<{month: string, balance: number}>} Saldi mensili in ordine cronologico.
 */
const getMonthlyTrend = (transactions = [], months = 12) => {
  const monthlyBalances = transactions.reduce(
    (balances, { type, amount, date }) => {
      const normalizedAmount = normalizeAmount(amount);
      const parsedDate = new Date(date);

      if (normalizedAmount === null || Number.isNaN(parsedDate.getTime())) {
        return balances;
      }

      const month = parsedDate.toISOString().slice(0, 7);
      const signedAmount =
        type === "credit"
          ? normalizedAmount
          : type === "debit"
            ? -normalizedAmount
            : 0;

      return {
        ...balances,
        [month]: (balances[month] ?? 0) + signedAmount,
      };
    },
    {},
  );

  const monthLimit = Math.max(0, Number.isFinite(months) ? months : 0);

  return Object.entries(monthlyBalances)
    .map(([month, balance]) => ({ month, balance }))
    .sort((first, second) => first.month.localeCompare(second.month))
    .slice(monthLimit === 0 ? 0 : -monthLimit);
};

/**
 * Identifica le transazioni il cui importo supera di oltre tre deviazioni standard la media.
 * Usa la deviazione standard della popolazione sugli importi assoluti.
 * @param {Array<{amount: number|string}>} transactions Transazioni da analizzare.
 * @returns {Array<object>} Transazioni anomale, nello stesso ordine dell'input.
 */
const detectAnomalies = (transactions = []) => {
  const validTransactions = transactions
    .map((transaction) => ({
      transaction,
      amount: normalizeAmount(transaction.amount),
    }))
    .filter(({ amount }) => amount !== null);

  if (validTransactions.length === 0) {
    return [];
  }

  const amounts = validTransactions.map(({ amount }) => amount);
  const mean =
    amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  const variance =
    amounts.reduce((sum, amount) => sum + (amount - mean) ** 2, 0) /
    amounts.length;
  const standardDeviation = Math.sqrt(variance);

  if (standardDeviation === 0) {
    return [];
  }

  return validTransactions
    .filter(({ amount }) => Math.abs(amount - mean) > 3 * standardDeviation)
    .map(({ transaction }) => transaction);
};

/**
 * Costruisce un report strutturato a partire dai risultati delle analisi.
 * @param {object} analytics Risultati prodotti dalle funzioni di analisi.
 * @param {number} [analytics.balance] Saldo complessivo.
 * @param {Array<object>} [analytics.topCategories] Categorie con maggiore spesa.
 * @param {Array<object>} [analytics.monthlyTrend] Andamento mensile.
 * @param {Array<object>} [analytics.anomalies] Transazioni anomale.
 * @returns {object} Report strutturato e indipendente dall'oggetto di input.
 */
const formatReport = ({
  balance = 0,
  topCategories = [],
  monthlyTrend = [],
  anomalies = [],
} = {}) => ({
  summary: {
    balance,
    anomalyCount: anomalies.length,
  },
  spending: {
    topCategories: topCategories.map((category) => ({ ...category })),
  },
  trend: monthlyTrend.map((month) => ({ ...month })),
  anomalies: anomalies.map((transaction) => ({ ...transaction })),
});

export {
  calculateBalance,
  getTopCategories,
  getMonthlyTrend,
  detectAnomalies,
  formatReport,
};
