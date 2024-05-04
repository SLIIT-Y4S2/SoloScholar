import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ZodTypeAny, ZodObject, ZodString } from "zod";
import { SQL_MSSQL_PROMPT } from "../prompt-templates/dashboard_prompt_template";
import { OPENAI_CHAT_MODEL } from "../constants/openai.constants";
import { OPENAI_API_KEY } from "../constants/app.constants";
import {
  AZURE_SQL_DATABASE,
  AZURE_SQL_HOST,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_USERNAME,
} from "../constants/azure.constants";

async function getSqlQueryChain(): Promise<
  RunnableSequence<
    {
      question: string;
    },
    {
      [x: string]: string;
    }
  >
> {
  const datasource: DataSource = new DataSource({
    type: "mssql",
    host: AZURE_SQL_HOST,
    database: AZURE_SQL_DATABASE,
    username: AZURE_SQL_USERNAME,
    password: AZURE_SQL_PASSWORD,
  });

  const database: SqlDatabase = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  const model: ChatOpenAI<ChatOpenAICallOptions> = new ChatOpenAI({
    model: OPENAI_CHAT_MODEL,
    apiKey: OPENAI_API_KEY,
    temperature: 0.2,
  });

  const jsonParser: StructuredOutputParser<
    ZodObject<
      {
        [k: string]: ZodString;
      },
      "strip",
      ZodTypeAny,
      {
        [x: string]: string;
      },
      {
        [x: string]: string;
      }
    >
  > = StructuredOutputParser.fromNamesAndDescriptions({
    query: "The SQL query for the question",
  });

  /**
   * Create a new RunnableSequence where we pipe the output from `db.getTableInfo()`
   * and the users question, into the prompt template, and then into the model.
   */
  const sqlQueryChain: RunnableSequence<
    {
      question: string;
    },
    {
      [x: string]: string;
    }
  > = RunnableSequence.from([
    {
      schema: async () => await database.getTableInfo(),
      formatInstructions: () => jsonParser.getFormatInstructions(),
      question: (input: { question: string }) => input.question,
    },
    SQL_MSSQL_PROMPT,
    model.bind({}),
    jsonParser,
  ]);

  return sqlQueryChain;
}

export const dashboardUtil = {
  getSqlQueryChain,
};
