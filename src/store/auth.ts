'use client'
import { create } from 'zustand'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: any
  setAccess: (t: string) => void
  setRefresh: (t: string | null) => void
  setUser: (u: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null,
  user: null,
  setAccess: (t) => set(() => { localStorage.setItem('access_token', t); return { accessToken: t } }),
  setRefresh: (t) => set(() => { 
    if (t) localStorage.setItem('refresh_token', t); else localStorage.removeItem('refresh_token'); 
    return { refreshToken: t } 
  }),
  setUser: (u) => set(() => ({ user: u })),
  logout: () => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    return { accessToken: null, refreshToken: null, user: null }
  }),
}))
