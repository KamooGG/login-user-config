"use client";
import axios from "axios";

// Base de la API, configurable por variable de entorno
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://46.202.88.87:8010/usuarios/api";
// Origen de la API para construir URLs absolutas de medios
export const API_ORIGIN = (() => {
    try {
        return new URL(API_BASE).origin;
    } catch {
        return "http://46.202.88.87:8010";
    }
})();

// Convierte una ruta relativa de imagen/media a una URL absoluta
export function absoluteMedia(path: string | null | undefined): string {
    if (!path) return "";
    try {
        const u = new URL(path, API_ORIGIN);
        return u.href;
    } catch {
        return String(path);
    }
}

// Instancia de axios configurada para la API
export const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar el token JWT a cada request si existe
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    // Elimina el Content-Type si es multipart/form-data (lo pone el navegador)
    if ((config.headers as any)["Content-Type"] === "multipart/form-data") {
        delete (config.headers as any)["Content-Type"];
    }
    return config;
});

// Interceptor para manejar respuestas de error (ej: token inválido)
api.interceptors.response.use(
    (r) => r,
    (error) => {
        const status = error?.response?.status;
        // Si el token expira, elimina los tokens y redirige a login
        if (typeof window !== "undefined" && status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            if (location.pathname !== "/login") location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Llama a la API para login, retorna los tokens y datos del usuario
export async function apiLogin(username: string, password: string) {
    // Esperado wrapper: { status, message, data: { access, refresh, ... } }
    const { data } = await api.post("/login/", { username, password });
    return data;
}

// Obtiene el perfil del usuario autenticado
export async function apiGetPerfil() {
    // Esperado wrapper: { status, message, data: {...} }
    const { data } = await api.get("/perfil/");
    return data;
}

// Actualiza el perfil del usuario (PUT)
export async function apiPutPerfil(payload: any) {
    const { data } = await api.put("/usuario/perfil/", payload);
    return data;
}

// Actualiza la foto de perfil del usuario (PATCH)
export async function apiPatchFoto(file: File) {
    const fd = new FormData();
    fd.append("foto", file);
    const { data } = await api.patch("/perfil/foto/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}
