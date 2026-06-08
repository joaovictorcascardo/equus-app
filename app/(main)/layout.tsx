import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar }   from '@/components/layout/Sidebar'
import { getSession } from '@/lib/auth'
import { queryOne }   from '@/lib/db'
import { redirect }   from 'next/navigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await queryOne<{
    id: number; name: string; username: string; avatar_url: string | null; type: string; verified: number
  }>(
    'SELECT id,name,username,avatar_url,type,verified FROM users WHERE id=? AND is_active=1',
    [session.userId]
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user ?? undefined} />
      <main className="lg:ml-64 xl:ml-72 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
