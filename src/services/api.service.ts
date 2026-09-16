const API_BASE_URL: string = "http://localhost:3001";

export async function fetchData<T>(endpoint: string): Promise<T> {
  const response: Response = await fetch(`${API_BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
