'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface EmptyStateProps {
  emoji?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  emoji = '🐴',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const router = useRouter()

  const handleAction = () => {
    if (onAction) return onAction()
    if (actionHref) router.push(actionHref)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <span className="text-6xl mb-4 select-none">{emoji}</span>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">{description}</p>
      {actionLabel && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAction}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm
                     hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}
