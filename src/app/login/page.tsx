"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiLogin } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    // Estados para usuario, contraseña y loading
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // Verifica si se puede enviar el formulario
    const canSubmit = username.trim().length > 0 && password.trim().length > 0;

    // Si ya hay token, redirige al home
    React.useEffect(() => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : null;
        if (token) router.replace("/");
    }, [router]);

    // Maneja el envío del formulario de login
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        try {
            // Llama a la API de login
            const res = await apiLogin(username.trim(), password.trim());
            if (res?.status !== "success")
                throw new Error(res?.message || "Credenciales inválidas");
            const { access, refresh } = res.data || {};
            // Guarda los tokens en localStorage
            if (access) localStorage.setItem("access_token", access);
            if (refresh) localStorage.setItem("refresh_token", refresh);
            toast.success(res?.message || "Inicio de sesión exitoso");
            // Redirige al home
            router.replace("/");
        } catch (err: any) {
            // Muestra error si falla el login
            const detail = err?.response?.data;
            toast.error(
                detail?.message ||
                    err?.message ||
                    "No fue posible iniciar sesión"
            );
        } finally {
            setLoading(false);
        }
    }

    // Evita enviar el formulario si no se puede
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !canSubmit) e.preventDefault();
    }

    return (
        <div className="min-h-screen">
            {/* Barra de navegación */}
            <Navbar />
            <main className="container py-6">
                <div
                    className="card"
                    style={{ maxWidth: 520, margin: "0 auto" }}
                >
                    <h2 className="card-title">Acceder</h2>
                    {/* Formulario de login */}
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label className="label">Usuario</label>
                            <input
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={onKeyDown}
                                autoComplete="username"
                                placeholder="tu_usuario"
                            />
                        </div>

                        <div>
                            <label className="label">Contraseña</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={onKeyDown}
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Botón de enviar solo si se puede o está cargando */}
                        {(canSubmit || loading) && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={loading || !canSubmit}
                                >
                                    {loading ? "Entrando…" : "Entrar"}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Mensaje de ayuda si no se puede enviar */}
                    {!canSubmit && !loading && (
                        <p className="muted" style={{ marginTop: 12 }}>
                            Ingresa usuario y contraseña para continuar.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
