"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [hasToken, setHasToken] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        setHasToken(!!localStorage.getItem("access_token"));
    }, [pathname]);

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
                <div className="navbar-title">
                    Prueba Técnica – Cristian Blanco
                </div>

                {/* Oculta todo el grupo de navegación en /login */}
                {pathname !== "/login" && (
                    <nav className="flex gap-2">
                        <Link
                            href="/"
                            className={`nav-link ${
                                pathname === "/" ? "nav-link--active" : ""
                            }`}
                        >
                            Perfil
                        </Link>
                        <Link
                            href="/editar"
                            className={`nav-link ${
                                pathname === "/editar" ? "nav-link--active" : ""
                            }`}
                        >
                            Editar
                        </Link>

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
