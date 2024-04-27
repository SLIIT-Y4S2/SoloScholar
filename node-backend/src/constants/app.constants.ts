import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT!, 10);

const MONGO_URI: string = process.env.MONGO_URI!;

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;


export { PORT, MONGO_URI, OPENAI_API_KEY };
