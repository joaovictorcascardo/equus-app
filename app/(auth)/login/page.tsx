'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import styles from './login.module.css'

export default function LoginPage() {
  const router        = useRouter()
  const { showToast } = useToast()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    console.log('[LOGIN PAGE] submit — email:', email)

    if (!email || !password) {
      setError('Preencha email e senha.')
      return
    }

    setLoading(true)
    try {
      console.log('[LOGIN PAGE] chamando /api/auth/login...')

      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log('[LOGIN PAGE] resposta:', res.status, data)

      if (!res.ok) {
        console.warn('[LOGIN PAGE] erro da API:', data.error)
        setError(data.error || 'Erro ao entrar')
        showToast(data.error || 'Erro ao entrar', 'error')
        return
      }

      console.log('[LOGIN PAGE] login ok — userId:', data.user?.id)
      showToast(`Bem-vindo, ${data.user.name.split(' ')[0]}!`)
      router.push('/')
      router.refresh()

    } catch (err) {
      console.error('[LOGIN PAGE] erro de rede:', err)
      setError('Erro de conexão. Verifique sua internet.')
      showToast('Erro de conexão. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Painel esquerdo — foto (desktop) ── */}
      <div className={styles.left}>
        <div
          className={styles.leftBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=85')" }}
        />
        <div className={styles.leftOverlay} />

        <div className={styles.leftLogo}>
          <div className={styles.leftLogoIcon}>🐴</div>
          <span className={styles.leftLogoText}>Equus</span>
        </div>

        <div className={styles.tagline}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={styles.taglineH2}
          >
            O mercado premium<br />do mundo equestre.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={styles.taglineP}
          >
            Compre, venda e conecte-se com os melhores haras e criadores do Brasil.
          </motion.p>
        </div>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div className={styles.right}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.box}
        >
          {/* Logo mobile */}
          <div className={styles.mobileLogo}>
            <div className={styles.logoIcon}>🐴</div>
            <span className={styles.logoText}>Equus</span>
          </div>

          {/* Cabeçalho */}
          <div className={styles.header}>
            <h1 className={styles.title}>Bem-vindo de volta</h1>
            <p className={styles.subtitle}>Entre na sua conta para continuar</p>
          </div>

          {/* Erro inline */}
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

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Email */}
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

            {/* Senha */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label className={styles.label}>Senha</label>
                <Link href="/recuperar-senha" className={styles.forgotLink}>
                  Esqueci minha senha
                </Link>
              </div>
              <div className={styles.inputWrap}>
                <Lock className={styles.inputIcon} size={16} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={`${styles.input} ${styles.inputPwd}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className={styles.eyeBtn}
                  tabIndex={-1}
                  aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={styles.btnPrimary}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Entrar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>ou</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Criar conta */}
          <Link href="/cadastro" className={styles.btnSecondary}>
            Criar uma conta grátis
          </Link>

          <p className={styles.footer}>
            Ao entrar, você concorda com nossos{' '}
            <span className={styles.footerLink}>Termos de Uso</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
