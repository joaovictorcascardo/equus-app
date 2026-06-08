'use client'

import { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

function SingleToast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  const Icon = item.type === 'error' ? AlertCircle : CheckCircle

  const colors = {
    success: 'bg-emerald-600',
    error:   'bg-red-500',
    info:    'bg-slate-700',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-medium ${colors[item.type]} max-w-xs`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{item.message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-1">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Portal-style fixed container */}
      <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <SingleToast item={t} onClose={() => remove(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
