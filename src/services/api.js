import { initAuth } from "./auth";

const authBase = "http://localhost:5050/api/auth";
const filesBase = "http://localhost:5055/api/files";

async function handleResp(res) {
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const j = await res.json();
      errorMsg = j?.msg || j?.message || errorMsg;
    } catch { }
    throw new Error(errorMsg || "Something went wrong");
  }

  if (ct.includes("application/json")) {
    return await res.json();
  }

  return res.blob();
}

async function authPost(path, body) {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;

  return fetch(authBase + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      ...body,
      redirectUrl: window.location.origin,
    }),
  }).then(handleResp);
}

async function filesGet(path) {
  await initAuth();

  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;
  headers["x-service-id"] = "docvault";

  try {
    const res = await fetch(filesBase + path, { headers });
    return await handleResp(res);
  } catch (error) {
    console.error("Network or fetch error:", error);
    throw error;
  }
}

async function filesPost(path, data, isMultipart = false) {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;
  headers["x-service-id"] = "docvault";

  if (!isMultipart) headers["Content-Type"] = "application/json";
  const res = await fetch(filesBase + path, {
    method: "POST",
    headers,
    body: isMultipart ? data : JSON.stringify(data),
  });
  return handleResp(res);
}

async function filesDelete(path) {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;
  headers["x-service-id"] = "docvault";

  const res = await fetch(filesBase + path, {
    method: "DELETE",
    headers: headers,
  });
  return handleResp(res);
}

export default {
  authPost,
  filesGet,
  filesPost,
  filesDelete,
};
