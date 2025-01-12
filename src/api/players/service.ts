import { Request, Response } from "express";
import {
  deletePlayerQuery,
  getAllPlayersQuery,
  getPlayerByIdQuery,
  savePlayerQuery,
  updatePlayerQuery,
} from "./model";

const getAllPlayers = async (req: Request, res: Response) => {
  try {
    const results = await getAllPlayersQuery();
    res.json(results)
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
}

const findPlayerById = async (req: Request, res: Response) => {
  const { playerId } = req.params;
  try {
    const results = await getPlayerByIdQuery(playerId);
    const foundUser = results.find(user => `${user.id}` === playerId)
    if (foundUser)
      res.json(foundUser)
    else
      res.status(404).json({});
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
}

const savePlayer = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    await savePlayerQuery(name);
    res.status(201).json({
      ...req.body,
      message: "Player created",
    });
  } catch (e) {
    res.status(500).json({
      message: "Unable to connect to the database",
      errors: e,
    });
  }
}

const updatePlayer = async (req: Request, res: Response) => {
  const { playerId } = req.params;
  const { name, preferred_cue, ranking } = req.body;
  if (!name && !preferred_cue && !ranking) {
    res.status(404).json({
      message: 'no fields provided'
    })
  } else
    try {
      const foundUser = await getPlayerByIdQuery(playerId);
      if (foundUser.length === 0)
        res.status(404).json({
          message: 'Invalid player id'
        })
      else {
        const result = await updatePlayerQuery(playerId, { name, preferred_cue, ranking });
        res.json(result);
      }
    } catch (e) {
      res.status(500).json({
        message: "Unable to connect to the database",
        errors: e,
      });
    }
}

const deletePlayer = async (req: Request, res: Response) => {
  const { playerId } = req.params;
  try {
    const foundUser = await getPlayerByIdQuery(playerId);
    if (foundUser.length === 0)
      res.status(404).json({
        message: 'Invalid player id'
      })
    else {
      await deletePlayerQuery(playerId);
      res.status(204).send();
    }
  } catch (e) {
    res.status(500).json({
      message: "Unable to connect to the database",
      errors: e,
    });
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