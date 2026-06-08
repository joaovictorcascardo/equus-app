import mysql, { type ExecuteValues } from 'mysql2/promise'

const pool = mysql.createPool({
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

export default pool

export async function query<T = unknown>(sql: string, params?: ExecuteValues): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

export async function queryOne<T = unknown>(sql: string, params?: ExecuteValues): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}
