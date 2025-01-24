import { NextFunction, Request, Response } from "express";
import {
  createMatchQuery,
  deleteMatchByIdQuery,
  getAllMatchesQuery,
  getMatchByDate,
  getMatchByDateRange,
  getMatchByIdQuery,
  hasOverlappingMatch,
  updateMatchQuery,
} from "./model";
import { httpErrors } from "../errors";
import {
  getMatchQueryParamsSchema,
  matchIdSchema,
  matchSchema,
  updateMatchSchema
} from "../schemas";
import { z } from "zod";
import config from "../../config/config";
import pool from "../../db/db";

type MatchIdParamsType = z.infer<typeof matchIdSchema>;
type MatchBodyType = z.infer<typeof matchSchema>;
type UpdateMatchBody = z.infer<typeof updateMatchSchema>;
type MatchesQueryParamsType = z.infer<typeof getMatchQueryParamsSchema>;

const getStatusData = ({ status }: Pick<MatchesQueryParamsType, 'status'>) => {
  const currentDate = new Date();

  switch (status) {
    case 'upcoming':
      return [currentDate.toISOString(), undefined];
    case 'ongoing': {
      const oneHourOffsetBefore = currentDate.getTime() - 3600000;
      const oneHourOffsetAfter = currentDate.getTime() + 3600000;
      return [
        new Date(oneHourOffsetBefore).toISOString(),
        new Date(oneHourOffsetAfter).toISOString(),
      ]
    }
    case 'completed':
      return [undefined, currentDate.toISOString()];
    default: return [];
  }
}

const getMatches = async (
  req: Request<{}, {}, {}, MatchesQueryParamsType>,
  res: Response,
  next: NextFunction
) => {
  const { status, date } = req.query;
  let results;
  try {
    if (date)
      results = await getMatchByDate(date);
    else if (status) {
      const [start_time, end_time] = getStatusData({ status })
      results = await getMatchByDateRange({ start_time, end_time });
    }
    else
      results = await getAllMatchesQuery();
    res.json(results)
  } catch (e) {
    console.log(e)
    next(httpErrors.serverError())
  }
}

const getMatchById = async (
  req: Request<MatchIdParamsType>,
  res: Response,
  next: NextFunction
) => {
  const matchId = Number(req.params.matchId);
  try {
    const results = await getMatchByIdQuery(matchId);
    if (!results.length)
      next(httpErrors.notFoundError('Match not found'));
    else
      res.json(results);
  } catch (e) {
    next(httpErrors.serverError())
  }
};

const createMatch = async (
  req: Request<{}, {}, MatchBodyType>,
  res: Response,
  next: NextFunction
) => {
  const getEndTime = (): string => {
    const end_time_offset = config.DEFAULT_MATCH_END_TIME_OFFSET;
    if (req.body.end_time)
      return req.body.end_time;
    return new Date(new Date(req.body.start_time).getTime() + end_time_offset).toISOString();
  }

  const player1_id = Number(req.body.player1_id);
  const player2_id = Number(req.body.player2_id);
  const start_time = req.body.start_time;
  const end_time = getEndTime();

  try {
    await pool.query('BEGIN');
    const results = await hasOverlappingMatch({ player1_id, player2_id, start_time });
    if (results.length)
      throw new Error(JSON.stringify({ status: 409 }))
    await createMatchQuery({ player1_id, player2_id, start_time, end_time });
    await pool.query('COMMIT');
    res.status(201).send();
  } catch (e: any) {
    await pool.query('ROLLBACK');
    if (e.message) {
      const { status } = JSON.parse(e.message);
      if (status === 409) next(httpErrors.conflictError('Player is already booked for another match'))
    } else {
      next(httpErrors.serverError())
    }
  }
};

const updateMatch = async (
  req: Request<MatchIdParamsType, {}, UpdateMatchBody>,
  res: Response,
  next: NextFunction
) => {
  const matchId = Number(req.params.matchId);
  const winner_id = Number(req.body.winner_id);
  const { end_time } = req.body;
  const timestampEndTime = new Date(end_time);

  try {
    const foundMatch = await getMatchByIdQuery(matchId);
    const start_time = foundMatch[0].start_time;
    const date_start_time = new Date(start_time).getTime();
    const date_end_time = new Date(end_time).getTime();

    if (foundMatch.length === 0)
      next(httpErrors.badRequestError('Resource not found'));
    else if (date_start_time - date_end_time > 0)
      next(httpErrors.badRequestError('End time must be greater than start time.'));
    else if (![foundMatch[0].player1_id, foundMatch[0].player2_id].includes(winner_id))
      next(httpErrors.badRequestError('Winner id must be one of the assigned players.'));
    else {
      await updateMatchQuery(matchId, winner_id, timestampEndTime);
      res.send({ message: 'Match updated' });
    }

  } catch (error) {
    next(httpErrors.serverError())
  }
}

const deleteMatch = async (
  req: Request<MatchIdParamsType>,
  res: Response,
  next: NextFunction
) => {
  const matchId = Number(req.params.matchId);
  try {
    const foundMatch = await getMatchByIdQuery(matchId);
    if (foundMatch.length === 0)
      next(httpErrors.badRequestError('Resource not found'));
    else {
      await deleteMatchByIdQuery(matchId);
      res.status(204).json({
        message: 'Resource successfully deleted'
      });
    }
  } catch (e) {
    next(httpErrors.serverError())
  }
}

const matchService = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
}

export default matchService;
