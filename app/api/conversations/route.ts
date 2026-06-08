import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne, insert } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface ConvRow {
  id: number; horse_id: number | null; buyer_id: number; seller_id: number
  last_message_at: string; created_at: string
  horse_name: string | null; horse_cover: string | null
  other_name: string; other_username: string; other_avatar: string | null; other_verified: number
  last_message: string | null; unread_count: number
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const uid = session.userId
  const convs = await query<ConvRow>(`
    SELECT c.id, c.horse_id, c.buyer_id, c.seller_id, c.last_message_at, c.created_at,
           h.name as horse_name,
           (SELECT hi.url FROM horse_images hi WHERE hi.horse_id=h.id ORDER BY hi.order_index LIMIT 1) as horse_cover,
           CASE WHEN c.buyer_id=? THEN u2.name  ELSE u1.name  END as other_name,
           CASE WHEN c.buyer_id=? THEN u2.username ELSE u1.username END as other_username,
           CASE WHEN c.buyer_id=? THEN u2.avatar_url ELSE u1.avatar_url END as other_avatar,
           CASE WHEN c.buyer_id=? THEN u2.verified ELSE u1.verified END as other_verified,
           (SELECT m.content FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
           (SELECT COUNT(*) FROM messages m WHERE m.conversation_id=c.id AND m.sender_id!=? AND m.read_at IS NULL) as unread_count
    FROM conversations c
    JOIN users u1 ON c.buyer_id=u1.id
    JOIN users u2 ON c.seller_id=u2.id
    LEFT JOIN horses h ON c.horse_id=h.id
    WHERE c.buyer_id=? OR c.seller_id=?
    ORDER BY c.last_message_at DESC
  `, [uid, uid, uid, uid, uid, uid, uid])

  return NextResponse.json({
    conversations: convs.map(c => ({
      ...c,
      other_verified: Boolean(c.other_verified),
      unread_count: Number(c.unread_count),
    }))
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { seller_id, horse_id } = await req.json()
  if (!seller_id) return NextResponse.json({ error: 'seller_id obrigatório' }, { status: 400 })
  if (seller_id === session.userId) {
    return NextResponse.json({ error: 'Não pode conversar consigo mesmo' }, { status: 400 })
  }

  const existing = await queryOne<{ id: number }>(
    'SELECT id FROM conversations WHERE buyer_id=? AND seller_id=? AND (horse_id=? OR (horse_id IS NULL AND ? IS NULL))',
    [session.userId, seller_id, horse_id || null, horse_id || null]
  )
  if (existing) return NextResponse.json({ conversation: { id: existing.id } })

  const id = await insert(
    'INSERT INTO conversations (buyer_id, seller_id, horse_id) VALUES (?,?,?)',
    [session.userId, seller_id, horse_id || null]
  )
  return NextResponse.json({ conversation: { id } }, { status: 201 })
}
