import type { Metadata } from "next";
import "./globals.scss";
import { Toaster } from "sonner";

// Metadatos globales de la aplicación
export const metadata: Metadata = {
    title: "Prueba Técnica Cristian Blanco (Next.js + Sass)",
    description: "Login, perfil, edición y foto con JWT",
};

// Componente raíz que envuelve toda la aplicación
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                {/* Contenedor principal de la app */}
                <div className="min-h-screen">
                    {/* Renderiza el contenido de cada página */}
                    {children}
                    {/* Componente para mostrar notificaciones tipo toast */}
                    <Toaster position="top-right" richColors />
                </div>
            </body>
        </html>
    );
}
