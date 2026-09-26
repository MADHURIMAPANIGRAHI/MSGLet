import { tokenStore } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Custom error class that carries HTTP status + parsed detail message
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Parses FastAPI-style { detail: "..." } or falls back to raw text
async function parseErrorBody(res) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json?.detail ?? text;
  } catch {
    return text || `Request failed with status ${res.status}`;
  }
}

export async function apiRequest(endpoint, options = {}, retry = true, router) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(tokenStore.accessToken && {
        Authorization: `Bearer ${tokenStore.accessToken}`,
      }),
      ...options.headers,
    },
    credentials: "include",
  });

  // Handle 401 with token refresh (skip for /login and /refresh themselves)
  if (
    res.status === 401 &&
    retry &&
    endpoint !== "/login" &&
    endpoint !== "/refresh"
  ) {
    try {
      const refreshRes = await fetch(`${API_BASE}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) throw new Error("Refresh failed");

      const data = await refreshRes.json();
      tokenStore.accessToken = data.access_token;

      // Retry original request once
      return apiRequest(endpoint, options, false, router);
    } catch {
      tokenStore.accessToken = null;
      if (router) router.replace("/login");
      throw new ApiError(401, "Token expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const message = await parseErrorBody(res);
    throw new ApiError(res.status, message);
  }

  return res.json();
}