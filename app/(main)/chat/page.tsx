'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChatListSkeleton } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'

interface Conv {
  id: number; horse_id: number | null; buyer_id: number; seller_id: number
  last_message_at: string; horse_name: string | null; horse_cover: string | null
  other_name: string; other_username: string; other_avatar: string | null; other_verified: boolean
  last_message: string | null; unread_count: number
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ChatPage() {
  const router = useRouter()
  const [convs,   setConvs]   = useState<Conv[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => { setConvs(d.conversations || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = convs.filter(c =>
    c.other_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.horse_name?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 h-14 px-4 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="lg:hidden p-1">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-black text-slate-900 flex-1">Chat</h1>
        </div>
        {/* Search */}
        <div className="px-4 pb-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5 bg-slate-100 rounded-2xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar conversas..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto pb-24">
        {loading && <ChatListSkeleton />}

        {!loading && filtered.length === 0 && (
          <EmptyState
            emoji="💬"
            title="Nenhuma conversa"
            description="Suas conversas aparecerão aqui quando você entrar em contato com um vendedor."
            actionLabel="Explorar cavalos"
            actionHref="/buscar"
          />
        )}

        {filtered.map(conv => (
          <motion.button
            key={conv.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push(`/chat/${conv.id}`)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50
                       transition-colors border-b border-slate-50 text-left"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {conv.other_avatar ? (
                <Image src={conv.other_avatar} alt={conv.other_name} width={48} height={48}
                  className="rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center
                               text-emerald-700 font-bold text-lg">
                  {conv.other_name[0]?.toUpperCase()}
                </div>
              )}
              {conv.unread_count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 text-white
                                 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {conv.unread_count > 9 ? '9+' : conv.unread_count}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  <span className={`text-sm truncate ${conv.unread_count > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {conv.other_name}
                  </span>
                  {conv.other_verified && <span className="text-emerald-500 text-xs shrink-0">✓</span>}
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(conv.last_message_at)}</span>
              </div>
              <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                {conv.last_message || (conv.horse_name ? `Sobre: ${conv.horse_name}` : 'Sem mensagens')}
              </p>
            </div>

            {/* Horse thumbnail */}
            {conv.horse_cover && (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image src={conv.horse_cover} alt={conv.horse_name || ''} fill className="object-cover" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
