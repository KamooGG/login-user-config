'use client'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://46.202.88.87:8010/usuarios/api'
export const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin } catch { return 'http://46.202.88.87:8010' }
})()

export function absoluteMedia(path: string | null | undefined): string {
  if (!path) return ''
  try {
    const u = new URL(path, API_ORIGIN)
    return u.href
  } catch {
    return String(path)
  }
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  if ((config.headers as any)['Content-Type'] === 'multipart/form-data') {
    delete (config.headers as any)['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status
    if (typeof window !== 'undefined' && status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      if (location.pathname !== '/login') location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export async function apiLogin(username: string, password: string) {
  // Esperado wrapper: { status, message, data: { access, refresh, ... } }
  const { data } = await api.post('/login/', { username, password })
  return data
}

export async function apiGetPerfil() {
  // Esperado wrapper: { status, message, data: {...} }
  const { data } = await api.get('/perfil/')
  return data
}

export async function apiPutPerfil(payload: any) {
  const { data } = await api.put('/usuario/perfil/', payload)
  return data
}

export async function apiPatchFoto(file: File) {
  const fd = new FormData()
  fd.append('foto', file)
  const { data } = await api.patch('/perfil/foto/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}
