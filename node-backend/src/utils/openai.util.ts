import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { OPENAI_API_KEY } from "../constants/app.constants";
import {
  HIGH_LEVEL_MODEL,
  OPENAI_CHAT_MODEL,
  TEXT_EMBEDDING_MODEL,
} from "../constants/openai.constants";

/**
 *
 * @returns OpenAIEmbeddings object
 */
function getEmbeddings(): OpenAIEmbeddings {
  return new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    model: TEXT_EMBEDDING_MODEL,
  });
}

interface GetChatModelInputType {
  model: string;
}

function getChatModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: OPENAI_CHAT_MODEL,
    temperature: 0.1,
    // verbose: true,
    callbacks: [
      {
        handleLLMEnd(output) {
          const promptTokens = output?.llmOutput?.tokenUsage.promptTokens;
          const completionTokens =
            output?.llmOutput?.tokenUsage.completionTokens;
          const inputTokenPrice = 0.15;
          const outputTokenPrice = 0.6;
          const totalCost =
            (promptTokens / 1000000) * inputTokenPrice +
            (completionTokens / 1000000) * outputTokenPrice;
          console.log("tokens cost: $", totalCost);
        },
      },
    ],
  });
}

function highLevelChatModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: HIGH_LEVEL_MODEL,
    temperature: 0.1,
    // verbose: true,
    callbacks: [
      {
        handleLLMEnd(output) {
          const promptTokens = output?.llmOutput?.tokenUsage.promptTokens;
          const completionTokens =
            output?.llmOutput?.tokenUsage.completionTokens;
          const inputTokenPrice = 2.5;
          const outputTokenPrice = 10;
          const totalCost =
            (promptTokens / 1000000) * inputTokenPrice +
            (completionTokens / 1000000) * outputTokenPrice;
          console.log("tokens cost: $", totalCost);
        },
      },
    ],
  });
}

export { getEmbeddings, getChatModel, highLevelChatModel };
