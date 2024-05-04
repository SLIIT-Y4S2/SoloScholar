import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT!, 10);

const MONGO_URI: string = process.env.MONGO_URI!;

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

const JWT_SECRET: string = process.env.JWT_SECRET!;

// process.env.LANGCHAIN_VERBOSE = "true";

export { PORT, MONGO_URI, JWT_SECRET, OPENAI_API_KEY };
