'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, MapPin, ChevronRight, Plus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FeedSkeleton } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatAge } from '@/lib/utils'

interface FeedPost {
  id: number; user_id: number; horse_id: number | null; content: string | null
  type: string; created_at: string; likes_count: number; liked: boolean
  images: { url: string; order_index: number }[]
  user: { name: string; username: string; avatar_url: string | null; verified: boolean }
  horse: { id: number; name: string; breed: string | null; cover: string | null } | null
}

interface FeedHorse {
  id: number; name: string; breed: string; color: string; gender: string
  age_years: number; age_months: number; price: number | null; negotiable: boolean
  state: string; city: string | null; created_at: string
  owner_name: string; owner_username: string; owner_avatar: string | null
  cover_url: string | null
}

type FeedItem = { kind: 'post'; data: FeedPost } | { kind: 'horse'; data: FeedHorse }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function Avatar({ url, name, size = 40 }: { url: string | null; name: string; size?: number }) {
  if (url) return (
    <Image src={url} alt={name} width={size} height={size}
      className="rounded-full object-cover ring-2 ring-white" />
  )
  return (
    <div className="rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold ring-2 ring-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {name[0]?.toUpperCase()}
    </div>
  )
}

function PostCard({ post, onLike }: { post: FeedPost; onLike: (id: number) => void }) {
  const router = useRouter()
  const img = post.images[0]?.url

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={() => router.push(`/perfil/${post.user.username}`)}>
          <Avatar url={post.user.avatar_url} name={post.user.name} size={40} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/perfil/${post.user.username}`)}
              className="text-sm font-bold text-slate-800 truncate hover:underline"
            >
              {post.user.name}
            </button>
            {post.user.verified && <span className="text-emerald-500 text-xs">✓</span>}
          </div>
          <p className="text-xs text-slate-400">@{post.user.username} · {timeAgo(post.created_at)}</p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      )}

      {/* Image */}
      {img && (
        <div className="aspect-video relative overflow-hidden bg-slate-100">
          <Image src={img} alt="Post" fill className="object-cover" />
        </div>
      )}

      {/* Horse tag */}
      {post.horse && (
        <Link href={`/cavalo/${post.horse.id}`}
          className="mx-4 mt-3 flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-2xl
                     border border-slate-100 hover:border-emerald-200 transition-colors group">
          {post.horse.cover && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-200">
              <Image src={post.horse.cover} alt={post.horse.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{post.horse.name}</p>
            {post.horse.breed && <p className="text-[11px] text-slate-400">{post.horse.breed}</p>}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
        </Link>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onLike(post.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Heart className={`w-4.5 h-4.5 transition-all ${post.liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium ${post.liked ? 'text-red-500' : 'text-slate-500'}`}>
            {post.likes_count}
          </span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <MessageCircle className="w-4.5 h-4.5 text-slate-400" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors ml-auto"
        >
          <Share2 className="w-4.5 h-4.5 text-slate-400" />
        </motion.button>
      </div>
    </motion.article>
  )
}

function HorseCard({ horse }: { horse: FeedHorse }) {
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden cursor-pointer"
      onClick={() => router.push(`/cavalo/${horse.id}`)}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {horse.cover_url ? (
          <Image src={horse.cover_url} alt={horse.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🐴</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm text-white
                         text-[11px] font-bold px-2 py-0.5 rounded-full">
          NOVO
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">{horse.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {horse.breed} · {horse.color} · {formatAge(horse.age_years, horse.age_months)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div>
            <p className="text-base font-black text-emerald-700">{formatPrice(horse.price)}</p>
            {horse.negotiable && (
              <p className="text-[10px] text-emerald-500 font-semibold">Negociável</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{horse.state}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
          <Avatar url={horse.owner_avatar} name={horse.owner_name} size={20} />
          <span className="text-xs text-slate-500 truncate">{horse.owner_name}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeedPage() {
  const { showToast } = useToast()
  const [posts,   setPosts]   = useState<FeedPost[]>([])
  const [horses,  setHorses]  = useState<FeedHorse[]>([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchData = useCallback(async (p: number) => {
    try {
      const [postsRes, horsesRes] = await Promise.all([
        fetch(`/api/posts?page=${p}`),
        fetch(`/api/horses?page=${p}&limit=6`),
      ])
      const postsData  = await postsRes.json()
      const horsesData = await horsesRes.json()

      if (p === 1) {
        setPosts(postsData.posts || [])
        setHorses(horsesData.horses || [])
      } else {
        setPosts(prev => [...prev, ...(postsData.posts || [])])
        setHorses(prev => [...prev, ...(horsesData.horses || [])])
      }
      if ((postsData.posts?.length || 0) < 20) setHasMore(false)
    } catch (err) {
      console.error(err)
      showToast('Erro ao carregar feed', 'error')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [showToast])

  useEffect(() => { fetchData(1) }, [fetchData])

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const next = page + 1
    setPage(next)
    fetchData(next)
  }

  const handleLike = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    if (!res.ok) return
    const { liked } = await res.json()
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, liked, likes_count: p.likes_count + (liked ? 1 : -1) }
      : p
    ))
  }

  // Merge horses into feed every 3 posts
  const feed: FeedItem[] = []
  let hi = 0
  posts.forEach((post, i) => {
    feed.push({ kind: 'post', data: post })
    if ((i + 1) % 3 === 0 && hi < horses.length) {
      feed.push({ kind: 'horse', data: horses[hi++] })
    }
  })
  // Add remaining horses
  while (hi < horses.length) feed.push({ kind: 'horse', data: horses[hi++] })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐴</span>
            <span className="text-lg font-black text-slate-900 tracking-tight">Equus</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Beta
            </span>
          </div>
          <Link href="/cavalo/novo">
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center
                         shadow-md shadow-emerald-200"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-3 py-4 pb-24 space-y-3">
        {loading && <FeedSkeleton />}

        {!loading && feed.length === 0 && (
          <EmptyState
            title="Feed vazio"
            description="Quando houver anúncios e posts, eles aparecerão aqui."
            actionLabel="Explorar Marketplace"
            actionHref="/buscar"
          />
        )}

        <AnimatePresence>
          {feed.map((item, i) =>
            item.kind === 'post'
              ? <PostCard key={`post-${item.data.id}`} post={item.data} onLike={handleLike} />
              : <HorseCard key={`horse-${item.data.id}`} horse={item.data} />
          )}
        </AnimatePresence>

        {hasMore && !loading && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-semibold
                       text-sm hover:border-emerald-300 hover:text-emerald-600 transition-colors
                       flex items-center justify-center gap-2 bg-white"
          >
            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Carregar mais'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
