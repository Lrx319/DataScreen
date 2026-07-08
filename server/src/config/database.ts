import 'dotenv/config'
import { createPool, type Pool } from 'mysql2/promise'

const pool: Pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'datascreen',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export { pool }
