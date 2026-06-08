import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne, insert } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface MsgRow {
  id: number; conversation_id: number; sender_id: number; content: string
  type: string; read_at: string | null; created_at: string
}
interface ConvRow { buyer_id: number; seller_id: number }

async function checkAccess(convId: string, userId: number): Promise<ConvRow | null> {
  const conv = await queryOne<ConvRow>(
    'SELECT buyer_id, seller_id FROM conversations WHERE id=?', [convId]
  )
  if (!conv) return null
  if (conv.buyer_id !== userId && conv.seller_id !== userId) return null
  return conv
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const conv = await checkAccess(id, session.userId)
  if (!conv) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const messages = await query<MsgRow>(
    'SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at ASC',
    [id]
  )

  // mark as read
  queryOne(
    'UPDATE messages SET read_at=NOW() WHERE conversation_id=? AND sender_id!=? AND read_at IS NULL',
    [id, session.userId]
  ).catch(() => {})

  return NextResponse.json({ messages })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const conv = await checkAccess(id, session.userId)
  if (!conv) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const { content, type = 'text' } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Conteúdo vazio' }, { status: 400 })

  const msgId = await insert(
    'INSERT INTO messages (conversation_id, sender_id, content, type) VALUES (?,?,?,?)',
    [id, session.userId, content.trim(), type]
  )
  queryOne(
    'UPDATE conversations SET last_message_at=NOW() WHERE id=?', [id]
  ).catch(() => {})

  return NextResponse.json({ id: msgId }, { status: 201 })
}
