import { executeQuery } from "../../db/db";
import { z } from "zod";
import { getMatchQueryParamsSchema, matchSchema } from "../schemas";

export type Match = {
  id: number;
  player1_id: number;
  player2_id: number;
  start_time: string;
  end_time?: string | null;
  winner_id?: number | null;
  table_number?: number | null;
};

type MatchByDateRangeType = Partial<Pick<z.infer<typeof matchSchema>, 'end_time' | 'start_time'>>;


export const updateMatchQuery = async (
  matchId: number, winner_id: number, end_time: Date
) => {

  const query = `
    UPDATE "match"
    SET winner_id = $1, end_time = $2
    WHERE id = $3
    RETURNING *;
  `;
  return executeQuery<Match>(query, [winner_id, end_time, matchId]);
}

export const getAllMatchesQuery = async () => {
  const query = 'SELECT * from "match"';
  return executeQuery<Match>(query);
}

export const getMatchByIdQuery = async (matchId: number) => {
  const query = `
    SELECT * from "match"
    WHERE id = $1;
  `;
  return executeQuery<Match>(query, [matchId]);
}

export const getMatchByDate = async (date: string) => {
  const query = `
    SELECT * 
    FROM "match"
    WHERE start_time::DATE = $1
    ORDER BY start_time ASC;
  `;
  return executeQuery<Match>(query, [date])
}

export const getMatchByDateRange = async (searchParams: MatchByDateRangeType) => {
  const fields = Object.keys(searchParams).filter(keyName => !!searchParams[keyName as keyof MatchByDateRangeType])
  const query = `
    SELECT * from "match"
    ${fields.length > 1
      ? (
        `WHERE ${fields.map((field, index) => `
          ${field}::DATE
          ${index === 0 ? '>' : '<'}
          $${index + 1}`).join(' AND ')
        }`
      ) : (
        `WHERE ${fields.map((field, index) => `
          ${field}::DATE 
          ${searchParams.start_time ? '>' : '<'}
          $${index + 1}`)
        }`
      )
    };
  `;
  const values = fields.map(field => searchParams[field as keyof MatchByDateRangeType])
  return executeQuery<Match>(query, [values])
}

export const hasOverlappingMatch = async (match: Omit<Match, 'id'>) => {
  const { player1_id, player2_id, start_time } = match;
  const query = `
    SELECT 1 FROM "match"
    WHERE ((player1_id = $1 OR player2_id = $2) OR (player1_id = $2 OR player2_id = $1))
    AND (start_time <= $3 AND end_time > $3)
    FOR UPDATE;
  `;
  return executeQuery<Match>(query, [player1_id, player2_id, start_time]);
}

export const createMatchQuery = async (match: Omit<Match, 'id'>) => {
  const { player1_id, player2_id, start_time, end_time } = match;
  const query = `
    INSERT INTO "match" (player1_id, player2_id, start_time, end_time)
    values ($1, $2, $3, $4)
  `;
  return executeQuery<Match>(query, [player1_id, player2_id, start_time, end_time]);
};

export const deleteMatchByIdQuery = async (matchId: number) => {
  const query = `
    DELETE from "match"
    WHERE id= $1;
  `;
  return executeQuery<Match>(query, [matchId]);
}