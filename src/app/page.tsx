'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import ProfileCard from '@/components/ProfileCard'
import { apiGetPerfil } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Page() {
  const router = useRouter()
  const { accessToken, setUser } = useAuthStore()
  const [perfil, setPerfil] = React.useState<any>(null)

  React.useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
      return
    }
    ;(async () => {
      try {
        const res = await apiGetPerfil()
        const data = res?.data ?? null
        if (!data) throw new Error(res?.message || 'Respuesta inválida')
        setPerfil(data)
        setUser(data)
      } catch (err: any) {
        toast.error(err?.message || 'No fue posible cargar el perfil')
      }
    })()
  }, [accessToken, router, setUser])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6 space-y-6">
        {perfil && <ProfileCard data={perfil} />}
      </main>
      <footer className="container pb-10 footer">
        <p>Hecho por Cristian Blanco</p>
      </footer>
    </div>
  )
}
