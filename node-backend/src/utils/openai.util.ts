import { OpenAIEmbeddings, ChatOpenAI, } from "@langchain/openai";
import { OPENAI_API_KEY } from "../constants/app.constants";
import {
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
};

function getChatModel({ model }: GetChatModelInputType = { model: OPENAI_CHAT_MODEL }): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: model,
    temperature: 0.1,
    callbacks: [
      {
        handleLLMEnd(output) {
          const promptTokens = output?.llmOutput?.tokenUsage.promptTokens;
          const completionTokens =
            output?.llmOutput?.tokenUsage.completionTokens;
          const totalCost =
            (promptTokens / 1000000) * 5 + // gpt-4o
            (completionTokens / 1000000) * 15;
          console.log("tokens cost: $", totalCost);
        },
      },
    ],
  });
}

export { getEmbeddings, getChatModel };

