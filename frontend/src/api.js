const API_BASE = "http://localhost:5000/api";

// Centralized fetch wrapper with automatic JSON parsing and error handling
async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, options);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.error || data.message || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, data) =>
    request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // For file uploads — don't set Content-Type, let the browser handle the boundary
  upload: (endpoint, formData, headers = {}) =>
    request(endpoint, {
      method: "POST",
      headers,
      body: formData,
    }),

  // Authenticated GET
  authGet: (endpoint, token) =>
    request(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Authenticated DELETE
  authDelete: (endpoint, token) =>
    request(endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export { API_BASE };
