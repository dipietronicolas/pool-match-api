import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1).optional(),
  ranking: z.number().min(1).optional(),
  preferred_cue: z.string().min(1).optional()
}).strict();

export const playerIdSchema = z.object({
  playerId: z.coerce.number().optional(),
}).strict();

export const matchIdSchema = z.object({
  matchId: z.coerce.number().optional(),
}).strict();

export const createMatchSchema = z.object({
  player1_id: z.coerce.number().min(1),
  player2_id: z.coerce.number().min(1),
  start_time: z.string().datetime({ offset: true }),
  end_time: z.string().datetime({ offset: true }).nullable().optional(),
}).strict();

export const getPlayersQueryParamsSchema = z.object({
  name: z.string().min(1).optional(),
}).strict();

export const getMatchQueryParamsSchema = z.object({
  status: z.enum(["upcoming", "ongoing", "completed"]).optional(),
  date: z.string().date().optional(),
}).strict();

export const matchSchema = z.object({
  id: z.number().int().optional(),
  player1_id: z.number().int().min(1, "player1_id must be a positive integer"),
  player2_id: z.number().int().min(1, "player2_id must be a positive integer"),
  start_time: z.string().datetime({ offset: true }),
  end_time: z.string().datetime({ offset: true }).nullable().optional(),
  winner_id: z.number().int().nullable().optional(),
  table_number: z.number().int().nullable().optional(),
}).strict();

export const updateMatchSchema = z.object({
  end_time: z.string().datetime({ offset: true }),
  winner_id: z.coerce.number(),
}).strict();