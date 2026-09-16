const API_BASE_URL = "http://localhost:3001";

async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
