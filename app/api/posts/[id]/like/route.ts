import { NextRequest, NextResponse } from 'next/server'
import { queryOne, insert } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const existing = await queryOne(
    'SELECT id FROM likes WHERE user_id=? AND post_id=?',
    [session.userId, id]
  )

  if (existing) {
    await queryOne('DELETE FROM likes WHERE user_id=? AND post_id=?', [session.userId, id])
    return NextResponse.json({ liked: false })
  } else {
    await insert('INSERT INTO likes (user_id, post_id) VALUES (?,?)', [session.userId, id])
    return NextResponse.json({ liked: true })
  }
}
