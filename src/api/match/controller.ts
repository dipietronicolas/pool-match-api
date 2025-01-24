import { Router } from "express";
import matchService from "./service";
import {
  createMatchSchema,
  getMatchQueryParamsSchema,
  matchIdSchema,
  updateMatchSchema,
} from '../schemas';
import {
  validateBody,
  validateParams,
  validateQueryParams
} from "../middleware";

const matchRouter = Router();

matchRouter.get('/matches', validateQueryParams(getMatchQueryParamsSchema), matchService.getMatches)
matchRouter.get('/matches/:matchId', validateParams(matchIdSchema), matchService.getMatchById)
matchRouter.post('/matches', validateBody(createMatchSchema), matchService.createMatch)
matchRouter.put('/matches/:matchId', validateParams(matchIdSchema), validateBody(updateMatchSchema), matchService.updateMatch)
matchRouter.delete('/matches/:matchId', validateParams(matchIdSchema), matchService.deleteMatch)

export default matchRouter;