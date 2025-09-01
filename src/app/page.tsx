"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { apiGetPerfil } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();
    const { accessToken, setUser } = useAuthStore();
    // Estado para guardar los datos del perfil
    const [perfil, setPerfil] = React.useState<any>(null);

    // Efecto para cargar el perfil al montar el componente
    React.useEffect(() => {
        if (!accessToken) {
            // Si no hay token, redirige a login
            router.replace("/login");
            return;
        }
        (async () => {
            try {
                // Llama a la API para obtener el perfil
                const res = await apiGetPerfil();
                const data = res?.data ?? null;
                if (!data)
                    throw new Error(res?.message || "Respuesta inválida");
                setPerfil(data);
                setUser(data); // Guarda el usuario en el store global
            } catch (err: any) {
                // Muestra error si falla la carga
                toast.error(err?.message || "No fue posible cargar el perfil");
            }
        })();
    }, [accessToken, router, setUser]);

    return (
        <div className="min-h-screen">
            {/* Barra de navegación */}
            <Navbar />
            <main className="container py-6 space-y-6">
                {/* Muestra la tarjeta de perfil si hay datos */}
                {perfil && <ProfileCard data={perfil} />}
            </main>
            {/* Pie de página */}
            <footer className="container pb-10 footer">
                <p>Hecho por Cristian Blanco</p>
            </footer>
        </div>
    );
}
