import { Pool } from "pg";

const port = process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432;

console.log({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD ?? '',
  database: process.env.POSTGRES_DB,
  port,
  idleTimeoutMillis: 30000
})

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD ?? '',
  database: process.env.POSTGRES_DB,
  port,
  idleTimeoutMillis: 30000
});

export default pool;