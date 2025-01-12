import express from 'express';
import defaultRoute from './default.routes';
import playersRouter from './players/controller';
import matchRouter from './match/controller';

export const router = express.Router();

router.use([
  defaultRoute,
  playersRouter,
  matchRouter
]);