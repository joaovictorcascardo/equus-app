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
    'SELECT id FROM saved_horses WHERE user_id=? AND horse_id=?',
    [session.userId, id]
  )

  if (existing) {
    await queryOne('DELETE FROM saved_horses WHERE user_id=? AND horse_id=?', [session.userId, id])
    return NextResponse.json({ saved: false })
  } else {
    await insert('INSERT INTO saved_horses (user_id, horse_id) VALUES (?,?)', [session.userId, id])
    return NextResponse.json({ saved: true })
  }
}
