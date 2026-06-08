import { NextRequest, NextResponse } from 'next/server'
import { query, insert } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams
  const breed    = s.get('breed')    || ''
  const color    = s.get('color')    || ''
  const fn       = s.get('function') || ''
  const state    = s.get('state')    || ''
  const minPrice = s.get('minPrice')
  const maxPrice = s.get('maxPrice')
  const q        = s.get('q')        || ''
  const page     = Math.max(1, Number(s.get('page') || 1))
  const limit    = Math.min(40, Number(s.get('limit') || 20))
  const offset   = (page - 1) * limit

  const conditions: string[] = ["h.status = 'active'"]
  const params: (string | number)[] = []

  if (breed)    { conditions.push('h.breed = ?');          params.push(breed) }
  if (color)    { conditions.push('h.color = ?');          params.push(color) }
  if (fn)       { conditions.push('h.horse_function = ?'); params.push(fn) }
  if (state)    { conditions.push('h.state = ?');          params.push(state) }
  if (minPrice) { conditions.push('h.price >= ?');         params.push(Number(minPrice)) }
  if (maxPrice) { conditions.push('h.price <= ?');         params.push(Number(maxPrice)) }
  if (q)        { conditions.push('(h.name LIKE ? OR h.breed LIKE ? OR h.description LIKE ?)'); params.push(`%${q}%`, `%${q}%`, `%${q}%`) }

  const where = conditions.join(' AND ')

  try {
    interface HorseRow {
      id: number; owner_id: number; name: string; breed: string; color: string
      gender: string; age_years: number; age_months: number; price: number | null
      negotiable: number; horse_function: string | null; status: string; state: string; city: string | null
      views: number; created_at: string
      owner_name: string; owner_username: string; owner_avatar: string | null; owner_verified: number
      cover_url: string | null
    }

    const horses = await query<HorseRow>(`
      SELECT h.id, h.owner_id, h.name, h.breed, h.color, h.gender,
             h.age_years, h.age_months, h.price, h.negotiable,
             h.horse_function, h.status, h.state, h.city, h.views, h.created_at,
             u.name as owner_name, u.username as owner_username,
             u.avatar_url as owner_avatar, u.verified as owner_verified,
             (SELECT hi.url FROM horse_images hi WHERE hi.horse_id = h.id ORDER BY hi.order_index LIMIT 1) as cover_url
      FROM horses h
      JOIN users u ON h.owner_id = u.id
      WHERE ${where}
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    return NextResponse.json({ horses, page, limit })
  } catch (err) {
    console.error('[horses GET]', err)
    return NextResponse.json({ error: 'Erro ao buscar cavalos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      name, breed, color, gender, age_years = 0, age_months = 0,
      price, negotiable = true, horse_function, state, city,
      description, has_gta = false, has_mormo_exam = false, has_coggins = false,
      has_vaccination = false, sire, dam, sire_sire, dam_dam,
      registered = false, registration_entity, registration_number,
      images = [],
    } = body

    if (!name || !breed || !color || !gender || !state) {
      return NextResponse.json({ error: 'Campos obrigatórios: nome, raça, pelagem, sexo, estado' }, { status: 400 })
    }

    const horseId = await insert(`
      INSERT INTO horses
        (owner_id, name, breed, color, gender, age_years, age_months,
         price, negotiable, horse_function, state, city, description,
         has_gta, has_mormo_exam, has_coggins, has_vaccination,
         sire, dam, sire_sire, dam_dam, registered, registration_entity, registration_number)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      session.userId, name, breed, color, gender, age_years, age_months,
      price || null, negotiable ? 1 : 0, horse_function || null, state, city || null, description || null,
      has_gta ? 1 : 0, has_mormo_exam ? 1 : 0, has_coggins ? 1 : 0, has_vaccination ? 1 : 0,
      sire || null, dam || null, sire_sire || null, dam_dam || null,
      registered ? 1 : 0, registration_entity || null, registration_number || null,
    ])

    for (let i = 0; i < images.length; i++) {
      await insert(
        'INSERT INTO horse_images (horse_id, url, order_index, is_cover) VALUES (?,?,?,?)',
        [horseId, images[i], i, i === 0 ? 1 : 0]
      )
    }

    return NextResponse.json({ id: horseId }, { status: 201 })
  } catch (err) {
    console.error('[horses POST]', err)
    return NextResponse.json({ error: 'Erro ao criar anúncio' }, { status: 500 })
  }
}
