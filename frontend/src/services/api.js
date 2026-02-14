const API_BASE_URL = "http://localhost:5000/api";

/**
 * A wrapper around the native fetch API.
 * Handles JSON parsing and error checking automatically.
 */
export const api = {
  // GET request
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },

  // POST request (for JSON data)
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // POST request (specifically for File Uploads - multipart/form-data)
  upload: async (endpoint, formData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      // Note: Do NOT set Content-Type header for FormData;
      // the browser sets it automatically with the boundary.
      body: formData,
    });
    return handleResponse(response);
  },
};

// Helper to check for HTTP errors
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
}
