import { Router } from 'express';

const defaultRoute = Router();

defaultRoute.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

export default defaultRoute;
