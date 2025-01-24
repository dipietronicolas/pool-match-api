import express from 'express';
import config from './config/config';
import { router } from './api';
import { initializeDatabase } from './db/schema';
import { errorHandlerMiddleware } from './api/middleware';

const app = express();

// config
app.set('PORT', config.PORT);
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routes
app.use('/', router);

// error handler
app.use(errorHandlerMiddleware);

const port = app.get('PORT');

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await initializeDatabase();
});
