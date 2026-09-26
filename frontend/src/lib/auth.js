const API_BASE=process.env.NEXT_PUBLIC_API_URL;
import { apiRequest } from "./Api";

export const tokenStore = {
  get() {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("access_token");
  },

  set(token) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("access_token", token);
  },

  clear() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("access_token");
  },
};


export async function refreshToken() {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Session expired");
  }

  const data = await res.json();

  if (!data.access_token) {
    throw new Error("Session expired");
  }

  tokenStore.set(data.access_token);
}



export async function logout() {
  const token = tokenStore.get();
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Logout failed on server");
      }
    } catch (error) {
      console.error(error);
    }
  }
  tokenStore.clear(); 
  return { success: true };
}
