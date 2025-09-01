"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import PhotoUploader from "@/components/PhotoUploader";
import ProfileCard from "@/components/ProfileCard";
import { apiGetPerfil, apiPutPerfil } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

// Selectores
const TIPO_USUARIO_OPCIONES = [
    { value: "instructor", label: "Instructor" },
    { value: "estudiante", label: "Estudiante" },
    { value: "otro", label: "Otro" },
];
const VERIFICADO_OPCIONES = [
    { value: "false", label: "No" },
    { value: "true", label: "Sí" },
];

export default function EditarPage() {
    const router = useRouter();
    const { accessToken } = useAuthStore();

    const [loading, setLoading] = React.useState(false);
    const [initializing, setInitializing] = React.useState(true);

    // guardamos el data completo para el resumen
    const [perfilData, setPerfilData] = React.useState<any>(null);

    // estado del formulario (solo los campos que tu API acepta en PUT)
    const [form, setForm] = React.useState<any>({
        user: { first_name: "", last_name: "" },
        telefono: "",
        tipo_usuario: "",
        biografia: "",
        documento: "",
        linkedin: "",
        twitter: "",
        github: "",
        sitio_web: "",
        esta_verificado: "false",
        // solo lectura
        _email_ro: "",
        _username_ro: "",
    });

    React.useEffect(() => {
        if (!accessToken) {
            router.replace("/login");
            return;
        }
        (async () => {
            try {
                const res = await apiGetPerfil();
                const data: any = res?.data ?? {};
                setPerfilData(data);

                const u = data?.basic_info ?? {};
                setForm({
                    user: {
                        first_name: u.first_name || "",
                        last_name: u.last_name || "",
                    },
                    telefono: u.telefono || "",
                    tipo_usuario: data.tipo_usuario || "instructor",
                    biografia: u.biografia || "",
                    documento: u.documento || "",
                    linkedin: u.redes_sociales?.linkedin || "",
                    twitter: u.redes_sociales?.twitter || "",
                    github: u.redes_sociales?.github || "",
                    sitio_web: u.redes_sociales?.sitio_web || "",
                    esta_verificado: String(data.esta_verificado ?? "false"),
                    // solo lectura (no se envían en PUT)
                    _email_ro: u.email || "",
                    _username_ro: u.username || "",
                });
            } catch (err: any) {
                toast.error(err?.message || "No fue posible cargar el perfil");
            } finally {
                setInitializing(false);
            }
        })();
    }, [accessToken, router]);

    function update<K extends keyof typeof form>(key: K, val: any) {
        setForm((prev: any) => ({ ...prev, [key]: val }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!form.user.first_name.trim() || !form.user.last_name.trim()) {
                throw new Error("Nombre y apellido son obligatorios");
            }
            if (!form.tipo_usuario) {
                throw new Error("Selecciona un tipo de usuario");
            }

            // payload exacto que acepta tu backend (sin tipo_naturaleza)
            const payload = {
                user: {
                    first_name: form.user.first_name.trim(),
                    last_name: form.user.last_name.trim(),
                },
                telefono: form.telefono.trim(),
                tipo_usuario: form.tipo_usuario,
                biografia: form.biografia.trim(),
                documento: form.documento.trim(),
                linkedin: form.linkedin.trim(),
                twitter: form.twitter.trim(),
                github: form.github.trim(),
                sitio_web: form.sitio_web.trim(),
                esta_verificado: form.esta_verificado, // "true" | "false"
            };

            const res = await apiPutPerfil(payload);
            const ok = res?.status ? res.status === "success" : true;
            const msg = res?.message || "Perfil actualizado correctamente";
            if (!ok) throw new Error(msg);
            toast.success(msg);
        } catch (err: any) {
            const detail = err?.response?.data;
            const fieldErrors = detail?.data;
            if (fieldErrors && typeof fieldErrors === "object") {
                const [field, msgs] = Object.entries(fieldErrors)[0] as [
                    string,
                    any
                ];
                toast.error(
                    `${field}: ${
                        Array.isArray(msgs) ? msgs.join(", ") : String(msgs)
                    }`
                );
            } else {
                toast.error(
                    detail?.message ||
                        err?.message ||
                        "No fue posible actualizar el perfil"
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container py-6 space-y-6">
                {/* Subir foto va en EDITAR */}
                <PhotoUploader />

                {/* ---------- Formulario ---------- */}
                <div className="card">
                    <h3 className="section-title">Editar perfil</h3>

                    {initializing ? (
                        <p className="muted">Cargando datos…</p>
                    ) : (
                        <form className="grid-2 gap-4 mt-4" onSubmit={onSubmit}>
                            {/* Solo lectura: email y username */}
                            <div>
                                <label className="label">
                                    Correo (solo lectura)
                                </label>
                                <input
                                    value={form._email_ro}
                                    disabled
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    Usuario (solo lectura)
                                </label>
                                <input
                                    value={form._username_ro}
                                    disabled
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Nombre</label>
                                <input
                                    value={form.user.first_name}
                                    onChange={(e) =>
                                        setForm((p: any) => ({
                                            ...p,
                                            user: {
                                                ...p.user,
                                                first_name: e.target.value,
                                            },
                                        }))
                                    }
                                    type="text"
                                    required
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Apellido</label>
                                <input
                                    value={form.user.last_name}
                                    onChange={(e) =>
                                        setForm((p: any) => ({
                                            ...p,
                                            user: {
                                                ...p.user,
                                                last_name: e.target.value,
                                            },
                                        }))
                                    }
                                    type="text"
                                    required
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    value={form.telefono}
                                    onChange={(e) =>
                                        update("telefono", e.target.value)
                                    }
                                    type="text"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Tipo de usuario</label>
                                <select
                                    value={form.tipo_usuario}
                                    onChange={(e) =>
                                        update("tipo_usuario", e.target.value)
                                    }
                                    className="select"
                                >
                                    {TIPO_USUARIO_OPCIONES.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1/-1" }}>
                                <label className="label">Biografía</label>
                                <textarea
                                    value={form.biografia}
                                    onChange={(e) =>
                                        update("biografia", e.target.value)
                                    }
                                    className="textarea"
                                />
                            </div>

                            <div>
                                <label className="label">Documento</label>
                                <input
                                    value={form.documento}
                                    onChange={(e) =>
                                        update("documento", e.target.value)
                                    }
                                    type="text"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">LinkedIn</label>
                                <input
                                    value={form.linkedin}
                                    onChange={(e) =>
                                        update("linkedin", e.target.value)
                                    }
                                    type="url"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Twitter</label>
                                <input
                                    value={form.twitter}
                                    onChange={(e) =>
                                        update("twitter", e.target.value)
                                    }
                                    type="url"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">GitHub</label>
                                <input
                                    value={form.github}
                                    onChange={(e) =>
                                        update("github", e.target.value)
                                    }
                                    type="url"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Sitio web</label>
                                <input
                                    value={form.sitio_web}
                                    onChange={(e) =>
                                        update("sitio_web", e.target.value)
                                    }
                                    type="url"
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">¿Verificado?</label>
                                <select
                                    value={form.esta_verificado}
                                    onChange={(e) =>
                                        update(
                                            "esta_verificado",
                                            e.target.value
                                        )
                                    }
                                    className="select"
                                >
                                    {VERIFICADO_OPCIONES.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1/-1" }}>
                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando…" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
