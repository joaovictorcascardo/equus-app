'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RecuperarSenhaPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    console.log('[RECUPERAR-SENHA] submit — email:', email)

    if (!email.trim()) {
      setError('Informe seu email.')
      return
    }

    setLoading(true)
    try {
      // TODO: implementar /api/auth/recuperar-senha
      // Por ora simula envio após 1s
      console.log('[RECUPERAR-SENHA] simulando envio para:', email)
      await new Promise(r => setTimeout(r, 1200))
      setSent(true)
      console.log('[RECUPERAR-SENHA] enviado com sucesso')
    } catch (err) {
      console.error('[RECUPERAR-SENHA] erro:', err)
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-lg">🐴</span>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Equus</span>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            /* ── Estado: email enviado ── */
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Email enviado!</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Enviamos um link de recuperação para{' '}
                <strong className="text-slate-700">{email}</strong>.
                Verifique sua caixa de entrada.
              </p>
              <Link href="/login">
                <button className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm
                                   hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                  Voltar para o login
                </button>
              </Link>
            </motion.div>
          ) : (
            /* ── Estado: formulário ── */
            <motion.div key="form">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800
                           transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Voltar para o login
              </Link>

              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Esqueceu a senha?
                </h1>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Informe seu email e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100
                               text-red-600 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50
                                 text-sm text-slate-900 placeholder:text-slate-300
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                                 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
                             bg-emerald-600 text-white font-bold text-sm tracking-wide
                             hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed
                             shadow-lg shadow-emerald-200 transition-all duration-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link de recuperação'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
