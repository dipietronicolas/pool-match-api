import pool from "./db";

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      ranking INT DEFAULT 0,
      preferred_cue VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS match (
      id SERIAL PRIMARY KEY,
      player1_id INT NOT NULL REFERENCES players(id),
      player2_id INT NOT NULL REFERENCES players(id),
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      winner_id INT REFERENCES players(id),
      table_number INT
    );
  `);
}

// Run the table creation and seeding process
export const initializeDatabase = async () => {
  try {
    await createTables();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};