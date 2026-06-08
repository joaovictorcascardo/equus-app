import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { queryOne } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const user = await queryOne(
      'SELECT id, name, username, email, avatar_url, cover_url, bio, city, state, type, verified, whatsapp, phone FROM users WHERE id = ? AND is_active = 1',
      [session.userId]
    )

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error('[me]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
