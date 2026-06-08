import { NextRequest, NextResponse } from 'next/server'
import { query, insert } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface PostRow {
  id: number; user_id: number; horse_id: number | null; content: string | null
  type: string; created_at: string
  user_name: string; user_username: string; user_avatar: string | null; user_verified: number
  horse_name: string | null; horse_breed: string | null; horse_cover: string | null
  likes_count: number; liked: number
}

export async function GET(req: NextRequest) {
  const page   = Math.max(1, Number(req.nextUrl.searchParams.get('page') || 1))
  const limit  = 20
  const offset = (page - 1) * limit

  const session = await getSession()

  try {
    const posts = await query<PostRow>(`
      SELECT p.id, p.user_id, p.horse_id, p.content, p.type, p.created_at,
             u.name as user_name, u.username as user_username,
             u.avatar_url as user_avatar, u.verified as user_verified,
             h.name as horse_name, h.breed as horse_breed,
             (SELECT hi.url FROM horse_images hi WHERE hi.horse_id = h.id ORDER BY hi.order_index LIMIT 1) as horse_cover,
             (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count,
             ${session ? `(SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id AND l.user_id = ${session.userId})` : '0'} as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN horses h ON p.horse_id = h.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])

    const enriched = await Promise.all(posts.map(async p => {
      const images = await query<{ url: string; order_index: number }>(
        'SELECT url, order_index FROM post_images WHERE post_id = ? ORDER BY order_index',
        [p.id]
      )
      return {
        id:         p.id,
        user_id:    p.user_id,
        horse_id:   p.horse_id,
        content:    p.content,
        type:       p.type,
        created_at: p.created_at,
        likes_count: Number(p.likes_count),
        liked:      Boolean(p.liked),
        images,
        user: {
          name:       p.user_name,
          username:   p.user_username,
          avatar_url: p.user_avatar,
          verified:   Boolean(p.user_verified),
        },
        horse: p.horse_id ? {
          id:     p.horse_id,
          name:   p.horse_name,
          breed:  p.horse_breed,
          cover:  p.horse_cover,
        } : null,
      }
    }))

    return NextResponse.json({ posts: enriched, page })
  } catch (err) {
    console.error('[posts GET]', err)
    return NextResponse.json({ error: 'Erro ao buscar feed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const { content, horse_id, images = [], type = 'text' } = await req.json()
    if (!content && images.length === 0) {
      return NextResponse.json({ error: 'Conteúdo obrigatório' }, { status: 400 })
    }

    const postId = await insert(
      'INSERT INTO posts (user_id, horse_id, content, type) VALUES (?,?,?,?)',
      [session.userId, horse_id || null, content || null, images.length > 0 ? 'image' : type]
    )

    for (let i = 0; i < images.length; i++) {
      await insert(
        'INSERT INTO post_images (post_id, url, order_index) VALUES (?,?,?)',
        [postId, images[i], i]
      )
    }

    return NextResponse.json({ id: postId }, { status: 201 })
  } catch (err) {
    console.error('[posts POST]', err)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}
