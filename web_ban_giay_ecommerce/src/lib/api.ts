export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`API error (${response.status}): ${response.statusText}`);
  }

  return (await response.json()) as T;
}
