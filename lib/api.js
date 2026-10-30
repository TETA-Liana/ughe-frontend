// Small REST client for the Django backend (Django REST Framework + token auth).
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

const TOKEN_KEY = "ughe_token";
const USER_KEY = "ughe_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(USER_KEY) || "";
}

function saveSession(token, username) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, username);
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export class UnauthorizedError extends Error {}

// POST /api/auth/login/ with the predefined credentials -> stores the returned token.
export async function login(username, password) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(`Cannot reach the server at ${API_URL}. Check that the backend is running.`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Login failed.");
  saveSession(data.token, data.username);
  return data;
}

export async function logout() {
  const token = getToken();
  if (token) {
    await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    }).catch(() => {});
  }
  clearSession();
}

// All homepage content (header, slideshow, stats) comes from this one endpoint.
export async function fetchHomepage() {
  const res = await fetch(`${API_URL}/api/homepage/`, {
    headers: { Authorization: `Token ${getToken()}` },
    cache: "no-store",
  });
  if (res.status === 401) throw new UnauthorizedError("Session expired.");
  if (!res.ok) throw new Error(`Server returned ${res.status}.`);
  return res.json();
}
