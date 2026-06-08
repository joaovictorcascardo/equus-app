import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface UserRow {
  id: number; name: string; username: string; email: string; type: string
  bio: string | null; avatar_url: string | null; cover_url: string | null
  phone: string | null; whatsapp: string | null; city: string | null
  state: string | null; verified: number; created_at: string
}
interface HorseRow {
  id: number; name: string; breed: string; price: number | null
  negotiable: number; state: string; created_at: string; cover_url: string | null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await queryOne<UserRow>(
    'SELECT id,name,username,email,type,bio,avatar_url,cover_url,phone,whatsapp,city,state,verified,created_at FROM users WHERE username=? AND is_active=1',
    [username]
  )
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const horses = await query<HorseRow>(`
    SELECT h.id, h.name, h.breed, h.price, h.negotiable, h.state, h.created_at,
           (SELECT hi.url FROM horse_images hi WHERE hi.horse_id=h.id ORDER BY hi.order_index LIMIT 1) as cover_url
    FROM horses h WHERE h.owner_id=? AND h.status='active'
    ORDER BY h.created_at DESC LIMIT 30
  `, [user.id])

  const session = await getSession()
  let isFollowing = false
  let isSelf = false
  if (session) {
    isSelf = session.userId === user.id
    if (!isSelf) {
      const follow = await queryOne(
        'SELECT 1 FROM follows WHERE follower_id=? AND following_id=?',
        [session.userId, user.id]
      )
      isFollowing = !!follow
    }
  }

  const [{ count: followersCount }] = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM follows WHERE following_id=?', [user.id]
  ) as [{ count: number }]
  const [{ count: followingCount }] = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id=?', [user.id]
  ) as [{ count: number }]
  const [{ count: horsesCount }] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM horses WHERE owner_id=? AND status='active'", [user.id]
  ) as [{ count: number }]

  return NextResponse.json({
    user: { ...user, verified: Boolean(user.verified) },
    horses: horses.map(h => ({ ...h, negotiable: Boolean(h.negotiable) })),
    stats: { followers: Number(followersCount), following: Number(followingCount), horses: Number(horsesCount) },
    isFollowing,
    isSelf,
  })
}
