import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT!, 10);

const MONGO_URI: string = process.env.MONGO_URI!;

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

const JWT_SECRET: string = process.env.JWT_SECRET!;

const PROD_CLIENT_DOMAIN: string = process.env.PROD_CLIENT_DOMAIN!;

const DEPLOYMENT_ENV: string = process.env.DEPLOYMENT_ENV!;

// process.env.LANGCHAIN_VERBOSE = "true";

export {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  OPENAI_API_KEY,
  PROD_CLIENT_DOMAIN,
  DEPLOYMENT_ENV,
};
