'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

export default function LoginPage() {
  const router      = useRouter()
  const { showToast } = useToast()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Erro ao entrar', 'error')
        return
      }

      showToast(`Bem-vindo de volta, ${data.user.name.split(' ')[0]}!`)
      router.push('/')
      router.refresh()

    } catch {
      showToast('Erro de conexão. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Painel esquerdo (desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col items-start justify-end p-12 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=85')" }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Logo */}
        <div className="absolute top-10 left-10 flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-xl">🐴</span>
          </div>
          <span className="text-white text-xl font-black tracking-tight">Equus</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-white leading-tight mb-3"
          >
            O mercado premium<br />do mundo equestre.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/70 text-base max-w-sm"
          >
            Compre, venda e conecte-se com os melhores haras e criadores do Brasil.
          </motion.p>
        </div>
      </div>

      {/* ── Painel direito (formulário) ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <span className="text-xl">🐴</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Equus</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900">Bem-vindo de volta</h1>
            <p className="text-slate-500 text-sm mt-1">Entre na sua conta para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white
                             text-sm text-slate-900 placeholder:text-slate-300
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Senha
                </label>
                <Link href="/recuperar-senha"
                  className="text-xs text-emerald-600 font-semibold hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white
                             text-sm text-slate-900 placeholder:text-slate-300
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                         bg-emerald-600 text-white font-bold text-sm
                         hover:bg-emerald-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-emerald-100 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Link cadastro */}
          <Link href="/cadastro">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                         border-2 border-slate-200 text-slate-700 font-bold text-sm
                         hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Criar uma conta grátis
            </motion.div>
          </Link>

          <p className="text-center text-xs text-slate-400 mt-6">
            Ao entrar, você concorda com nossos{' '}
            <span className="text-emerald-600 cursor-pointer hover:underline">Termos de Uso</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
