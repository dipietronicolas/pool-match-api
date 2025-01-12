import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { router } from './api';
import { initializeDatabase } from './db/schema';

const app = express();

// config
app.set('PORT', process.env.PORT || 3000);
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routes
app.use('/', router);

const port = app.get('PORT');

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await initializeDatabase();
});
