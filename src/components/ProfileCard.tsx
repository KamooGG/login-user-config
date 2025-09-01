"use client";
import React from "react";
import { absoluteMedia } from "@/lib/api";
import { Linkedin, Twitter, Github, Globe } from "lucide-react"; // ⬅️ NUEVO

export default function ProfileCard({ data }: { data: any }) {
    const basic = data?.basic_info ?? {};
    const redes = basic?.redes_sociales ?? {};

    const first = basic?.first_name ?? "";
    const last = basic?.last_name ?? "";
    const email = basic?.email ?? "";
    const foto = absoluteMedia(basic?.foto);
    const name = `${first} ${last}`.trim();
    const fotoFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}`;

    const tipoUsuario = data?.tipo_usuario ?? "";
    const verificado = data?.esta_verificado ? "Sí" : "No";

    const educacion = Array.isArray(data?.educacion) ? data.educacion : [];
    const experiencia = Array.isArray(data?.experiencia_laboral)
        ? data.experiencia_laboral
        : [];
    const habilidades = Array.isArray(data?.habilidades)
        ? data.habilidades
        : [];
    const portafolio = Array.isArray(data?.portafolio) ? data.portafolio : [];

    return (
        <div className="card">
            <div className="flex gap-6">
                <div className="shrink-0">
                    <img
                        src={foto || fotoFallback}
                        alt="Foto de perfil"
                        className="avatar"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="card-title">Perfil</h2>

                    <div className="grid-2 mt-2">
                        <div>
                            <p className="kv-label">Nombre</p>
                            <p className="kv-value">{first || "—"}</p>
                        </div>
                        <div>
                            <p className="kv-label">Apellido</p>
                            <p className="kv-value">{last || "—"}</p>
                        </div>
                        <div>
                            <p className="kv-label">Correo</p>
                            <p
                                className="kv-value"
                                style={{ wordBreak: "break-all" }}
                            >
                                {email || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="kv-label">Tipo de usuario</p>
                            <p className="kv-value">{tipoUsuario || "—"}</p>
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                            <p className="kv-label">Biografía</p>
                            <p
                                className="kv-value"
                                style={{
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                }}
                            >
                                {(basic?.biografia || "—").replace(/\s+/g, " ")}
                            </p>
                        </div>
                        <div>
                            <p className="kv-label">Documento</p>
                            <p className="kv-value">
                                {basic?.documento || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="kv-label">Teléfono</p>
                            <p className="kv-value">{basic?.telefono || "—"}</p>
                        </div>
                        <div>
                            <p className="kv-label">Verificado</p>
                            <p className="kv-value">{verificado}</p>
                        </div>
                    </div>

                    <div className="section">
                        <p className="kv-label">Redes</p>
                        <div className="flex gap-3">
                            {redes?.linkedin && (
                                <a
                                    href={redes.linkedin}
                                    target="_blank"
                                    className="icon-link"
                                >
                                    <Linkedin size={18} /> <span>LinkedIn</span>
                                </a>
                            )}
                            {redes?.twitter && (
                                <a
                                    href={redes.twitter}
                                    target="_blank"
                                    className="icon-link"
                                >
                                    <Twitter size={18} /> <span>Twitter</span>
                                </a>
                            )}
                            {redes?.github && (
                                <a
                                    href={redes.github}
                                    target="_blank"
                                    className="icon-link"
                                >
                                    <Github size={18} /> <span>GitHub</span>
                                </a>
                            )}
                            {redes?.sitio_web && (
                                <a
                                    href={redes.sitio_web}
                                    target="_blank"
                                    className="icon-link"
                                >
                                    <Globe size={18} /> <span>Sitio Web</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {educacion.length > 0 && (
                        <div className="section">
                            <h3 className="section-title">Educación</h3>
                            <ul className="list prose">
                                {educacion.map((e: any) => (
                                    <li key={e.id}>
                                        <strong>{e.titulo || "—"}</strong> —{" "}
                                        {e.institucion || "—"}
                                        <div className="muted">
                                            {e.fecha_inicio} →{" "}
                                            {e.completado
                                                ? e.fecha_fin || "fin"
                                                : "en curso"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {experiencia.length > 0 && (
                        <div className="section">
                            <h3 className="section-title">Experiencia</h3>
                            <ul className="list prose">
                                {experiencia.map((x: any) => (
                                    <li key={x.id}>
                                        <strong>{x.posicion || "—"}</strong> —{" "}
                                        {x.empresa || "—"}
                                        <div className="muted">
                                            {x.fecha_inicio} →{" "}
                                            {x.actualmente
                                                ? "actualidad"
                                                : x.fecha_fin || "fin"}
                                        </div>
                                        {Array.isArray(x.habilidades) &&
                                            x.habilidades.length > 0 && (
                                                <div className="muted">
                                                    Habilidades:{" "}
                                                    {x.habilidades
                                                        .map(
                                                            (h: any) => h.nombre
                                                        )
                                                        .join(", ")}
                                                </div>
                                            )}
                                        {x.funciones && (
                                            <p
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {x.funciones}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {habilidades.length > 0 && (
                        <div className="section">
                            <h3 className="section-title">Habilidades</h3>
                            <ul className="list prose">
                                {habilidades.map((h: any) => (
                                    <li key={h.id}>
                                        <strong>
                                            {h.habilidad__nombre || "—"}
                                        </strong>{" "}
                                        • {h.tiempo_experiencia || 0} años{" "}
                                        <strong>
                                            {h.esta_verificado ? "✓" : ""}
                                        </strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {portafolio.length > 0 && (
                        <div className="section">
                            <h3 className="section-title">Portafolio</h3>
                            <ul className="list prose">
                                {portafolio.map((p: any) => (
                                    <li key={p.id}>
                                        <strong>{p.titulo || "—"}</strong> —{" "}
                                        <span className="muted">
                                            {p.fecha || ""}
                                        </span>
                                        {p.descripcion && (
                                            <div className="muted">
                                                {p.descripcion}
                                            </div>
                                        )}
                                        {p.url && (
                                            <div>
                                                <a
                                                    href={p.url}
                                                    target="_blank"
                                                    className="underline"
                                                >
                                                    Ver
                                                </a>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
