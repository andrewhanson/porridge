import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const config = useRuntimeConfig()
    
    pool = new Pool({
      host: config.postgresHost,
      port: parseInt(config.postgresPort || '5432'),
      database: config.postgresDb,
      user: config.postgresUser,
      password: config.postgresPassword,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
  }
  
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}