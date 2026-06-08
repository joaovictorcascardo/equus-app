'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, MapPin, Heart, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { HorseCardSkeleton } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatPrice, formatAge } from '@/lib/utils'

interface HorseCard {
  id: number; name: string; breed: string; color: string; gender: string
  age_years: number; age_months: number; price: number | null; negotiable: boolean
  state: string; city: string | null; horse_function: string | null
  owner_name: string; owner_avatar: string | null; cover_url: string | null
}

const BREEDS = ['Quarto de Milha','Mangalarga Marchador','Crioulo','Lusitano','Paint Horse','Appaloosa','Árabe','Campolina','Nordestino','Pônei']
const FUNCTIONS = ['Vaquejada','Laço','Dressage','Hipismo','Polo','Cavalgada','Reprodução','Exposição']
const STATES_BR = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border shrink-0 transition-all duration-150 ${
        active
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
      }`}
    >
      {label}
    </motion.button>
  )
}

export default function BuscarPage() {
  const router = useRouter()
  const sp = useSearchParams()

  const [search,   setSearch]   = useState(sp.get('q') || '')
  const [breed,    setBreed]    = useState(sp.get('breed') || '')
  const [fn,       setFn]       = useState(sp.get('function') || '')
  const [state,    setState]    = useState(sp.get('state') || '')
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') || '')
  const [horses,   setHorses]   = useState<HorseCard[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [saved,    setSaved]    = useState<Set<number>>(new Set())

  const activeCount = [breed, fn, state, minPrice, maxPrice].filter(Boolean).length

  const fetchHorses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)   params.set('q', search)
    if (breed)    params.set('breed', breed)
    if (fn)       params.set('function', fn)
    if (state)    params.set('state', state)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const res = await fetch(`/api/horses?${params}`)
    const data = await res.json()
    setHorses(data.horses || [])
    setLoading(false)
  }, [search, breed, fn, state, minPrice, maxPrice])

  useEffect(() => {
    const timeout = setTimeout(fetchHorses, 350)
    return () => clearTimeout(timeout)
  }, [fetchHorses])

  const clearFilters = () => {
    setBreed(''); setFn(''); setState(''); setMinPrice(''); setMaxPrice('')
  }

  const toggleSave = (id: number) => {
    setSaved(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    fetch(`/api/horses/${id}/save`, { method: 'POST' }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sticky search header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="px-4 py-3 max-w-3xl mx-auto">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2.5 bg-slate-100 rounded-2xl px-3.5 py-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cavalos, raça, cidade..."
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                showFilters ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px]
                                 font-bold rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Quick filters — breeds */}
          <div className="flex gap-2 mt-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
            <Chip label="Todos" active={!breed} onClick={() => setBreed('')} />
            {BREEDS.map(b => (
              <Chip key={b} label={b} active={breed === b} onClick={() => setBreed(breed === b ? '' : b)} />
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100"
            >
              <div className="px-4 py-4 max-w-3xl mx-auto space-y-4">
                {/* Função */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Função</p>
                  <div className="flex gap-2 flex-wrap">
                    {FUNCTIONS.map(f => (
                      <Chip key={f} label={f} active={fn === f} onClick={() => setFn(fn === f ? '' : f)} />
                    ))}
                  </div>
                </div>

                {/* Estado + Preço */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Estado</p>
                    <select
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos</option>
                      {STATES_BR.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preço mín.</p>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      placeholder="R$ 0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preço máx.</p>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      placeholder="R$ ∞"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 font-semibold hover:underline"
                  >
                    Limpar {activeCount} filtro{activeCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <HorseCardSkeleton key={i} />)}
          </div>
        ) : horses.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="Nenhum cavalo encontrado"
            description="Tente ajustar seus filtros ou busca para encontrar mais resultados."
            actionLabel="Limpar filtros"
            onAction={clearFilters}
          />
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-400 mb-3">
              {horses.length} {horses.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {horses.map((horse) => (
                <motion.div
                  key={horse.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl shadow-card overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/cavalo/${horse.id}`)}
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {horse.cover_url ? (
                      <Image src={horse.cover_url} alt={horse.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">🐴</div>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={e => { e.stopPropagation(); toggleSave(horse.id) }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm
                                 flex items-center justify-center shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${saved.has(horse.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
                      />
                    </motion.button>
                    {horse.horse_function && (
                      <span className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white
                                       text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                        {horse.horse_function}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{horse.name}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      {horse.breed} · {formatAge(horse.age_years, horse.age_months)}
                    </p>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="text-sm font-black text-emerald-700">{formatPrice(horse.price)}</p>
                        {horse.negotiable && <p className="text-[10px] text-emerald-500 font-semibold">Negociável</p>}
                      </div>
                      <div className="flex items-center gap-0.5 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[11px]">{horse.state}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
