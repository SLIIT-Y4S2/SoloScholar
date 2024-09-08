import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import {
  DASHBOARD_PINECONE_INDEX,
  PINECONE_API_KEY,
  PINECONE_CLOUD_PROVIDER,
  PINECONE_INDEX,
  PINECONE_REGION,
  VECTORDIMENSIONS,
} from "../constants/pinecone.constants";
import { getEmbeddings } from "./openai.util";

/**
 * @returns A Pinecone Index object
 */

async function getPineconeIndex() {
  const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,
  });

  const pineconeIndexList = await pinecone.listIndexes();

  let isPineconeIndexExist: boolean = false;

  for (const index of pineconeIndexList.indexes!) {
    if (index.name === PINECONE_INDEX) {
      isPineconeIndexExist = true;
      break;
    }
  }

  if (isPineconeIndexExist === true) {
    return pinecone.Index(PINECONE_INDEX);
  } else {
    pinecone.createIndex({
      name: PINECONE_INDEX,
      dimension: VECTORDIMENSIONS,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: PINECONE_CLOUD_PROVIDER,
          region: PINECONE_REGION,
        },
      },
    });

    return pinecone.Index(PINECONE_INDEX);
  }
}

async function getDashboardPineconeIndex() {
  const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,
  });

  const pineconeIndexList = await pinecone.listIndexes();

  let isPineconeIndexExist: boolean = false;

  for (const index of pineconeIndexList.indexes!) {
    if (index.name === DASHBOARD_PINECONE_INDEX) {
      isPineconeIndexExist = true;
      break;
    }
  }

  if (isPineconeIndexExist === true) {
    return pinecone.Index(DASHBOARD_PINECONE_INDEX);
  } else {
    pinecone.createIndex({
      name: DASHBOARD_PINECONE_INDEX,
      dimension: VECTORDIMENSIONS,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: PINECONE_CLOUD_PROVIDER,
          region: PINECONE_REGION,
        },
      },
    });

    return pinecone.Index(DASHBOARD_PINECONE_INDEX);
  }
}

/**
 *
 * @param chunks - Array of text chunks
 * @returns A PineconeStore object
 */
async function uploadDocumentToPinecone(
  chunks: Document<Record<string, any>>[]
) {
  const pineconeIndex = await getPineconeIndex();

  const embeddingModel = getEmbeddings();

  const vectorStore = await PineconeStore.fromDocuments(
    chunks,
    embeddingModel,
    {
      pineconeIndex,
      maxConcurrency: 5,
    }
  );

  return vectorStore;
}

export {
  uploadDocumentToPinecone,
  getPineconeIndex,
  getDashboardPineconeIndex,
};
