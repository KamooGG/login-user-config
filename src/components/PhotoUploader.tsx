"use client";
import React from "react";
import { apiPatchFoto, apiGetPerfil } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

export default function PhotoUploader({
    onUpdated,
}: {
    onUpdated?: () => void;
}) {
    // Referencia al input de archivo
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    // Estado para el archivo seleccionado
    const [file, setFile] = React.useState<File | null>(null);
    // Estado para la vista previa de la imagen
    const [preview, setPreview] = React.useState<string | null>(null);
    // Estado para mostrar loading mientras sube la foto
    const [loading, setLoading] = React.useState(false);
    // Acceso al store de autenticación
    const auth = useAuthStore();

    // Maneja el cambio de archivo en el input
    function onFileChange() {
        const f = inputRef.current?.files?.[0] || null;
        setFile(f || null);
        setPreview(f ? URL.createObjectURL(f) : null);
    }

    // Maneja el envío del formulario para subir la foto
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        try {
            // Llama a la API para subir la foto
            const res = await apiPatchFoto(file);
            const ok = res?.status ? res.status === "success" : true;
            const msg = res?.message || "Foto actualizada";
            if (!ok) throw new Error(msg);

            // Actualiza el perfil en el store global después de subir la foto
            try {
                const perfilRes = await apiGetPerfil();
                auth.setUser(perfilRes?.data ?? null);
            } catch {}

            toast.success(msg);
            // Ejecuta callback si se pasa como prop
            onUpdated?.();
            // Limpia el input y estados locales
            if (inputRef.current) inputRef.current.value = "";
            setFile(null);
            setPreview(null);
        } catch (err: any) {
            // Muestra error si falla la subida
            toast.error(err?.message || "No fue posible subir la foto");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            {/* Título de la sección */}
            <h3 style={{ fontSize: "18px", fontWeight: 600 }} className="mb-4">
                Actualizar foto de perfil
            </h3>
            {/* Formulario para subir la foto */}
            <form className="flex items-center gap-3" onSubmit={onSubmit}>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="input"
                    onChange={onFileChange}
                />
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!file || loading}
                >
                    {loading ? "Subiendo…" : "Subir foto"}
                </button>
                <p className="muted">{file?.name || ""}</p>
            </form>
            {/* Muestra la vista previa de la imagen seleccionada */}
            {preview && (
                <div className="mt-4">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="avatar avatar--sm"
                    />
                </div>
            )}
        </div>
    );
}
