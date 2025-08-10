/**
 * Minimal token helpers. Assumes auth endpoints return { accessToken, refreshToken } on login
 * and accept POST /refresh with { refreshToken } returning new tokens.
 */

import api from './api'

export function saveTokens(obj) {
  if (obj.data.tokens.accessToken) localStorage.setItem('accessToken', obj.data.tokens.accessToken)
  if (obj.data.tokens.refreshToken) localStorage.setItem('refreshToken', obj.data.tokens.refreshToken)
}

export async function logout() {
  await api.authPost('/logout')

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function isLoggedIn() {
  return !!localStorage.getItem('accessToken')
}

export async function refreshTokens() {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) throw new Error('No refresh token')
  const res = await api.authPost('/refresh', { refreshToken: rt })
  if (res.accessToken) saveTokens(res)
  return res
}
