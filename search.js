"use strict";

function debounce(callback, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delay);
  };
}

function initSearch(onSearch) {
  const input = document.getElementById("searchInput");
  if (!input) return;

  let latestRequest = 0;
  const debouncedSearch = debounce(async (value) => {
    const requestId = ++latestRequest;
    try {
      await onSearch(value.trim(), requestId);
    } catch (error) {
      if (requestId === latestRequest) {
        console.error("Errore nella ricerca:", error);
      }
    }
  }, 300);

  input.addEventListener("input", (event) => {
    debouncedSearch(event.target.value);
  });
}
