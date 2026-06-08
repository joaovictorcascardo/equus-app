import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Equus — Marketplace de Cavalos', template: '%s | Equus' },
  description: 'A plataforma premium para compra, venda e comunidade equestre do Brasil.',
  keywords: ['cavalos', 'marketplace', 'equestre', 'vaquejada', 'pedigree', 'haras'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Equus',
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
