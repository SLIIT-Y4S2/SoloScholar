import { config } from "dotenv";

config();

const AZURE_STORAGE_ACCOUNT_NAME: string =
  process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const AZURE_STORAGE_CONTAINER_NAME: string =
  process.env.AZURE_STORAGE_CONTAINER_NAME!;
const AZURE_STORAGE_SAS_TOKEN: string = process.env.AZURE_STORAGE_SAS_TOKEN!;

/**
 * Azure SQL Database constants for metadata-database
 */
const AZURE_SQL_HOST: string = process.env.AZURE_SQL_HOST!;
const AZURE_SQL_DATABASE: string = process.env.AZURE_SQL_DATABASE!;
const AZURE_SQL_USERNAME: string = process.env.AZURE_SQL_USERNAME!;
const AZURE_SQL_PASSWORD: string = process.env.AZURE_SQL_PASSWORD!;
const AZURE_SQL_PORT: number = parseInt(process.env.AZURE_SQL_PORT!, 1433);

export {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_SAS_TOKEN,
  AZURE_SQL_DATABASE,
  AZURE_SQL_HOST,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_PORT,
  AZURE_SQL_USERNAME,
};
