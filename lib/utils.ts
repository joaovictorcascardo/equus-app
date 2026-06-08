import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value?: number | null): string {
  if (!value) return 'Consultar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatAge(years: number, months: number): string {
  if (years === 0 && months === 0) return 'Potro'
  if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`
  if (months === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`
  return `${years}a ${months}m`
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export function buildWhatsAppLink(number: string, horseName: string): string {
  const cleaned = number.replace(/\D/g, '')
  const msg = encodeURIComponent(
    `Olá! Vi o anúncio do *${horseName}* no Equus e tenho interesse. Podemos conversar?`
  )
  return `https://wa.me/55${cleaned}?text=${msg}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
