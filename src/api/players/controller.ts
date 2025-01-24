import { Router } from 'express';
import {
  getPlayersQueryParamsSchema, playerIdSchema, userSchema, 
} from '../schemas';
import { validateBody, validateParams, validateQueryParams } from '../middleware';
import playerService from './service';

const playersRouter = Router();

playersRouter.get('/players', validateQueryParams(getPlayersQueryParamsSchema), playerService.getAllPlayers);
playersRouter.get('/players/:playerId', validateParams(playerIdSchema), playerService.findPlayerById);
playersRouter.post('/players', validateBody(userSchema), playerService.savePlayer);
playersRouter.put('/players/:playerId', validateParams(playerIdSchema), validateBody(userSchema), playerService.updatePlayer);
playersRouter.delete('/players/:playerId', validateParams(playerIdSchema), playerService.deletePlayer);

export default playersRouter;