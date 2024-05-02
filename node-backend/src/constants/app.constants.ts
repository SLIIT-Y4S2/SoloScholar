import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT!, 10);

const MONGO_URI: string = process.env.MONGO_URI!;

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

const JWT_SECRET: string = process.env.JWT_SECRET!;

const AZURE_SQL_HOST: string = process.env.AZURE_SQL_HOST!;

const AZURE_SQL_DATABASE: string = process.env.AZURE_SQL_DATABASE!;

const AZURE_SQL_USERNAME: string = process.env.AZURE_SQL_USERNAME!;

const AZURE_SQL_PASSWORD: string = process.env.AZURE_SQL_PASSWORD!;

const AZURE_SQL_PORT: number = parseInt(process.env.AZURE_SQL_PORT!, 1433);

export {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  OPENAI_API_KEY,
  AZURE_SQL_HOST,
  AZURE_SQL_DATABASE,
  AZURE_SQL_USERNAME,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_PORT,
};
