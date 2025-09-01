"use client";
import { create } from "zustand";

// Define el tipo de estado de autenticación
type AuthState = {
    accessToken: string | null;      // Token de acceso JWT
    refreshToken: string | null;     // Token de refresco JWT
    user: any;                      // Datos del usuario autenticado
    setAccess: (t: string) => void; // Actualiza el token de acceso
    setRefresh: (t: string | null) => void; // Actualiza el token de refresco
    setUser: (u: any) => void;      // Actualiza los datos del usuario
    logout: () => void;             // Elimina los tokens y datos de usuario
};

// Hook global de estado de autenticación usando Zustand
export const useAuthStore = create<AuthState>((set) => ({
    // Inicializa el token de acceso desde localStorage si existe
    accessToken:
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null,
    // Inicializa el token de refresco desde localStorage si existe
    refreshToken:
        typeof window !== "undefined"
            ? localStorage.getItem("refresh_token")
            : null,
    // Inicializa el usuario como null
    user: null,
    // Actualiza el token de acceso y lo guarda en localStorage
    setAccess: (t) =>
        set(() => {
            localStorage.setItem("access_token", t);
            return { accessToken: t };
        }),
    // Actualiza el token de refresco y lo guarda/elimina en localStorage
    setRefresh: (t) =>
        set(() => {
            if (t) localStorage.setItem("refresh_token", t);
            else localStorage.removeItem("refresh_token");
            return { refreshToken: t };
        }),
    // Actualiza los datos del usuario
    setUser: (u) => set(() => ({ user: u })),
    // Elimina los tokens y datos de usuario (logout)
    logout: () =>
        set(() => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
            return { accessToken: null, refreshToken: null, user: null };
        }),
}));
