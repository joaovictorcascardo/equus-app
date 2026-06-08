'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

const STATES_BR = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

interface UserForm {
  name: string; bio: string; city: string; state: string
  avatar_url: string; cover_url: string; whatsapp: string; phone: string
}

const cls = "w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"

export default function EditarPerfilPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [form,    setForm]    = useState<UserForm>({ name: '', bio: '', city: '', state: '', avatar_url: '', cover_url: '', whatsapp: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.replace('/login'); return }
        const u = d.user
        setForm({
          name:       u.name       || '',
          bio:        u.bio        || '',
          city:       u.city       || '',
          state:      u.state      || '',
          avatar_url: u.avatar_url || '',
          cover_url:  u.cover_url  || '',
          whatsapp:   u.whatsapp   || '',
          phone:      u.phone      || '',
        })
        setLoading(false)
      })
  }, [router])

  const set = (key: keyof UserForm, value: string) => setForm(f => ({ ...f, [key]: value }))

  const save = async () => {
    if (!form.name.trim()) { showToast('Nome é obrigatório', 'error'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const e = await res.json()
        showToast(e.error || 'Erro ao salvar', 'error')
        return
      }
      showToast('Perfil atualizado!', 'success')
      router.push('/perfil')
    } catch {
      showToast('Erro ao salvar perfil', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 h-14 px-4 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-1.5">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-sm font-black text-slate-900 flex-1">Editar Perfil</h1>
          <motion.button whileTap={{ scale: 0.92 }} onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 rounded-xl text-white text-sm font-bold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </motion.button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Nome<span className="text-red-400 ml-0.5">*</span>
          </label>
          <input className={cls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Seu nome" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bio</label>
          <textarea className={`${cls} resize-none`} rows={3} value={form.bio}
            onChange={e => set('bio', e.target.value)} placeholder="Fale um pouco sobre você ou seu haras..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Estado</label>
            <select className={cls} value={form.state} onChange={e => set('state', e.target.value)}>
              <option value="">Selecione</option>
              {STATES_BR.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cidade</label>
            <input className={cls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Sua cidade" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp</label>
          <input className={cls} type="tel" value={form.whatsapp}
            onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))} placeholder="(11) 99999-9999" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telefone</label>
          <input className={cls} type="tel" value={form.phone}
            onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} placeholder="(11) 9999-9999" />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">URL da foto de perfil</label>
          <input className={cls} value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">URL da foto de capa</label>
          <input className={cls} value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="https://..." />
        </div>
      </div>
    </div>
  )
}
