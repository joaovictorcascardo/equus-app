import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { username } = await params
  const target = await queryOne<{ id: number }>(
    'SELECT id FROM users WHERE username=? AND is_active=1', [username]
  )
  if (!target) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  if (target.id === session.userId) return NextResponse.json({ error: 'Não pode seguir a si mesmo' }, { status: 400 })

  const existing = await queryOne(
    'SELECT 1 FROM follows WHERE follower_id=? AND following_id=?',
    [session.userId, target.id]
  )

  if (existing) {
    await query('DELETE FROM follows WHERE follower_id=? AND following_id=?', [session.userId, target.id])
    return NextResponse.json({ following: false })
  } else {
    await query('INSERT INTO follows (follower_id, following_id) VALUES (?,?)', [session.userId, target.id])
    return NextResponse.json({ following: true })
  }
}
