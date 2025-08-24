/**
 * Minimal token helpers. Assumes auth endpoints return { accessToken, refreshToken } on login
 * and accept POST /refresh with { refreshToken } returning new tokens.
 */

import { jwtDecode } from "jwt-decode";
import api from "./api";

export function saveTokens(obj) {
  if (obj.data.tokens.accessToken)
    localStorage.setItem("accessToken", obj.data.tokens.accessToken);
  if (obj.data.tokens.refreshToken)
    localStorage.setItem("refreshToken", obj.data.tokens.refreshToken);
}

export async function logout() {
  await api.authPost("/logout");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

const authBase = "http://localhost:5050/api/auth";
export async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new Error("No refresh token");

  try {
    const res = await fetch(`${authBase}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-refresh-token": refreshToken
      },
    });
    const data = await res.json();
    console.log(data);

    saveTokens(data);
  } catch (err) {
    console.error("Failed to refresh token:", err);
  }
}

export async function initAuth() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken && refreshToken) {
    console.log("refresh token called: 1");
    await refreshTokens(refreshToken);
  } else if (accessToken && isExpired(accessToken) && refreshToken) {
    console.log("refresh token called: 2");
    await refreshTokens(refreshToken);
  }
}

function isExpired(token) {
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
}
