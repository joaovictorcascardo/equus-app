'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, MapPin, CheckCircle, Grid, UserPlus, UserMinus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface ProfileUser {
  id: number; name: string; username: string; type: string
  bio: string | null; avatar_url: string | null; cover_url: string | null
  city: string | null; state: string | null; verified: boolean; created_at: string
}
interface Horse {
  id: number; name: string; breed: string; price: number | null
  negotiable: boolean; state: string; cover_url: string | null
}

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()

  const [user,        setUser]        = useState<ProfileUser | null>(null)
  const [horses,      setHorses]      = useState<Horse[]>([])
  const [stats,       setStats]       = useState({ followers: 0, following: 0, horses: 0 })
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSelf,      setIsSelf]      = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [notFound,    setNotFound]    = useState(false)

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null } return r.json() })
      .then(d => {
        if (!d) return
        setUser(d.user)
        setHorses(d.horses || [])
        setStats(d.stats)
        setIsFollowing(d.isFollowing)
        setIsSelf(d.isSelf)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [username])

  const toggleFollow = async () => {
    setFollowLoading(true)
    const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' })
    if (res.ok) {
      const d = await res.json()
      setIsFollowing(d.following)
      setStats(s => ({ ...s, followers: s.followers + (d.following ? 1 : -1) }))
    }
    setFollowLoading(false)
  }

  const startChat = async () => {
    if (!user) return
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_id: user.id }),
    })
    if (!res.ok) return
    const d = await res.json()
    router.push(`/chat/${d.conversation.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
        <span className="text-5xl mb-3">🔍</span>
        <h1 className="text-xl font-black text-slate-800">Usuário não encontrado</h1>
        <p className="text-slate-500 text-sm mt-2">Este perfil não existe ou foi removido.</p>
        <button onClick={() => router.back()}
          className="mt-4 text-emerald-600 font-semibold text-sm hover:underline">
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-600 to-teal-700 overflow-hidden">
        {user.cover_url && (
          <Image src={user.cover_url} alt="Capa" fill className="object-cover opacity-60" />
        )}
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm
                     flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
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
            {user.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!isSelf && (
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.92 }} onClick={startChat}
                className="w-10 h-10 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-center">
                <MessageCircle className="w-4.5 h-4.5 text-slate-600" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={toggleFollow}
                disabled={followLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-colors ${
                  isFollowing
                    ? 'border-2 border-slate-200 bg-white text-slate-600'
                    : 'bg-emerald-600 text-white'
                }`}>
                {isFollowing
                  ? <><UserMinus className="w-4 h-4" />Seguindo</>
                  : <><UserPlus className="w-4 h-4" />Seguir</>
                }
              </motion.button>
            </div>
          )}
          {isSelf && (
            <Link href="/perfil/editar">
              <div className="px-4 py-2 rounded-2xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-600">
                Editar perfil
              </div>
            </Link>
          )}
        </div>

        <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
        <p className="text-sm text-slate-500">@{user.username}</p>
        {user.type === 'haras' && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700
                           px-2 py-0.5 rounded-full mt-1">Haras</span>
        )}
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

      {/* Listings header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
        <Grid className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-bold text-slate-700">Anúncios ({stats.horses})</span>
      </div>

      {/* Horses grid */}
      <div className="px-3 py-4">
        {horses.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-4xl mb-3">🐴</span>
            <p className="text-slate-500 font-medium">Nenhum anúncio ativo</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {horses.map(h => (
              <motion.div key={h.id} whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/cavalo/${h.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {h.cover_url ? (
                    <Image src={h.cover_url} alt={h.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🐴</div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="font-bold text-slate-800 text-sm truncate">{h.name}</p>
                  <p className="text-xs text-slate-400 truncate">{h.breed}</p>
                  <p className="text-sm font-black text-emerald-700 mt-1">{formatPrice(h.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
