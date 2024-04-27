import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT!, 10);

const MONGO_URI = process.env.MONGO_URI!;

const JWT_SECRET: string = process.env.JWT_SECRET!;

const PINECONE_API_KEY: string = process.env.PINECONE_API_KEY!;

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

const PINECONE_INDEX: string = "rag-pinecone-index";

export {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  PINECONE_API_KEY,
  OPENAI_API_KEY,
  PINECONE_INDEX,
};
