# Pool Match API

Pool Match API is a backend service designed to manage 8-Ball Pool matches and tournaments. It allows users to schedule matches, track ongoing games, record results, and optionally manage small leagues or tournaments.

## Key Features

- **Match Management**: Schedule matches and track their progress.
- **Player Availability**: Prevent players from being scheduled in multiple matches at the same time.
- **Tournament Management**: Organize small tournaments or leagues.
- **Data Integrity**: Ensure consistency with transactions and foreign keys.

## Technologies Used

- **Node.js** with **Express** for the backend server.
- **TypeScript** for type safety and improved developer experience.
- **PostgreSQL** for database management, using plain SQL queries.
- **Zod** for schema validation.
- **Docker** for containerization.

## Prerequisites

- Node.js (v18+ recommended)
- Docker
- A PostgreSQL client (e.g., pgAdmin, psql) for database management if needed

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dipietronicolas/pool-match-api.git
   cd pool-match-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and configure the following variables:

   ```env
      PORT={your_project_port}

      POSTGRES_DB={your_db_name}
      POSTGRES_USER={your_db_user}
      POSTGRES_PASSWORD={your_db_password}
      POSTGRES_PORT={your_db_port}
      POSTGRES_HOST={your_db_host}

      DEFAULT_MATCH_END_TIME_OFFSET=3600000
   ```

4. Start the PostgreSQL database using Docker:

   ```bash
   docker-compose up 
   ```

5. Start the server:

   - For development:

     ```bash
     npm run dev
     ```

   - For production:

     ```bash
     npm start
     ```

### API Endpoints

The API provides the following key endpoints:

#### Matches

- `POST /matches`: Create a match, specifying two different players and a proposed start\_time.
- `GET /matches`: List all matches, optionally filter by date or status.
- `GET /matches/:matchId`: Retrieve details of a single match.
- `PUT /matches/:matchId`: Update match details (e.g., set end\_time, declare a winner\_id).
- `DELETE /matches/:matchId`: Delete a match.

#### Players

- `POST /players`: Create a player.
- `GET /players`: List all players.
- `GET /players/:playerId`: Retrieve details of a single player.
- `PUT /players/:playerId`: Update a player's details.
- `DELETE /players/:playerId`: Remove a player.

For a complete list of endpoints and their usage, refer to the API documentation.

## Development

### Running Tests

To be added: Unit tests and integration tests.

### Codebase Structure

```plaintext
src/
├── api/
│   ├── match/
│   │   ├── controller.ts  # Match controllers
│   │   ├── model.ts       # Match models
│   │   └── service.ts     # Match services
│   ├── player/
│       ├── controller.ts  # Player controllers
│       ├── model.ts       # Player models
│       └── service.ts     # Player services
```


