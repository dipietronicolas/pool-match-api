import { Router } from "express";

const matchRouter = Router();

matchRouter.get('/matches', (req, res) => {
  res.send('matches lists');
})

export default matchRouter;