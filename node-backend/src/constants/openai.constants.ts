import { config } from 'dotenv';

config();

const OPENAI_CHAT_MODEL: string = process.env.OPENAI_CHAT_MODEL!;
const TEXT_EMBEDDING_MODEL: string = process.env.TEXT_EMBEDDING_MODEL!;

export { OPENAI_CHAT_MODEL, TEXT_EMBEDDING_MODEL };