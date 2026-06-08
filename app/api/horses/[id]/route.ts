import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface HorseRow {
  id: number; owner_id: number; name: string; breed: string; color: string
  gender: string; age_years: number; age_months: number; price: number | null
  negotiable: number; horse_function: string | null; status: string
  state: string; city: string | null; description: string | null
  has_gta: number; has_mormo_exam: number; mormo_exam_date: string | null
  has_coggins: number; coggins_date: string | null; has_vaccination: number
  sire: string | null; dam: string | null; sire_sire: string | null; dam_dam: string | null
  registered: number; registration_entity: string | null; registration_number: string | null
  views: number; created_at: string
  owner_name: string; owner_username: string; owner_avatar: string | null
  owner_whatsapp: string | null; owner_verified: number; owner_type: string
  owner_city: string | null; owner_state: string | null
}
interface ImageRow { id: number; url: string; order_index: number; is_cover: number }

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const horse = await queryOne<HorseRow>(`
      SELECT h.*, u.name as owner_name, u.username as owner_username,
             u.avatar_url as owner_avatar, u.whatsapp as owner_whatsapp,
             u.verified as owner_verified, u.type as owner_type,
             u.city as owner_city, u.state as owner_state
      FROM horses h JOIN users u ON h.owner_id = u.id
      WHERE h.id = ?
    `, [id])

    if (!horse) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const images = await query<ImageRow>(
      'SELECT id, url, order_index, is_cover FROM horse_images WHERE horse_id = ? ORDER BY order_index',
      [id]
    )

    // increment views (fire and forget)
    queryOne('UPDATE horses SET views = views + 1 WHERE id = ?', [id]).catch(() => {})

    const session = await getSession()
    let saved = false
    if (session) {
      const row = await queryOne('SELECT id FROM saved_horses WHERE user_id=? AND horse_id=?', [session.userId, id])
      saved = !!row
    }

    return NextResponse.json({
      horse: {
        ...horse,
        negotiable: Boolean(horse.negotiable),
        has_gta: Boolean(horse.has_gta),
        has_mormo_exam: Boolean(horse.has_mormo_exam),
        has_coggins: Boolean(horse.has_coggins),
        has_vaccination: Boolean(horse.has_vaccination),
        registered: Boolean(horse.registered),
        images: images.map(img => ({ ...img, is_cover: Boolean(img.is_cover) })),
        owner: {
          id:         horse.owner_id,
          name:       horse.owner_name,
          username:   horse.owner_username,
          avatar_url: horse.owner_avatar,
          whatsapp:   horse.owner_whatsapp,
          verified:   Boolean(horse.owner_verified),
          type:       horse.owner_type,
          city:       horse.owner_city,
          state:      horse.owner_state,
        },
        saved,
      }
    })
  } catch (err) {
    console.error('[horse GET]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
