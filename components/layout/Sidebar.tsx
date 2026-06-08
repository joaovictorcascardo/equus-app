'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, Search, MessageCircle, User, PlusCircle,
  Trophy, Bell, Settings, ChevronRight, LogOut,
} from 'lucide-react'

const PRIMARY_NAV = [
  { icon: Home,          label: 'Feed',        href: '/'        },
  { icon: Search,        label: 'Marketplace', href: '/buscar'  },
  { icon: MessageCircle, label: 'Chat',        href: '/chat'    },
  { icon: Bell,          label: 'Notificações',href: '/notificacoes' },
  { icon: Trophy,        label: 'Rankings',    href: '/rankings'},
  { icon: User,          label: 'Perfil',      href: '/perfil'  },
]

interface SidebarProps {
  user?: {
    name: string
    username: string
    avatar_url?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen fixed left-0 top-0 z-40
                      bg-white border-r border-slate-100">

      {/* ── Logo ────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
          <span className="text-xl leading-none select-none">🐴</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-900 tracking-tight">Equus</span>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5
                           rounded-full uppercase tracking-wider">
            Beta
          </span>
        </div>
      </div>

      {/* ── CTA Anunciar ────────────────────────────────── */}
      <div className="px-3 pt-4">
        <Link href="/cavalo/novo">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white
                       cursor-pointer hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
          >
            <PlusCircle className="w-5 h-5 shrink-0" strokeWidth={2} />
            <span className="text-sm font-bold">Anunciar Cavalo</span>
          </motion.div>
        </Link>
      </div>

      {/* ── Nav items ───────────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {PRIMARY_NAV.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                            transition-colors duration-150 ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon
                  className="w-5 h-5 shrink-0"
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-2 h-2 rounded-full bg-emerald-500"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* ── User card ───────────────────────────────────── */}
      <div className="p-3 border-t border-slate-100">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/perfil')}
          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer
                     transition-colors group"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center
                            text-emerald-700 font-bold text-sm ring-2 ring-slate-100">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name ?? 'Meu Perfil'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              @{user?.username ?? 'usuario'}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href="/configuracoes">
              <Settings className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            </Link>
          </div>
        </motion.div>
      </div>
    </aside>
  )
}
