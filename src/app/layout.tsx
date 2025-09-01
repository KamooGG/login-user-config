import type { Metadata } from 'next'
import './globals.scss'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Prueba Técnica Cristian Blanco (Next.js + Sass)',
  description: 'Login, perfil, edición y foto con JWT',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen">
          {children}
          <Toaster position="top-right" richColors />
        </div>
      </body>
    </html>
  )
}
