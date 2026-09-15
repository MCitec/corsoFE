"use strict";

const API_BASE = "http://localhost:3001";

async function requestJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

async function fetchTransactions(query = "") {
  const url = query
    ? `${API_BASE}/transactions?q=${encodeURIComponent(query)}`
    : `${API_BASE}/transactions`;
  try {
    return await requestJson(url);
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    const localData = await requestJson("db.json");
    if (!query) return localData.transactions;
    const search = query.toLowerCase();
    return localData.transactions.filter((transaction) =>
      `${transaction.description} ${transaction.category} ${transaction.amount}`
        .toLowerCase()
        .includes(search),
    );
  }
}

async function fetchUser() {
  try {
    return await requestJson(`${API_BASE}/users/1`);
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    const localData = await requestJson("db.json");
    return localData.users[0];
  }
}
