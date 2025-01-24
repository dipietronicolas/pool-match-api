import { NextFunction, Request, Response } from "express";
import {
  deletePlayerQuery,
  getAllPlayersQuery,
  getMatchByPlayerId,
  getPlayerByIdQuery,
  getPlayerByNameQuery,
  getPlayersByName,
  savePlayerQuery,
  updatePlayerQuery,
} from "./model";
import { httpErrors } from "../errors";
import { z } from "zod";
import { getPlayersQueryParamsSchema, playerIdSchema, userSchema } from "../schemas";

type NameQueryParam = z.infer<typeof getPlayersQueryParamsSchema>;
type PlayerIdParam = z.infer<typeof playerIdSchema>;
type PlayerSchema = z.infer<typeof userSchema>;

const getAllPlayers = async (
  req: Request<{}, {}, {}, NameQueryParam>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.query;

  try {
    let results;
    if (name)
      results = await getPlayersByName(name as string);
    else
      results = await getAllPlayersQuery();
    res.json(results)
  } catch (e) {
    next(httpErrors.serverError())
  }
}

const findPlayerById = async (
  req: Request<PlayerIdParam>,
  res: Response,
  next: NextFunction
) => {
  const playerId = Number(req.params.playerId);
  try {
    const results = await getPlayerByIdQuery(playerId);
    const foundUser = results.find(user => user.id === playerId)
    if (foundUser)
      res.json(foundUser)
    else
      next(httpErrors.notFoundError('Player not found.'))
  } catch (e) {
    next(httpErrors.serverError())
  }
}

const savePlayer = async (
  req: Request<{}, {}, PlayerSchema>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  try {
    const foundPlayer = await getPlayerByNameQuery(name ?? '');
    if (foundPlayer.length > 0) {
      next(httpErrors.conflictError());
    } else {
      await savePlayerQuery(name ?? '');
      res.status(201).json({
        ...req.body,
        message: "Player created",
      });
    }
  } catch (e) {
    next(httpErrors.serverError())
  }
}

const updatePlayer = async (
  req: Request<PlayerIdParam, {}, PlayerSchema>,
  res: Response,
  next: NextFunction
) => {
  const playerId = Number(req.params.playerId);
  const { preferred_cue, ranking } = req.body;
  const name = String(req.body.name);
  if (!name && !preferred_cue && !ranking) {
    next(httpErrors.badRequestError('No fields provided.'))
  } else
    try {
      const foundUser = await getPlayerByIdQuery(playerId); // devolver object en caso de que devuelva uno solo
      if (foundUser.length === 0)
        next(httpErrors.notFoundError("Invalid player's id."))
      else {
        const playerByName = await getPlayerByNameQuery(name);
        if (!!playerByName.length && playerByName[0].id !== Number(playerId)) {
          next(httpErrors.conflictError("Player's name is already in use"))
        } else {
          const result = await updatePlayerQuery(playerId, { name, preferred_cue, ranking });
          res.json(result);
        }
      }
    } catch (e) {
      next(httpErrors.serverError())
    }
}

const deletePlayer = async (
  req: Request<PlayerIdParam>,
  res: Response,
  next: NextFunction
) => {
  const playerId = Number(req.params.playerId);
  try {
    const foundUser = await getPlayerByIdQuery(playerId);
    if (foundUser.length === 0)
      next(httpErrors.notFoundError("Invalid player's id."));
    const foundExistingMatch = await getMatchByPlayerId(playerId);
    if (foundExistingMatch.length)
      next(httpErrors.conflictError("Player has an existing match, resource can't be deleted."));
    await deletePlayerQuery(playerId);
    res.status(204).send();
  } catch (e) {
    next(httpErrors.serverError())
  }
}

const playerService = {
  getAllPlayers,
  findPlayerById,
  savePlayer,
  updatePlayer,
  deletePlayer,
}

export default playerService;