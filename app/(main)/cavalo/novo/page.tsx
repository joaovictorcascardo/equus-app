'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, CheckCircle, X, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

const BREEDS = ['Quarto de Milha','Mangalarga Marchador','Crioulo','Lusitano','Paint Horse','Appaloosa','Árabe','Campolina','Nordestino','Pônei','Mestiço','Outro']
const FUNCTIONS = ['Vaquejada','Laço','Dressage','Hipismo','Polo','Cavalgada','Reprodução','Exposição','Lazer','Outro']
const STATES_BR = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

interface FormData {
  name: string; breed: string; color: string; gender: string
  age_years: string; age_months: string; horse_function: string
  price: string; negotiable: boolean; state: string; city: string
  description: string; whatsapp: string
  has_gta: boolean; has_mormo_exam: boolean; has_coggins: boolean; has_vaccination: boolean
  registered: boolean; registration_entity: string; registration_number: string
  sire: string; dam: string
  images: string[]
}

const INIT: FormData = {
  name: '', breed: '', color: '', gender: 'Macho',
  age_years: '', age_months: '0', horse_function: '', price: '', negotiable: false,
  state: '', city: '', description: '', whatsapp: '',
  has_gta: false, has_mormo_exam: false, has_coggins: false, has_vaccination: false,
  registered: false, registration_entity: '', registration_number: '',
  sire: '', dam: '', images: [],
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const cls = "w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"

export default function NovoCavaloPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step,    setStep]    = useState(0)
  const [form,    setForm]    = useState<FormData>(INIT)
  const [saving,  setSaving]  = useState(false)
  const [imgInput, setImgInput] = useState('')

  const set = (key: keyof FormData, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }))

  const steps = ['Informações', 'Fotos', 'Docs & Pedigree', 'Contato']

  const addImage = () => {
    const url = imgInput.trim()
    if (!url || form.images.length >= 10) return
    set('images', [...form.images, url])
    setImgInput('')
  }

  const removeImage = (i: number) =>
    set('images', form.images.filter((_, idx) => idx !== i))

  const canProceed = () => {
    if (step === 0) return !!(form.name && form.breed && form.color && form.age_years && form.state)
    if (step === 1) return true // images optional
    if (step === 2) return true
    if (step === 3) return true
    return false
  }

  const submit = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/horses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age_years:  Number(form.age_years),
          age_months: Number(form.age_months),
          price:      form.price ? Number(form.price) : null,
        }),
      })
      if (!res.ok) {
        const e = await res.json()
        showToast(e.error || 'Erro ao criar anúncio', 'error')
        return
      }
      const data = await res.json()
      showToast('Anúncio criado com sucesso!', 'success')
      router.push(`/cavalo/${data.id}`)
    } catch {
      showToast('Erro ao criar anúncio', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 h-14 px-4 max-w-2xl mx-auto">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()} className="p-1.5">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-black text-slate-900">Anunciar Cavalo</p>
            <p className="text-xs text-slate-400">Passo {step + 1} de {steps.length}: {steps[step]}</p>
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          {/* ── Step 0: Informações Básicas ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              <Field label="Nome do cavalo" required>
                <input className={cls} placeholder="Ex: Relâmpago da Serra" value={form.name}
                  onChange={e => set('name', e.target.value)} />
              </Field>

              <Field label="Raça" required>
                <select className={cls} value={form.breed} onChange={e => set('breed', e.target.value)}>
                  <option value="">Selecione a raça</option>
                  {BREEDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Pelagem" required>
                  <input className={cls} placeholder="Ex: Alazão" value={form.color}
                    onChange={e => set('color', e.target.value)} />
                </Field>
                <Field label="Sexo" required>
                  <select className={cls} value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option>Macho</option>
                    <option>Fêmea</option>
                    <option>Castrado</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Idade (anos)" required>
                  <input className={cls} type="number" min="0" max="40" placeholder="0"
                    value={form.age_years} onChange={e => set('age_years', e.target.value)} />
                </Field>
                <Field label="Meses">
                  <select className={cls} value={form.age_months} onChange={e => set('age_months', e.target.value)}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{i} mês{i !== 1 ? 'es' : ''}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Função principal">
                <select className={cls} value={form.horse_function} onChange={e => set('horse_function', e.target.value)}>
                  <option value="">Selecione a função</option>
                  {FUNCTIONS.map(f => <option key={f}>{f}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Estado" required>
                  <select className={cls} value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="">UF</option>
                    {STATES_BR.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Cidade">
                  <input className={cls} placeholder="Ex: Uberlândia" value={form.city}
                    onChange={e => set('city', e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (R$)">
                  <input className={cls} type="number" min="0" placeholder="0"
                    value={form.price} onChange={e => set('price', e.target.value)} />
                </Field>
                <Field label="Negociável">
                  <div className="flex items-center h-[46px]">
                    <button onClick={() => set('negotiable', !form.negotiable)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form.negotiable ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      <motion.div animate={{ x: form.negotiable ? 24 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                    <span className="ml-2.5 text-sm text-slate-600 font-medium">
                      {form.negotiable ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </Field>
              </div>

              <Field label="Descrição">
                <textarea className={`${cls} resize-none`} rows={4}
                  placeholder="Descreva o animal, suas características, histórico de competições..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </Field>
            </motion.div>
          )}

          {/* ── Step 1: Fotos ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              <div className="text-center py-4">
                <Camera className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Adicionar Fotos</p>
                <p className="text-xs text-slate-400 mt-1">Cole as URLs das fotos do cavalo (até 10)</p>
              </div>

              <div className="flex gap-2">
                <input className={`${cls} flex-1`} placeholder="https://... (URL da foto)"
                  value={imgInput} onChange={e => setImgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addImage()} />
                <button onClick={addImage}
                  className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>

              {form.images.length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl py-10 text-center">
                  <p className="text-slate-400 text-sm">Nenhuma foto adicionada</p>
                  <p className="text-slate-300 text-xs mt-1">Fotos aumentam muito as chances de venda</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] font-bold
                                       px-1.5 py-0.5 rounded-full">CAPA</span>
                    )}
                    <button onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Docs & Pedigree ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Documentação</p>
                <div className="space-y-2">
                  {[
                    { key: 'has_gta',         label: 'GTA (Guia de Trânsito Animal)' },
                    { key: 'has_mormo_exam',   label: 'Exame de Mormo' },
                    { key: 'has_coggins',      label: 'Coggins (AIE)' },
                    { key: 'has_vaccination',  label: 'Vacinação em dia' },
                  ].map(({ key, label }) => (
                    <button key={key} onClick={() => set(key as keyof FormData, !form[key as keyof FormData])}
                      className="w-full flex items-center justify-between bg-white rounded-2xl px-4 py-3.5
                                 border border-slate-100 shadow-card">
                      <span className="text-sm text-slate-700 font-medium">{label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        form[key as keyof FormData]
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300'
                      }`}>
                        {form[key as keyof FormData] && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Registro */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Registro de Raça</p>
                <button onClick={() => set('registered', !form.registered)}
                  className={`w-full flex items-center justify-between bg-white rounded-2xl px-4 py-3.5
                              border shadow-card ${form.registered ? 'border-emerald-500' : 'border-slate-100'}`}>
                  <span className="text-sm text-slate-700 font-medium">Possui registro</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    form.registered ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {form.registered && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
                {form.registered && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Field label="Entidade">
                      <input className={cls} placeholder="ABQM, ABCCC..." value={form.registration_entity}
                        onChange={e => set('registration_entity', e.target.value)} />
                    </Field>
                    <Field label="Nº Registro">
                      <input className={cls} placeholder="Número" value={form.registration_number}
                        onChange={e => set('registration_number', e.target.value)} />
                    </Field>
                  </div>
                )}
              </div>

              {/* Pedigree */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pedigree (opcional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Pai">
                    <input className={cls} placeholder="Nome do pai" value={form.sire}
                      onChange={e => set('sire', e.target.value)} />
                  </Field>
                  <Field label="Mãe">
                    <input className={cls} placeholder="Nome da mãe" value={form.dam}
                      onChange={e => set('dam', e.target.value)} />
                  </Field>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Contato / Publicar ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-6">
              <Field label="WhatsApp para contato">
                <input className={cls} type="tel" placeholder="(11) 99999-9999" value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))} />
                <p className="text-xs text-slate-400 mt-1">Usado para o botão de WhatsApp no anúncio</p>
              </Field>

              {/* Summary */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-5 space-y-2.5">
                <p className="text-sm font-black text-slate-800 mb-3">Resumo do anúncio</p>
                {[
                  ['Nome', form.name || '—'],
                  ['Raça', form.breed || '—'],
                  ['Sexo / Idade', `${form.gender} · ${form.age_years || 0} anos ${form.age_months || 0} meses`],
                  ['Localização', [form.city, form.state].filter(Boolean).join(', ') || '—'],
                  ['Preço', form.price ? `R$ ${Number(form.price).toLocaleString('pt-BR')}${form.negotiable ? ' (negociável)' : ''}` : 'A combinar'],
                  ['Fotos', `${form.images.length} foto${form.images.length !== 1 ? 's' : ''}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">{k}</span>
                    <span className="text-slate-700 font-semibold text-right max-w-[60%] truncate">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 inset-x-0 lg:left-64 xl:left-72 bg-white border-t border-slate-100 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!canProceed() || saving}
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : submit()}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm
                       disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</>
            ) : step < steps.length - 1 ? (
              <>Próximo <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Publicar anúncio <CheckCircle className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
