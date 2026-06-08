import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { name, bio, city, state, avatar_url, cover_url, whatsapp, phone } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })

  await query(
    `UPDATE users SET name=?, bio=?, city=?, state=?, avatar_url=?, cover_url=?, whatsapp=?, phone=?
     WHERE id=?`,
    [
      name.trim(),
      bio?.trim() || null,
      city?.trim() || null,
      state?.trim() || null,
      avatar_url?.trim() || null,
      cover_url?.trim() || null,
      whatsapp?.replace(/\D/g, '') || null,
      phone?.replace(/\D/g, '') || null,
      session.userId,
    ]
  )

  return NextResponse.json({ success: true })
}
