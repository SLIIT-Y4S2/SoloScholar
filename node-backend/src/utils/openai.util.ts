import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
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

function getChatModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: OPENAI_CHAT_MODEL,
    temperature: 0.1,
    // verbose: true,
    callbacks: [
      {
        handleLLMEnd(output) {
          if (OPENAI_CHAT_MODEL !== "gpt-4o-mini") return;
          const promptTokens = output?.llmOutput?.tokenUsage.promptTokens;
          const completionTokens =
            output?.llmOutput?.tokenUsage.completionTokens;
          const totalCost =
            (promptTokens / 1000000) * 0.15 + // gpt-4o-mini
            (completionTokens / 1000000) * 0.6;
          console.log("tokens cost: $", totalCost);
        },
      },
    ],
  });
}

export { getEmbeddings, getChatModel };
