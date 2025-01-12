import { Router } from 'express';
import { playerIdSchema, userSchema, validateBody, validateParams } from './middleware';
import playerService from './service';

const playersRouter = Router();

playersRouter.get('/players', playerService.getAllPlayers);
playersRouter.get('/players/:playerId', validateParams(playerIdSchema), playerService.findPlayerById);
playersRouter.post('/players', validateBody(userSchema), playerService.savePlayer);
playersRouter.put('/players/:playerId', validateParams(playerIdSchema), playerService.updatePlayer);
playersRouter.delete('/players/:playerId', validateParams(playerIdSchema), playerService.deletePlayer);

export default playersRouter;