const API_URL = "http://localhost:5000/api";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }

  return data;
}

export async function getUserOrderHistory(email) {
  const response = await fetch(
    `${API_URL}/orders/user/${encodeURIComponent(email)}`
  );

  return handleResponse(response);
}