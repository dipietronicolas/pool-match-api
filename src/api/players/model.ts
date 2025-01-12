import { QueryResultRow } from "pg";
import pool from "../../db/db";

type Player = {
  id: number,
  name: string,
  ranking: number,
  preferred_cue: null | string,
}

export const getAllPlayersQuery = async () => {
  const query = 'SELECT * from players;'
  return executeQuery<Player>(query);
}

export const getPlayerByIdQuery = async (id: string) => {
  const query = `
    SELECT * from players 
    WHERE id = ${id};
  `;
  return executeQuery<Player>(query);
}

export const savePlayerQuery = async (name: string) => {
  const query = `
    INSERT INTO players (name) 
    VALUES ('${name}');
  `;
  return executeQuery(query);
}

export const updatePlayerQuery = async (id: string, updates: Partial<Omit<Player, 'id'>>) => {
  const fields = Object.keys(updates).filter(entry => !!updates[entry as keyof Omit<Player, 'id'>]);
  const query = `
    UPDATE players
    SET ${fields.map((field, index) => `${field} = $${index + 1}`).join(', ')}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
  const values = [...fields.map(field => updates[field as keyof Omit<Player, 'id'>]), id];
  return executeQuery<Player>(query, values);
}

export const deletePlayerQuery = async (id: string) => {
  const query = `
    DELETE FROM players
    WHERE id = ${id}
  `;
  return executeQuery(query);
}

const executeQuery = async <T extends QueryResultRow>(query: string, params?: any[]) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query<T>(query, params);
    return result.rows;
  } catch (e) {
    return Promise.reject("Database error");
  } finally {
    if (client)
      client.release();
  }
};