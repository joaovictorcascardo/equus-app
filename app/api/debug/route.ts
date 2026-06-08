import { NextResponse } from 'next/server'

console.log('[DEBUG-ROUTE] app/api/debug/route.ts carregado')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  console.log('[DEBUG-ROUTE] GET chamado')
  return NextResponse.json({
    ok: true,
    node: process.version,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    dbHost: process.env.DB_HOST ? 'configurado' : 'NÃO CONFIGURADO',
    dbName: process.env.DB_NAME ? 'configurado' : 'NÃO CONFIGURADO',
    jwtSecret: process.env.JWT_SECRET ? 'configurado' : 'NÃO CONFIGURADO',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
}
