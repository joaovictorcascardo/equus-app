'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import styles from './recuperar.module.css'

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
    <div className={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={styles.box}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐴</div>
          <span className={styles.logoText}>Equus</span>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.sentWrap}
            >
              <div className={styles.sentIcon}>
                <CheckCircle size={32} />
              </div>
              <h1 className={styles.sentTitle}>Email enviado!</h1>
              <p className={styles.sentText}>
                Enviamos um link de recuperação para{' '}
                <strong className={styles.sentEmail}>{email}</strong>.
                Verifique sua caixa de entrada.
              </p>
              <Link href="/login" className={styles.btn} style={{ display: 'flex', textDecoration: 'none' }}>
                Voltar para o login
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form">
              <Link href="/login" className={styles.back}>
                <ArrowLeft size={16} />
                Voltar para o login
              </Link>

              <div className={styles.header}>
                <h1 className={styles.title}>Esqueceu a senha?</h1>
                <p className={styles.subtitle}>
                  Informe seu email e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.errorBox}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <div className={styles.inputWrap}>
                    <Mail className={styles.inputIcon} size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                      className={styles.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className={styles.btn}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
