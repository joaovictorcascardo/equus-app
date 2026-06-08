import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const horses = await query<{
    id: number; name: string; breed: string; price: number | null
    negotiable: number; state: string; cover_url: string | null; saved_at: string
  }>(`
    SELECT h.id, h.name, h.breed, h.price, h.negotiable, h.state, sh.created_at as saved_at,
           (SELECT hi.url FROM horse_images hi WHERE hi.horse_id=h.id ORDER BY hi.order_index LIMIT 1) as cover_url
    FROM saved_horses sh
    JOIN horses h ON h.id = sh.horse_id
    WHERE sh.user_id=? AND h.status='active'
    ORDER BY sh.created_at DESC
  `, [session.userId])

  return NextResponse.json({ horses: horses.map(h => ({ ...h, negotiable: Boolean(h.negotiable) })) })
}
