import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar }   from '@/components/layout/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Em produção, busque o user da sessão/cookie aqui (Server Component)
  const user = undefined // ex: await getSessionUser()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar — visível só no desktop (lg+) */}
      <Sidebar user={user} />

      {/* Conteúdo principal — empurrado pela sidebar no desktop */}
      <main className="lg:ml-64 xl:ml-72 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>

      {/* Bottom nav — visível só no mobile */}
      <BottomNav />
    </div>
  )
}
