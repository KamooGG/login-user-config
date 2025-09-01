'use client'
import React from 'react'
import { apiPatchFoto, apiGetPerfil } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export default function PhotoUploader({ onUpdated }: { onUpdated?: () => void }) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const auth = useAuthStore()

  function onFileChange() {
    const f = inputRef.current?.files?.[0] || null
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const res = await apiPatchFoto(file)
      const ok = res?.status ? res.status === 'success' : true
      const msg = res?.message || 'Foto actualizada'
      if (!ok) throw new Error(msg)

      try {
        const perfilRes = await apiGetPerfil()
        auth.setUser(perfilRes?.data ?? null)
      } catch {}

      toast.success(msg)
      onUpdated?.()
      if (inputRef.current) inputRef.current.value = ''
      setFile(null)
      setPreview(null)
    } catch (err: any) {
      toast.error(err?.message || 'No fue posible subir la foto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 style={{fontSize:'18px', fontWeight:600}} className="mb-4">Actualizar foto de perfil</h3>
      <form className="flex items-center gap-3" onSubmit={onSubmit}>
        <input ref={inputRef} type="file" accept="image/*" className="input" onChange={onFileChange} />
        <button type="submit" className="btn btn--primary" disabled={!file || loading}>
          {loading ? 'Subiendo…' : 'Subir foto'}
        </button>
        <p className="muted">{file?.name || ''}</p>
      </form>
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Vista previa" className="avatar avatar--sm" />
        </div>
      )}
    </div>
  )
}
