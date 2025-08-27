import {
  getTokens,
  isTokenExpired,
  refreshTokens,
  clearTokens,
} from "./tokens";

// Handle API response
async function handleResponse(res) {
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const j = await res.json();
      errorMsg = j?.msg || j?.message || errorMsg;
    } catch { }
    throw new Error(errorMsg || "Something went wrong");
  }

  return ct.includes("application/json") ? res.json() : res.blob();
}

// Centralized request wrapper
export async function request({ base, path, method = "GET", data, isMultipart = false }) {
  let { accessToken, refreshToken } = getTokens();

  // Refresh access token if expired
  if (accessToken && isTokenExpired(accessToken) && refreshToken) {
    try {
      await refreshTokens();
      accessToken = localStorage.getItem("accessToken");
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  // Build headers
  const headers = {};

  if (base.includes("api/files")) headers["x-service-id"] = "docvault";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;

  if (!isMultipart && data && !(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
    body: data ? (isMultipart ? data : JSON.stringify(data)) : undefined,
  };

  try {
    const res = await fetch(`${base}${path}`, options);

    // Retry on 401 Unauthorized
    if (res.status === 401 && refreshToken) {
      await refreshTokens();
      return request({ base, path, method, data, isMultipart, serviceId }); // retry once
    }

    return await handleResponse(res);
  } catch (err) {
    console.error(`Request failed [${method} ${path}]:`, err);
    throw err;
  }
}
