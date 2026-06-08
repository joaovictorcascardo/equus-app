'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Grid, Heart, PlusCircle, MapPin, CheckCircle, Edit3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface MyUser {
  id: number; name: string; username: string; type: string
  bio: string | null; avatar_url: string | null; cover_url: string | null
  city: string | null; state: string | null; verified: number
}
interface Horse {
  id: number; name: string; breed: string; price: number | null
  negotiable: number; state: string; cover_url: string | null
}
interface SavedHorse extends Horse { saved_at: string }

export default function MyProfilePage() {
  const router = useRouter()
  const [user,       setUser]       = useState<MyUser | null>(null)
  const [horses,     setHorses]     = useState<Horse[]>([])
  const [saved,      setSaved]      = useState<SavedHorse[]>([])
  const [stats,      setStats]      = useState({ followers: 0, following: 0, horses: 0 })
  const [tab,        setTab]        = useState<'listings' | 'saved'>('listings')
  const [loading,    setLoading]    = useState(true)
  const [loadSaved,  setLoadSaved]  = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.replace('/login'); return }
        const u = d.user
        setUser(u)
        // load profile via username
        return fetch(`/api/users/${u.username}`)
      })
      .then(r => r?.json())
      .then(d => {
        if (!d) return
        setHorses(d.horses || [])
        setStats(d.stats || { followers: 0, following: 0, horses: 0 })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (tab !== 'saved') return
    setLoadSaved(true)
    fetch('/api/horses/saved')
      .then(r => r.json())
      .then(d => { setSaved(d.horses || []); setLoadSaved(false) })
      .catch(() => setLoadSaved(false))
  }, [tab])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-600 to-teal-700 overflow-hidden">
        {user.cover_url && (
          <Image src={user.cover_url} alt="Capa" fill className="object-cover opacity-60" />
        )}
        {/* Settings button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link href="/perfil/editar">
            <motion.div whileTap={{ scale: 0.88 }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </motion.div>
          </Link>
          <motion.button whileTap={{ scale: 0.88 }} onClick={handleLogout}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="px-4 -mt-12 pb-4">
        <div className="flex items-end justify-between mb-3">
          <div className="relative">
            {user.avatar_url ? (
              <Image src={user.avatar_url} alt={user.name} width={80} height={80}
                className="rounded-full object-cover ring-4 ring-white" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-white
                             flex items-center justify-center text-emerald-700 font-black text-2xl">
                {user.name[0]}
              </div>
            )}
            {Boolean(user.verified) && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
            )}
          </div>
          <Link href="/cavalo/novo">
            <motion.div whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-2xl text-white text-sm font-bold">
              <PlusCircle className="w-4 h-4" strokeWidth={2.2} />
              Anunciar
            </motion.div>
          </Link>
        </div>

        <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
        <p className="text-sm text-slate-500">@{user.username}</p>
        {user.bio && <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{user.bio}</p>}
        {(user.city || user.state) && (
          <div className="flex items-center gap-1 mt-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{[user.city, user.state].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          {[
            { label: 'Anúncios', value: stats.horses },
            { label: 'Seguidores', value: stats.followers },
            { label: 'Seguindo', value: stats.following },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
        {(['listings', 'saved'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold
                        border-b-2 transition-colors ${
              tab === t ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t === 'listings' ? <><Grid className="w-4 h-4" />Anúncios</> : <><Heart className="w-4 h-4" />Salvos</>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-3 py-4">
        {tab === 'listings' && (
          <>
            {horses.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <span className="text-4xl mb-3">🐴</span>
                <p className="text-slate-500 font-medium">Nenhum anúncio ainda</p>
                <Link href="/cavalo/novo"
                  className="mt-3 text-sm text-emerald-600 font-semibold hover:underline">
                  Criar primeiro anúncio
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {horses.map(h => (
                  <HorseCard key={h.id} horse={h} onClick={() => router.push(`/cavalo/${h.id}`)} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'saved' && (
          <>
            {loadSaved ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : saved.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <span className="text-4xl mb-3">❤️</span>
                <p className="text-slate-500 font-medium">Nenhum cavalo salvo</p>
                <Link href="/buscar"
                  className="mt-3 text-sm text-emerald-600 font-semibold hover:underline">
                  Explorar marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {saved.map(h => (
                  <HorseCard key={h.id} horse={h} onClick={() => router.push(`/cavalo/${h.id}`)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function HorseCard({ horse, onClick }: { horse: Horse; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer">
      <div className="relative aspect-[4/3] bg-slate-100">
        {horse.cover_url ? (
          <Image src={horse.cover_url} alt={horse.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🐴</div>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-bold text-slate-800 text-sm truncate">{horse.name}</p>
        <p className="text-xs text-slate-400 truncate">{horse.breed}</p>
        <p className="text-sm font-black text-emerald-700 mt-1">{formatPrice(horse.price)}</p>
      </div>
    </motion.div>
  )
}
