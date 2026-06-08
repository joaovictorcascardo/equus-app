import { NextRequest, NextResponse } from 'next/server'
import { queryOne, insert } from '@/lib/db'
import { hashPassword, signToken, authCookieOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password, type, phone, whatsapp, state } = await request.json()

    // Validação básica
    if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }
    if (!/^[a-z0-9_.]+$/i.test(username)) {
      return NextResponse.json({ error: 'Usuário: use apenas letras, números, ponto e underscore' }, { status: 400 })
    }

    // Unicidade
    const emailExists = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()])
    if (emailExists) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    const usernameExists = await queryOne('SELECT id FROM users WHERE username = ?', [username.toLowerCase().trim()])
    if (usernameExists) {
      return NextResponse.json({ error: 'Este nome de usuário já está em uso' }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const userId = await insert(
      `INSERT INTO users (type, name, username, email, password_hash, phone, whatsapp, state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type       || 'buyer',
        name.trim(),
        username.toLowerCase().trim(),
        email.toLowerCase().trim(),
        password_hash,
        phone     || null,
        whatsapp  || null,
        state     || null,
      ]
    )

    const token = signToken({ userId, username: username.toLowerCase().trim() })

    const response = NextResponse.json(
      { user: { id: userId, name: name.trim(), username: username.toLowerCase().trim() } },
      { status: 201 }
    )

    response.cookies.set(authCookieOptions(token))
    return response

  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
