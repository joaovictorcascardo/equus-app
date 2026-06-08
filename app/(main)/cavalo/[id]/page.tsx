'use client'

import { useState, useEffect, useRef, use } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import {
  ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight,
  MessageCircle, Phone, MapPin, Calendar, Award,
  Shield, CheckCircle, ChevronDown, Eye, Star,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { HorseDetailSkeleton } from '@/components/ui/SkeletonLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatAge, formatDate, buildWhatsAppLink } from '@/lib/utils'
import type { Horse } from '@/types'

// ─────────────────────────────────────────────────────────────
// MOCK DATA (substituir pela chamada real à API)
// ─────────────────────────────────────────────────────────────
const MOCK_HORSE: Horse = {
  id: 1,
  owner_id: 1,
  name: 'Relâmpago da Serra',
  breed: 'Quarto de Milha',
  color: 'Alazão Tostado',
  gender: 'Macho',
  age_years: 5,
  age_months: 3,
  price: 85000,
  negotiable: true,
  horse_function: 'Vaquejada',
  status: 'active',
  state: 'MG',
  city: 'Uberlândia',
  description:
    'Animal excepcional com ótimo preparo para vaquejada. Filho do famoso Três Corações, um dos melhores reprodutores da região. Participou de competições regionais com excelente desempenho e premiações. Muito manso, dócil e de fácil manejo — ideal tanto para atletas experientes quanto para aprendizes. Veterinário de confiança disponível para vistorias presenciais.',
  has_gta: true,
  has_mormo_exam: true,
  mormo_exam_date: '2024-11-15',
  has_coggins: true,
  coggins_date: '2024-10-02',
  has_vaccination: true,
  sire: 'Três Corações',
  dam: 'Estrela do Sul',
  sire_sire: 'Diamante Negro',
  dam_dam: 'Rosa dos Ventos',
  registered: true,
  registration_entity: 'ABQM',
  registration_number: 'ABQM-2019-45231',
  views: 347,
  created_at: '2024-12-01T12:00:00Z',
  images: [
    { id: 1, horse_id: 1, url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80', order_index: 0, is_cover: true },
    { id: 2, horse_id: 1, url: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=900&q=80', order_index: 1, is_cover: false },
    { id: 3, horse_id: 1, url: 'https://images.unsplash.com/photo-1534773729-uce3e82fa5a?w=900&q=80', order_index: 2, is_cover: false },
  ],
  owner: {
    id: 1,
    type: 'haras',
    name: 'Haras Boa Vista',
    username: 'harasboavista',
    email: 'contato@harasboavista.com.br',
    whatsapp: '34991234567',
    avatar_url: 'https://ui-avatars.com/api/?name=Haras+Boa+Vista&background=059669&color=fff&size=128',
    city: 'Uberlândia',
    state: 'MG',
    verified: true,
    created_at: '2023-01-01T00:00:00Z',
  },
  saved: false,
  likes_count: 42,
}

// ─────────────────────────────────────────────────────────────
// CAROUSEL
// ─────────────────────────────────────────────────────────────
function HorseCarousel({
  images,
  horseName,
}: {
  images: Horse['images']
  horseName: string
}) {
  const [current, setCurrent]   = useState(0)
  const [direction, setDirection] = useState(0)
  const dragX = useMotionValue(0)
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.6, 1, 0.6])
  const containerRef = useRef<HTMLDivElement>(null)

  const goTo = (index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }

  const prev = () => goTo((current - 1 + images.length) % images.length, -1)
  const next = () => goTo((current + 1) % images.length, 1)

  const handleDragEnd = (_: never, info: PanInfo) => {
    const THRESHOLD = 60
    if (info.offset.x < -THRESHOLD) next()
    else if (info.offset.x > THRESHOLD) prev()
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/3] overflow-hidden bg-slate-200 select-none">

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ opacity: dragOpacity }}
          transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.8 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={images[current]?.url ?? '/placeholder-horse.jpg'}
            alt={`${horseName} — foto ${current + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover pointer-events-none"
            priority={current === 0}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Top-to-bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/15 pointer-events-none" />

      {/* Arrow buttons — hidden on mobile touch */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex w-9 h-9 rounded-full
                       bg-white/85 backdrop-blur-sm items-center justify-center shadow-md
                       hover:bg-white transition-colors z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex w-9 h-9 rounded-full
                       bg-white/85 backdrop-blur-sm items-center justify-center shadow-md
                       hover:bg-white transition-colors z-10"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/55'
              }`}
              aria-label={`Ir para foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter badge */}
      <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white
                      text-xs px-2.5 py-1 rounded-full font-semibold">
        {current + 1} / {images.length}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// INFO CHIP
// ─────────────────────────────────────────────────────────────
function InfoChip({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ElementType
}) {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-card">
      {Icon && <Icon className="w-4 h-4 text-emerald-600 mb-1.5" strokeWidth={1.8} />}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">{value}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EXAM ROW
// ─────────────────────────────────────────────────────────────
function ExamRow({ label, ok, date }: { label: string; ok: boolean; date?: string }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-3.5 py-3
                    border border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          ok ? 'bg-emerald-100' : 'bg-slate-100'
        }`}>
          {ok
            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            : <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
          }
        </div>
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      </div>
      <span className={`text-xs font-medium ${ok ? 'text-slate-400' : 'text-slate-300'}`}>
        {ok ? (date ? formatDate(date) : 'Possui') : 'Não possui'}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function HorseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router      = useRouter()
  const { showToast } = useToast()
  const [horse,    setHorse]    = useState<Horse | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [descOpen, setDescOpen] = useState(false)

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/horses/${id}`)
        if (!res.ok) { setNotFound(true); return }
        const data = await res.json()
        setHorse(data.horse)
        setSaved(data.horse.saved ?? false)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ── Handlers ───────────────────────────────────────────────
  const handleSave = async () => {
    const next = !saved
    setSaved(next)
    showToast(next ? '❤️ Adicionado aos favoritos!' : 'Removido dos favoritos')
    await fetch(`/api/horses/${id}/save`, { method: 'POST' })
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.share({ title: horse?.name, url })
    } catch {
      await navigator.clipboard.writeText(url)
      showToast('🔗 Link copiado!')
    }
  }

  const handleWhatsApp = () => {
    if (!horse?.owner.whatsapp) {
      showToast('Número não disponível', 'error')
      return
    }
    window.open(buildWhatsAppLink(horse.owner.whatsapp, horse.name), '_blank')
  }

  const handleChat = async () => {
    if (!horse) return
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horse_id: horse.id, seller_id: horse.owner_id }),
    })
    if (!res.ok) { showToast('Faça login para conversar', 'error'); return }
    const data = await res.json()
    router.push(`/chat/${data.conversation.id}`)
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ━━━━━━━━━━ FIXED HEADER ━━━━━━━━━━ */}
      <header className="fixed top-0 inset-x-0 lg:left-64 xl:left-72 z-40
                         bg-white/90 backdrop-blur-xl border-b border-slate-100/80
                         transition-all duration-200">
        <div className="flex items-center justify-between h-14 px-4 max-w-3xl mx-auto">

          {/* Back */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-600
                       transition-colors -ml-1.5 py-2 pr-2"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.2} />
            <span className="text-sm font-semibold hidden xs:block">Voltar</span>
          </motion.button>

          {/* Title */}
          <span className="text-sm font-bold text-slate-800 truncate max-w-[160px] xs:max-w-[220px]">
            {horse?.name ?? (loading ? '...' : 'Cavalo')}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         hover:bg-slate-100 transition-colors"
              aria-label="Compartilhar"
            >
              <Share2 className="w-4.5 h-4.5 text-slate-500" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSave}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         hover:bg-slate-100 transition-colors"
              aria-label={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-all duration-200 ${
                  saved ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-500'
                }`}
              />
            </motion.button>
          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━ SCROLLABLE CONTENT ━━━━━━━━━━ */}
      <div className="pt-14 pb-32 max-w-3xl mx-auto">

        {/* ── Loading ── */}
        {loading && <HorseDetailSkeleton />}

        {/* ── Not Found ── */}
        {!loading && notFound && (
          <EmptyState
            emoji="🐴"
            title="Anúncio não encontrado"
            description="Este cavalo pode ter sido vendido ou o anúncio foi removido."
            actionLabel="Explorar Anúncios"
            actionHref="/buscar"
          />
        )}

        {/* ── Content ── */}
        {!loading && horse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >

            {/* ── Carousel ── */}
            <HorseCarousel images={horse.images} horseName={horse.name} />

            {/* ── Main Info ── */}
            <div className="px-4 pt-5 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-slate-900 leading-tight truncate">
                    {horse.name}
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5 font-medium">
                    {horse.breed} • {horse.color}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-emerald-700 leading-tight">
                    {formatPrice(horse.price)}
                  </p>
                  {horse.negotiable && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50
                                     px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Negociável
                    </span>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-medium">{horse.city}, {horse.state}</span>
                </div>
                <span className="text-slate-200">•</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-xs">{horse.views.toLocaleString('pt-BR')} visualizações</span>
                </div>
                <span className="text-slate-200">•</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs">{horse.likes_count ?? 0} curtidas</span>
                </div>
              </div>
            </div>

            {/* ── Info Chips ── */}
            <div className="px-4 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <InfoChip label="Sexo"    value={horse.gender}                              icon={Award}    />
                <InfoChip label="Idade"   value={formatAge(horse.age_years, horse.age_months)} icon={Calendar} />
                <InfoChip label="Função"  value={horse.horse_function ?? '—'}               icon={Star}     />
                <InfoChip
                  label="Registro"
                  value={horse.registered ? horse.registration_entity ?? 'Sim' : 'Sem reg.'}
                  icon={Shield}
                />
              </div>
            </div>

            {/* ─── Section divider ─── */}
            <div className="h-2 bg-slate-100 border-y border-slate-200/60" />

            {/* ── Exams / Documentation ── */}
            <section className="px-4 py-5">
              <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                Documentação & Exames
              </h2>
              <div className="space-y-2">
                <ExamRow label="GTA (Guia de Trânsito Animal)"           ok={horse.has_gta}        />
                <ExamRow label="Exame de Mormo"   ok={horse.has_mormo_exam} date={horse.mormo_exam_date} />
                <ExamRow label="Coggins (AIE)"    ok={horse.has_coggins}    date={horse.coggins_date}    />
                <ExamRow label="Vacinação em dia"                         ok={horse.has_vaccination}     />
                <ExamRow
                  label={`Registro ${horse.registration_entity ?? 'ABQM'} (${horse.registration_number ?? '—'})`}
                  ok={horse.registered}
                />
              </div>
            </section>

            <div className="h-2 bg-slate-100 border-y border-slate-200/60" />

            {/* ── Pedigree ── */}
            {(horse.sire || horse.dam) && (
              <>
                <section className="px-4 py-5">
                  <h2 className="text-base font-bold text-slate-800 mb-3">
                    Genealogia / Pedigree
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {horse.sire && (
                      <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-card">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                          Pai
                        </span>
                        <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                          {horse.sire}
                        </p>
                        {horse.sire_sire && (
                          <p className="text-xs text-slate-400 mt-0.5">↳ {horse.sire_sire}</p>
                        )}
                      </div>
                    )}
                    {horse.dam && (
                      <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-card">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">
                          Mãe
                        </span>
                        <p className="text-sm font-bold text-slate-800 mt-1 leading-tight">
                          {horse.dam}
                        </p>
                        {horse.dam_dam && (
                          <p className="text-xs text-slate-400 mt-0.5">↳ {horse.dam_dam}</p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
                <div className="h-2 bg-slate-100 border-y border-slate-200/60" />
              </>
            )}

            {/* ── Description ── */}
            <section className="px-4 py-5">
              <h2 className="text-base font-bold text-slate-800 mb-3">Sobre o Animal</h2>
              <div className="relative">
                <p
                  className={`text-sm text-slate-600 leading-relaxed transition-all duration-300 ${
                    !descOpen ? 'line-clamp-4' : ''
                  }`}
                >
                  {horse.description}
                </p>
                {!descOpen && (
                  <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setDescOpen(!descOpen)}
                className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-2"
              >
                {descOpen ? 'Ver menos' : 'Ver mais'}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${descOpen ? 'rotate-180' : ''}`}
                />
              </motion.button>
            </section>

            <div className="h-2 bg-slate-100 border-y border-slate-200/60" />

            {/* ── Seller Card ── */}
            <section className="px-4 py-5">
              <h2 className="text-base font-bold text-slate-800 mb-3">Anunciante</h2>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/perfil/${horse.owner.username}`)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card
                           flex items-center gap-3.5 cursor-pointer hover:shadow-card-hover
                           transition-shadow"
              >
                {horse.owner.avatar_url ? (
                  <Image
                    src={horse.owner.avatar_url}
                    alt={horse.owner.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center
                                  justify-center text-emerald-700 font-bold text-lg shrink-0">
                    {horse.owner.name[0]}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-800 truncate">{horse.owner.name}</p>
                    {horse.owner.verified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">@{horse.owner.username}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {horse.owner.city}, {horse.owner.state}
                  </p>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 shrink-0" />
              </motion.div>
            </section>

          </motion.div>
        )}
      </div>

      {/* ━━━━━━━━━━ STICKY BOTTOM BAR (CTA) ━━━━━━━━━━ */}
      <AnimatePresence>
        {!loading && horse && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30, delay: 0.4 }}
            className="fixed bottom-0 inset-x-0 lg:left-64 xl:left-72 z-40
                       bg-white/95 backdrop-blur-xl border-t border-slate-100
                       pb-[env(safe-area-inset-bottom)]"
          >
            <div className="px-4 py-3 max-w-3xl mx-auto flex items-center gap-3">
              {/* Price reminder on larger screens */}
              <div className="hidden sm:block flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-medium leading-none">Preço</p>
                <p className="text-lg font-black text-emerald-700 leading-tight mt-0.5">
                  {formatPrice(horse.price)}
                </p>
              </div>

              {/* Chat button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleChat}
                className="flex-1 sm:flex-none sm:w-44 flex items-center justify-center gap-2
                           py-3.5 rounded-2xl border-2 border-emerald-600 text-emerald-700
                           font-bold text-sm hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle className="w-4.5 h-4.5" strokeWidth={2.2} />
                Chat Interno
              </motion.button>

              {/* WhatsApp button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none sm:w-44 flex items-center justify-center gap-2
                           py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm
                           hover:bg-emerald-700 transition-colors
                           shadow-xl shadow-emerald-200/60"
              >
                <Phone className="w-4.5 h-4.5" strokeWidth={2.2} />
                WhatsApp
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
