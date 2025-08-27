import { request } from "../client";
import { BASE_URLS } from "../config";
import { clearTokens } from "../tokens";

export const authApi = {
  login: (body) =>
    request({
      base: BASE_URLS.auth,
      path: "/login",
      method: "POST",
      data: body,
    }),

  register: (body) =>
    request({
      base: BASE_URLS.auth,
      path: "/register",
      method: "POST",
      data: { ...body, redirectUrl: window.location.origin },
    }),

  verifyEmail: (body) =>
    request({
      base: BASE_URLS.auth,
      path: "/verify-email",
      method: "POST",
      data: body
    }),

  forgotPassword: (body) =>
    request({
      base: BASE_URLS.auth,
      path: "/forgot",
      method: "POST",
      data: { ...body, redirectUrl: window.location.origin },
    }),

  resetPassword: (body) =>
    request({
      base: BASE_URLS.auth,
      path: "/reset",
      method: "POST",
      data: body,
    }),

  logout: () => {
    clearTokens();
    request({
      base: BASE_URLS.auth,
      path: "/logout",
      method: "POST",
    });
  },
};
