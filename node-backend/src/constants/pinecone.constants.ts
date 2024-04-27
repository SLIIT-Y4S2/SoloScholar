import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { config } from "dotenv";
config();

const VECTORDIMENSIONS: number = 3072;
const PINECONE_INDEX: string = "rag-pinecone-index";
const PINECONE_API_KEY: string = process.env.PINECONE_API_KEY!;
const PINECONE_CLOUD_PROVIDER: ServerlessSpecCloudEnum = process.env.PINECONE_CLOUD_PROVIDER! as ServerlessSpecCloudEnum;
const PINECONE_REGION: string = process.env.PINECONE_REGION!;


export { VECTORDIMENSIONS, PINECONE_INDEX, PINECONE_API_KEY, PINECONE_CLOUD_PROVIDER, PINECONE_REGION };