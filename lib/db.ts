console.log('[DB1] lib/db.ts carregado')

import mysql, { type ExecuteValues, type ResultSetHeader } from 'mysql2/promise'

console.log('[DB2] mysql2 importado')

let pool: mysql.Pool

try {
  pool = mysql.createPool({
    host:            process.env.DB_HOST     || 'localhost',
    port:            Number(process.env.DB_PORT) || 3306,
    user:            process.env.DB_USER     || 'root',
    password:        process.env.DB_PASSWORD || '',
    database:        process.env.DB_NAME     || 'equus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:      0,
    charset:         'utf8mb4',
  })
  console.log('[DB3] pool criado — host:', process.env.DB_HOST, 'db:', process.env.DB_NAME)
} catch (err) {
  console.error('[DB-ERRO] falha ao criar pool:', err)
  throw err
}

export default pool

export async function query<T = unknown>(sql: string, params?: ExecuteValues): Promise<T[]> {
  console.log('[DB-QUERY]', sql.slice(0, 60))
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

export async function queryOne<T = unknown>(sql: string, params?: ExecuteValues): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

export async function insert(sql: string, params?: ExecuteValues): Promise<number> {
  console.log('[DB-INSERT]', sql.slice(0, 60))
  const [result] = await pool.execute(sql, params)
  return (result as ResultSetHeader).insertId
}
