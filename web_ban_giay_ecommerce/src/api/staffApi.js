const API_URL = "http://localhost:5000/api";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }

  return data;
}

export async function getAllProducts() {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function getAllOrders() {
  const response = await fetch(`${API_URL}/orders`);
  return handleResponse(response);
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
}