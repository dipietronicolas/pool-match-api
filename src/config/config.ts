import dotenv from 'dotenv';
dotenv.config();

interface EnvConfigInterface {
  PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  DEFAULT_MATCH_END_TIME_OFFSET: number;
}

const getPort = () => {
  const port = Number(process.env.PORT);
  if (Number.isNaN(port))
    return 3000;
  return port;
}

const getDefaultMatchEndTimeOffset = () => {
  const endTimeOffset = Number(process.env.DEFAULT_MATCH_END_TIME_OFFSET);
  if (Number.isNaN(endTimeOffset)) {
    // default to one hour in miliseconds.
    return 3600000;
  }
  return endTimeOffset;
}

const config: EnvConfigInterface = {
  PORT: getPort(),
  POSTGRES_HOST: process.env.POSTGRES_HOST || '',
  POSTGRES_USER: process.env.POSTGRES_USER || '',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
  POSTGRES_DB: process.env.POSTGRES_DB || '',
  DEFAULT_MATCH_END_TIME_OFFSET: getDefaultMatchEndTimeOffset(),
};

if (!config.POSTGRES_HOST) {
  throw new Error('Missing required environment variables');
}

export default config;
