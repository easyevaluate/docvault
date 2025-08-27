import { jwtDecode } from "jwt-decode";
import { BASE_URLS } from "./config";

// Save tokens to local storage
export function saveTokens(obj) {
  const tokens = obj?.data?.tokens || obj?.tokens;
  if (!tokens) return;

  if (tokens.accessToken) localStorage.setItem("accessToken", tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
}

// Clear tokens from local storage
export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Get tokens from local storage
export function getTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

// Check if the user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

// Check if the access token is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// Refresh tokens using the refresh token
export async function refreshTokens() {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error("Missing refresh token");

  const res = await fetch(`${BASE_URLS.auth}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": refreshToken,
    },
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired, please log in again");
  }

  const data = await res.json();
  saveTokens(data);
  return data;
}
