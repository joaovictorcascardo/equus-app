'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Loader2, Building2, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

const STATES = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO',
  'MA','MG','MS','MT','PA','PB','PE','PI','PR',
  'RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

type AccountType = 'buyer' | 'seller' | 'haras'

const TYPE_OPTIONS: { value: AccountType; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    value: 'buyer',
    label: 'Comprador / Cavaleiro',
    sub:   'Quero comprar ou acompanhar cavalos',
    icon:  <UserCircle className="w-6 h-6" />,
  },
  {
    value: 'seller',
    label: 'Vendedor / Peão',
    sub:   'Quero anunciar cavalos para venda',
    icon:  <User className="w-6 h-6" />,
  },
  {
    value: 'haras',
    label: 'Haras / Empresa',
    sub:   'Conta profissional com mais recursos',
    icon:  <Building2 className="w-6 h-6" />,
  },
]

export default function CadastroPage() {
  const router      = useRouter()
  const { showToast } = useToast()

  const [step,     setStep]     = useState<1 | 2>(1)
  const [loading,  setLoading]  = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)

  const [type,     setType]     = useState<AccountType>('buyer')
  const [name,     setName]     = useState('')
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [state,    setState]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !username.trim() || !email.trim()) return
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      showToast('Senha deve ter no mínimo 6 caracteres', 'error')
      return
    }
    if (password !== confirm) {
      showToast('As senhas não coincidem', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, username, email, password, phone, whatsapp, state }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Erro ao criar conta', 'error')
        if (res.status === 409 && data.error?.includes('email')) setStep(1)
        return
      }

      showToast(`Conta criada! Bem-vindo ao Equus, ${data.user.name.split(' ')[0]}!`)
      router.push('/')
      router.refresh()

    } catch {
      showToast('Erro de conexão. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <span className="text-xl">🐴</span>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Equus</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-700 -ml-1 p-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-2xl font-black text-slate-900">
              {step === 1 ? 'Criar sua conta' : 'Defina sua senha'}
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            {step === 1 ? 'Escolha o tipo de conta e seus dados' : 'Última etapa — quase lá!'}
          </p>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-4">
            {[1, 2].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${
                s <= step ? 'w-8 bg-emerald-600' : 'w-4 bg-slate-200'
              }`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNext}
              className="space-y-4"
            >
              {/* Tipo de conta */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Tipo de conta
                </label>
                <div className="grid gap-2">
                  {TYPE_OPTIONS.map(opt => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setType(opt.value)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                        type === opt.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`shrink-0 ${type === opt.value ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${type === opt.value ? 'text-emerald-800' : 'text-slate-700'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        type === opt.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                      }`}>
                        {type === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white
                               text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nome de usuário</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    placeholder="seu.usuario"
                    required
                    className="w-full pl-8 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white
                               text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white
                               text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp + Estado (row) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="(00) 00000"
                      className="w-full pl-9 pr-3 py-3.5 rounded-2xl border border-slate-200 bg-white
                                 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Estado</label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-3.5 rounded-2xl border border-slate-200 bg-white
                               text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">UF</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                           bg-emerald-600 text-white font-bold text-sm
                           hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 mt-2"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="text-center text-sm text-slate-500">
                Já tem conta?{' '}
                <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
                  Entrar
                </Link>
              </p>
            </motion.form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white
                               text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Força da senha */}
                {password && (
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= i * 3
                          ? i <= 2 ? 'bg-amber-400' : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showCPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3.5 rounded-2xl border bg-white
                               text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      confirm && confirm !== password
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-slate-200 focus:ring-emerald-500'
                    }`}
                  />
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowCPwd(!showCPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-500 font-medium">As senhas não coincidem</p>
                )}
              </div>

              {/* Resumo do usuário */}
              <div className="bg-slate-100 rounded-2xl p-4 text-sm space-y-1">
                <p className="font-semibold text-slate-700">{name}</p>
                <p className="text-slate-400">@{username} • {email}</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading || !password || password !== confirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                           bg-emerald-600 text-white font-bold text-sm
                           hover:bg-emerald-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg shadow-emerald-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar conta'}
              </motion.button>

              <p className="text-center text-xs text-slate-400">
                Ao criar, você concorda com os{' '}
                <span className="text-emerald-600 cursor-pointer hover:underline">Termos de Uso</span>
                {' '}e a{' '}
                <span className="text-emerald-600 cursor-pointer hover:underline">Política de Privacidade</span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
