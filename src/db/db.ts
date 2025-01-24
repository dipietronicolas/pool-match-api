import { DatabaseError, Pool, QueryResultRow } from "pg";
import config from "../config/config";

const port = process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432;

export const pool = new Pool({
  host: config.POSTGRES_HOST,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  port,
  idleTimeoutMillis: 30000
});

pool.on('connect', () => {console.log('database on')})

export const executeQuery = async <T extends QueryResultRow>(query: string, params?: any[]) => {
  try {
    const result = await pool.query<T>(query, params);
    console.log(query, params ? params : '');
    return result.rows;
  } catch (e: unknown) {
    if (e instanceof DatabaseError)
      return Promise.reject({
        message: `Database error: ${e.detail}`,
        statusCode: e.code,
      });
      console.error('query: ', query)
    return Promise.reject({ message: "Database error" });
  }
};

export default pool;