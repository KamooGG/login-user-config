"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    // Estado para saber si hay token de sesión
    const [hasToken, setHasToken] = React.useState(false);

    // Actualiza el estado del token cuando cambia la ruta
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        setHasToken(!!localStorage.getItem("access_token"));
    }, [pathname]);

    // Función para cerrar sesión y redirigir al login
    function logout() {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
        router.replace("/login");
    }

    return (
        <header className="navbar">
            <div className="container py-6 flex items-center justify-between">
                {/* Título de la aplicación */}
                <div className="navbar-title">
                    Prueba Técnica – Cristian Blanco
                </div>

                {/* Oculta todo el grupo de navegación en /login */}
                {pathname !== "/login" && (
                    <nav className="flex gap-2">
                        {/* Enlace al perfil */}
                        <Link
                            href="/"
                            className={`nav-link ${
                                pathname === "/" ? "nav-link--active" : ""
                            }`}
                        >
                            Perfil
                        </Link>
                        {/* Enlace a edición */}
                        <Link
                            href="/editar"
                            className={`nav-link ${
                                pathname === "/editar" ? "nav-link--active" : ""
                            }`}
                        >
                            Editar
                        </Link>

                        {/* Botón de salir si hay token, si no muestra Login */}
                        {hasToken ? (
                            <button
                                type="button"
                                className="btn btn--danger"
                                onClick={logout}
                            >
                                Salir
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className={`nav-link ${
                                    pathname === "/login"
                                        ? "nav-link--active"
                                        : ""
                                }`}
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
