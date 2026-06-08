import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { comparePassword, signToken, authCookieOptions } from '@/lib/auth'

interface UserRow {
  id: number
  name: string
  username: string
  email: string
  password_hash: string
  avatar_url: string | null
  type: string
  verified: number
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 })
    }

    const user = await queryOne<UserRow>(
      'SELECT id, name, username, email, password_hash, avatar_url, type, verified FROM users WHERE email = ? AND is_active = 1',
      [email.toLowerCase().trim()]
    )

    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, username: user.username })

    const response = NextResponse.json({
      user: {
        id:         user.id,
        name:       user.name,
        username:   user.username,
        avatar_url: user.avatar_url,
        type:       user.type,
        verified:   Boolean(user.verified),
      },
    })

    response.cookies.set(authCookieOptions(token))
    return response

  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
