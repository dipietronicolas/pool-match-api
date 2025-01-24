import { QueryResultRow } from "pg";
import pool, { executeQuery } from "../../db/db";
import { Match } from "../match/model";

type Player = {
  id: number,
  name: string,
  ranking: number,
  preferred_cue: null | string,
}

export const getPlayersByName = async (name: string) => {
  const query = `SELECT * from players WHERE name ILIKE '%${name}%';`;
  return executeQuery<Player>(query);
}

export const getAllPlayersQuery = async () => {
  const query = 'SELECT * from players;'
  return executeQuery<Player>(query);
}

export const getPlayerByIdQuery = async (id: number) => {
  const query = `
    SELECT * from players 
    WHERE id = $1;
  `;
  return executeQuery<Player>(query, [id]);
}

export const getPlayerByNameQuery = async (name: string) => {
  const query = `
    SELECT * from players 
    WHERE name ILIKE $1;
  `;
  return executeQuery<Player>(query, [name]);
}

export const savePlayerQuery = async (name: string) => {
  const query = `
    INSERT INTO players (name) 
    VALUES ('${name}');
  `;
  return executeQuery(query);
}

export const updatePlayerQuery = async (id: number, updates: Partial<Omit<Player, 'id'>>) => {
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

export const deletePlayerQuery = async (id: number) => {
  const query = `
    DELETE FROM players
    WHERE id = $1;
  `;
  return executeQuery(query, [id]);
}

export const getMatchByPlayerId = async (playerId: number) => {
  const query = `
    SELECT * FROM "match"
    WHERE player1_id = $1 or player2_id = $1
    limit 1
  `;
  return executeQuery<Match>(query, [playerId]);
}

