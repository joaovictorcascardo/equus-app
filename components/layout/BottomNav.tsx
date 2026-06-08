'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, PlusCircle, MessageCircle, User, type LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  special?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home,          label: 'Início',   href: '/'            },
  { icon: Search,        label: 'Buscar',   href: '/buscar'      },
  { icon: PlusCircle,    label: 'Anunciar', href: '/cavalo/novo', special: true },
  { icon: MessageCircle, label: 'Chat',     href: '/chat'        },
  { icon: User,          label: 'Perfil',   href: '/perfil'      },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl
                 border-t border-slate-100 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-1 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, href, special }) => {
          const active = isActive(href)

          if (special) {
            return (
              <motion.button
                key={href}
                whileTap={{ scale: 0.88 }}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-0.5 -mt-4"
                aria-label={label}
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center
                                shadow-xl shadow-emerald-200 border-4 border-white">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-[9px] font-semibold text-emerald-600 tracking-wide mt-0.5">
                  {label}
                </span>
              </motion.button>
            )
          }

          return (
            <motion.button
              key={href}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.push(href)}
              className="relative flex flex-col items-center gap-1 min-w-[52px] py-0.5"
              aria-label={label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active ? 'text-emerald-600 scale-110' : 'text-slate-400'
                  }`}
                  strokeWidth={active ? 2.5 : 1.8}
                />

                {/* Dot indicator */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId={`nav-dot-${href}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1
                                 rounded-full bg-emerald-600"
                    />
                  )}
                </AnimatePresence>
              </div>

              <span
                className={`text-[10px] font-medium transition-colors duration-200 leading-none ${
                  active ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
