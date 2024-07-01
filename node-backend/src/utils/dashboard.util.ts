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

const datasource: DataSource = new DataSource({
  type: "mssql",
  host: AZURE_SQL_HOST,
  database: AZURE_SQL_DATABASE,
  username: AZURE_SQL_USERNAME,
  password: AZURE_SQL_PASSWORD,
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

let database: SqlDatabase | null = null;

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
  if (database == null) {
    await datasource.initialize();
    database = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      ignoreTables: ["database_firewall_rules"],
    });
  }

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
      schema: async () => await database?.getTableInfo(),
      formatInstructions: () => jsonParser.getFormatInstructions(),
      question: (input: { question: string }) => input.question,
      defaultQuery: () => "SELECT NULL",
    },
    SQL_MSSQL_PROMPT,
    model.bind({}),
    jsonParser,
  ]);

  return sqlQueryChain;
}

interface Column {
  name: string;
  data_type: string;
  description: string;
}
interface Table {
  name: string;
  description: string;
  columns: Column[];
}

/**
 *  Function that converts the table information in JSON form into an array of metadata objects.
 */
async function getTableMetadata(tableInformation: { table_info: Table[] }) {
  return tableInformation.table_info.map((table) => {
    const columns: Column[] = table.columns;

    // Extract column details
    const columnNames = columns.map((column) => column.name);
    const columnDataTypes = columns.map((column) => column.data_type);
    const columnDescriptions = columns.map((column) => column.description);

    // Create metadata object
    return {
      table_name: table.name,
      table_description: table.description,
      column_names: JSON.stringify(columnNames),
      data_types: JSON.stringify(columnDataTypes),
      column_descriptions: JSON.stringify(columnDescriptions),
    };
  });
}

export const dashboardUtil = {
  getSqlQueryChain,
  getTableMetadata,
};
