import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
  apiURL: process.env.API_URL ?? 'http://localhost:4200',
  environment: process.env.ENVIRONMENT ?? 'local',
  headless: process.env.HEADLESS !== 'false',
  workers: Number(process.env.WORKERS ?? '4'),
};
