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
  console.log('[LOGIN] POST recebido')

  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[LOGIN] email recebido:', email?.toLowerCase?.()?.trim())

    if (!email?.trim() || !password) {
      console.log('[LOGIN] campos faltando — email:', !!email, 'senha:', !!password)
      return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 })
    }

    const user = await queryOne<UserRow>(
      'SELECT id, name, username, email, password_hash, avatar_url, type, verified FROM users WHERE email = ? AND is_active = 1',
      [email.toLowerCase().trim()]
    )

    if (!user) {
      console.log('[LOGIN] usuário não encontrado para:', email)
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    console.log('[LOGIN] usuário encontrado — id:', user.id, 'type:', user.type)

    const valid = await comparePassword(password, user.password_hash)
    console.log('[LOGIN] senha válida:', valid)

    if (!valid) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, username: user.username })
    console.log('[LOGIN] token gerado — userId:', user.id)

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
    console.log('[LOGIN] sucesso — redirecionando userId:', user.id)
    return response

  } catch (err) {
    console.error('[LOGIN] erro interno:', err)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
